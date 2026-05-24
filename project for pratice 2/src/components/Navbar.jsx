import { Link, useLocation, useNavigate } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { Button } from './ui/Button'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const isAuthPage = ['/login','/signup'].includes(location.pathname)

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-black/20 border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-sky-400 to-teal-500" />
          <span className="font-extrabold tracking-tight">Campus Connect</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-cyan-100">Home</Link>
          <Link to="/dashboard" className="hover:text-cyan-100">Connections</Link>
          <Link to="/dashboard#events" className="hover:text-cyan-100">Events</Link>
          <Link to="/profile" className="hover:text-cyan-100">Profile</Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthPage ? (
            <Link to="/signup"><Button>Sign Up</Button></Link>
          ) : (
            localStorage.getItem('token') ? (
              <Button onClick={handleLogout} variant="outline">Logout</Button>
            ) : (
              <div className="flex gap-2">
                <Link to="/login"><Button variant="outline">Login</Button></Link>
                <Link to="/signup"><Button>Sign Up</Button></Link>
              </div>
            )
          )}
        </div>
      </div>
    </header>
  )
}
