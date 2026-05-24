import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { api } from '../api/client'
import { Button } from '../components/ui/Button'
import SlideOver from '../components/SlideOver'

function UserCard({ user, onConnect, onOpen }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="glass rounded-2xl p-4 card-hover cursor-pointer" onClick={()=>onOpen?.(user)}>
      <div className="flex items-center gap-3">
        <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name || 'User')}`} alt="avatar" className="w-12 h-12 rounded-xl" />
        <div>
          <h4 className="font-semibold">{user.name}</h4>
          <p className="text-white/70 text-sm">{user.college} • {user.year || 'Year'}</p>
        </div>
      </div>
      {user.skills && (
        <div className="mt-3 flex flex-wrap gap-2 text-xs text-white/80">
          {user.skills.slice(0,5).map((s,i)=> <span key={i} className="px-2 py-1 rounded-lg bg-white/10">{s}</span>)}
        </div>
      )}
      {onConnect && <div className="mt-4"><Button onClick={(e)=>{e.stopPropagation(); onConnect(user._id || user.id)}}>Connect</Button></div>}
    </motion.div>
  )
}

function EventCard({ event, onOpen }) {
  return (
    <motion.div whileHover={{ y: -4 }} className="glass rounded-2xl p-4 card-hover cursor-pointer" onClick={()=>onOpen?.(event)}>
      <h4 className="font-semibold">{event.title}</h4>
      <p className="text-white/80 text-sm">{new Date(event.date).toLocaleDateString()} • {event.location || 'Campus'}</p>
      <p className="text-white/80 mt-2 text-sm">{event.description}</p>
    </motion.div>
  )
}

export default function Dashboard() {
  const [me, setMe] = useState(null)
  const [teammates, setTeammates] = useState([])
  const [mentors, setMentors] = useState([])
  const [events, setEvents] = useState([])
  const [openUser, setOpenUser] = useState(null)
  const [openEvent, setOpenEvent] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const [meR, tR, mR, eR] = await Promise.allSettled([
          api.me(), api.listTeammates(), api.listMentors(), api.listEvents()
        ])
        if (cancelled) return
        setMe(meR.status==='fulfilled'? meR.value : { name: 'Student' })
        setTeammates(tR.status==='fulfilled'? tR.value : [
          { _id:'1', name:'Aarav', college:'ABC College', year:'3rd', skills:['React','Node','ML'] },
          { _id:'2', name:'Priya', college:'XYZ Inst', year:'2nd', skills:['Design','Frontend'] },
        ])
        setMentors(mR.status==='fulfilled'? mR.value : [
          { _id:'m1', name:'Rahul (Senior)', college:'ABC College', year:'Alumni', skills:['Career','DSA'] },
        ])
        setEvents(eR.status==='fulfilled'? eR.value : [
          { id:'e1', title:'Campus Hackathon', date:new Date().toISOString(), description:'24-hour coding sprint.' },
          { id:'e2', title:'AI Workshop', date:new Date(Date.now()+86400000).toISOString(), description:'Intro to GenAI.' },
        ])
      } catch {}
    }
    load()
    return () => { cancelled = true }
  }, [])

  const connect = async (id) => {
    try { await api.connect(id); alert('Connection request sent!') } catch(e) { alert(e.message) }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-semibold">Hey {me?.name}, let’s find your next project partner!</h2>

      <section className="mt-8 grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h3 className="font-semibold mb-3">Teammates</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {teammates.map(u=> <UserCard key={u._id || u.id} user={u} onConnect={connect} onOpen={setOpenUser} />)}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Mentors</h3>
          <div className="grid gap-4">
            {mentors.map(u=> <UserCard key={u._id || u.id} user={u} onOpen={setOpenUser} />)}
          </div>
        </div>
      </section>

      <section id="events" className="mt-10">
        <h3 className="font-semibold mb-3">Upcoming Events</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {events.map(e=> <EventCard key={e.id || e._id} event={e} onOpen={setOpenEvent} />)}
        </div>
      </section>

      <SlideOver open={!!openUser} onClose={()=>setOpenUser(null)} title={openUser?.name}>
        {openUser && (
          <div>
            <p className="text-white/80">{openUser.college} • {openUser.year || 'Year'}</p>
            {openUser.skills?.length>0 && (
              <div className="mt-4 flex flex-wrap gap-2 text-sm">
                {openUser.skills.map((s,i)=>(<span key={i} className="px-2 py-1 rounded-lg bg-white/10">{s}</span>))}
              </div>
            )}
            <div className="mt-6">
              <Button onClick={()=>{connect(openUser._id || openUser.id); setOpenUser(null)}}>Connect</Button>
            </div>
          </div>
        )}
      </SlideOver>

      <SlideOver open={!!openEvent} onClose={()=>setOpenEvent(null)} title={openEvent?.title}>
        {openEvent && (
          <div>
            <p className="text-white/80">{new Date(openEvent.date).toLocaleString()} • {openEvent.location || 'Campus'}</p>
            <p className="mt-3">{openEvent.description}</p>
            {openEvent.link && <a className="underline mt-4 inline-block" href={openEvent.link} target="_blank" rel="noreferrer">Open link</a>}
          </div>
        )}
      </SlideOver>
    </main>
  )
}
