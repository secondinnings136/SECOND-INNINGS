const mongoose = require('mongoose');

/**
 * Atomic Time-Slot Reservation Lock
 * Enforces a database-level unique index on `slotKey` (e.g. "2026-10-28T10:00")
 * so two concurrent booking requests at the exact same millisecond can NEVER
 * double-book the same mentoring slot.
 */
const slotLockSchema = new mongoose.Schema(
  {
    slotKey: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true
    },
    datePart: {
      type: String,
      required: true,
      index: true
    },
    startAt: {
      type: Date,
      required: true,
      index: true
    },
    endAt: {
      type: Date,
      required: true,
      index: true
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      default: null,
      index: true
    },
    userSubscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'UserSubscription',
      default: null
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    status: {
      type: String,
      enum: ['confirmed', 'pending_payment'],
      default: 'confirmed',
      index: true
    },
    expiresAt: {
      type: Date,
      default: null,
      index: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('SlotLock', slotLockSchema);
