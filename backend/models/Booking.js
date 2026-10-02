const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, trim: true, lowercase: true },
  phone: { type: String, required: true },
  whatsapp: { type: String },
  userType: { type: String, enum: ['student', 'parent', 'institution', 'other'], default: 'student' },
  age: { type: String },
  ageGroup: { type: String },
  currentStage: { type: String }, // School / College / University / Current Stage
  city: { type: String },
  topic: { type: String }, // What would you like to talk about?
  usefulGoal: { type: String }, // What would make this conversation useful for you?
  concern: { type: String }, // backward compatibility
  preferredDate: { type: Date },
  preferredTime: { type: String },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
  notes: { type: String },
  followUpDate: { type: Date },
  actionAgreed: { type: String },
  actionStatus: { type: String, enum: ['pending', 'in-progress', 'completed', 'not-started'], default: 'not-started' },
  feedback: { type: String },
  source: { type: String }, // How did you hear about Second Innings?
  referredBy: { type: String } // Were you referred by someone?
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
