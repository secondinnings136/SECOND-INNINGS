const mongoose = require('mongoose');

const subscriptionPlanSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  planType: {
    type: String,
    enum: ['single', 'monthly_subscription', 'multi_pack'],
    required: true
  },
  sessionsCount: {
    type: Number,
    required: true,
    min: 1
  },
  durationDays: {
    type: Number,
    required: true,
    min: 1,
    default: 30
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  badgeText: {
    type: String,
    trim: true
  },
  features: [{
    type: String,
    trim: true
  }],
  isPopular: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  sortOrder: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('SubscriptionPlan', subscriptionPlanSchema);
