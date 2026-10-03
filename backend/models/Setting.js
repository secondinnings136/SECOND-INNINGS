const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true, index: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  description: { type: String },
  updatedBy: { type: String }
}, { timestamps: true });

// Helper to get a setting with fallback default
settingSchema.statics.getSetting = async function(key, defaultValue = null) {
  const setting = await this.findOne({ key });
  return setting ? setting.value : defaultValue;
};

// Helper to set or update a setting
settingSchema.statics.setSetting = async function(key, value, updatedBy = 'system') {
  return await this.findOneAndUpdate(
    { key },
    { key, value, updatedBy },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
};

module.exports = mongoose.model('Setting', settingSchema);
