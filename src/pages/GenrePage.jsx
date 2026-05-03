import { useParams, useNavigate } from 'react-router-dom'
import { useCallback, useState } from 'react'
import { ArrowLeft, Tag, ChevronLeft, ChevronRight } from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import api from '../services/api'
import AnimeCard from '../components/AnimeCard'
import { SkeletonGrid } from '../components/SkeletonCard'
import { ErrorMessage } from '../components/ErrorMessage'

export default function GenrePage() {
  const { genreId } = useParams()
  const navigate = useNavigate()
  const [page, setPage] = useState(1)

  const genreName = genreId
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())

  // Fetch both ongoing + complete filtered by genre
  const fetchFn = useCallback(
    () => api.get(`/genre/${genreId}`, { params: { page } }),
    [genreId, page]
  )
  const { data, loading, error, refetch } = useFetch(fetchFn, [genreId, page])

  const animeList  = data?.data?.animeList || data?.animeList || []
  const pagination = data?.data?.pagination || {}
  const hasNext    = pagination.hasNextPage || pagination.nextPage || pagination.totalPages > page || animeList.length >= 10

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:pt-14" style={{ background: '#080b10' }}>
      {/* Header */}
      <div className="sticky top-0 md:top-14 z-40 px-4 py-3 flex items-center gap-3"
        style={{ background: 'rgba(8,11,16,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <button onClick={() => navigate(-1)}
          className="p-2 rounded-xl text-gray-600 hover:text-gray-300 transition-colors">
          <ArrowLeft size={18}/>
        </button>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)' }}>
            <Tag size={13} className="text-accent"/>
          </div>
          <div className="min-w-0">
            <h1 className="font-display font-bold text-white text-sm leading-tight">{genreName}</h1>
            <p className="text-[9px] font-mono text-gray-600 uppercase tracking-wider">Genre Anime</p>
          </div>
        </div>
        {animeList.length > 0 && (
          <span className="text-[10px] font-mono text-gray-600 flex-shrink-0">
            {animeList.length} anime · hal {page}
          </span>
        )}
      </div>

      {/* Grid — 3 cols mobile, more on desktop */}
      <div className="px-3 md:px-8 py-4">
        {loading && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 md:gap-3">
            {Array.from({length:18}).map((_,i) => (
              <div key={i} className="skeleton aspect-[3/4] rounded-xl"/>
            ))}
          </div>
        )}
        {error && <ErrorMessage message={error} onRetry={refetch}/>}

        {!loading && !error && animeList.length > 0 && (
          <>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-2 md:gap-3">
              {animeList.map((anime, i) => (
                <div key={anime.animeId || i}
                  className="animate-fadeUp"
                  style={{ animationDelay: `${Math.min(i*20,300)}ms`, opacity: 0 }}>
                  <SmallCard anime={anime}/>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3 mt-8">
              <button
                onClick={() => { setPage(p => Math.max(1,p-1)); window.scrollTo({top:0,behavior:'smooth'}) }}
                disabled={page===1}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-30 transition-all active:scale-95"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#9ca3af' }}>
                <ChevronLeft size={14}/> Sebelumnya
              </button>
              <span className="px-4 py-2 rounded-xl font-mono font-bold text-sm"
                style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)', color: '#00d4ff' }}>
                {page}
              </span>
              <button
                onClick={() => { setPage(p => p+1); window.scrollTo({top:0,behavior:'smooth'}) }}
                disabled={!hasNext}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-30 transition-all active:scale-95"
                style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.25)', color: '#00d4ff' }}>
                Selanjutnya <ChevronRight size={14}/>
              </button>
            </div>
          </>
        )}

        {!loading && !error && animeList.length === 0 && (
          <div className="text-center py-20">
            <div className="text-4xl mb-3">🎭</div>
            <p className="text-gray-500 text-sm">Tidak ada anime untuk genre ini</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Compact card for genre page — smaller than AnimeCard
function SmallCard({ anime }) {
  const navigate = useNavigate()
  const id     = anime.animeId || anime.id
  const title  = anime.title  || anime.name || ''
  const poster = anime.poster || anime.image || ''
  const ep     = anime.episodes || anime.episode || ''
  const score  = anime.score || ''

  return (
    <div onClick={() => id && navigate(`/anime/${id}`)}
      className="cursor-pointer group"
      style={{ WebkitTapHighlightColor: 'transparent' }}>
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-1"
        style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
        {poster ? (
          <img src={poster} alt={title} loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={e => { e.target.style.display='none' }}/>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xl font-bold"
            style={{ background: `hsl(${(id?.charCodeAt(0)||0)*37%360},30%,12%)`, color: `hsl(${(id?.charCodeAt(0)||0)*37%360},60%,50%)` }}>
            {title.charAt(0)}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/>

        {/* Badges */}
        {ep && (
          <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold"
            style={{ background: 'rgba(0,212,255,0.25)', color: '#67e8f9' }}>
            {ep}
          </div>
        )}
        {score && (
          <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold"
            style={{ background: 'rgba(0,0,0,0.7)', color: '#fcd34d' }}>
            ★{score}
          </div>
        )}
        {/* Hover overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ background: 'rgba(0,212,255,0.15)' }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(0,212,255,0.6)' }}>
            <span className="text-accent text-sm ml-0.5">▶</span>
          </div>
        </div>
      </div>
      <p className="text-[10px] font-semibold text-gray-400 line-clamp-2 leading-tight group-hover:text-gray-200 transition-colors px-0.5">
        {title}
      </p>
    </div>
  )
}