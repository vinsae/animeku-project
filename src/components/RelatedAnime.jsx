/**
 * RelatedAnime — shows anime with same genres
 * Used in DetailPage below episode list
 */
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Play, Star } from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import api from '../services/api'

export default function RelatedAnime({ genres = [], currentId, recommended = [] }) {
  const navigate = useNavigate()

  // Use first genre to fetch related, fallback to recommended from API
  const firstGenre = genres[0]?.genreId || genres[0]?.id
  const fetchFn = useCallback(() =>
    firstGenre
      ? api.get(`/genre/${firstGenre}`, { params: { page: 1 } })
      : Promise.resolve(null)
  , [firstGenre])

  const { data } = useFetch(fetchFn, [firstGenre])

  const fromGenre    = data?.data?.animeList || data?.animeList || []
  const filtered     = fromGenre.filter(a => (a.animeId || a.id) !== currentId).slice(0, 12)
  const fromRecommended = recommended.slice(0, 12)

  // Prefer API recommendations, fallback to genre-based
  const animeList = fromRecommended.length > 0 ? fromRecommended : filtered

  if (animeList.length === 0) return null

  return (
    <div className="px-4 md:px-8 mt-6">
      <div className="h-px mb-5" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.15), transparent)' }}/>

      <div className="flex items-center gap-2 mb-4">
        <div className="w-5 h-5 rounded-md flex items-center justify-center"
          style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
          <Sparkles size={11} style={{ color: '#a78bfa' }}/>
        </div>
        <span className="font-display font-bold text-white">Rekomendasi Untukmu</span>
        {genres[0] && (
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.2)', color: '#a78bfa' }}>
            {genres[0]?.title || genres[0]?.name}
          </span>
        )}
      </div>

      {/* Horizontal scroll on mobile, grid on desktop */}
      <div className="md:hidden flex gap-3 overflow-x-auto scrollbar-none -mx-4 px-4 pb-2">
        {animeList.map((anime, i) => {
          const id     = anime.animeId || anime.id
          const title  = anime.title  || anime.name
          const poster = anime.poster || anime.image
          const ep     = anime.episodes || anime.episode || ''
          const score  = anime.score || ''
          return (
            <div key={id || i} onClick={() => navigate(`/anime/${id}`)}
              className="flex-shrink-0 w-28 cursor-pointer group animate-fadeUp"
              style={{ animationDelay: `${i*30}ms`, opacity: 0 }}>
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-1.5"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                {poster
                  ? <img src={poster} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                  : <div className="w-full h-full flex items-center justify-center" style={{ background: '#0f1520' }}>
                      <Play size={20} className="text-gray-700"/>
                    </div>
                }
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"/>
                {ep && (
                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold"
                    style={{ background: 'rgba(0,212,255,0.2)', border: '1px solid rgba(0,212,255,0.4)', color: '#00d4ff' }}>
                    EP {ep}
                  </div>
                )}
                {score && (
                  <div className="absolute bottom-1.5 right-1.5 flex items-center gap-0.5 px-1.5 py-0.5 rounded-md"
                    style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <Star size={8} className="text-yellow-400" fill="currentColor"/>
                    <span className="text-[9px] font-mono text-yellow-300 font-bold">{score}</span>
                  </div>
                )}
              </div>
              <p className="text-[11px] font-semibold text-gray-300 line-clamp-2 leading-tight group-hover:text-accent transition-colors">{title}</p>
            </div>
          )
        })}
      </div>

      {/* Desktop grid */}
      <div className="hidden md:grid grid-cols-4 lg:grid-cols-6 gap-3">
        {animeList.map((anime, i) => {
          const id     = anime.animeId || anime.id
          const title  = anime.title  || anime.name
          const poster = anime.poster || anime.image
          const ep     = anime.episodes || anime.episode || ''
          return (
            <div key={id || i} onClick={() => navigate(`/anime/${id}`)}
              className="cursor-pointer group animate-fadeUp"
              style={{ animationDelay: `${i*30}ms`, opacity: 0 }}>
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-1.5"
                style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                {poster
                  ? <img src={poster} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                  : <div className="w-full h-full flex items-center justify-center" style={{ background: '#0f1520' }}><Play size={20} className="text-gray-700"/></div>
                }
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"/>
                {ep && (
                  <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-md text-[9px] font-mono font-bold"
                    style={{ background: 'rgba(0,212,255,0.2)', border: '1px solid rgba(0,212,255,0.4)', color: '#00d4ff' }}>
                    EP {ep}
                  </div>
                )}
              </div>
              <p className="text-xs font-semibold text-gray-300 line-clamp-2 group-hover:text-accent transition-colors">{title}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
