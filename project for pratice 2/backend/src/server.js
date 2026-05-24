import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.js'
import userRoutes from './routes/users.js'
import eventRoutes from './routes/events.js'
import matchRoutes from './routes/match.js'
import connectionsRoutes from './routes/connections.js'

dotenv.config()

const app = express()
app.use(express.json())
app.use(morgan('dev'))
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:5173'], credentials: true }))

const PORT = process.env.PORT || 4000

app.get('/api/health', (_,res)=>res.json({ ok: true }))
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/match', matchRoutes)
app.use('/api/matches', matchRoutes)
app.use('/api/connections', connectionsRoutes)

app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || 'Server error' })
})

app.listen(PORT, ()=>{
  console.log(`API listening on http://localhost:${PORT}`)
})
