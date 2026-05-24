import { Router } from 'express'
import { prisma } from '../db/prisma.js'
import { authRequired } from '../middleware/auth.js'

const router = Router()

// POST /api/connections/:id - connect current user to target user
router.post('/:id', authRequired, async (req, res) => {
  const targetId = Number(req.params.id)
  const meId = Number(req.userId)
  if (targetId === meId) return res.status(400).json({ message: 'Cannot connect to self' })
  try {
    await prisma.connection.create({ data: { fromId: meId, toId: targetId } })
  } catch (e) { /* ignore duplicate */ }
  res.json({ ok: true })
})

export default router
