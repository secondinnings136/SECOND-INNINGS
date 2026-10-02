const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, required: true },
  whatsapp: { type: String },
  userType: { type: String, enum: ['student', 'parent', 'institution'], required: true },
  ageGroup: { type: String, enum: ['16-18', '19-21', '22-25', 'parent', 'other'] },
  concern: { type: String, maxlength: 500 },
  preferredDate: { type: Date },
  preferredTime: { type: String },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  notes: { type: String },
  followUpDate: { type: Date },
  actionAgreed: { type: String },
  actionStatus: { type: String, enum: ['pending', 'in-progress', 'completed', 'not-started'], default: 'not-started' },
  feedback: { type: String },
  source: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
