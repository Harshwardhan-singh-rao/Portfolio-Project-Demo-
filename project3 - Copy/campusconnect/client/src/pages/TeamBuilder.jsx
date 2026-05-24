import { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import api from '../utils/api'
import UserCard from '../components/UserCard'

export default function TeamBuilder(){
  const [matches, setMatches] = useState([])

  async function fetchMatches(){
    const { data } = await api.post('/api/match')
    setMatches(data.matches)
  }

  useEffect(()=>{ fetchMatches() },[])

  return (
    <div>
      <NavBar />
      <div className="max-w-6xl mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Top Team Combinations</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {matches.map((m,i)=> (
            <UserCard key={m.user._id} user={m.user} onConnect={()=>{}} />
          ))}
        </div>
      </div>
    </div>
  )
}
