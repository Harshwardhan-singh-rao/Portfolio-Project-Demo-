import User from '../models/User.js';

export async function listUsers(req, res) {
  try {
    const { skill, college, q } = req.query;
    const filter = {};
    if (skill) filter.skills = { $in: skill.split(',').map(s => s.trim()) };
    if (college) filter.college = college;
    if (q) filter.$or = [
      { name: new RegExp(q, 'i') },
      { interests: { $in: [new RegExp(q, 'i')] } },
      { skills: { $in: [new RegExp(q, 'i')] } }
    ];
    const users = await User.find(filter).select('-password').limit(100);
    res.json({ users });
  } catch (e) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
}
