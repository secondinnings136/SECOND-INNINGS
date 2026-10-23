const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Booking = require('../models/Booking');
const UserSubscription = require('../models/UserSubscription');
const PaymentTransaction = require('../models/PaymentTransaction');
const { protectUser, protectAdmin } = require('../middleware/auth');
const { authLimiter } = require('../middleware/security');

/**
 * Generate signed User JWT with explicit tokenType='user' claim
 */
function generateUserToken(userId) {
  return jwt.sign(
    { id: userId, tokenType: 'user' },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
}

/**
 * Link any historical guest bookings matching user's email or phone
 */
async function linkHistoricalBookings(user) {
  const orConditions = [];
  if (user.email) {
    orConditions.push({ email: user.email.toLowerCase() });
  }
  if (user.phone && user.phone.trim().length >= 10) {
    const cleanDigits = user.phone.replace(/[^0-9]/g, '').slice(-10);
    if (cleanDigits.length === 10) {
      orConditions.push({ phone: { $regex: cleanDigits + '$' } });
    }
  }

  if (orConditions.length === 0) return;

  await Booking.updateMany(
    { userId: null, $or: orConditions },
    { $set: { userId: user._id } }
  );
}

/**
 * Fetch user's active subscription & credit summary (auto-expiring outdated ones)
 */
async function getUserSubscriptionSummary(userId) {
  const now = new Date();

  // Auto-mark expired subscriptions
  await UserSubscription.updateMany(
    { userId, status: 'active', expiresAt: { $lte: now } },
    { $set: { status: 'expired' } }
  );

  // Auto-mark exhausted subscriptions
  await UserSubscription.updateMany(
    { userId, status: 'active', remainingCredits: { $lte: 0 } },
    { $set: { status: 'exhausted' } }
  );

  const activeSubscriptions = await UserSubscription.find({
    userId,
    status: 'active',
    remainingCredits: { $gt: 0 },
    expiresAt: { $gt: now }
  }).sort({ expiresAt: 1 }); // Use earliest expiring credits first

  const remainingCredits = activeSubscriptions.reduce(
    (sum, sub) => sum + (sub.remainingCredits || 0),
    0
  );

  const totalCredits = activeSubscriptions.reduce(
    (sum, sub) => sum + (sub.totalCredits || 0),
    0
  );

  const primarySubscription = activeSubscriptions[0] || null;
  const sessionCount = await Booking.countDocuments({
    userId,
    status: { $in: ['confirmed', 'completed', 'pending'] }
  });

  return {
    activeSubscription: primarySubscription,
    activeSubscriptions,
    remainingCredits,
    totalCredits,
    sessionCount
  };
}

/**
 * Verify Google Credential (supports both ID Token from Google Identity Services and OAuth2 Access Token)
 */
async function verifyGoogleCredential({ credential, accessToken }) {
  if (credential) {
    const resp = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`
    );
    if (!resp.ok) {
      throw new Error('Invalid Google ID token');
    }
    const payload = await resp.json();

    if (process.env.GOOGLE_CLIENT_ID && payload.aud !== process.env.GOOGLE_CLIENT_ID) {
      throw new Error('Google token client ID mismatch');
    }
    if (!payload.email || payload.email_verified === 'false') {
      throw new Error('Google account email is not verified');
    }
    return {
      googleId: payload.sub,
      email: payload.email.toLowerCase(),
      name: payload.name || payload.given_name || payload.email.split('@')[0],
      avatar: payload.picture || ''
    };
  }

  if (accessToken) {
    const resp = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!resp.ok) {
      throw new Error('Invalid Google access token');
    }
    const payload = await resp.json();
    if (!payload.email || !payload.email_verified) {
      throw new Error('Google account email is not verified');
    }
    return {
      googleId: payload.sub,
      email: payload.email.toLowerCase(),
      name: payload.name || payload.given_name || payload.email.split('@')[0],
      avatar: payload.picture || ''
    };
  }

  throw new Error('Google credential or access token is required');
}

// @route   POST /api/auth/google
// @desc    Sign in or sign up with Google OAuth (1-click login)
// @access  Public
router.post('/google', authLimiter, async (req, res, next) => {
  try {
    const { credential, accessToken } = req.body;
    const googleProfile = await verifyGoogleCredential({ credential, accessToken });

    let user = await User.findOne({
      $or: [{ googleId: googleProfile.googleId }, { email: googleProfile.email }]
    });

    if (!user) {
      user = await User.create({
        googleId: googleProfile.googleId,
        email: googleProfile.email,
        name: googleProfile.name,
        avatar: googleProfile.avatar,
        authProvider: 'google',
        onboardingCompleted: false,
        lastLoginAt: new Date()
      });
    } else {
      if (!user.googleId) user.googleId = googleProfile.googleId;
      if (googleProfile.avatar && !user.avatar) user.avatar = googleProfile.avatar;
      if (user.authProvider === 'email') user.authProvider = 'both';
      user.lastLoginAt = new Date();
      await user.save();
    }

    await linkHistoricalBookings(user);
    const subSummary = await getUserSubscriptionSummary(user._id);
    const token = generateUserToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user,
      ...subSummary
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      error: error.message || 'Google authentication failed'
    });
  }
});

// @route   POST /api/auth/register
// @desc    Create account with Name, Email & Password (fallback for users without Google OAuth popup)
// @access  Public
router.post('/register', authLimiter, async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and password are required'
      });
    }
    if (String(password).length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters'
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const existing = await User.findOne({ email: normalizedEmail }).select('+passwordHash');

    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'An account with this email already exists. Please sign in instead.'
      });
    }

    const user = new User({
      name: String(name).trim(),
      email: normalizedEmail,
      authProvider: 'email',
      onboardingCompleted: false,
      lastLoginAt: new Date()
    });
    await user.setPassword(String(password));
    await user.save();

    await linkHistoricalBookings(user);
    const subSummary = await getUserSubscriptionSummary(user._id);
    const token = generateUserToken(user._id);

    const userObj = user.toObject();
    delete userObj.passwordHash;

    res.status(201).json({
      success: true,
      token,
      user: userObj,
      ...subSummary
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/auth/login
// @desc    Sign in with Email & Password
// @access  Public
router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please enter both email and password'
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    if (!user.passwordHash) {
      return res.status(401).json({
        success: false,
        error: 'This account was created with Google. Please click "Continue with Google" to sign in.'
      });
    }

    const isMatch = await user.matchPassword(String(password));
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    user.lastLoginAt = new Date();
    await user.save();

    await linkHistoricalBookings(user);
    const subSummary = await getUserSubscriptionSummary(user._id);
    const token = generateUserToken(user._id);

    const userObj = user.toObject();
    delete userObj.passwordHash;

    res.status(200).json({
      success: true,
      token,
      user: userObj,
      ...subSummary
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/auth/me
// @desc    Get current logged-in mentee profile + active subscription credits
// @access  Private (User)
router.get('/me', protectUser, async (req, res, next) => {
  try {
    await linkHistoricalBookings(req.user);
    const subSummary = await getUserSubscriptionSummary(req.user._id);

    res.status(200).json({
      success: true,
      user: req.user,
      ...subSummary
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/auth/onboarding
// @desc    Complete one-time post-signup onboarding (or update profile)
// @access  Private (User)
router.put('/onboarding', protectUser, async (req, res, next) => {
  try {
    const {
      name,
      userType,
      phone,
      whatsapp,
      age,
      parentName,
      parentPhone,
      parentEmail,
      parentRelation,
      parentConsentConfirmed,
      whereCurrently,
      institutionOrOrg,
      city,
      source,
      referredBy
    } = req.body;

    const cleanPhone = String(phone || req.user.phone || '').trim();
    if (!cleanPhone || cleanPhone.replace(/[^0-9]/g, '').length < 10) {
      return res.status(400).json({
        success: false,
        error: 'A valid 10-digit mobile / WhatsApp number is required.'
      });
    }

    const resolvedUserType = ['student', 'parent', 'institution', 'other'].includes(userType)
      ? userType
      : 'student';

    const parsedAge = age !== undefined && age !== '' ? Number(age) : req.user.age;
    if (resolvedUserType === 'student' && (!parsedAge || parsedAge < 10 || parsedAge > 99)) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid age between 10 and 99.'
      });
    }

    const isUnder18 = resolvedUserType === 'student' && parsedAge < 18;
    if (isUnder18) {
      if (!parentName || !parentPhone || !parentConsentConfirmed) {
        return res.status(400).json({
          success: false,
          error: 'For students under 18, parent/guardian name, contact number, and consent confirmation are mandatory.'
        });
      }
    }

    let computedAgeGroup = 'other';
    if (resolvedUserType === 'parent') computedAgeGroup = 'parent';
    else if (parsedAge >= 16 && parsedAge <= 18) computedAgeGroup = '16-18';
    else if (parsedAge >= 19 && parsedAge <= 21) computedAgeGroup = '19-21';
    else if (parsedAge >= 22 && parsedAge <= 25) computedAgeGroup = '22-25';

    if (name && String(name).trim()) req.user.name = String(name).trim();
    req.user.userType = resolvedUserType;
    req.user.phone = cleanPhone;
    req.user.whatsapp = whatsapp ? String(whatsapp).trim() : cleanPhone;
    if (parsedAge) req.user.age = parsedAge;
    req.user.ageGroup = computedAgeGroup;
    req.user.isUnder18 = isUnder18;

    if (isUnder18) {
      req.user.parentName = String(parentName).trim();
      req.user.parentPhone = String(parentPhone).trim();
      req.user.parentEmail = parentEmail ? String(parentEmail).trim().toLowerCase() : '';
      req.user.parentRelation = parentRelation ? String(parentRelation).trim() : 'Parent/Guardian';
      req.user.parentConsentConfirmed = Boolean(parentConsentConfirmed);
      req.user.parentConsentAt = new Date();
    } else {
      req.user.parentConsentConfirmed = false;
    }

    if (whereCurrently !== undefined) req.user.whereCurrently = whereCurrently;
    if (institutionOrOrg !== undefined) req.user.institutionOrOrg = String(institutionOrOrg).trim();
    if (city !== undefined) req.user.city = String(city).trim();
    if (source !== undefined) req.user.source = String(source).trim();
    if (referredBy !== undefined) req.user.referredBy = String(referredBy).trim();

    req.user.onboardingCompleted = true;
    if (!req.user.onboardingCompletedAt) {
      req.user.onboardingCompletedAt = new Date();
    }

    await req.user.save();
    await linkHistoricalBookings(req.user);
    const subSummary = await getUserSubscriptionSummary(req.user._id);

    res.status(200).json({
      success: true,
      message: 'Profile saved! You never need to fill these details again.',
      user: req.user,
      ...subSummary
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/auth/my-sessions
// @desc    Get logged-in user's complete session history, 7-day next steps, subscriptions & payment receipts
// @access  Private (User)
router.get('/my-sessions', protectUser, async (req, res, next) => {
  try {
    await linkHistoricalBookings(req.user);

    const sessions = await Booking.find({ userId: req.user._id })
      .select('-notes -slotUpdateToken') // Never expose private mentor notes to client
      .sort({ createdAt: -1 });

    const subscriptions = await UserSubscription.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    const transactions = await PaymentTransaction.find({
      userId: req.user._id,
      status: { $in: ['PAID', 'REFUNDED', 'PENDING', 'ACTIVE'] }
    })
      .select('-rawGatewaySummary')
      .sort({ createdAt: -1 });

    const subSummary = await getUserSubscriptionSummary(req.user._id);

    res.status(200).json({
      success: true,
      sessions,
      subscriptions,
      transactions,
      ...subSummary
    });
  } catch (error) {
    next(error);
  }
});

// @route   PATCH /api/auth/my-sessions/:id/reflection
// @desc    Allow student to update their 7-Day Next Step status, reflection, or session feedback
// @access  Private (User)
router.patch('/my-sessions/:id/reflection', protectUser, async (req, res, next) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Session record not found in your account'
      });
    }

    const { actionStatus, studentReflection, feedback, preferredDate, preferredTime } = req.body;

    if (actionStatus && ['not-started', 'pending', 'in-progress', 'completed', 'done'].includes(actionStatus)) {
      booking.actionStatus = actionStatus;
    }
    if (studentReflection !== undefined) {
      booking.studentReflection = String(studentReflection).slice(0, 1500);
    }
    if (feedback !== undefined) {
      booking.feedback = String(feedback).slice(0, 1000);
    }
    // Allow updating preferred slot if session is not yet completed/cancelled
    if (booking.status !== 'completed' && booking.status !== 'cancelled') {
      if (preferredDate) booking.preferredDate = preferredDate;
      if (preferredTime) booking.preferredTime = String(preferredTime).slice(0, 100);
    }

    await booking.save();

    const safeBooking = booking.toObject();
    delete safeBooking.notes;

    res.status(200).json({
      success: true,
      message: 'Your session progress has been updated.',
      data: safeBooking
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/auth/admin/users
// @desc    Get all registered mentees with session counts & active subscriptions (Admin only)
// @access  Private (Admin)
router.get('/admin/users', protectAdmin, async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).lean();
    const activeSubs = await UserSubscription.find({ status: 'active' }).lean();
    const bookings = await Booking.find({ userId: { $ne: null } })
      .select('userId status createdAt topic actionAgreed actionStatus')
      .sort({ createdAt: -1 })
      .lean();

    const subByUser = new Map();
    for (const s of activeSubs) {
      const uid = String(s.userId);
      if (!subByUser.has(uid)) subByUser.set(uid, []);
      subByUser.get(uid).push(s);
    }

    const bookingsByUser = new Map();
    for (const b of bookings) {
      const uid = String(b.userId);
      if (!bookingsByUser.has(uid)) bookingsByUser.set(uid, []);
      bookingsByUser.get(uid).push(b);
    }

    const enriched = users.map((u) => {
      const uid = String(u._id);
      const userSubs = subByUser.get(uid) || [];
      const userBookings = bookingsByUser.get(uid) || [];
      const remainingCredits = userSubs.reduce((acc, s) => acc + (s.remainingCredits || 0), 0);

      return {
        ...u,
        activeSubscriptions: userSubs,
        remainingCredits,
        totalBookings: userBookings.length,
        recentBookings: userBookings.slice(0, 5)
      };
    });

    res.status(200).json({
      success: true,
      count: enriched.length,
      data: enriched
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
