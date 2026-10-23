const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Setting = require('../models/Setting');
const UserSubscription = require('../models/UserSubscription');
const { protectAdmin, optionalAuth } = require('../middleware/auth');
const { publicFormLimiter, computeDedupFingerprint } = require('../middleware/security');

// POST /api/bookings - Create booking (Complimentary Public Intake OR Admin Manual Entry)
router.post('/', publicFormLimiter, optionalAuth, async (req, res, next) => {
  try {
    const isAdminManual = Boolean(req.admin);
    const user = req.user || null;

    // 1. If NOT an Admin manual entry, enforce strict payment bypass check & field whitelisting
    if (!isAdminManual) {
      const enabledDoc = await Setting.findOne({ key: 'paymentsEnabled' });
      const paymentsEnabled = enabledDoc ? Boolean(enabledDoc.value) : false;

      if (paymentsEnabled) {
        return res.status(402).json({
          success: false,
          error: 'Online session payment or an active subscription credit is required to confirm a booking.'
        });
      }
    }

    const resolvedName = String(user?.name || req.body.name || '').trim();
    const resolvedPhone = String(user?.phone || req.body.phone || '').trim();
    const resolvedUserType = user?.userType || req.body.userType || 'student';

    if (!resolvedName || !resolvedPhone) {
      return res.status(400).json({
        success: false,
        error: 'Name and phone/WhatsApp number are required.'
      });
    }

    const parsedAge = user?.age || (req.body.age ? Number(req.body.age) : undefined);
    const isUnder18 = Boolean(user?.isUnder18 ?? (resolvedUserType === 'student' && parsedAge && parsedAge < 18));

    if (!isAdminManual && isUnder18) {
      const pName = user?.parentName || req.body.parentName;
      const pPhone = user?.parentPhone || req.body.parentPhone;
      const pConsent = user?.parentConsentConfirmed || req.body.parentConsentConfirmed;
      if (!pName || !pPhone || !pConsent) {
        return res.status(400).json({
          success: false,
          error: 'For students under 18, parent/guardian name, phone number, and consent confirmation are required.'
        });
      }
    }

    // Deduplicate rapid double-clicks within 2 minutes for non-admin submissions
    const topicText = String(req.body.topic || req.body.concern || '').trim();
    const dedupKey = req.body.idempotencyKey
      ? String(req.body.idempotencyKey).trim()
      : computeDedupFingerprint([user?._id || resolvedPhone, topicText, req.body.preferredDate]);

    if (!isAdminManual) {
      const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
      const duplicateBooking = await Booking.findOne({
        idempotencyKey: dedupKey,
        createdAt: { $gte: twoMinutesAgo }
      });
      if (duplicateBooking) {
        return res.status(200).json({
          success: true,
          duplicatePrevented: true,
          data: duplicateBooking
        });
      }
    }

    const prevCount = user
      ? await Booking.countDocuments({ userId: user._id, status: { $ne: 'cancelled' } })
      : 0;

    // Strictly construct whitelisted booking document (Prevents Mass Assignment)
    const bookingPayload = {
      userId: user ? user._id : null,
      sessionNumber: prevCount + 1,
      bookingMode: isAdminManual ? 'admin_manual' : 'free_intro',
      idempotencyKey: dedupKey,
      name: resolvedName,
      email: String(user?.email || req.body.email || '').trim().toLowerCase(),
      phone: resolvedPhone,
      whatsapp: String(user?.whatsapp || req.body.whatsapp || resolvedPhone).trim(),
      userType: ['student', 'parent', 'institution', 'other'].includes(resolvedUserType)
        ? resolvedUserType
        : 'student',
      age: parsedAge,
      ageGroup: user?.ageGroup || req.body.ageGroup || 'other',
      isUnder18,
      parentName: user?.parentName || req.body.parentName || '',
      parentPhone: user?.parentPhone || req.body.parentPhone || '',
      parentEmail: user?.parentEmail || req.body.parentEmail || '',
      parentConsentConfirmed: Boolean(user?.parentConsentConfirmed ?? req.body.parentConsentConfirmed),
      whereCurrently: user?.whereCurrently || req.body.whereCurrently || req.body.currentStage || '',
      currentStage: user?.whereCurrently || req.body.whereCurrently || req.body.currentStage || '',
      institutionOrOrg: user?.institutionOrOrg || req.body.institutionOrOrg || '',
      city: user?.city || req.body.city || '',
      topic: topicText.slice(0, 1000),
      concern: topicText.slice(0, 1000),
      usefulGoal: req.body.usefulGoal ? String(req.body.usefulGoal).trim().slice(0, 500) : '',
      preferredDate: req.body.preferredDate || undefined,
      preferredTime: req.body.preferredTime ? String(req.body.preferredTime).trim() : undefined,
      source: user?.source || req.body.source || '',
      referredBy: user?.referredBy || req.body.referredBy || '',

      // Privileged fields ONLY allowed if req.admin is authenticated
      status: isAdminManual && req.body.status ? req.body.status : 'pending',
      paymentRequired: isAdminManual ? Boolean(req.body.paymentRequired) : false,
      paymentStatus: isAdminManual && req.body.paymentStatus ? req.body.paymentStatus : 'not_required',
      paymentAmount: isAdminManual ? Number(req.body.paymentAmount || 0) : 0,
      paymentMode: isAdminManual ? req.body.paymentMode || 'DIRECT_UPI' : undefined,
      paymentTime: isAdminManual ? req.body.paymentTime || null : null,
      notes: isAdminManual ? req.body.notes || '' : ''
    };

    const booking = await Booking.create(bookingPayload);
    if (user && !user.hasUsedFreeSession && bookingPayload.bookingMode === 'free_intro') {
      user.hasUsedFreeSession = true;
      await user.save();
    }

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
});

// GET /api/bookings - Get all bookings (Admin Only!)
router.get('/', protectAdmin, async (req, res, next) => {
  try {
    const { status, userType, userId } = req.query;
    const query = {};
    if (status) query.status = status;
    if (userType) query.userType = userType;
    if (userId) query.userId = userId;

    const bookings = await Booking.find(query).sort({ createdAt: -1 }).lean();

    // Group past sessions by userId or phone/email so Admin can see student's full session history
    const historyByKey = new Map();
    for (const b of bookings) {
      const key = b.userId
        ? `uid:${b.userId}`
        : b.email
        ? `email:${b.email.toLowerCase()}`
        : `phone:${String(b.phone || '').replace(/[^0-9]/g, '').slice(-10)}`;

      if (!historyByKey.has(key)) historyByKey.set(key, []);
      historyByKey.get(key).push({
        _id: b._id,
        sessionNumber: b.sessionNumber,
        topic: b.topic || b.concern,
        status: b.status,
        bookingMode: b.bookingMode,
        actionAgreed: b.actionAgreed,
        actionStatus: b.actionStatus,
        studentReflection: b.studentReflection,
        sharedNotes: b.sharedNotes,
        createdAt: b.createdAt,
        preferredDate: b.preferredDate
      });
    }

    const enrichedBookings = bookings.map((b) => {
      const key = b.userId
        ? `uid:${b.userId}`
        : b.email
        ? `email:${b.email.toLowerCase()}`
        : `phone:${String(b.phone || '').replace(/[^0-9]/g, '').slice(-10)}`;
      const allForParticipant = historyByKey.get(key) || [];
      return {
        ...b,
        participantTotalSessions: allForParticipant.length,
        participantHistory: allForParticipant.filter((h) => String(h._id) !== String(b._id))
      };
    });

    res.status(200).json({
      success: true,
      count: enrichedBookings.length,
      data: enrichedBookings
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/bookings/:id - Get single booking (Admin Only)
router.get('/:id', protectAdmin, async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/bookings/:id - Update booking lifecycle, mentor notes & status (Admin Only)
router.patch('/:id', protectAdmin, async (req, res, next) => {
  try {
    const existing = await Booking.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    const allowedAdminUpdates = [
      'status',
      'notes',
      'sharedNotes',
      'followUpDate',
      'actionAgreed',
      'actionStatus',
      'studentReflection',
      'feedback',
      'paymentStatus',
      'paymentAmount',
      'paymentMode',
      'preferredDate',
      'preferredTime'
    ];

    const updates = {};
    for (const field of allowedAdminUpdates) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    // If a subscription-credit booking is being cancelled for the first time, automatically refund 1 credit to the student!
    if (
      updates.status === 'cancelled' &&
      existing.status !== 'cancelled' &&
      existing.bookingMode === 'subscription_credit' &&
      existing.userSubscriptionId
    ) {
      const sub = await UserSubscription.findById(existing.userSubscriptionId);
      if (sub) {
        sub.remainingCredits += 1;
        sub.usedCredits = Math.max(0, sub.usedCredits - 1);
        if (sub.status === 'exhausted' && (!sub.expiresAt || sub.expiresAt > new Date())) {
          sub.status = 'active';
        }
        sub.creditLedger.push({
          action: 'REFUNDED',
          bookingId: existing._id,
          creditsDelta: 1,
          balanceAfter: sub.remainingCredits,
          note: `Credit restored after Session #${existing.sessionNumber} was cancelled`,
          timestamp: new Date()
        });
        await sub.save();
      }
    }

    const booking = await Booking.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
