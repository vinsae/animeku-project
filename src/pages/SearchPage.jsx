import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import { searchAnime } from '../services/api'
import { useFetch } from '../hooks/useFetch'
import AnimeCard from '../components/AnimeCard'
import { SkeletonGrid } from '../components/SkeletonCard'
import { ErrorMessage, EmptyState } from '../components/ErrorMessage'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery]       = useState(searchParams.get('q') || '')
  const [debounced, setDebounced] = useState(query)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounced(query)
      if (query) setSearchParams({ q: query })
      else setSearchParams({})
    }, 500)
    return () => clearTimeout(timer)
  }, [query]) // eslint-disable-line

  const fetchFn = useCallback(
    () => debounced.trim() ? searchAnime(debounced.trim()) : Promise.resolve(null),
    [debounced]
  )
  const { data, loading, error, refetch } = useFetch(fetchFn, [debounced])

  // wajik-anime-api search: { data: { animeList: [] } }
  const results   = data?.data?.animeList || data?.animeList || data?.results || []
  const hasResults = Array.isArray(results) && results.length > 0

  return (
    <div className="min-h-screen bg-bg pb-24 md:pb-8 md:pt-14">
      <div className="sticky top-0 md:top-14 z-40 px-4 py-3 glass border-b border-border">
        <div className="relative max-w-xl mx-auto">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          <input type="text" autoFocus value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari judul anime..."
            className="w-full pl-10 pr-10 py-3 rounded-xl bg-surface2 border border-border text-text placeholder-muted focus:outline-none focus:border-accent/60 text-sm font-body transition-all duration-200" />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-surface text-muted hover:text-text transition-colors">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      <div className="px-4 md:px-8 py-5">
        {!debounced.trim() && <EmptyState title="Cari Anime" desc="Ketik judul anime di atas untuk memulai pencarian" />}
        {debounced.trim() && loading && <SkeletonGrid count={8} />}
        {debounced.trim() && error && <ErrorMessage message={error} onRetry={refetch} />}
        {debounced.trim() && !loading && !error && !hasResults && (
          <EmptyState title="Tidak Ditemukan" desc={`Tidak ada hasil untuk "${debounced}"`} />
        )}
        {!loading && hasResults && (
          <>
            <p className="text-xs text-subtext mb-4 font-mono">{results.length} hasil untuk <span className="text-accent">"{debounced}"</span></p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 md:gap-4">
              {results.map((anime, idx) => (
                <div key={anime.animeId || idx} className="animate-fadeUp" style={{ animationDelay: `${Math.min(idx * 30, 300)}ms`, opacity: 0 }}>
                  <AnimeCard anime={anime} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
