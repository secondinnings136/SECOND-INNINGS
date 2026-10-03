const mongoose = require('mongoose');

const supportTicketSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  category: { 
    type: String, 
    enum: [
      'bug_report',
      'page_not_working',
      'booking_issue',
      'broken_link',
      'feedback_suggestion',
      'account_login_help',
      'other'
    ], 
    default: 'bug_report' 
  },
  pageUrl: { type: String, trim: true },
  subject: { type: String, required: true, trim: true },
  description: { type: String, required: true, maxlength: 3000 },
  deviceInfo: { type: String, trim: true },
  priority: { 
    type: String, 
    enum: ['low', 'medium', 'high', 'urgent'], 
    default: 'medium' 
  },
  status: { 
    type: String, 
    enum: ['open', 'investigating', 'resolved', 'closed'], 
    default: 'open' 
  },
  adminNotes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('SupportTicket', supportTicketSchema);
