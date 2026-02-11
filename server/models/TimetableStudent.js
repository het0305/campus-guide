const mongoose = require('mongoose');

const DaySchema = new mongoose.Schema({}, { strict: false, _id: false });

const TimetableStudentSchema = new mongoose.Schema({
  semKey: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  image: { type: String },
  // Backwards-compatible fields: older docs may use `data`.
  data: { type: DaySchema },
  // New fields: draft (editable by admin) and published (visible to visitors)
  draftData: { type: DaySchema },
  publishedData: { type: DaySchema }
});

module.exports = mongoose.model('TimetableStudent', TimetableStudentSchema);
