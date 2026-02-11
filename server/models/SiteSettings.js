const mongoose = require('mongoose');

const SiteSettingsSchema = new mongoose.Schema({
  contactLocation: { type: String, default: '' },
  contactPhone: { type: String, default: '' },
  contactEmail: { type: String, default: '' }
});

module.exports = mongoose.model('SiteSettings', SiteSettingsSchema);
