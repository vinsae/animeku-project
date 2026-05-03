/**
 * RecentlyAdded — shows latest updated anime from ongoing page 1
 * Displayed as horizontal scroll strip on Home page
 */
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Clock, ChevronRight } from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import { getOngoing } from '../services/api'

export default function RecentlyAdded() {
  const navigate = useNavigate()
  const fetchFn  = useCallback(() => getOngoing(1), [])
  const { data, loading } = useFetch(fetchFn, [])

  const list = (data?.data?.animeList || data?.animeList || []).slice(0, 10)

  if (loading) return (
    <div className="px-4 py-3">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-1 h-4 rounded-full bg-gradient-to-b from-green-400 to-cyan-400"/>
        <div className="skeleton h-4 w-32 rounded"/>
      </div>
      <div className="flex gap-2 overflow-hidden">
        {Array.from({length:5}).map((_,i) => (
          <div key={i} className="flex-shrink-0 w-28">
            <div className="skeleton aspect-[3/4] rounded-xl mb-1"/>
            <div className="skeleton h-3 rounded w-full"/>
          </div>
        ))}
      </div>
    </div>
  )

  if (list.length === 0) return null

  return (
    <div className="py-3">
      {/* Header */}
      <div className="flex items-center justify-between px-4 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-1 h-4 rounded-full" style={{ background: 'linear-gradient(180deg, #4ade80, #00d4ff)' }}/>
          <Zap size={13} className="text-green-400"/>
          <span className="font-display font-bold text-white text-sm">Baru Diupdate</span>
          {/* Live dot */}
          <div className="flex items-center gap-1 px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>
            <span className="text-[9px] font-mono font-bold text-green-400">LIVE</span>
          </div>
        </div>
        <button onClick={() => navigate('/ongoing')}
          className="flex items-center gap-1 text-[11px] font-mono text-gray-600 hover:text-accent transition-colors">
          Lihat Semua <ChevronRight size={11}/>
        </button>
      </div>

      {/* Horizontal scroll */}
      <div className="flex gap-2.5 overflow-x-auto scrollbar-none px-4 pb-1">
        {list.map((anime, i) => {
          const id     = anime.animeId || anime.id
          const title  = anime.title   || anime.name || ''
          const poster = anime.poster  || anime.image || ''
          const ep     = anime.episodes || anime.episode || ''
          const date   = anime.latestReleaseDate || anime.releaseDay || ''

          return (
            <div key={id || i}
              onClick={() => id && navigate(`/anime/${id}`)}
              className="flex-shrink-0 cursor-pointer group animate-fadeUp"
              style={{ width: '100px', animationDelay: `${i*40}ms`, opacity: 0 }}>

              {/* Poster */}
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-1.5"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                {poster ? (
                  <img src={poster} alt={title} loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl font-black"
                    style={{
                      background: `hsl(${(id?.charCodeAt(0)||i)*37%360},30%,12%)`,
                      color: `hsl(${(id?.charCodeAt(0)||i)*37%360},60%,50%)`
                    }}>
                    {title.charAt(0)}
                  </div>
                )}

                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"/>

                {/* NEW badge */}
                <div className="absolute top-1.5 left-1.5">
                  <span className="px-1.5 py-0.5 rounded-md text-[8px] font-mono font-black"
                    style={{ background: 'rgba(74,222,128,0.25)', border: '1px solid rgba(74,222,128,0.5)', color: '#4ade80' }}>
                    NEW
                  </span>
                </div>

                {/* EP badge */}
                {ep && (
                  <div className="absolute bottom-1.5 right-1.5">
                    <span className="px-1.5 py-0.5 rounded-md text-[8px] font-mono font-bold"
                      style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff' }}>
                      EP {ep}
                    </span>
                  </div>
                )}

                {/* Hover play */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: 'rgba(0,212,255,0.1)' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(0,212,255,0.5)' }}>
                    <span className="text-accent text-xs ml-0.5">▶</span>
                  </div>
                </div>
              </div>

              {/* Title */}
              <p className="text-[10px] font-semibold text-gray-400 line-clamp-2 leading-tight group-hover:text-white transition-colors">
                {title}
              </p>

              {/* Date */}
              {date && (
                <p className="text-[9px] text-gray-700 mt-0.5 flex items-center gap-1 font-mono">
                  <Clock size={7}/>{date}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}