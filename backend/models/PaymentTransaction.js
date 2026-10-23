const mongoose = require('mongoose');

const paymentTransactionSchema = new mongoose.Schema({
  idempotencyKey: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  dedupFingerprint: {
    type: String,
    index: true
  },
  cashfreeOrderId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  cashfreePaymentSessionId: {
    type: String
  },
  cashfreePaymentId: {
    type: String,
    unique: true,
    sparse: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    index: true
  },
  userSubscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserSubscription',
    index: true
  },
  purpose: {
    type: String,
    enum: ['single_booking', 'subscription_purchase', 'support_contribution'],
    required: true
  },
  planCode: {
    type: String
  },
  customerName: {
    type: String
  },
  customerPhone: {
    type: String
  },
  customerEmail: {
    type: String
  },
  expectedAmount: {
    type: Number,
    required: true,
    min: 1
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  status: {
    type: String,
    enum: [
      'CREATED',
      'ACTIVE',
      'PAID',
      'FAILED',
      'USER_DROPPED',
      'EXPIRED',
      'AMOUNT_MISMATCH_HOLD',
      'DUPLICATE_PAID_NEEDS_REFUND',
      'REFUNDED'
    ],
    default: 'CREATED',
    index: true
  },
  paymentMethod: {
    type: String
  },
  paidAt: {
    type: Date
  },
  verifiedBy: {
    type: String,
    enum: ['verify_endpoint', 'webhook', 'precheck_reconcile', 'admin_manual']
  },
  rawGatewaySummary: {
    type: mongoose.Schema.Types.Mixed
  }
}, { timestamps: true });

module.exports = mongoose.model('PaymentTransaction', paymentTransactionSchema);
