import { useEffect, useState } from 'react'
import { api } from '../api/client'
import SlideOver from '../components/SlideOver'
import { Button } from '../components/ui/Button'

export default function Profile() {
  const [me, setMe] = useState(null)
  const [openEdit, setOpenEdit] = useState(false)
  const [openMatches, setOpenMatches] = useState(false)
  const [form, setForm] = useState({ name:'', college:'', year:'', skills:[], interests:[] })
  const [matches, setMatches] = useState([])

  useEffect(()=>{
    async function load(){
      try {
        const data = await api.me()
        setMe(data)
        setForm({ ...data, skills: data.skills||[], interests: data.interests||[] })
      } catch {
        const fallback = { name:'Student', college:'Your College', year:'3rd', skills:['React','Node'], interests:['AI','Web'] }
        setMe(fallback)
        setForm(fallback)
      }
    }
    load()
  },[])

  const save = async () => {
    try {
      await api.updateProfile({ ...form, skills: form.skills, interests: form.interests })
      setMe(form)
      setOpenEdit(false)
    } catch(e) { alert(e.message) }
  }

  const openMatchesPanel = async () => {
    try { const res = await api.matches(); setMatches(res.map(r=>r.user || r)); setOpenMatches(true) } catch(e){ setMatches([]); setOpenMatches(true) }
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="glass rounded-2xl p-6">
        <div className="flex items-center gap-4">
          <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(me?.name||'Student')}`} alt="avatar" className="w-20 h-20 rounded-2xl" />
          <div>
            <h2 className="text-2xl font-semibold">{me?.name}</h2>
            <p className="text-white/80">{me?.college} • {me?.year}</p>
          </div>
        </div>
        <div className="mt-4">
          <h4 className="font-semibold">Skills</h4>
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            {(me?.skills||[]).map((s,i)=>(<span key={i} className="px-2 py-1 rounded-lg bg-white/10">{s}</span>))}
          </div>
        </div>
        <div className="mt-4">
          <h4 className="font-semibold">Interests</h4>
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            {(me?.interests||[]).map((s,i)=>(<span key={i} className="px-2 py-1 rounded-lg bg-white/10">{s}</span>))}
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <Button onClick={()=>setOpenEdit(true)} variant="outline">Edit Profile</Button>
          <Button onClick={openMatchesPanel}>View My Matches</Button>
        </div>
      </div>

      <SlideOver open={openEdit} onClose={()=>setOpenEdit(false)} title="Edit Profile" footer={
        <>
          <Button variant="ghost" onClick={()=>setOpenEdit(false)}>Cancel</Button>
          <Button onClick={save}>Save</Button>
        </>
      }>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="glass rounded-xl p-3" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Name" />
          <input className="glass rounded-xl p-3" value={form.college} onChange={e=>setForm({...form,college:e.target.value})} placeholder="College" />
          <input className="glass rounded-xl p-3" value={form.year} onChange={e=>setForm({...form,year:e.target.value})} placeholder="Year" />
          <input className="glass rounded-xl p-3 md:col-span-2" value={form.skills.join(', ')} onChange={e=>setForm({...form,skills:e.target.value.split(',').map(s=>s.trim())})} placeholder="Skills (comma separated)" />
          <input className="glass rounded-xl p-3 md:col-span-2" value={form.interests.join(', ')} onChange={e=>setForm({...form,interests:e.target.value.split(',').map(s=>s.trim())})} placeholder="Interests (comma separated)" />
        </div>
      </SlideOver>

      <SlideOver open={openMatches} onClose={()=>setOpenMatches(false)} title="Your Matches">
        {matches.length === 0 ? (
          <p className="text-white/80">No matches yet.</p>
        ) : (
          <div className="space-y-3">
            {matches.map((u,i)=> (
              <div key={i} className="glass rounded-xl p-3">
                <div className="flex items-center gap-3">
                  <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(u.name||'User')}`} alt="avatar" className="w-10 h-10 rounded-lg" />
                  <div>
                    <div className="font-semibold">{u.name}</div>
                    <div className="text-xs text-white/70">{u.college} • {u.year || 'Year'}</div>
                  </div>
                </div>
                {u.skills?.length>0 && (
                  <div className="mt-2 flex flex-wrap gap-2 text-xs">
                    {u.skills.map((s,idx)=>(<span key={idx} className="px-2 py-1 rounded-lg bg-white/10">{s}</span>))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </SlideOver>
    </main>
  )
}
