import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { api, saveAuth } from '../api/client'
import { Button } from '../components/ui/Button'

export default function Signup() {
  const [form, setForm] = useState({ name:'', college:'', year:'', skills:'', interests:'', email:'', password:'' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = { ...form, skills: form.skills.split(',').map(s=>s.trim()), interests: form.interests.split(',').map(s=>s.trim()) }
      const res = await api.signup(payload)
      saveAuth(res.token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  return (
    <main className="max-w-7xl mx-auto px-4 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto glass rounded-2xl p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Create your account</h2>
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input className="glass rounded-xl p-3" placeholder="Name" value={form.name} onChange={set('name')} required />
          <input className="glass rounded-xl p-3" placeholder="College" value={form.college} onChange={set('college')} required />
          <input className="glass rounded-xl p-3" placeholder="Year" value={form.year} onChange={set('year')} required />
          <input className="glass rounded-xl p-3" placeholder="Email" type="email" value={form.email} onChange={set('email')} required />
          <input className="glass rounded-xl p-3 md:col-span-2" placeholder="Skills (comma separated)" value={form.skills} onChange={set('skills')} />
          <input className="glass rounded-xl p-3 md:col-span-2" placeholder="Interests (comma separated)" value={form.interests} onChange={set('interests')} />
          <input className="glass rounded-xl p-3 md:col-span-2" placeholder="Password" type="password" value={form.password} onChange={set('password')} required />
          {error && <p className="text-red-300 text-sm md:col-span-2">{error}</p>}
          <div className="md:col-span-2"><Button type="submit" className="w-full">{loading? 'Creating...' : 'Sign Up'}</Button></div>
        </form>
        <p className="mt-4 text-center text-white/80">Already have an account? <Link className="underline" to="/login">Login</Link></p>
      </motion.div>
    </main>
  )
}
