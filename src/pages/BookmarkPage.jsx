import { useNavigate } from 'react-router-dom'
import { Bookmark, Play, Trash2, X, Clock } from 'lucide-react'
import { useAppContext } from '../context/AppContext'
import LazyPoster from '../components/LazyPoster'
import { EmptyState } from '../components/ErrorMessage'

function timeAgo(ts) {
  const d = Date.now() - ts
  const m = Math.floor(d/60000), h = Math.floor(d/3600000), day = Math.floor(d/86400000)
  if (m < 1) return 'Baru saja'
  if (m < 60) return `${m} menit lalu`
  if (h < 24) return `${h} jam lalu`
  return `${day} hari lalu`
}

export default function BookmarkPage() {
  const navigate = useNavigate()
  const { bookmarks, toggleBookmark, clearBookmarks, getProgress } = useAppContext()

  return (
    <div className="min-h-screen bg-bg pb-24 md:pb-8 md:pt-14">
      <div className="sticky top-0 md:top-14 z-40 px-4 py-3 glass border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bookmark size={18} className="text-accent"/>
          <h1 className="font-display font-bold text-text">Favorit</h1>
          {bookmarks.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-mono border border-accent/25">
              {bookmarks.length}
            </span>
          )}
        </div>
        {bookmarks.length > 0 && (
          <button onClick={clearBookmarks}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/25 transition-all">
            <Trash2 size={12}/> Hapus Semua
          </button>
        )}
      </div>

      <div className="px-4 md:px-8 py-4">
        {bookmarks.length === 0
          ? <EmptyState title="Belum Ada Favorit" desc="Bookmark anime favorit kamu dari halaman detail"/>
          : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {bookmarks.map(anime => {
                const prog = getProgress(anime.animeId)
                return (
                  <div key={anime.animeId}
                    className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border hover:border-accent/30 transition-all group">
                    <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate(`/anime/${anime.animeId}`)}>
                      {anime.poster
                        ? <img src={anime.poster} alt={anime.title} className="w-12 h-16 rounded-lg object-cover"/>
                        : <LazyPoster animeId={anime.animeId} title={anime.title} size="md"/>
                      }
                    </div>
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/anime/${anime.animeId}`)}>
                      <p className="font-display font-semibold text-sm text-text line-clamp-1 group-hover:text-accent transition-colors">{anime.title}</p>
                      {prog && (
                        <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md bg-accent/10 border border-accent/25 text-accent text-[10px] font-mono">
                          Lanjut {prog.episodeTitle}
                        </span>
                      )}
                      <p className="text-[10px] text-muted mt-1 flex items-center gap-1">
                        <Clock size={9}/>{timeAgo(anime.savedAt)}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1.5 flex-shrink-0">
                      {prog && (
                        <button onClick={() => navigate(`/watch/${prog.episodeId}`)}
                          className="p-2 rounded-xl bg-accent/10 border border-accent/25 text-accent hover:bg-accent/20 transition-all"
                          title="Lanjut Nonton">
                          <Play size={13} fill="currentColor"/>
                        </button>
                      )}
                      <button onClick={() => toggleBookmark(anime)}
                        className="p-2 rounded-xl text-muted hover:text-red-400 hover:bg-red-500/10 transition-all"
                        title="Hapus dari favorit">
                        <X size={13}/>
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        }
      </div>
    </div>
  )
}