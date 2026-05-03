/**
 * Movie Page — /movies
 * Filters anime with type "Movie" from complete list
 * Falls back to searching "movie" keyword if no type filter available
 */
import { useState, useCallback } from 'react'
import { Film, ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useFetch } from '../hooks/useFetch'
import api from '../services/api'
import AnimeCard from '../components/AnimeCard'
import { SkeletonGrid } from '../components/SkeletonCard'
import { ErrorMessage } from '../components/ErrorMessage'

export default function MoviePage() {
  const [page, setPage] = useState(1)
  const navigate = useNavigate()

  // wajik-anime-api has /otakudesu/anime endpoint with type filter
  // Fallback: use complete list and filter client-side
  const fetchFn = useCallback(() =>
    api.get('/anime', { params: { type: 'Movie', page } })
      .catch(() => api.get('/complete', { params: { page } }))
  , [page])

  const { data, loading, error, refetch } = useFetch(fetchFn, [page])

  const raw       = data?.data?.animeList || data?.animeList || []
  // Filter movies client-side as fallback
  const animeList = raw.filter(a =>
    !a.type || a.type?.toLowerCase().includes('movie') || a.type?.toLowerCase().includes('film')
  ).length > 0
    ? raw.filter(a => !a.type || a.type?.toLowerCase().includes('movie') || a.type?.toLowerCase().includes('film'))
    : raw // show all if no movies found after filter

  const pagination = data?.data?.pagination || {}
  const hasNext    = pagination.hasNextPage || pagination.nextPage

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:pt-14" style={{ background: '#080b10' }}>
      {/* Header */}
      <div className="sticky top-0 md:top-14 z-40 px-4 py-3"
        style={{ background: 'rgba(8,11,16,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 rounded-xl text-gray-600 hover:text-gray-300 transition-colors">
            <ChevronLeft size={20}/>
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
              <Film size={15} style={{ color: '#a78bfa' }}/>
            </div>
            <div>
              <h1 className="font-display font-bold text-white leading-tight">Anime Movie</h1>
              <p className="text-[10px] text-gray-600 font-mono">FILM ANIME TERBAIK</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero banner */}
      <div className="relative overflow-hidden px-4 py-6 mb-2"
        style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(0,212,255,0.04) 100%)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(ellipse at 30% 50%, rgba(124,58,237,0.12) 0%, transparent 60%)'
        }}/>
        <div className="relative flex items-center gap-4">
          <div>
            <p className="text-3xl font-display font-black text-white">🎬 Movie</p>
            <p className="text-sm text-gray-500 mt-1">Koleksi film anime subtitle Indonesia</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-3 md:px-8 py-2">
        {loading && <SkeletonGrid count={12}/>}
        {error   && <ErrorMessage message={error} onRetry={refetch}/>}

        {!loading && !error && animeList.length > 0 && (
          <>
            <p className="text-[10px] font-mono text-gray-600 mb-4 px-1">
              {animeList.length} FILM · HALAMAN {page}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 md:gap-4">
              {animeList.map((anime, i) => (
                <div key={anime.animeId || i} className="animate-fadeUp"
                  style={{ animationDelay: `${Math.min(i*25,400)}ms`, opacity: 0 }}>
                  <AnimeCard anime={anime}/>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-3 mt-8">
              <button onClick={() => { setPage(p => Math.max(1,p-1)); window.scrollTo({top:0,behavior:'smooth'}) }}
                disabled={page===1}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#9ca3af' }}>
                <ChevronLeft size={15}/> Sebelumnya
              </button>
              <span className="px-4 py-2 rounded-xl font-mono font-bold text-sm"
                style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.3)', color: '#a78bfa' }}>
                {page}
              </span>
              <button onClick={() => { setPage(p => p+1); window.scrollTo({top:0,behavior:'smooth'}) }}
                disabled={!hasNext}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
                style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.25)', color: '#a78bfa' }}>
                Selanjutnya <ChevronRight size={15}/>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
