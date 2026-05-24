import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { prisma } from '../db/prisma.js'
import { signToken } from '../middleware/auth.js'

const router = Router()

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, college, year, skills = [], interests = [] } = req.body
    if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' })
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(409).json({ message: 'Email already in use' })
    const hash = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: { name, email, password: hash, college, year, skills: JSON.stringify(skills), interests: JSON.stringify(interests) }
    })
    const token = signToken(user)
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })
    const ok = await bcrypt.compare(password, user.password)
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' })
    const token = signToken(user)
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } })
  } catch (e) {
    res.status(500).json({ message: e.message })
  }
})

export default router
