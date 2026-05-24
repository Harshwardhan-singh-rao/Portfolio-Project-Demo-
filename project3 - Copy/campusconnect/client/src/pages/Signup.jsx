import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

export default function Signup(){
  const [form, setForm] = useState({ name:'', email:'', password:'', college:'', year:'', skills:'', interests:'', goals:'' })
  const [err, setErr] = useState('')
  const nav = useNavigate()

  function update(k, v){ setForm({ ...form, [k]: v }) }

  async function submit(e){
    e.preventDefault()
    setErr('')
    try {
      const payload = { ...form, skills: form.skills.split(',').map(s=>s.trim()).filter(Boolean), interests: form.interests.split(',').map(s=>s.trim()).filter(Boolean) }
      const { data } = await api.post('/api/auth/signup', payload)
      localStorage.setItem('token', data.token)
      if (data.user) localStorage.setItem('me', JSON.stringify(data.user))
      nav('/explore')
    } catch (e) { setErr(e.response?.data?.message || 'Signup failed') }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={submit} className="card w-full max-w-2xl">
        <h2 className="text-xl font-semibold">Create your profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
          <input placeholder="Name" className="p-3 rounded-lg border" value={form.name} onChange={e=>update('name', e.target.value)} />
          <input placeholder="Email" className="p-3 rounded-lg border" value={form.email} onChange={e=>update('email', e.target.value)} />
          <input placeholder="Password" type="password" className="p-3 rounded-lg border" value={form.password} onChange={e=>update('password', e.target.value)} />
          <input placeholder="College" className="p-3 rounded-lg border" value={form.college} onChange={e=>update('college', e.target.value)} />
          <input placeholder="Year" className="p-3 rounded-lg border" value={form.year} onChange={e=>update('year', e.target.value)} />
          <input placeholder="Skills (comma separated)" className="p-3 rounded-lg border md:col-span-2" value={form.skills} onChange={e=>update('skills', e.target.value)} />
          <input placeholder="Interests (comma separated)" className="p-3 rounded-lg border md:col-span-2" value={form.interests} onChange={e=>update('interests', e.target.value)} />
          <input placeholder="Goals" className="p-3 rounded-lg border md:col-span-2" value={form.goals} onChange={e=>update('goals', e.target.value)} />
        </div>
        {err && <div className="text-red-600 text-sm mt-2">{err}</div>}
        <button className="btn-primary mt-4 w-full">Create</button>
      </form>
    </div>
  )
}
