/**
 * HeroCarousel — auto-playing featured anime banner
 * Fetches first page of ongoing, uses top 6 as featured
 */
import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Play, ChevronLeft, ChevronRight, Star, Zap } from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import { getOngoing } from '../services/api'

export default function HeroCarousel() {
  const navigate   = useNavigate()
  const [current, setCurrent]   = useState(0)
  const [paused,  setPaused]    = useState(false)
  const [loaded,  setLoaded]    = useState({})
  const intervalRef = useRef(null)

  const fetchFn = useCallback(() => getOngoing(1), [])
  const { data, loading } = useFetch(fetchFn, [])
  const items = (data?.data?.animeList || data?.animeList || []).slice(0, 6)

  // Auto-advance
  useEffect(() => {
    if (paused || items.length === 0) return
    intervalRef.current = setInterval(() => {
      setCurrent(p => (p + 1) % items.length)
    }, 4000)
    return () => clearInterval(intervalRef.current)
  }, [paused, items.length])

  const prev = () => { clearInterval(intervalRef.current); setCurrent(p => (p - 1 + items.length) % items.length) }
  const next = () => { clearInterval(intervalRef.current); setCurrent(p => (p + 1) % items.length) }

  if (loading) return (
    <div className="skeleton w-full" style={{ height: '220px' }}/>
  )
  if (items.length === 0) return null

  const anime  = items[current]
  const id     = anime.animeId || anime.id
  const title  = anime.title   || anime.name || ''
  const poster = anime.poster  || anime.image || ''
  const ep     = anime.episodes || anime.episode || ''
  const score  = anime.score || ''
  const date   = anime.latestReleaseDate || ''

  return (
    <div className="relative overflow-hidden select-none"
      style={{ height: '240px' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}>

      {/* Slides */}
      {items.map((item, i) => {
        const p = item.poster || item.image || ''
        return (
          <div key={item.animeId || i}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}>
            {p && (
              <img src={p} alt={item.title}
                className="w-full h-full object-cover"
                style={{ filter: 'blur(2px) brightness(0.35) saturate(1.4)', transform: 'scale(1.05)' }}
                onLoad={() => setLoaded(prev => ({ ...prev, [i]: true }))}/>
            )}
            {!p && (
              <div className="w-full h-full"
                style={{ background: `hsl(${(item.animeId?.charCodeAt(0)||i)*37%360},40%,8%)` }}/>
            )}
          </div>
        )
      })}

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-10" style={{
        background: 'linear-gradient(90deg, rgba(8,11,16,0.95) 0%, rgba(8,11,16,0.5) 50%, rgba(8,11,16,0.2) 100%)'
      }}/>
      <div className="absolute inset-0 z-10" style={{
        background: 'linear-gradient(0deg, rgba(8,11,16,1) 0%, transparent 40%)'
      }}/>

      {/* Content */}
      <div className="absolute inset-0 z-20 flex items-end pb-6 px-4">
        <div className="flex items-end gap-4 w-full">
          {/* Poster thumbnail */}
          <div className="flex-shrink-0 hidden sm:block"
            style={{ width: '80px', height: '110px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
            {poster && <img src={poster} alt={title} className="w-full h-full object-cover"/>}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            {/* Badges row */}
            <div className="flex items-center gap-2 mb-2">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.35)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>
                <span className="text-[9px] font-mono font-bold text-green-400">ONGOING</span>
              </div>
              {score && (
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.3)' }}>
                  <Star size={8} className="text-yellow-400" fill="currentColor"/>
                  <span className="text-[9px] font-mono font-bold text-yellow-400">{score}</span>
                </div>
              )}
              {ep && (
                <div className="px-2 py-0.5 rounded-full"
                  style={{ background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.3)' }}>
                  <span className="text-[9px] font-mono font-bold text-accent">EP {ep}</span>
                </div>
              )}
            </div>

            {/* Title */}
            <h2 className="font-display font-black text-white leading-tight mb-2 line-clamp-2"
              style={{ fontSize: 'clamp(16px, 4vw, 22px)', textShadow: '0 2px 12px rgba(0,0,0,0.8)' }}>
              {title}
            </h2>

            {/* Date + CTA */}
            <div className="flex items-center gap-2">
              {date && (
                <span className="text-[10px] text-gray-500 font-mono flex items-center gap-1">
                  <Zap size={9} className="text-gray-600"/> {date}
                </span>
              )}
              <button
                onClick={() => navigate(`/anime/${id}`)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-xs transition-all active:scale-95"
                style={{ background: 'rgba(0,212,255,0.2)', border: '1px solid rgba(0,212,255,0.5)', color: '#00d4ff', boxShadow: '0 0 16px rgba(0,212,255,0.2)' }}>
                <Play size={11} fill="currentColor"/> Tonton
              </button>
            </div>
          </div>

          {/* Poster right side (mobile only) */}
          <div className="flex-shrink-0 sm:hidden"
            style={{ width: '60px', height: '80px', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            {poster && <img src={poster} alt={title} className="w-full h-full object-cover"/>}
          </div>
        </div>
      </div>

      {/* Prev/Next arrows — desktop only */}
      <button onClick={prev}
        className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 items-center justify-center rounded-full transition-all hover:scale-110"
        style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
        <ChevronLeft size={16}/>
      </button>
      <button onClick={next}
        className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 z-30 w-8 h-8 items-center justify-center rounded-full transition-all hover:scale-110"
        style={{ background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
        <ChevronRight size={16}/>
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-2 right-4 z-30 flex items-center gap-1.5">
        {items.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className="rounded-full transition-all duration-300"
            style={{
              width:  i === current ? '20px' : '6px',
              height: '6px',
              background: i === current ? '#00d4ff' : 'rgba(255,255,255,0.25)',
              boxShadow: i === current ? '0 0 8px rgba(0,212,255,0.6)' : 'none',
            }}/>
        ))}
      </div>

      {/* Progress bar */}
      {!paused && (
        <div className="absolute bottom-0 left-0 z-30 h-0.5"
          style={{ background: '#00d4ff', boxShadow: '0 0 6px #00d4ff' }}
          key={current}>
          <div className="h-full bg-accent"
            style={{ width: '100%', animation: 'progress 4s linear forwards' }}/>
        </div>
      )}

      <style>{`
        @keyframes progress {
          from { width: 0% }
          to   { width: 100% }
        }
      `}</style>
    </div>
  )
}