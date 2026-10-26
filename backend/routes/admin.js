const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const Booking = require('../models/Booking');
const Contact = require('../models/Contact');
const InstitutionalEnquiry = require('../models/InstitutionalEnquiry');
const Opportunity = require('../models/Opportunity');
const Resource = require('../models/Resource');
const Testimonial = require('../models/Testimonial');
const Newsletter = require('../models/Newsletter');
const SupportTicket = require('../models/SupportTicket');
const User = require('../models/User');
const UserSubscription = require('../models/UserSubscription');
const EmailLog = require('../models/EmailLog');
const { protectAdmin } = require('../middleware/auth');
const { authLimiter } = require('../middleware/security');

const generateToken = (id) => {
  return jwt.sign({ id, tokenType: 'admin' }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// @route   POST /api/admin/login
// @desc    Auth admin & get token (Rate-Limited against brute-force)
// @access  Public
router.post(
  '/login',
  authLimiter,
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists()
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const admin = await Admin.findOne({ email: String(email).toLowerCase() });

      if (admin && (await admin.matchPassword(password))) {
        if (!admin.isActive) {
          return res.status(401).json({ success: false, error: 'Account is deactivated' });
        }

        admin.lastLogin = Date.now();
        await admin.save();

        res.json({
          success: true,
          token: generateToken(admin._id),
          admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role
          }
        });
      } else {
        res.status(401).json({ success: false, error: 'Invalid email or password' });
      }
    } catch (error) {
      next(error);
    }
  }
);

// @route   GET /api/admin/me
// @desc    Get current logged in admin
// @access  Private (Admin)
router.get('/me', protectAdmin, async (req, res) => {
  res.json({
    success: true,
    data: req.admin
  });
});

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private (Admin)
router.get('/dashboard', protectAdmin, async (req, res, next) => {
  try {
    const [
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      totalContacts,
      newContacts,
      readContacts,
      repliedContacts,
      totalEnquiries,
      enquiriesByStatus,
      activeOpportunities,
      publishedResources,
      approvedTestimonials,
      activeSubscribers,
      totalSupportTickets,
      openSupportTickets,
      investigatingSupportTickets,
      resolvedSupportTickets,
      totalUsers,
      activeSubscriptionsCount,
      recentBookings,
      recentContacts,
      recentEnquiries,
      recentSupportTickets
    ] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.countDocuments({ status: 'confirmed' }),
      Booking.countDocuments({ status: 'completed' }),

      Contact.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
      Contact.countDocuments({ status: 'read' }),
      Contact.countDocuments({ status: 'replied' }),

      InstitutionalEnquiry.countDocuments(),
      InstitutionalEnquiry.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),

      Opportunity.countDocuments({ isActive: true }),
      Resource.countDocuments({ isPublished: true }),
      Testimonial.countDocuments({ isApproved: true }),
      Newsletter.countDocuments({ isActive: true }),

      SupportTicket.countDocuments(),
      SupportTicket.countDocuments({ status: 'open' }),
      SupportTicket.countDocuments({ status: 'investigating' }),
      SupportTicket.countDocuments({ status: 'resolved' }),

      User.countDocuments(),
      UserSubscription.countDocuments({ status: 'active' }),

      Booking.find().sort({ createdAt: -1 }).limit(5),
      Contact.find().sort({ createdAt: -1 }).limit(5),
      InstitutionalEnquiry.find().sort({ createdAt: -1 }).limit(5),
      SupportTicket.find().sort({ createdAt: -1 }).limit(5)
    ]);

    const enquiryStatusMap = {};
    enquiriesByStatus.forEach((item) => {
      enquiryStatusMap[item._id] = item.count;
    });

    res.json({
      success: true,
      data: {
        stats: {
          bookings: {
            total: totalBookings,
            pending: pendingBookings,
            confirmed: confirmedBookings,
            completed: completedBookings
          },
          contacts: {
            total: totalContacts,
            new: newContacts,
            read: readContacts,
            replied: repliedContacts
          },
          institutions: {
            total: totalEnquiries,
            byStatus: enquiryStatusMap
          },
          support: {
            total: totalSupportTickets,
            open: openSupportTickets,
            investigating: investigatingSupportTickets,
            resolved: resolvedSupportTickets
          },
          users: {
            total: totalUsers,
            activeSubscriptions: activeSubscriptionsCount
          },
          opportunities: { active: activeOpportunities },
          resources: { published: publishedResources },
          testimonials: { approved: approvedTestimonials },
          newsletter: { active: activeSubscribers }
        },
        recent: {
          bookings: recentBookings,
          contacts: recentContacts,
          institutions: recentEnquiries,
          support: recentSupportTickets
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/admin/change-password
// @desc    Change admin password
// @access  Private (Admin)
router.put(
  '/change-password',
  protectAdmin,
  [
    body('currentPassword', 'Current password is required').exists(),
    body('newPassword', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const admin = await Admin.findById(req.admin._id);
      const { currentPassword, newPassword } = req.body;

      if (!(await admin.matchPassword(currentPassword))) {
        return res.status(401).json({ success: false, error: 'Invalid current password' });
      }

      admin.password = newPassword;
      await admin.save();

      res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
      next(error);
    }
  }
);

// @route   POST /api/admin/create
// @desc    Create a new admin
// @access  Private (Superadmin only)
router.post(
  '/create',
  protectAdmin,
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  async (req, res, next) => {
    if (req.admin.role !== 'superadmin') {
      return res.status(403).json({ success: false, error: 'Not authorized to create admins' });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, password, role } = req.body;

    try {
      let admin = await Admin.findOne({ email: String(email).toLowerCase() });

      if (admin) {
        return res.status(400).json({ success: false, error: 'Admin already exists' });
      }

      admin = await Admin.create({
        name,
        email: String(email).toLowerCase(),
        password,
        role: role || 'admin'
      });

      res.status(201).json({
        success: true,
        data: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        }
      });
    } catch (error) {
      next(error);
    }
  }
);

// @route   GET /api/admin/email-logs
// @desc    Inspect recent transactional email logs & delivery metrics
// @access  Private (Admin)
router.get('/email-logs', protectAdmin, async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const filter = {};
    if (req.query.status) filter.status = String(req.query.status);
    if (req.query.workflow) filter.workflow = String(req.query.workflow);

    const [logs, totalSent, totalFailed, totalPendingDomain] = await Promise.all([
      EmailLog.find(filter).sort({ createdAt: -1 }).limit(limit).lean(),
      EmailLog.countDocuments({ status: 'sent' }),
      EmailLog.countDocuments({ status: 'failed' }),
      EmailLog.countDocuments({ status: 'skipped_unverified_domain' })
    ]);

    res.status(200).json({
      success: true,
      summary: {
        sent: totalSent,
        failed: totalFailed,
        skippedUnverifiedDomain: totalPendingDomain
      },
      count: logs.length,
      data: logs
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
