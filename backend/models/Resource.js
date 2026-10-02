const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  category: { type: String, enum: ['for-students', 'for-parents', 'frameworks-tools'], required: true },
  excerpt: { type: String, required: true, maxlength: 300 },
  content: { type: String, required: true },
  readingTime: { type: Number },
  readTime: { type: Number },
  author: { type: String, default: 'Deepak Sogani' },
  isPublished: { type: Boolean, default: false },
  tags: [String]
}, { timestamps: true });

resourceSchema.pre('save', function(next) {
  if (this.readTime && !this.readingTime) this.readingTime = this.readTime;
  if (this.readingTime && !this.readTime) this.readTime = this.readingTime;
  next();
});

module.exports = mongoose.model('Resource', resourceSchema);
