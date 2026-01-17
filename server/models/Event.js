const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: Date,
  location: String,
  description: String
});

module.exports = mongoose.model('Event', EventSchema);
