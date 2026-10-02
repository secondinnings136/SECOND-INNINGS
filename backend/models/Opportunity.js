const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, enum: ['internships', 'fellowships', 'scholarships', 'courses', 'higher-education', 'entrepreneurship', 'social-impact', 'professional-exposure'], required: true },
  bestFor: { type: String },
  eligibility: { type: String },
  whatItOffers: { type: String, required: true },
  locationMode: { type: String, enum: ['physical', 'online', 'hybrid'] },
  location: { type: String },
  deadline: { type: Date },
  costFunding: { type: String },
  costOrFunding: { type: String },
  funding: { type: String },
  officialSource: { type: String },
  whyUseful: { type: String },
  suggestedNextStep: { type: String },
  lastVerified: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

opportunitySchema.pre('save', function(next) {
  const val = this.costFunding || this.costOrFunding || this.funding || '';
  this.costFunding = val;
  this.costOrFunding = val;
  this.funding = val;
  if (!this.lastVerified) this.lastVerified = new Date();
  next();
});

module.exports = mongoose.model('Opportunity', opportunitySchema);
