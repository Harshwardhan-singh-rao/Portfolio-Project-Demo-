import { Link, useLocation } from 'react-router-dom'

export default function NavBar(){
  const { pathname } = useLocation()
  const Item = ({ to, children }) => (
    <Link to={to} className={`px-3 py-2 rounded-xl ${pathname===to?'bg-deepBlue text-white':'hover:bg-white/70'}`}>{children}</Link>
  )
  return (
    <div className="sticky top-0 z-20 bg-white/60 backdrop-blur border-b border-white/40">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        <Link to="/explore" className="text-xl font-bold bg-gradient-to-r from-deepBlue to-neonPurple bg-clip-text text-transparent">CampusConnect</Link>
        <nav className="flex gap-2">
          <Item to="/explore">Explore</Item>
          <Item to="/team">Team Builder</Item>
          <Item to="/chat">Chat</Item>
          <Item to="/login">Login</Item>
        </nav>
      </div>
    </div>
  )
}
