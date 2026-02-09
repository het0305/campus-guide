const mongoose = require('mongoose');

const AuditoriumSchema = new mongoose.Schema({
  name: { type: String, required: true },
  capacity: Number,
  location: String,
  notes: String
});

module.exports = mongoose.model('Auditorium', AuditoriumSchema);
