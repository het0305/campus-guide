const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register (optional - can be used to create users)
router.post('/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  if (!name || !email || !password || !role) return res.status(400).json({ error: 'Missing fields' });
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: 'Email exists' });
  const hash = await bcrypt.hash(password, 10);
  const u = new User({ name, email, password: hash, role });
  await u.save();
  res.status(201).json({ ok: true });
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const u = await User.findOne({ email });
  if (!u) return res.status(400).json({ error: 'Invalid' });
  const ok = await bcrypt.compare(password, u.password);
  if (!ok) return res.status(400).json({ error: 'Invalid' });
  const token = jwt.sign({ id: u._id, role: u.role, name: u.name }, process.env.JWT_SECRET || 'secretkey', { expiresIn: '8h' });
  res.json({ token, role: u.role, name: u.name });
});

module.exports = router;
