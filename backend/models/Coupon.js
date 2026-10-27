const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    discountType: {
      type: String,
      enum: ['PERCENTAGE', 'FLAT'],
      default: 'PERCENTAGE'
    },
    discountValue: {
      type: Number,
      required: true,
      min: 1
    },
    applicableTo: {
      type: String,
      enum: ['ALL', 'SINGLE_SESSION', 'SUBSCRIPTION'],
      default: 'ALL'
    },
    maxUses: {
      type: Number,
      default: null // null or 0 = unlimited total uses
    },
    maxUsesPerUser: {
      type: Number,
      default: 1 // 1 use per user by default; 0 = unlimited per user
    },
    usedCount: {
      type: Number,
      default: 0
    },
    usedBy: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        email: { type: String, trim: true, lowercase: true },
        orderId: { type: String, trim: true },
        bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
        usedAt: { type: Date, default: Date.now }
      }
    ],
    expiresAt: {
      type: Date,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Coupon', couponSchema);
