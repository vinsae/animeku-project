import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Home, Search, History, Play, Flame, CheckCircle, Bookmark, Calendar, Tag, Film } from 'lucide-react'

function DesktopNav() {
  const { pathname } = useLocation()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const navLinks = [
    { to: '/',         label: 'Beranda',  icon: Home        },
    { to: '/ongoing',  label: 'Ongoing',  icon: Flame       },
    { to: '/complete', label: 'Complete', icon: CheckCircle },
    { to: '/schedule', label: 'Jadwal',   icon: Calendar    },
    { to: '/bookmark', label: 'Favorit',  icon: Bookmark    },
    { to: '/history',  label: 'History',  icon: History     },
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) { navigate(`/search?q=${encodeURIComponent(query.trim())}`); setQuery('') }
  }

  return (
    <nav className="hidden md:flex fixed top-0 left-0 right-0 z-50 h-14 items-center px-6 gap-4 glass border-b border-white/5">
      <Link to="/" className="flex items-center gap-2 mr-2 flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center glow-sm">
          <Play size={13} className="text-accent ml-0.5" fill="currentColor"/>
        </div>
        <span className="font-display font-bold text-lg tracking-tight">
          Anim<span className="text-gradient">Eku</span>
        </span>
      </Link>
      <div className="flex items-center gap-0.5">
        {navLinks.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || (to !== '/' && pathname.startsWith(to))
          return (
            <Link key={to} to={to}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                active ? 'text-accent bg-accent/10 border border-accent/25' : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
              }`}>
              <Icon size={13}/>{label}
            </Link>
          )
        })}
      </div>
      <form onSubmit={handleSearch} className="ml-auto">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"/>
          <input type="text" value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Cari anime..."
            className="pl-9 pr-4 py-1.5 rounded-xl bg-white/5 border border-white/8 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-accent/40 w-48 transition-all"/>
        </div>
      </form>
    </nav>
  )
}

function MobileNav() {
  const { pathname } = useLocation()
  const tabs = [
    { to: '/',         label: 'Home',    icon: Home     },
    { to: '/search',   label: 'Cari',    icon: Search   },
    { to: '/schedule', label: 'Jadwal',  icon: Calendar },
    { to: '/bookmark', label: 'Favorit', icon: Bookmark },
    { to: '/history',  label: 'History', icon: History  },
  ]

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 mobile-nav safe-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map(({ to, label, icon: Icon }) => {
          const active = pathname === to || (to !== '/' && pathname.startsWith(to))
          return (
            <Link key={to} to={to}
              className="flex flex-col items-center gap-1 flex-1 py-1 transition-all duration-200 active:scale-90"
              style={{ color: active ? '#00d4ff' : '#374151' }}>
              <div className={`relative p-2 rounded-2xl transition-all duration-300 ${active ? 'bg-cyan-500/12' : ''}`}
                style={active ? { boxShadow: '0 0 16px rgba(0,212,255,0.15)' } : {}}>
                <Icon size={21} strokeWidth={active ? 2.5 : 1.8}/>
                {active && (
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-accent animate-pulse"
                    style={{ boxShadow: '0 0 6px #00d4ff' }}/>
                )}
              </div>
              <span className={`text-[9px] font-bold tracking-wide ${active ? 'text-accent' : 'text-gray-600'}`}>
                {label.toUpperCase()}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

export default function Navbar() {
  return (
    <>
      <DesktopNav/>
      <MobileNav/>
    </>
  )
}
