import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import api from '../utils/api'
import NavBar from '../components/NavBar'
import UserCard from '../components/UserCard'

export default function Explore(){
  const [users, setUsers] = useState([])
  const [skill, setSkill] = useState('')
  const [college, setCollege] = useState('')

  useEffect(()=>{ fetchUsers() },[])
  async function fetchUsers(){
    const params = {}
    if (skill) params.skill = skill
    if (college) params.college = college
    const { data } = await api.get('/api/users', { params })
    setUsers(data.users)
  }

  return (
    <div>
      <NavBar />
      <div className="max-w-6xl mx-auto p-6">
        <div className="card mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input placeholder="Filter by skill (e.g. React)" className="p-3 rounded-lg border" value={skill} onChange={e=>setSkill(e.target.value)} />
            <input placeholder="College" className="p-3 rounded-lg border" value={college} onChange={e=>setCollege(e.target.value)} />
            <button className="btn-primary" onClick={fetchUsers}>Apply Filters</button>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((u, i)=> (
            <motion.div key={u._id} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay: i*0.03 }}>
              <UserCard user={u} onConnect={() => {}} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
