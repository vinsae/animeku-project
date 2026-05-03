import { useState, useCallback } from 'react'
import { Flame, CheckCircle, ChevronLeft, ChevronRight, Play, Clock, TrendingUp, Tag, ChevronRight as CR } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import { getOngoing, getComplete } from '../services/api'
import AnimeCard from '../components/AnimeCard'
import { SkeletonGrid } from '../components/SkeletonCard'
import { ErrorMessage } from '../components/ErrorMessage'
import { useAppContext } from '../context/AppContext'
import RecentlyAdded from '../components/RecentlyAdded'
import HeroCarousel from '../components/HeroCarousel'
import LazyPoster from '../components/LazyPoster'

const TABS = [
  { id: 'ongoing',  label: 'Ongoing',  icon: Flame       },
  { id: 'complete', label: 'Complete', icon: CheckCircle },
]

function timeAgo(ts) {
  const d = Date.now() - ts
  const m = Math.floor(d/60000), h = Math.floor(d/3600000)
  if (m < 1) return 'Baru saja'
  if (m < 60) return `${m}m lalu`
  if (h < 24) return `${h}j lalu`
  return `${Math.floor(d/86400000)}h lalu`
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('ongoing')
  const [page, setPage] = useState(1)
  const navigate = useNavigate()
  const { history } = useAppContext()

  const fetchFn = useCallback(
    () => activeTab === 'ongoing' ? getOngoing(page) : getComplete(page),
    [activeTab, page]
  )
  const { data, loading, error, refetch } = useFetch(fetchFn, [activeTab, page])

  const animeList  = data?.data?.animeList || data?.animeList || []
  const pagination = data?.data?.pagination || {}
  const hasNext    = pagination.hasNextPage || pagination.nextPage
  const recentHistory = history.slice(0, 8)

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    setPage(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen" style={{ background: '#080b10' }}>

      {/* ── Mobile Hero Header ── */}
      <div className="md:hidden relative overflow-hidden px-4 pt-6 pb-4"
        style={{ background: 'linear-gradient(180deg, rgba(0,212,255,0.06) 0%, transparent 100%)' }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, #00d4ff 0%, transparent 70%)' }}/>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-lg bg-accent/20 border border-accent/40 flex items-center justify-center">
                <Play size={11} className="text-accent ml-0.5" fill="currentColor"/>
              </div>
              <span className="font-display font-extrabold text-xl tracking-tight">
                Anim<span className="text-gradient">Eku</span>
              </span>
            </div>
            <p className="text-[11px] text-gray-500 font-mono">ANIME STREAMING</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)' }}>
            <TrendingUp size={11} className="text-accent"/>
            <span className="text-[10px] text-accent font-mono font-bold">LIVE</span>
          </div>
        </div>
      </div>

      {/* ── Hero Carousel ── */}
      <HeroCarousel/>

      {/* ── Continue Watching ── */}
      {recentHistory.length > 0 && (
        <div className="pt-2 pb-1">
          <div className="flex items-center gap-2 px-4 mb-3">
            <div className="w-1 h-4 rounded-full bg-gradient-to-b from-accent to-purple-500"/>
            <span className="font-display font-bold text-white text-sm">Lanjut Nonton</span>
            <span className="text-[10px] text-gray-600 font-mono ml-auto">{recentHistory.length} anime</span>
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-none px-4 pb-1">
            {recentHistory.map((item, i) => (
              <div key={item.animeId}
                onClick={() => navigate(`/watch/${item.episodeId}`)}
                className="flex-shrink-0 cursor-pointer group animate-fadeUp"
                style={{ animationDelay: `${i*40}ms`, opacity: 0, width: '160px' }}>
                <div className="flex items-center gap-2.5 p-2.5 rounded-2xl transition-all duration-200 group-active:scale-95"
                  style={{ background: 'rgba(15,21,32,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {/* Poster — lazy load if missing */}
                  <div className="relative flex-shrink-0">
                    {item.poster
                      ? <img src={item.poster} alt={item.title} className="w-9 h-12 rounded-xl object-cover"/>
                      : <LazyPoster animeId={item.animeId} title={item.title} size="sm"/>
                    }
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-gray-200 line-clamp-1 leading-tight">{item.title}</p>
                    <p className="text-[9px] font-mono mt-0.5 line-clamp-1"
                      style={{ color: '#00d4ff' }}>{item.episodeTitle}</p>
                    <p className="text-[8px] text-gray-600 mt-0.5">{timeAgo(item.timestamp)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Genre Quick Access ── */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(180deg, #7c3aed, #00d4ff)' }}/>
            <span className="font-display font-bold text-white text-sm">Genre</span>
          </div>
          <button onClick={() => navigate('/genres')}
            className="flex items-center gap-1 text-[11px] font-mono text-gray-500 hover:text-accent transition-colors">
            Semua <CR size={12}/>
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-4 px-4">
          {[
            ['action','Action','#ef4444'],['comedy','Comedy','#f59e0b'],['romance','Romance','#ec4899'],
            ['fantasy','Fantasy','#7c3aed'],['drama','Drama','#10b981'],['school','School','#3b82f6'],
            ['adventure','Adventure','#f97316'],['horror','Horror','#6b7280'],['shounen','Shounen','#00d4ff'],
            ['slice-of-life','Slice of Life','#84cc16'],
          ].map(([id, label, color]) => (
            <button key={id} onClick={() => navigate(`/genre/${id}`)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95"
              style={{ background: `${color}15`, border: `1px solid ${color}30`, color }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Recently Added ── */}
      <RecentlyAdded/>

      {/* ── Tabs ── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 40, background: 'rgba(8,11,16,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        className="px-4 md:px-8 md:top-14">
        <div className="flex gap-1.5 py-2.5">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => handleTabChange(id)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 active:scale-95"
              style={activeTab === id
                ? { background: 'rgba(0,212,255,0.12)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)', boxShadow: '0 0 16px rgba(0,212,255,0.1)' }
                : { color: '#4b5563', border: '1px solid transparent' }}>
              <Icon size={13}/>{label}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-1 px-2 py-1 rounded-lg" style={{ color: '#00d4ff' }}>
            <Flame size={11}/>
            <span className="text-[10px] font-mono font-bold">{animeList.length || '—'}</span>
          </div>
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="px-3 md:px-8 py-4">
        {loading && <SkeletonGrid count={12}/>}
        {error   && <ErrorMessage message={error} onRetry={refetch}/>}

        {!loading && !error && animeList.length > 0 && (
          <>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-2 md:gap-3">
              {animeList.map((anime, idx) => (
                <div key={anime.animeId || idx} className="animate-fadeUp"
                  style={{ animationDelay: `${Math.min(idx*25,400)}ms`, opacity: 0 }}>
                  <AnimeCard anime={anime}/>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-3 mt-8 pb-2">
              <button onClick={() => { setPage(p => Math.max(1,p-1)); window.scrollTo({top:0,behavior:'smooth'}) }}
                disabled={page===1}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#9ca3af' }}>
                <ChevronLeft size={15}/> Sebelumnya
              </button>
              <div className="px-4 py-2 rounded-xl font-mono font-bold text-sm"
                style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)', color: '#00d4ff' }}>
                {page}
              </div>
              <button onClick={() => { setPage(p => p+1); window.scrollTo({top:0,behavior:'smooth'}) }}
                disabled={!hasNext}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.25)', color: '#00d4ff' }}>
                Selanjutnya <ChevronRight size={15}/>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}