require('dotenv').config();
const mongoose = require('mongoose');
const Department = require('./models/Department');
const Event = require('./models/Event');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/campus';

const departments = [
  { name: 'Computer Science', building: 'Engineering Block', contact: 'cs@college.edu', description: 'CS Dept.' },
  { name: 'Mathematics', building: 'Math Building', contact: 'math@college.edu', description: 'Math Dept.' }
];

const events = [
  { title: 'Orientation Day', date: new Date(), location: 'Main Hall', description: 'Welcome event' }
];

const bcrypt = require('bcrypt');
const User = require('./models/User');

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    await Department.deleteMany({});
    await Event.deleteMany({});
    await Department.insertMany(departments);
    await Event.insertMany(events);

    // seed users
    await User.deleteMany({});
    const sHash = await bcrypt.hash('studentpass', 10);
    const tHash = await bcrypt.hash('staffpass', 10);
    await User.create({ name: 'Sample Student', email: 'student@campus.test', password: sHash, role: 'student' });
    await User.create({ name: 'Sample Staff', email: 'staff@campus.test', password: tHash, role: 'staff' });
    console.log('Seeded DB');
    process.exit(0);
  })
  .catch(err => { console.error(err); process.exit(1); });
