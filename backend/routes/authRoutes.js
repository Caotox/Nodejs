const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models/db');
const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password, name, role = 'user' } = req.body;
  if (!email || !password || !name) return res.status(400).json({ error: 'Missing fields' });

  const hashed = await bcrypt.hash(password, 10);
  await db.execute('INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)', [email, hashed, name, role]);
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  const user = rows[0];
  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
  res.status(201).json({ token, user: { id: user.id, email, name, role } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
  const user = rows[0];
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
});
module.exports = router;
