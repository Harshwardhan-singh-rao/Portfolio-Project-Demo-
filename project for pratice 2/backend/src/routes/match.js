import { Router } from 'express'
import { prisma } from '../db/prisma.js'
import { authRequired } from '../middleware/auth.js'
import { combinedSimilarity } from '../utils/similarity.js'

const router = Router()

// GET /api/match/:id - recommend peers for a given user id
router.get('/:id', async (req, res) => {
  const meId = Number(req.params.id)
  const user = await prisma.user.findUnique({ where: { id: meId } })
  if (!user) return res.status(404).json({ message: 'User not found' })
  const candidates = await prisma.user.findMany({
    where: { id: { not: meId } },
    select: { id:true, name:true, email:true, college:true, year:true, skills:true, interests:true }
  })
  const base = {
    ...user,
    skills: user.skills ? JSON.parse(user.skills) : [],
    interests: user.interests ? JSON.parse(user.interests) : []
  }
  const scored = candidates.map(c => {
    const u = {
      ...c,
      skills: c.skills ? JSON.parse(c.skills) : [],
      interests: c.interests ? JSON.parse(c.interests) : []
    }
    return { user: u, score: combinedSimilarity(base, u) }
  })
  scored.sort((a,b)=> b.score - a.score)
  res.json(scored.slice(0, 10))
})

// GET /api/matches - current user's matches (auth)
router.get('/', authRequired, async (req, res) => {
  const meId = Number(req.userId)
  const user = await prisma.user.findUnique({ where: { id: meId } })
  if (!user) return res.status(404).json({ message: 'User not found' })
  const candidates = await prisma.user.findMany({
    where: { id: { not: meId } },
    select: { id:true, name:true, email:true, college:true, year:true, skills:true, interests:true }
  })
  const base = {
    ...user,
    skills: user.skills ? JSON.parse(user.skills) : [],
    interests: user.interests ? JSON.parse(user.interests) : []
  }
  const scored = candidates.map(c => {
    const u = {
      ...c,
      skills: c.skills ? JSON.parse(c.skills) : [],
      interests: c.interests ? JSON.parse(c.interests) : []
    }
    return { user: u, score: combinedSimilarity(base, u) }
  })
  scored.sort((a,b)=> b.score - a.score)
  res.json(scored.slice(0, 10))
})

export default router
