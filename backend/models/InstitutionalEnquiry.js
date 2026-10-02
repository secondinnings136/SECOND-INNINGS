const mongoose = require('mongoose');

const institutionalEnquirySchema = new mongoose.Schema({
  institutionName: { type: String, required: true },
  institutionType: { type: String, enum: ['school', 'college', 'university', 'other'] },
  contactPerson: { type: String, required: true },
  designation: { type: String },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  city: { type: String },
  state: { type: String },
  studentStrength: { type: String },
  enquiryNature: { type: String, required: true, maxlength: 2000 },
  interestedIn: [{ type: String, enum: ['individual-mentoring', 'small-group', 'student-leadership', 'career-exposure', 'parent-engagement', 'school-to-life', 'professional-exposure', 'student-insights'] }],
  preferredContact: { type: String, enum: ['email', 'phone', 'whatsapp'], default: 'email' },
  status: { type: String, enum: ['new', 'contacted', 'meeting-scheduled', 'pilot-proposed', 'active', 'closed'], default: 'new' }
}, { timestamps: true });

module.exports = mongoose.model('InstitutionalEnquiry', institutionalEnquirySchema);
