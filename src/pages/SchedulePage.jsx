import { useCallback, useState } from 'react'
import { Calendar, Play } from 'lucide-react'
import LazyPoster from '../components/LazyPoster'
import { useNavigate } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import api from '../services/api'
import { ErrorMessage } from '../components/ErrorMessage'

const DAYS = ['Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu']

function todayIdx() {
  const d = new Date().getDay() // 0=Sun
  return d === 0 ? 6 : d - 1
}

export default function SchedulePage() {
  const [activeDay, setActiveDay] = useState(todayIdx())
  const navigate = useNavigate()

  const fetchFn = useCallback(() => api.get('/schedule'), [])
  const { data, loading, error, refetch } = useFetch(fetchFn, [])

  // API: { data: { scheduleList: [{ title: "Senin", animeList: [...] }] } }
  const scheduleList = data?.data?.scheduleList || []

  // Find anime for active day
  const dayData  = scheduleList.find(s =>
    s.title?.toLowerCase() === DAYS[activeDay].toLowerCase()
  )
  const dayAnime = dayData?.animeList || []

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:pt-14" style={{ background: '#080b10' }}>
      {/* Header */}
      <div className="sticky top-0 md:top-14 z-40"
        style={{ background: 'rgba(8,11,16,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="px-4 pt-3 pb-1 flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-accent/15 flex items-center justify-center">
            <Calendar size={11} className="text-accent"/>
          </div>
          <h1 className="font-display font-bold text-white">Jadwal Tayang</h1>
          {scheduleList.length > 0 && (
            <span className="ml-auto text-[10px] font-mono text-gray-600">
              {scheduleList.reduce((a,s) => a + (s.animeList?.length||0), 0)} anime
            </span>
          )}
        </div>

        {/* Day tabs */}
        <div className="flex gap-1 px-3 pb-3 overflow-x-auto scrollbar-none">
          {DAYS.map((day, i) => {
            const isToday  = i === todayIdx()
            const isActive = i === activeDay
            const count    = scheduleList.find(s => s.title?.toLowerCase() === day.toLowerCase())?.animeList?.length || 0
            return (
              <button key={day} onClick={() => setActiveDay(i)}
                className="flex-shrink-0 flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 active:scale-95"
                style={isActive
                  ? { background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff' }
                  : isToday
                    ? { background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)', color: '#4b9ead' }
                    : { border: '1px solid transparent', color: '#4b5563' }
                }>
                <span className="text-xs font-bold">{day}</span>
                {count > 0 && (
                  <span className="text-[8px] font-mono" style={{ color: isActive ? '#00d4ff' : '#374151' }}>{count}</span>
                )}
                {isToday && !isActive && (
                  <span className="w-1 h-1 rounded-full bg-accent/50"/>
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="px-4 md:px-8 py-4">
        {loading && (
          <div className="space-y-2">
            {Array.from({length:10}).map((_,i) => (
              <div key={i} className="skeleton h-16 rounded-2xl" style={{ animationDelay: `${i*60}ms` }}/>
            ))}
          </div>
        )}
        {error && <ErrorMessage message={error} onRetry={refetch}/>}

        {!loading && !error && (
          dayAnime.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="text-5xl">📅</div>
              <p className="text-gray-500 text-sm">Tidak ada jadwal untuk hari {DAYS[activeDay]}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-[10px] text-gray-600 font-mono mb-3">
                {dayAnime.length} ANIME · {DAYS[activeDay].toUpperCase()}
              </p>
              {dayAnime.map((anime, i) => {
                const id     = anime.animeId || anime.id
                const title  = anime.title || anime.name
                const poster = anime.poster || anime.image
                const ep     = anime.latestEpisode || anime.episodes || anime.episode || ''
                return (
                  <div key={id || i}
                    onClick={() => id && navigate(`/anime/${id}`)}
                    className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer group transition-all duration-200 active:scale-98 animate-fadeUp"
                    style={{
                      background: 'rgba(15,21,32,0.7)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      animationDelay: `${i*30}ms`,
                      opacity: 0,
                    }}>
                    {/* Number */}
                    <span className="w-6 text-center text-[10px] font-mono text-gray-700 flex-shrink-0">{i+1}</span>

                    {/* Lazy-loaded poster */}
                    <LazyPoster animeId={id} title={title} size="sm"/>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-display font-semibold text-sm text-gray-100 line-clamp-1 group-hover:text-accent transition-colors">
                        {title}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        {ep && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md"
                            style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}>
                            EP {ep}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Arrow */}
                    <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all"
                      style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff' }}>
                      <Play size={11} fill="currentColor"/>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        )}
      </div>
    </div>
  )
}
