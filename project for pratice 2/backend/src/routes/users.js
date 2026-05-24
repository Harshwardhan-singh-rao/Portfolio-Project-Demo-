import { Router } from 'express'
import { prisma } from '../db/prisma.js'
import { authRequired } from '../middleware/auth.js'

const router = Router()

// Get all users
router.get('/', async (req, res) => {
  const users = await prisma.user.findMany({
    select: { id:true, name:true, email:true, college:true, year:true, skills:true, interests:true }
  })
  res.json(users.map(u=> ({
    ...u,
    skills: u.skills ? JSON.parse(u.skills) : [],
    interests: u.interests ? JSON.parse(u.interests) : []
  })))
})

// Get current user
router.get('/me', authRequired, async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.userId) },
    select: { id:true, name:true, email:true, college:true, year:true, skills:true, interests:true }
  })
  if (!user) return res.status(404).json({ message: 'User not found' })
  res.json({
    ...user,
    skills: user.skills ? JSON.parse(user.skills) : [],
    interests: user.interests ? JSON.parse(user.interests) : []
  })
})

// Update current user
router.put('/me', authRequired, async (req, res) => {
  const allowed = ['name','college','year','skills','interests']
  const data = {}
  for (const k of allowed) if (k in req.body) data[k] = (k==='skills'||k==='interests') ? JSON.stringify(req.body[k]) : req.body[k]
  const user = await prisma.user.update({
    where: { id: Number(req.userId) },
    data,
    select: { id:true, name:true, email:true, college:true, year:true, skills:true, interests:true }
  })
  res.json({
    ...user,
    skills: user.skills ? JSON.parse(user.skills) : [],
    interests: user.interests ? JSON.parse(user.interests) : []
  })
})

// Get user by id
router.get('/:id', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.params.id) },
    select: { id:true, name:true, email:true, college:true, year:true, skills:true, interests:true }
  })
  if (!user) return res.status(404).json({ message: 'User not found' })
  res.json({
    ...user,
    skills: user.skills ? JSON.parse(user.skills) : [],
    interests: user.interests ? JSON.parse(user.interests) : []
  })
})

// Update user by id (owner-only simple check)
router.put('/:id', authRequired, async (req, res) => {
  if (String(req.userId) !== String(req.params.id)) return res.status(403).json({ message: 'Forbidden' })
  const allowed = ['name','college','year','skills','interests']
  const data = {}
  for (const k of allowed) if (k in req.body) data[k] = (k==='skills'||k==='interests') ? JSON.stringify(req.body[k]) : req.body[k]
  const user = await prisma.user.update({
    where: { id: Number(req.params.id) },
    data,
    select: { id:true, name:true, email:true, college:true, year:true, skills:true, interests:true }
  })
  res.json({
    ...user,
    skills: user.skills ? JSON.parse(user.skills) : [],
    interests: user.interests ? JSON.parse(user.interests) : []
  })
})

// Connect to another user (adds to your connections)
router.post('/connections/:id', authRequired, async (req, res) => {
  const targetId = Number(req.params.id)
  const meId = Number(req.userId)
  if (targetId === meId) return res.status(400).json({ message: 'Cannot connect to self' })
  try {
    await prisma.connection.create({ data: { fromId: meId, toId: targetId } })
  } catch(e) { /* ignore duplicate due to unique constraint */ }
  res.json({ ok: true })
})

export default router
