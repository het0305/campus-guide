const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

// Models
const Department = require("../models/Department");
const Event = require("../models/Event");
const Auditorium = require("../models/Auditorium");
const User = require("../models/User");

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
