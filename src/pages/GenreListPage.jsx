import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Tag, ChevronRight } from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import api from '../services/api'
import { ErrorMessage } from '../components/ErrorMessage'

// Color palette untuk genre badges
const COLORS = [
  '#00d4ff','#7c3aed','#10b981','#f59e0b','#ef4444',
  '#ec4899','#8b5cf6','#06b6d4','#84cc16','#f97316',
  '#14b8a6','#a855f7','#3b82f6','#e11d48','#059669',
]

export default function GenreListPage() {
  const navigate = useNavigate()
  const fetchFn = useCallback(() => api.get('/genre'), [])
  const { data, loading, error, refetch } = useFetch(fetchFn, [])

  const genres = data?.data?.genreList || data?.genreList || []

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:pt-14" style={{ background: '#080b10' }}>
      {/* Header */}
      <div className="sticky top-0 md:top-14 z-40 px-4 py-3"
        style={{ background: 'rgba(8,11,16,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-accent/15 flex items-center justify-center">
            <Tag size={11} className="text-accent"/>
          </div>
          <h1 className="font-display font-bold text-white">Semua Genre</h1>
          {genres.length > 0 && (
            <span className="ml-auto text-[10px] font-mono text-gray-600">{genres.length} genre</span>
          )}
        </div>
      </div>

      <div className="px-4 md:px-8 py-5">
        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {Array.from({length:16}).map((_,i) => (
              <div key={i} className="skeleton h-14 rounded-2xl"/>
            ))}
          </div>
        )}
        {error && <ErrorMessage message={error} onRetry={refetch}/>}

        {!loading && !error && genres.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {genres.map((g, i) => {
              const name    = g.title || g.genreName || g.name
              const id      = g.genreId || g.id || name?.toLowerCase().replace(/\s+/g,'-')
              const color   = COLORS[i % COLORS.length]
              return (
                <button key={id || i}
                  onClick={() => navigate(`/genre/${id}`)}
                  className="group flex items-center justify-between p-3.5 rounded-2xl transition-all duration-200 active:scale-95 text-left"
                  style={{
                    background: `${color}0d`,
                    border: `1px solid ${color}22`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = `${color}18`; e.currentTarget.style.borderColor = `${color}44` }}
                  onMouseLeave={e => { e.currentTarget.style.background = `${color}0d`; e.currentTarget.style.borderColor = `${color}22` }}>
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color, boxShadow: `0 0 6px ${color}` }}/>
                    <span className="text-sm font-bold text-gray-200 line-clamp-1">{name}</span>
                  </div>
                  <ChevronRight size={13} className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color }}/>
                </button>
              )
            })}
          </div>
        )}

        {!loading && !error && genres.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-3">🎭</div>
            <p className="text-gray-500 text-sm">Genre tidak tersedia</p>
          </div>
        )}
      </div>
    </div>
  )
}