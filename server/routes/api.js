const express = require('express');
const router = express.Router();
const Department = require('../models/Department');
const Event = require('../models/Event');
const Attendance = require('../models/Attendance');
const User = require('../models/User');

const { auth, permit } = require('../middleware/auth');

// mount auth
router.use('/auth', require('./auth'));

// Departments
router.get('/departments', async (req, res) => {
  const docs = await Department.find();
  res.json(docs);
});

// Events
router.get('/events', async (req, res) => {
  const docs = await Event.find().sort({ date: 1 });
  res.json(docs);
});

router.post('/events', async (req, res) => {
  const ev = new Event(req.body);
  await ev.save();
  res.status(201).json(ev);
});

// Contact


// Protected sample endpoints
router.get('/student/dashboard', auth, permit('student'), async (req, res) => {
  res.json({ msg: `Hello student ${req.user.name}` });
});

router.get('/staff/dashboard', auth, permit('staff'), async (req, res) => {
  res.json({ msg: `Hello staff ${req.user.name}` });
});

// Attendance upload: expects { date: ISODateString, records: [ { email, name, status } ] }
router.post('/attendance', async (req, res) => {
  try {
    const { date, records } = req.body;
    if (!date || !Array.isArray(records)) return res.status(400).json({ error: 'Invalid payload' });

    console.log('Public attendance upload, records:', records.length);

    const attendanceDocs = [];
    for (const r of records) {
      const email = (r.email || r.Email || r.studentEmail || '').toString().trim();
      const name = (r.name || r.Name || r.studentName || '').toString().trim();
      const status = ('' + (r.status || r.Status || '')).toLowerCase() === 'present' ? 'present' : 'absent';

      let student = null;
      if (email) student = await User.findOne({ email: email.toLowerCase() });

      attendanceDocs.push({
        student: student ? student._id : null,
        name: name || (student ? student.name : ''),
        email: email || (student ? student.email : ''),
        date: new Date(date),
        status,
        markedBy: null
      });
    }

    const created = await Attendance.insertMany(attendanceDocs);
    res.status(201).json({ inserted: created.length });
  } catch (err) {
    console.error('Attendance save error', err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

module.exports = router;
