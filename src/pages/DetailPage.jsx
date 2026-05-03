import { useParams, useNavigate } from 'react-router-dom'
import { useCallback } from 'react'
import { ArrowLeft, Star, Calendar, Layers, Play, Info, Tag, Clock, Bookmark, BookmarkCheck } from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import { getDetail } from '../services/api'
import { SkeletonDetail } from '../components/SkeletonCard'
import { ErrorMessage } from '../components/ErrorMessage'
import { useAppContext } from '../context/AppContext'
import RelatedAnime from '../components/RelatedAnime'

export default function DetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isBookmarked, toggleBookmark, getProgress } = useAppContext()

  const fetchFn = useCallback(() => getDetail(id), [id])
  const { data, loading, error, refetch } = useFetch(fetchFn, [id])

  const anime    = data?.data?.details || data?.details || data?.data || {}
  const episodes = anime.episodeList  || []
  const genres   = anime.genreList    || []
  const synopsis = Array.isArray(anime.synopsis?.paragraphList)
    ? anime.synopsis.paragraphList.join(' ')
    : (anime.synopsis || '')
  const title    = anime.title   || 'Unknown'
  const poster   = anime.poster  || ''
  const score    = anime.score   || ''
  const status   = anime.status  || ''
  const type     = anime.type    || ''
  const studio   = anime.studios || anime.studio || ''
  const aired    = anime.aired   || ''
  const totalEp  = anime.episodes || ''
  const duration = anime.duration || ''

  const bookmarkData = { animeId: id, title, poster }
  const bookmarked   = isBookmarked(id)
  const progress     = getProgress(id)

  if (loading) return <div className="min-h-screen bg-bg pt-0 md:pt-14"><SkeletonDetail/></div>
  if (error)   return <div className="min-h-screen bg-bg flex items-center justify-center pt-14"><ErrorMessage message={error} onRetry={refetch}/></div>

  return (
    <div className="min-h-screen bg-bg pb-24 md:pb-8 md:pt-14">
      {/* Top bar */}
      <div className="sticky top-0 md:top-14 z-40 px-4 py-3 glass border-b border-border flex items-center gap-3">
        <button onClick={() => navigate('/')}
          className="p-2 rounded-xl hover:bg-surface2 text-subtext hover:text-text transition-colors">
          <ArrowLeft size={20}/>
        </button>
        <h1 className="font-display font-bold text-text text-sm line-clamp-1 flex-1">{title}</h1>
        <button onClick={() => toggleBookmark(bookmarkData)}
          className={`p-2 rounded-xl border transition-all duration-200 ${
            bookmarked
              ? 'bg-accent/15 border-accent/40 text-accent'
              : 'bg-surface2 border-border text-subtext hover:text-accent hover:border-accent/30'
          }`}
          title={bookmarked ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}>
          {bookmarked ? <BookmarkCheck size={18}/> : <Bookmark size={18}/>}
        </button>
      </div>

      {/* Hero */}
      <div className="relative">
        {poster && (
          <div className="absolute inset-0 h-64 overflow-hidden">
            <img src={poster} alt="" className="w-full h-full object-cover blur-2xl opacity-20 scale-110"/>
            <div className="absolute inset-0 bg-gradient-to-b from-bg/30 via-bg/70 to-bg"/>
          </div>
        )}
        <div className="relative px-4 pt-6 pb-4 md:px-8">
          <div className="flex gap-4">
            <div className="w-28 md:w-36 flex-shrink-0">
              <div className="aspect-[3/4] rounded-xl overflow-hidden border border-border shadow-2xl">
                {poster
                  ? <img src={poster} alt={title} className="w-full h-full object-cover"/>
                  : <div className="w-full h-full bg-surface2 flex items-center justify-center"><Play size={24} className="text-muted"/></div>
                }
              </div>
            </div>
            <div className="flex-1 pt-1 space-y-2">
              <h1 className="font-display font-bold text-xl text-text leading-tight">{title}</h1>
              <div className="flex flex-wrap gap-1.5">
                {type   && <Badge color="cyan">{type}</Badge>}
                {status && <Badge color="purple">{status}</Badge>}
                {totalEp && <Badge color="gray">{totalEp} Ep</Badge>}
              </div>
              <div className="space-y-1 text-xs text-subtext">
                {score    && <div className="flex items-center gap-1.5"><Star size={12} className="text-yellow-400 fill-yellow-400"/><span className="font-mono font-semibold text-yellow-300">{score}</span></div>}
                {aired    && <div className="flex items-center gap-1.5"><Calendar size={12} className="text-accent/70"/><span>{aired}</span></div>}
                {duration && <div className="flex items-center gap-1.5"><Clock size={12} className="text-accent/70"/><span>{duration}</span></div>}
                {studio   && <div className="flex items-center gap-1.5"><span className="text-accent/70">🎬</span><span>{studio}</span></div>}
              </div>

              {/* Continue watching badge */}
              {progress && (
                <button
                  onClick={() => navigate(`/watch/${progress.episodeId}`)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-accent/10 border border-accent/30 text-accent text-xs font-semibold hover:bg-accent/20 transition-all w-full justify-center mt-2">
                  <Play size={12} fill="currentColor"/> Lanjut {progress.episodeTitle}
                </button>
              )}
            </div>
          </div>

          {/* Genres — clickable */}
          {genres.length > 0 && (
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <Tag size={12} className="text-muted flex-shrink-0"/>
              {genres.map(g => (
                <button key={g.genreId || g.title}
                  onClick={() => navigate(`/genre/${g.genreId}`)}
                  className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-surface2 border border-border text-subtext hover:border-accent/40 hover:text-accent transition-colors">
                  {g.title}
                </button>
              ))}
            </div>
          )}

          {/* Synopsis */}
          {synopsis && (
            <div className="mt-4 p-3 rounded-xl bg-surface/60 border border-border">
              <div className="flex items-center gap-1.5 mb-2">
                <Info size={12} className="text-accent"/>
                <span className="text-xs font-semibold text-accent uppercase tracking-wide">Sinopsis</span>
              </div>
              <p className="text-sm text-subtext leading-relaxed line-clamp-4 md:line-clamp-none">{synopsis}</p>
            </div>
          )}
        </div>
      </div>

      {/* Episode list */}
      {episodes.length > 0 && (
        <div className="px-4 md:px-8 mt-2">
          <div className="flex items-center gap-2 mb-3">
            <Layers size={16} className="text-accent"/>
            <h2 className="font-display font-bold text-text">Daftar Episode</h2>
            <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-mono border border-accent/25">{episodes.length}</span>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
            {episodes.map(ep => {
              const isLastWatched = progress?.episodeId === ep.episodeId
              return (
                <button key={ep.episodeId}
                  onClick={() => navigate(`/watch/${ep.episodeId}`)}
                  className={`ep-btn hover:scale-105 active:scale-95 relative ${isLastWatched ? 'active' : 'text-subtext'}`}
                  title={ep.title}>
                  {ep.title}
                  {isLastWatched && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent"/>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
      {/* Related Anime */}
      <RelatedAnime
        genres={genres}
        currentId={id}
        recommended={anime.recommendedAnimeList || []}
      />
    </div>
  )
}

function Badge({ children, color = 'gray' }) {
  const colors = { cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25', purple: 'bg-purple-500/10 text-purple-400 border-purple-500/25', gray: 'bg-surface2 text-subtext border-border' }
  return <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold border ${colors[color]}`}>{children}</span>
}
