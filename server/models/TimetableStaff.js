const mongoose = require('mongoose');

const DaySchema = new mongoose.Schema({}, { strict: false, _id: false });

const TimetableStaffSchema = new mongoose.Schema({
  staffId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  photo: { type: String },
  // Backwards-compatible field
  timetable: { type: DaySchema },
  // New fields for draft/published workflow
  draftTimetable: { type: DaySchema },
  publishedTimetable: { type: DaySchema }
});

module.exports = mongoose.model('TimetableStaff', TimetableStaffSchema);
