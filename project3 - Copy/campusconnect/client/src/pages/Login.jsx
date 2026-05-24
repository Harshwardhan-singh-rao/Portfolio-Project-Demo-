import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../utils/api'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const nav = useNavigate()

  async function submit(e){
    e.preventDefault()
    setErr('')
    try {
      const { data } = await api.post('/api/auth/login', { email, password })
      localStorage.setItem('token', data.token)
      if (data.user) localStorage.setItem('me', JSON.stringify(data.user))
      nav('/explore')
    } catch (e) { setErr(e.response?.data?.message || 'Login failed') }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={submit} className="card w-full max-w-md">
        <h2 className="text-xl font-semibold">Login</h2>
        <input placeholder="Email" className="mt-4 p-3 rounded-lg w-full border" value={email} onChange={e=>setEmail(e.target.value)} />
        <input placeholder="Password" type="password" className="mt-3 p-3 rounded-lg w-full border" value={password} onChange={e=>setPassword(e.target.value)} />
        {err && <div className="text-red-600 text-sm mt-2">{err}</div>}
        <button className="btn-primary mt-4 w-full">Login</button>
        <div className="text-sm mt-3">No account? <Link to="/signup" className="text-neonPurple">Sign up</Link></div>
      </form>
    </div>
  )
}
