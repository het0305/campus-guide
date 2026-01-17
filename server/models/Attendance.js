const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  name: String,
  email: String,
  date: { type: Date, required: true },
  status: { type: String, enum: ['present','absent'], required: true },
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Attendance', AttendanceSchema);
