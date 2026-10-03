const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const { protect, superadmin } = require('../middleware/auth');
const Booking = require('../models/Booking');
const Contact = require('../models/Contact');
const InstitutionalEnquiry = require('../models/InstitutionalEnquiry');
const Opportunity = require('../models/Opportunity');
const Resource = require('../models/Resource');
const Testimonial = require('../models/Testimonial');
const Newsletter = require('../models/Newsletter');
const SupportTicket = require('../models/SupportTicket');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// @route   POST /api/admin/login
// @desc    Auth admin & get token
router.post('/login', [
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Password is required').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (admin && (await admin.matchPassword(password))) {
      if (!admin.isActive) {
        return res.status(401).json({ message: 'Account disabled' });
      }

      admin.lastLogin = Date.now();
      await admin.save();

      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        token: generateToken(admin._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/admin/me
// @desc    Get current admin user
// @access  Private
router.get('/me', protect, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select('-password');
    res.json(admin);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/admin/dashboard
// @desc    Get dashboard stats
// @access  Private
router.get('/dashboard', protect, async (req, res) => {
  try {
    const [
      bookingsTotal, bookingsPending, bookingsConfirmed, bookingsCompleted,
      contactsTotal, contactsNew, contactsRead, contactsReplied,
      institutionsTotal, institutionsNew,
      opportunitiesActive,
      resourcesPublished,
      testimonialsApproved,
      newsletterActive,
      recentBookings,
      recentContacts,
      recentInstitutions,
      supportTotal,
      supportOpen,
      recentSupport
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
      InstitutionalEnquiry.countDocuments({ status: 'new' }), // Assuming status field exists
      Opportunity.countDocuments({ isActive: true }),
      Resource.countDocuments({ isPublished: true }),
      Testimonial.countDocuments({ isApproved: true }),
      Newsletter.countDocuments({ isActive: true }),
      Booking.find().sort({ createdAt: -1 }).limit(5),
      Contact.find().sort({ createdAt: -1 }).limit(5),
      InstitutionalEnquiry.find().sort({ createdAt: -1 }).limit(5),
      SupportTicket.countDocuments(),
      SupportTicket.countDocuments({ status: 'open' }),
      SupportTicket.find().sort({ createdAt: -1 }).limit(5)
    ]);

    res.json({
      stats: {
        totalBookings: bookingsTotal,
        pendingBookings: bookingsPending,
        confirmedBookings: bookingsConfirmed,
        completedBookings: bookingsCompleted,
        totalContacts: contactsTotal,
        newContacts: contactsNew,
        readContacts: contactsRead,
        repliedContacts: contactsReplied,
        totalSupport: supportTotal,
        openSupport: supportOpen,
        institutionalEnquiries: institutionsTotal,
        newInstitutions: institutionsNew,
        activeOpportunities: opportunitiesActive,
        publishedResources: resourcesPublished,
        approvedTestimonials: testimonialsApproved,
        newsletterSubscribers: newsletterActive,
        bookings: { total: bookingsTotal, pending: bookingsPending, confirmed: bookingsConfirmed, completed: bookingsCompleted },
        contacts: { total: contactsTotal, new: contactsNew, read: contactsRead, replied: contactsReplied },
        support: { total: supportTotal, open: supportOpen },
        institutions: { total: institutionsTotal, new: institutionsNew },
        opportunities: { active: opportunitiesActive },
        resources: { published: resourcesPublished },
        testimonials: { approved: testimonialsApproved },
        newsletter: { active: newsletterActive }
      },
      recent: {
        bookings: recentBookings,
        contacts: recentContacts,
        institutions: recentInstitutions,
        support: recentSupport
      }
    });
  } catch (error) {
    console.error(error);
    // Ignore error for missing collections/fields during early setup
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/admin/change-password
// @desc    Change admin password
// @access  Private
router.put('/change-password', protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const admin = await Admin.findById(req.admin.id);

    if (admin && (await admin.matchPassword(currentPassword))) {
      admin.password = newPassword;
      await admin.save();
      res.json({ message: 'Password updated successfully' });
    } else {
      res.status(401).json({ message: 'Invalid current password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/admin/create
// @desc    Create new admin user
// @access  Private (Superadmin only)
router.post('/create', protect, superadmin, [
  body('name', 'Name is required').not().isEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, role } = req.body;

  try {
    let admin = await Admin.findOne({ email });

    if (admin) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    admin = new Admin({
      name,
      email,
      password,
      role: role || 'admin'
    });

    await admin.save();

    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
