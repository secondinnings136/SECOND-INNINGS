const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true },
  phone: { type: String },
  subject: { type: String, required: true },
  message: { type: String, required: true, maxlength: 2000 },
  type: { type: String, enum: ['general', 'student', 'parent', 'other'], default: 'general' },
  status: { type: String, enum: ['new', 'read', 'replied', 'closed'], default: 'new' }
}, { timestamps: true });

module.exports = mongoose.model('Contact', contactSchema);
