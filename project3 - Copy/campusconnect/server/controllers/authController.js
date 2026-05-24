import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getEmbedding } from '../utils/openai.js';

export async function signup(req, res) {
  try {
    const { name, email, password, college, year, skills = [], interests = [], goals = '' } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const profileText = `${name} ${college} ${year} skills: ${skills.join(' ')} interests: ${interests.join(' ')} goals: ${goals}`;
    let embedding = [];
    try { embedding = await getEmbedding(profileText); } catch {}
    const user = await User.create({ name, email, password: hash, college, year, skills, interests, goals, embedding });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: sanitize(user) });
  } catch (e) {
    res.status(500).json({ message: 'Signup failed' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: sanitize(user) });
  } catch (e) {
    res.status(500).json({ message: 'Login failed' });
  }
}

export async function me(req, res) {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'Not found' });
  res.json({ user: sanitize(user) });
}

function sanitize(u) {
  const { password, __v, ...rest } = u.toObject();
  return rest;
}
