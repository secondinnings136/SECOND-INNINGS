const mongoose = require('mongoose');

const creditLedgerEntrySchema = new mongoose.Schema({
  action: {
    type: String,
    enum: ['CREDITED', 'CONSUMED', 'REFUNDED', 'ADMIN_ADJUSTED', 'EXPIRED'],
    required: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  creditsDelta: {
    type: Number,
    required: true
  },
  balanceAfter: {
    type: Number,
    required: true
  },
  note: {
    type: String,
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

const userSubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  planId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubscriptionPlan'
  },
  planCode: {
    type: String,
    required: true
  },
  planName: {
    type: String,
    required: true
  },
  planType: {
    type: String,
    enum: ['single', 'monthly_subscription', 'multi_pack'],
    default: 'monthly_subscription'
  },
  totalCredits: {
    type: Number,
    required: true,
    min: 1
  },
  usedCredits: {
    type: Number,
    default: 0,
    min: 0
  },
  remainingCredits: {
    type: Number,
    required: true,
    min: 0
  },
  amountPaid: {
    type: Number,
    default: 0
  },
  couponCode: {
    type: String,
    trim: true,
    uppercase: true,
    default: null
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending_payment', 'active', 'exhausted', 'expired', 'cancelled'],
    default: 'pending_payment',
    index: true
  },
  startsAt: {
    type: Date
  },
  expiresAt: {
    type: Date,
    index: true
  },
  cashfreeOrderId: {
    type: String,
    index: true
  },
  cashfreePaymentId: {
    type: String
  },
  paymentTransactionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PaymentTransaction'
  },
  pendingInitialBookingData: {
    type: mongoose.Schema.Types.Mixed
  },
  initialBookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  creditLedger: [creditLedgerEntrySchema]
}, { timestamps: true });

module.exports = mongoose.model('UserSubscription', userSubscriptionSchema);
