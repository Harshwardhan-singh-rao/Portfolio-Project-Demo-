import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { api, saveAuth } from '../api/client'
import { Button } from '../components/ui/Button'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.login(email, password)
      saveAuth(res.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto glass rounded-2xl p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Welcome back</h2>
        <form onSubmit={onSubmit} className="space-y-4">
          <input className="w-full glass rounded-xl p-3 text-white placeholder-white/70" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
          <input className="w-full glass rounded-xl p-3 text-white placeholder-white/70" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
          {error && <p className="text-red-300 text-sm">{error}</p>}
          <Button type="submit" className="w-full" onClick={()=>{}}>{loading? 'Logging in...' : 'Login'}</Button>
        </form>
        <p className="mt-4 text-center text-white/80">No account? <Link className="underline" to="/signup">Sign up</Link></p>
      </motion.div>
    </main>
  )
}
