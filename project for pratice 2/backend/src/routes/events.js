import { Router } from 'express'
import { prisma } from '../db/prisma.js'

const router = Router()

// GET /api/events - list events
router.get('/', async (req, res) => {
  const events = await prisma.event.findMany({ orderBy: { date: 'asc' }})
  res.json(events)
})

export default router
