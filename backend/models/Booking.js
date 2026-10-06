const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, required: true },
  whatsapp: { type: String },
  userType: { type: String, enum: ['student', 'parent', 'institution', 'other'], default: 'student' },
  age: { type: String },
  ageGroup: { type: String },
  whereCurrently: { type: String }, // School / College or University / Working / Taking a break / Exploring what comes next / Other
  currentStage: { type: String }, // backward compatibility
  institutionOrOrg: { type: String, trim: true }, // School / College / University / Organisation
  city: { type: String, trim: true },
  topic: { type: String }, // What would you like to talk about?
  usefulGoal: { type: String }, // What would make this conversation useful for you?
  concern: { type: String }, // backward compatibility
  // Consent & Safeguarding
  isUnder18: { type: Boolean, default: false },
  parentName: { type: String, trim: true },
  parentPhone: { type: String, trim: true },
  parentEmail: { type: String, trim: true },
  parentConsentConfirmed: { type: Boolean, default: false },
  adultConsentConfirmed: { type: Boolean, default: false },
  preferredDate: { type: Date },
  preferredTime: { type: String },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  notes: { type: String },
  followUpDate: { type: Date },
  actionAgreed: { type: String },
  actionStatus: { type: String, enum: ['pending', 'in-progress', 'completed', 'not-started'], default: 'not-started' },
  feedback: { type: String },
  source: { type: String }, // How did you hear about Second Innings?
  referredBy: { type: String }, // Were you referred by someone?
  // Payment Integration (Cashfree PG)
  paymentRequired: { type: Boolean, default: false },
  paymentStatus: { type: String, enum: ['not_required', 'pending', 'paid', 'failed', 'refunded'], default: 'not_required' },
  paymentAmount: { type: Number, default: 0 },
  paymentCurrency: { type: String, default: 'INR' },
  cashfreeOrderId: { type: String },
  cashfreePaymentSessionId: { type: String },
  cashfreePaymentId: { type: String },
  paymentMode: { type: String },
  paymentTime: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
