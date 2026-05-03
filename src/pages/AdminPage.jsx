/**
 * Admin Dashboard — /admin
 * Features: Stats, History manager, Bookmark manager, Cache clear, API status check
 * Password protected (default: "admin123")
 */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Shield, BarChart2, History, Bookmark, Trash2,
  RefreshCw, Wifi, WifiOff, Eye, EyeOff, LogOut,
  Play, X, Database, Clock, Star, AlertTriangle
} from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import api from '../services/api'

const ADMIN_KEY = 'animeku_admin_auth'
const DEFAULT_PASS = 'admin123'

function LoginScreen({ onLogin }) {
  const [pass, setPass] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [shake, setShake] = useState(false)

  const handleLogin = () => {
    const saved = localStorage.getItem('animeku_admin_pass') || DEFAULT_PASS
    if (pass === saved) {
      localStorage.setItem(ADMIN_KEY, '1')
      onLogin()
    } else {
      setError('Password salah')
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6" style={{ background: '#080b10' }}>
      <div className={`w-full max-w-sm transition-all ${shake ? 'animate-[wiggle_0.4s_ease]' : ''}`}>
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.3)', boxShadow: '0 0 32px rgba(0,212,255,0.15)' }}>
            <Shield size={28} className="text-accent"/>
          </div>
          <h1 className="font-display font-bold text-2xl text-white">Admin Panel</h1>
          <p className="text-gray-500 text-sm mt-1">AnimEku Dashboard</p>
        </div>

        <div className="space-y-3 p-6 rounded-2xl" style={{ background: 'rgba(15,21,32,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              value={pass}
              onChange={e => { setPass(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              placeholder="Password admin"
              className="w-full px-4 py-3 pr-12 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.08)'}` }}/>
            <button onClick={() => setShow(!show)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400">
              {show ? <EyeOff size={16}/> : <Eye size={16}/>}
            </button>
          </div>
          {error && <p className="text-red-400 text-xs px-1">{error}</p>}
          <button onClick={handleLogin}
            className="w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-95"
            style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.35)', color: '#00d4ff' }}>
            Masuk
          </button>
          <p className="text-center text-[10px] text-gray-700">Default: admin123</p>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color = '#00d4ff', sub }) {
  return (
    <div className="p-4 rounded-2xl" style={{ background: 'rgba(15,21,32,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-start justify-between mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
          <Icon size={16} style={{ color }}/>
        </div>
        <span className="font-mono font-bold text-2xl text-white">{value}</span>
      </div>
      <p className="text-xs font-semibold text-gray-400">{label}</p>
      {sub && <p className="text-[10px] text-gray-600 mt-0.5">{sub}</p>}
    </div>
  )
}

export default function AdminPage() {
  const navigate = useNavigate()
  const [authed, setAuthed] = useState(!!localStorage.getItem(ADMIN_KEY))
  const [apiStatus, setApiStatus] = useState('checking')
  const [activeTab, setActiveTab] = useState('stats')
  const [newPass, setNewPass] = useState('')
  const [passSaved, setPassSaved] = useState(false)
  const { history, clearHistory, bookmarks, clearBookmarks, progress } = useAppContext()

  // Check API status
  useEffect(() => {
    if (!authed) return
    api.get('/ongoing').then(() => setApiStatus('online')).catch(() => setApiStatus('offline'))
  }, [authed])

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_KEY)
    setAuthed(false)
  }

  const handleClearAll = () => {
    if (!confirm('Hapus semua data lokal? (History, Bookmark, Progress)')) return
    clearHistory()
    clearBookmarks()
    localStorage.removeItem('animeku_progress')
    alert('Semua data berhasil dihapus')
  }

  const handleSavePass = () => {
    if (newPass.length < 4) return alert('Password minimal 4 karakter')
    localStorage.setItem('animeku_admin_pass', newPass)
    setPassSaved(true)
    setNewPass('')
    setTimeout(() => setPassSaved(false), 2000)
  }

  const progressCount = Object.keys(progress || {}).length

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)}/>

  const TABS = [
    { id: 'stats',    label: 'Statistik', icon: BarChart2 },
    { id: 'history',  label: 'History',   icon: History   },
    { id: 'bookmark', label: 'Favorit',   icon: Bookmark  },
    { id: 'settings', label: 'Pengaturan',icon: Shield    },
  ]

  return (
    <div className="min-h-screen pb-24 md:pb-8" style={{ background: '#080b10' }}>
      {/* Header */}
      <div className="sticky top-0 z-40 px-4 py-3 flex items-center gap-3"
        style={{ background: 'rgba(8,11,16,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <button onClick={() => navigate('/')} className="p-2 rounded-xl text-gray-600 hover:text-gray-300 transition-colors">
          <X size={18}/>
        </button>
        <div className="flex items-center gap-2 flex-1">
          <Shield size={16} className="text-accent"/>
          <h1 className="font-display font-bold text-white">Admin Panel</h1>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg ml-2"
            style={{ background: apiStatus === 'online' ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${apiStatus === 'online' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
            {apiStatus === 'online' ? <Wifi size={10} className="text-green-400"/> : apiStatus === 'offline' ? <WifiOff size={10} className="text-red-400"/> : <RefreshCw size={10} className="text-gray-500 animate-spin"/>}
            <span className={`text-[9px] font-mono font-bold ${apiStatus === 'online' ? 'text-green-400' : apiStatus === 'offline' ? 'text-red-400' : 'text-gray-500'}`}>
              {apiStatus === 'online' ? 'API ONLINE' : apiStatus === 'offline' ? 'API OFFLINE' : 'CHECKING'}
            </span>
          </div>
        </div>
        <button onClick={handleLogout} className="p-2 rounded-xl text-gray-600 hover:text-red-400 transition-colors">
          <LogOut size={16}/>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-4 py-3 overflow-x-auto scrollbar-none"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all"
            style={activeTab === id
              ? { background: 'rgba(0,212,255,0.12)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)' }
              : { color: '#4b5563', border: '1px solid transparent' }}>
            <Icon size={12}/>{label}
          </button>
        ))}
      </div>

      <div className="px-4 py-4 space-y-4">

        {/* ── Stats tab ── */}
        {activeTab === 'stats' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="grid grid-cols-2 gap-3">
              <StatCard icon={History}  label="Riwayat Tontonan" value={history.length}   color="#00d4ff" sub="anime ditonton"/>
              <StatCard icon={Bookmark} label="Anime Favorit"    value={bookmarks.length} color="#7c3aed" sub="disimpan"/>
              <StatCard icon={Play}     label="Progress Tersimpan" value={progressCount}  color="#10b981" sub="anime dilanjutkan"/>
              <StatCard icon={Database} label="Storage Lokal"    value={`${(JSON.stringify(localStorage).length/1024).toFixed(1)}KB`} color="#f59e0b" sub="digunakan"/>
            </div>

            {/* Recent activity */}
            {history.length > 0 && (
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Aktivitas Terakhir</p>
                <div className="space-y-1.5">
                  {history.slice(0,5).map(item => (
                    <div key={item.animeId} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                      onClick={() => navigate(`/watch/${item.episodeId}`)}>
                      {item.poster && <img src={item.poster} alt={item.title} className="w-8 h-11 rounded-lg object-cover flex-shrink-0"/>}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-200 line-clamp-1">{item.title}</p>
                        <p className="text-[10px] text-accent font-mono">{item.episodeTitle}</p>
                      </div>
                      <Clock size={10} className="text-gray-700 flex-shrink-0"/>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── History tab ── */}
        {activeTab === 'history' && (
          <div className="space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-white">{history.length} Riwayat</p>
              {history.length > 0 && (
                <button onClick={() => { if(confirm('Hapus semua riwayat?')) clearHistory() }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-red-400 transition-all"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <Trash2 size={11}/> Hapus Semua
                </button>
              )}
            </div>
            {history.length === 0
              ? <p className="text-center text-gray-600 text-sm py-10">Belum ada riwayat</p>
              : history.map(item => (
                <div key={item.animeId} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: 'rgba(15,21,32,0.7)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  {item.poster && <img src={item.poster} alt="" className="w-9 h-12 rounded-lg object-cover flex-shrink-0"/>}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-200 line-clamp-1">{item.title}</p>
                    <p className="text-[10px] text-accent font-mono mt-0.5">{item.episodeTitle}</p>
                  </div>
                  <button onClick={() => navigate(`/watch/${item.episodeId}`)}
                    className="p-1.5 rounded-lg text-accent" style={{ background: 'rgba(0,212,255,0.1)' }}>
                    <Play size={11} fill="currentColor"/>
                  </button>
                </div>
              ))
            }
          </div>
        )}

        {/* ── Bookmark tab ── */}
        {activeTab === 'bookmark' && (
          <div className="space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-white">{bookmarks.length} Favorit</p>
              {bookmarks.length > 0 && (
                <button onClick={() => { if(confirm('Hapus semua favorit?')) clearBookmarks() }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-red-400 transition-all"
                  style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <Trash2 size={11}/> Hapus Semua
                </button>
              )}
            </div>
            {bookmarks.length === 0
              ? <p className="text-center text-gray-600 text-sm py-10">Belum ada favorit</p>
              : bookmarks.map(anime => (
                <div key={anime.animeId} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer"
                  style={{ background: 'rgba(15,21,32,0.7)', border: '1px solid rgba(255,255,255,0.05)' }}
                  onClick={() => navigate(`/anime/${anime.animeId}`)}>
                  {anime.poster && <img src={anime.poster} alt="" className="w-9 h-12 rounded-lg object-cover flex-shrink-0"/>}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-200 line-clamp-1">{anime.title}</p>
                    <p className="text-[10px] text-purple-400 font-mono mt-0.5 flex items-center gap-1"><Star size={8} fill="currentColor"/> Favorit</p>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {/* ── Settings tab ── */}
        {activeTab === 'settings' && (
          <div className="space-y-4 animate-fadeIn">

            {/* Change password */}
            <div className="p-4 rounded-2xl space-y-3" style={{ background: 'rgba(15,21,32,0.7)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-sm font-bold text-white flex items-center gap-2"><Shield size={14} className="text-accent"/> Ganti Password</p>
              <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)}
                placeholder="Password baru (min. 4 karakter)"
                className="w-full px-4 py-2.5 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}/>
              <button onClick={handleSavePass}
                className="w-full py-2.5 rounded-xl text-sm font-bold transition-all"
                style={{ background: passSaved ? 'rgba(34,197,94,0.15)' : 'rgba(0,212,255,0.1)', border: `1px solid ${passSaved ? 'rgba(34,197,94,0.4)' : 'rgba(0,212,255,0.3)'}`, color: passSaved ? '#4ade80' : '#00d4ff' }}>
                {passSaved ? '✓ Tersimpan!' : 'Simpan Password'}
              </button>
            </div>

            {/* Danger zone */}
            <div className="p-4 rounded-2xl space-y-3" style={{ background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)' }}>
              <p className="text-sm font-bold text-red-400 flex items-center gap-2"><AlertTriangle size={14}/> Danger Zone</p>
              <button onClick={handleClearAll}
                className="w-full py-2.5 rounded-xl text-sm font-bold text-red-400 transition-all active:scale-95"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
                <Trash2 size={13} className="inline mr-2"/>Hapus Semua Data Lokal
              </button>
              <p className="text-[10px] text-gray-700">Menghapus history, favorit, dan progress yang tersimpan di browser.</p>
            </div>

            {/* App info */}
            <div className="p-4 rounded-2xl" style={{ background: 'rgba(15,21,32,0.5)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Info Aplikasi</p>
              <div className="space-y-1.5 text-xs font-mono">
                {[['Versi', '1.0.0'], ['Stack', 'React + Vite'], ['API', 'wajik-anime-api'], ['Source', 'Otakudesu.blog']].map(([k,v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-gray-600">{k}</span>
                    <span className="text-gray-400">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
