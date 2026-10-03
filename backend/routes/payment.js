const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Setting = require('../models/Setting');
const cashfreeService = require('../services/cashfree');
const { protect } = require('../middleware/auth');

const PAYMENT_SETTING_KEY = 'payment_settings';

// Default settings: payments OFF by default
const DEFAULT_PAYMENT_SETTINGS = {
  paymentsEnabled: false, // Default is OFF as requested by user
  sessionFee: 0,          // Fee amount in INR
  currency: 'INR',
  environment: process.env.CASHFREE_ENVIRONMENT || 'PRODUCTION',
  feeNotice: 'Mentoring sessions are currently complimentary. No fees required.',
  requirePaymentFor: ['student', 'parent', 'institution', 'other']
};

/**
 * GET /api/payment/config
 * Public endpoint returning current payment requirement status for bookings
 */
router.get('/config', async (req, res) => {
  try {
    const settings = await Setting.getSetting(PAYMENT_SETTING_KEY, DEFAULT_PAYMENT_SETTINGS);
    const configured = cashfreeService.isConfigured();

    res.json({
      success: true,
      paymentsEnabled: !!settings.paymentsEnabled && configured,
      sessionFee: Number(settings.sessionFee || 0),
      currency: settings.currency || 'INR',
      feeNotice: settings.feeNotice || DEFAULT_PAYMENT_SETTINGS.feeNotice,
      environment: settings.environment || 'PRODUCTION',
      gatewayConfigured: configured
    });
  } catch (error) {
    console.error('Error fetching payment config:', error);
    res.status(500).json({ success: false, message: 'Server error fetching payment config' });
  }
});

/**
 * POST /api/payment/create-order
 * Initiates payment session with Cashfree for a booking
 */
router.post('/create-order', async (req, res) => {
  try {
    const { bookingId, name, email, phone, userType } = req.body;

    // Check payment settings
    const settings = await Setting.getSetting(PAYMENT_SETTING_KEY, DEFAULT_PAYMENT_SETTINGS);
    const paymentsEnabled = !!settings.paymentsEnabled && cashfreeService.isConfigured();
    const feeAmount = Number(settings.sessionFee || 0);

    // If payments are toggled OFF by admin or fee is 0, no payment required
    if (!paymentsEnabled || feeAmount <= 0) {
      // If bookingId provided, ensure it's marked as not_required
      if (bookingId) {
        await Booking.findByIdAndUpdate(bookingId, {
          paymentRequired: false,
          paymentStatus: 'not_required',
          paymentAmount: 0
        });
      }

      return res.json({
        success: true,
        paymentRequired: false,
        message: 'No payment required for this session.'
      });
    }

    // Find or create booking
    let booking;
    if (bookingId) {
      booking = await Booking.findById(bookingId);
    }

    if (!booking) {
      // Create new booking in pending payment state
      booking = new Booking({
        name,
        email,
        phone,
        userType: userType || 'student',
        paymentRequired: true,
        paymentStatus: 'pending',
        paymentAmount: feeAmount,
        status: 'pending'
      });
      await booking.save();
    } else {
      booking.paymentRequired = true;
      booking.paymentStatus = 'pending';
      booking.paymentAmount = feeAmount;
      await booking.save();
    }

    // Generate unique Cashfree order ID (alphanumeric + underscore/hyphen, max 50 chars)
    const orderId = `SI_${booking._id.toString().slice(-8)}_${Date.now().toString().slice(-6)}`;

    // Create Cashfree order
    const cfOrder = await cashfreeService.createPaymentOrder({
      orderId,
      orderAmount: feeAmount,
      customerId: `CUST_${booking.phone.replace(/[^0-9]/g, '').slice(-10)}`,
      customerName: booking.name,
      customerEmail: booking.email,
      customerPhone: booking.phone,
      returnUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/book/status?order_id=${orderId}&booking_id=${booking._id}`
    });

    // Save Cashfree order details to booking
    booking.cashfreeOrderId = cfOrder.order_id;
    booking.cashfreePaymentSessionId = cfOrder.payment_session_id;
    await booking.save();

    res.json({
      success: true,
      paymentRequired: true,
      bookingId: booking._id,
      orderId: cfOrder.order_id,
      paymentSessionId: cfOrder.payment_session_id,
      amount: feeAmount,
      currency: 'INR'
    });
  } catch (error) {
    console.error('Error creating payment order:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create payment order'
    });
  }
});

/**
 * POST /api/payment/verify
 * Verifies payment status with Cashfree and updates the booking
 */
router.post('/verify', async (req, res) => {
  try {
    const { orderId, bookingId } = req.body;

    if (!orderId && !bookingId) {
      return res.status(400).json({ success: false, message: 'orderId or bookingId is required' });
    }

    // Look up booking
    let booking;
    if (bookingId) {
      booking = await Booking.findById(bookingId);
    } else {
      booking = await Booking.findOne({ cashfreeOrderId: orderId });
    }

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const queryOrderId = orderId || booking.cashfreeOrderId;
    if (!queryOrderId) {
      return res.status(400).json({ success: false, message: 'No Cashfree order associated with this booking' });
    }

    // Check with Cashfree API
    let payments = [];
    let isPaid = false;
    let paymentDetails = null;

    try {
      payments = await cashfreeService.getOrderPayments(queryOrderId);
      if (Array.isArray(payments) && payments.length > 0) {
        // Find successful payment
        const successful = payments.find(p => p.payment_status === 'SUCCESS');
        if (successful) {
          isPaid = true;
          paymentDetails = successful;
        }
      }
    } catch (err) {
      // Fallback: check order status directly
      const order = await cashfreeService.getOrderDetails(queryOrderId);
      if (order && order.order_status === 'PAID') {
        isPaid = true;
      }
    }

    if (isPaid) {
      booking.paymentStatus = 'paid';
      booking.status = 'confirmed';
      if (paymentDetails) {
        booking.cashfreePaymentId = String(paymentDetails.cf_payment_id || '');
        booking.paymentMode = paymentDetails.payment_group || 'cashfree';
        booking.paymentTime = new Date();
      }
      await booking.save();

      return res.json({
        success: true,
        paid: true,
        booking,
        message: 'Payment verified and booking confirmed successfully!'
      });
    } else {
      return res.json({
        success: true,
        paid: false,
        booking,
        message: 'Payment is pending or not completed.'
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Payment verification failed'
    });
  }
});

/**
 * POST /api/payment/webhook
 * Cashfree Webhook Listener
 */
router.post('/webhook', async (req, res) => {
  try {
    const rawBody = JSON.stringify(req.body);
    const signature = req.headers['x-webhook-signature'];
    const timestamp = req.headers['x-webhook-timestamp'];

    // Verify webhook if signature is present
    if (signature && timestamp) {
      const isValid = cashfreeService.verifyWebhookSignature(signature, rawBody, timestamp);
      if (!isValid) {
        console.warn('Invalid Cashfree webhook signature');
      }
    }

    const { type, data } = req.body;
    console.log('Received Cashfree webhook event:', type);

    if (type === 'PAYMENT_SUCCESS_WEBHOOK' || type === 'ORDER_PAID') {
      const orderId = data?.order?.order_id || data?.payment?.order_id;
      if (orderId) {
        const booking = await Booking.findOne({ cashfreeOrderId: orderId });
        if (booking) {
          booking.paymentStatus = 'paid';
          booking.status = 'confirmed';
          if (data?.payment) {
            booking.cashfreePaymentId = String(data.payment.cf_payment_id || '');
            booking.paymentMode = data.payment.payment_group || 'cashfree';
            booking.paymentTime = new Date();
          }
          await booking.save();
          console.log(`Booking ${booking._id} confirmed via webhook for order ${orderId}`);
        }
      }
    }

    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Error processing Cashfree webhook:', error);
    res.status(200).json({ status: 'error_logged' }); // Always 200 to acknowledge webhook
  }
});

// ================= ADMIN PROTECTED ROUTES =================

/**
 * GET /api/payment/admin/settings
 * Admin: Get current payment settings & financial summary
 */
router.get('/admin/settings', protect, async (req, res) => {
  try {
    const settings = await Setting.getSetting(PAYMENT_SETTING_KEY, DEFAULT_PAYMENT_SETTINGS);
    const isConfigured = cashfreeService.isConfigured();

    // Calculate quick stats
    const totalBookings = await Booking.countDocuments();
    const paidBookings = await Booking.countDocuments({ paymentStatus: 'paid' });
    const pendingPaymentBookings = await Booking.countDocuments({ paymentStatus: 'pending' });
    const freeBookings = await Booking.countDocuments({ paymentStatus: 'not_required' });

    // Aggregate total revenue
    const revenueAgg = await Booking.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, total: { $sum: '$paymentAmount' } } }
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    res.json({
      success: true,
      settings: {
        paymentsEnabled: !!settings.paymentsEnabled,
        sessionFee: Number(settings.sessionFee || 0),
        currency: settings.currency || 'INR',
        environment: settings.environment || process.env.CASHFREE_ENVIRONMENT || 'PRODUCTION',
        feeNotice: settings.feeNotice || DEFAULT_PAYMENT_SETTINGS.feeNotice,
        requirePaymentFor: settings.requirePaymentFor || DEFAULT_PAYMENT_SETTINGS.requirePaymentFor
      },
      gateway: {
        isConfigured,
        appId: process.env.CASHFREE_APP_ID ? `${process.env.CASHFREE_APP_ID.slice(0, 6)}...${process.env.CASHFREE_APP_ID.slice(-4)}` : 'Not Set',
        environment: process.env.CASHFREE_ENVIRONMENT || 'PRODUCTION'
      },
      stats: {
        totalBookings,
        paidBookings,
        pendingPaymentBookings,
        freeBookings,
        totalRevenue
      }
    });
  } catch (error) {
    console.error('Error fetching admin payment settings:', error);
    res.status(500).json({ success: false, message: 'Server error fetching payment settings' });
  }
});

/**
 * PUT /api/payment/admin/settings
 * Admin: Toggle payments ON/OFF, set session fee, customize notice
 */
router.put('/admin/settings', protect, async (req, res) => {
  try {
    const { paymentsEnabled, sessionFee, feeNotice, currency, requirePaymentFor } = req.body;

    const currentSettings = await Setting.getSetting(PAYMENT_SETTING_KEY, DEFAULT_PAYMENT_SETTINGS);

    const updatedSettings = {
      ...currentSettings,
      paymentsEnabled: typeof paymentsEnabled === 'boolean' ? paymentsEnabled : currentSettings.paymentsEnabled,
      sessionFee: typeof sessionFee !== 'undefined' ? Number(sessionFee) : currentSettings.sessionFee,
      feeNotice: typeof feeNotice === 'string' ? feeNotice : currentSettings.feeNotice,
      currency: currency || currentSettings.currency || 'INR',
      requirePaymentFor: Array.isArray(requirePaymentFor) ? requirePaymentFor : currentSettings.requirePaymentFor,
      environment: process.env.CASHFREE_ENVIRONMENT || 'PRODUCTION'
    };

    await Setting.setSetting(PAYMENT_SETTING_KEY, updatedSettings, req.admin?.email || 'admin');

    res.json({
      success: true,
      message: 'Payment settings updated successfully',
      settings: updatedSettings
    });
  } catch (error) {
    console.error('Error updating admin payment settings:', error);
    res.status(500).json({ success: false, message: 'Failed to update payment settings' });
  }
});

module.exports = router;
