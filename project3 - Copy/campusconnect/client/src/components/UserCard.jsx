export default function UserCard({ user, onConnect }){
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{user.name}</h3>
          <p className="text-sm opacity-70">{user.college} • {user.year}</p>
        </div>
        {user.score !== undefined && (
          <div className="text-right">
            <div className="text-xs opacity-60">Compatibility</div>
            <div className="text-lg font-bold text-neonPurple">{Math.round(user.score*100)}%</div>
          </div>
        )}
      </div>
      <div className="mt-3">
        <div className="text-xs opacity-70 mb-1">Skills</div>
        <div className="flex flex-wrap gap-2">
          {user.skills?.map((s,i)=> <span key={i} className="px-2 py-1 bg-white/70 rounded-full text-xs">{s}</span>)}
        </div>
      </div>
      <div className="mt-3">
        <div className="text-xs opacity-70 mb-1">Interests</div>
        <div className="flex flex-wrap gap-2">
          {user.interests?.map((s,i)=> <span key={i} className="px-2 py-1 bg-white/70 rounded-full text-xs">{s}</span>)}
        </div>
      </div>
      {onConnect && <button className="btn-primary mt-4" onClick={()=>onConnect(user)}>Connect</button>}
    </div>
  )
}
