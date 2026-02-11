const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

// Models
const Department = require("../models/Department");
const Event = require("../models/Event");
const Auditorium = require("../models/Auditorium");
const Contact = require("../models/Contact");
const User = require("../models/User");
const TimetableStudent = require("../models/TimetableStudent");
const TimetableStaff = require("../models/TimetableStaff");
const SiteSettings = require("../models/SiteSettings");

// Middleware
const { auth, permit } = require("../middleware/auth");


/* =========================
   ADMIN LOGIN
========================= */

router.post("/admin-login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await User.findOne({ email: username, role: "admin" });

    if (!admin) return res.json({ success: false });

    const match = await bcrypt.compare(password, admin.password);
    if (!match) return res.json({ success: false });

    // Sign JWT
    const payload = { id: admin._id, role: admin.role, name: admin.name };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secretkey', {
      expiresIn: '8h'
    });

    res.json({ success: true, token, role: admin.role, name: admin.name });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* =========================
   DEPARTMENTS
========================= */

// Public
router.get("/departments", async (req, res) => {
  const docs = await Department.find();
  res.json(docs);
});

// Admin (protected)
router.post("/departments", auth, permit("admin"), async (req, res) => {
  const dept = new Department(req.body);
  await dept.save();
  res.status(201).json(dept);
});

// Update department
router.put('/departments/:id', auth, permit('admin'), async (req, res) => {
  const doc = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json(doc);
});

// Delete department
router.delete('/departments/:id', auth, permit('admin'), async (req, res) => {
  await Department.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

/* =========================
   EVENTS
========================= */

// Public
router.get("/events", async (req, res) => {
  const docs = await Event.find().sort({ date: 1 });
  res.json(docs);
});

// Auditoriums - public list
router.get('/auditoriums', async (req, res) => {
  console.log('[AUDITORIUMS GET] incoming');
  const docs = await Auditorium.find();
  res.json(docs);
});

// Admin create
router.post('/auditoriums', auth, permit('admin'), async (req, res) => {
  // Temporary debug logging
  console.log('[AUDITORIUM CREATE] headers:', req.headers);
  console.log('[AUDITORIUM CREATE] body:', req.body);
  try {
    const a = new Auditorium(req.body);
    await a.save();
    res.status(201).json(a);
  } catch (err) {
    console.error('[AUDITORIUM CREATE] error', err);
    res.status(500).json({ error: 'Failed to create' });
  }
});

// Admin update
router.put('/auditoriums/:id', auth, permit('admin'), async (req, res) => {
  const doc = await Auditorium.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json(doc);
});

// Admin delete
router.delete('/auditoriums/:id', auth, permit('admin'), async (req, res) => {
  await Auditorium.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

// Admin (protected)
router.post("/events", auth, permit("admin"), async (req, res) => {
  const ev = new Event(req.body);
  await ev.save();
  res.status(201).json(ev);
});

// Update event
router.put('/events/:id', auth, permit('admin'), async (req, res) => {
  const doc = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json(doc);
});

// Delete event
router.delete('/events/:id', auth, permit('admin'), async (req, res) => {
  await Event.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

/* =========================
   TIMETABLES (Student/Staff)
========================= */

// Student timetables
router.get("/timetable/student", async (req, res) => {
  const docs = await TimetableStudent.find();
  // detect if requester is admin by verifying JWT (optional)
  let isAdmin = false;
  try {
    const auth = req.headers.authorization || "";
    if (auth.startsWith("Bearer ")) {
      const token = auth.replace("Bearer ", "");
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
      if (payload && payload.role === 'admin') isAdmin = true;
    }
  } catch (e) {
    isAdmin = false;
  }

  const out = docs.map(doc => ({
    semKey: doc.semKey,
    label: doc.label,
    image: doc.image,
    data: isAdmin ? (doc.draftData || doc.data || doc.publishedData || {}) : (doc.publishedData || doc.data || doc.draftData || {})
  }));
  res.json(out);
});

router.put("/timetable/student/:semKey", auth, permit("admin"), async (req, res) => {
  const { semKey } = req.params;
  const { day, index, value, fullData } = req.body;
  let doc = await TimetableStudent.findOne({ semKey });
  if (!doc) {
    doc = new TimetableStudent({
      semKey,
      label: semKey.toUpperCase(),
      image: "",
      draftData: {},
      publishedData: {}
    });
  }
  // Prefer full timetable from client so visitor always sees complete data
  let updated;
  if (fullData && typeof fullData === "object" && Object.keys(fullData).length > 0) {
    updated = fullData;
  } else {
    const data = doc.draftData || doc.data || {};
    const arr = Array.isArray(data[day]) ? [...data[day]] : [];
    while (arr.length <= index) arr.push("—");
    arr[index] = value;
    updated = { ...data, [day]: arr };
  }
  doc.draftData = updated;
  doc.publishedData = updated;
  doc.data = updated;
  await doc.save();
  res.json(doc);
});

// Publish student draft -> published
router.post('/timetable/student/:semKey/publish', auth, permit('admin'), async (req, res) => {
  const { semKey } = req.params;
  const doc = await TimetableStudent.findOne({ semKey });
  if (!doc) return res.status(404).json({ error: 'Not found' });
  // promote draftData if present, otherwise promote legacy data
  doc.publishedData = doc.draftData || doc.data || {};
  await doc.save();
  res.json(doc);
});

router.delete("/timetable/student/:semKey", auth, permit("admin"), async (req, res) => {
  await TimetableStudent.deleteOne({ semKey: req.params.semKey });
  res.json({ ok: true });
});

// Staff timetables
router.get("/timetable/staff", async (req, res) => {
  const docs = await TimetableStaff.find();
  let isAdmin = false;
  try {
    const auth = req.headers.authorization || "";
    if (auth.startsWith("Bearer ")) {
      const token = auth.replace("Bearer ", "");
      const payload = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
      if (payload && payload.role === 'admin') isAdmin = true;
    }
  } catch (e) {
    isAdmin = false;
  }

  const out = docs.map(doc => ({
    staffId: doc.staffId,
    name: doc.name,
    photo: doc.photo,
    timetable: isAdmin ? (doc.draftTimetable || doc.timetable || doc.publishedTimetable || {}) : (doc.publishedTimetable || doc.timetable || doc.draftTimetable || {})
  }));
  res.json(out);
});

router.put("/timetable/staff/:staffId", auth, permit("admin"), async (req, res) => {
  const staffId = Number(req.params.staffId);
  const { day, index, value, fullData } = req.body;
  let doc = await TimetableStaff.findOne({ staffId });
  if (!doc) {
    doc = new TimetableStaff({
      staffId,
      name: `Staff ${staffId}`,
      photo: "",
      draftTimetable: {},
      publishedTimetable: {}
    });
  }
  let updated;
  if (fullData && typeof fullData === "object" && Object.keys(fullData).length > 0) {
    updated = fullData;
  } else {
    const tt = doc.draftTimetable || doc.timetable || {};
    const arr = Array.isArray(tt[day]) ? [...tt[day]] : [];
    while (arr.length <= index) arr.push("—");
    arr[index] = value;
    updated = { ...tt, [day]: arr };
  }
  doc.draftTimetable = updated;
  doc.publishedTimetable = updated;
  doc.timetable = updated;
  await doc.save();
  res.json(doc);
});

// Publish staff draft -> published
router.post('/timetable/staff/:staffId/publish', auth, permit('admin'), async (req, res) => {
  const staffId = Number(req.params.staffId);
  const doc = await TimetableStaff.findOne({ staffId });
  if (!doc) return res.status(404).json({ error: 'Not found' });
  doc.publishedTimetable = doc.draftTimetable || doc.timetable || {};
  await doc.save();
  res.json(doc);
});

router.delete("/timetable/staff/:staffId", auth, permit("admin"), async (req, res) => {
  const staffId = Number(req.params.staffId);
  await TimetableStaff.deleteOne({ staffId });
  res.json({ ok: true });
});

/* =========================
   CONTACT SETTINGS
========================= */

router.get("/settings/contact", async (req, res) => {
  let doc = await SiteSettings.findOne();
  if (!doc) {
    doc = new SiteSettings({
      contactLocation:
        "Uka Tarsadia University Maliba Campus, Gopal Vidyanagar, Bardoli-Mahuva Road, Tarsadi – 394350, Tal: Mahuva Dist: Surat, Gujarat, INDIA.",
      contactPhone: "6353030096, 6353033853",
      contactEmail: "registrar[at]utu[dot]ac[dot]in",
    });
    await doc.save();
  }
  res.json(doc);
});

router.put("/settings/contact", auth, permit("admin"), async (req, res) => {
  const { contactLocation, contactPhone, contactEmail } = req.body;
  const doc = await SiteSettings.findOneAndUpdate(
    {},
    { contactLocation, contactPhone, contactEmail },
    { new: true, upsert: true }
  );
  res.json(doc);
});

// Visitor contact/feedback submit
router.post('/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body || {};
    const c = new Contact({ name, email, message });
    await c.save();
    res.status(201).json({ success: true });
  } catch (err) {
    console.error('[CONTACT POST] error', err);
    res.status(500).json({ success: false });
  }
});

// Admin: list visitor contacts/feedback
router.get('/contact', auth, permit('admin'), async (req, res) => {
  try {
    const docs = await Contact.find().sort({ createdAt: -1 });
    res.json(docs);
  } catch (err) {
    console.error('[CONTACT GET] error', err);
    res.status(500).json([]);
  }
});

/* =========================
   DASHBOARDS
========================= */

router.get("/student/dashboard", auth, async (req, res) => {
  res.json({ msg: "Student dashboard" });
});

router.get("/staff/dashboard", auth, async (req, res) => {
  res.json({ msg: "Staff dashboard" });
});

/* =========================
   EXPORT
========================= */

module.exports = router;
