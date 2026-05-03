import { useNavigate } from 'react-router-dom'
import { History, Play, Trash2, X, Clock } from 'lucide-react'
import { useAppContext as useHistoryContext } from '../context/AppContext'
import { EmptyState } from '../components/ErrorMessage'
import LazyPoster from '../components/LazyPoster'

function timeAgo(timestamp) {
  const diff = Date.now() - timestamp
  const m = Math.floor(diff / 60000)
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(diff / 86400000)
  if (m < 1)   return 'Baru saja'
  if (m < 60)  return `${m} menit lalu`
  if (h < 24)  return `${h} jam lalu`
  return `${d} hari lalu`
}

export default function HistoryPage() {
  const navigate = useNavigate()
  const { history, removeHistory, clearHistory } = useHistoryContext()

  return (
    <div className="min-h-screen pb-24 md:pb-8 md:pt-14" style={{ background: '#080b10' }}>
      <div className="sticky top-0 md:top-14 z-40 px-4 py-3 flex items-center justify-between"
        style={{ background: 'rgba(8,11,16,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="flex items-center gap-2">
          <History size={17} className="text-accent"/>
          <h1 className="font-display font-bold text-white">Riwayat Tontonan</h1>
          {history.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono border"
              style={{ background: 'rgba(0,212,255,0.1)', borderColor: 'rgba(0,212,255,0.25)', color: '#00d4ff' }}>
              {history.length}
            </span>
          )}
        </div>
        {history.length > 0 && (
          <button onClick={clearHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
            style={{ color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <Trash2 size={11}/> Hapus Semua
          </button>
        )}
      </div>

      <div className="px-4 md:px-8 py-4">
        {history.length === 0
          ? <EmptyState title="Belum Ada Riwayat" desc="Anime yang sudah ditonton akan muncul di sini"/>
          : (
            <div className="space-y-2">
              {history.map((item) => (
                <div key={item.animeId}
                  className="flex items-center gap-3 p-3 rounded-2xl transition-all group"
                  style={{ background: 'rgba(15,21,32,0.7)', border: '1px solid rgba(255,255,255,0.05)' }}>

                  {/* Poster */}
                  <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate(`/anime/${item.animeId}`)}>
                    {item.poster
                      ? <img src={item.poster} alt={item.title} className="w-12 h-16 rounded-xl object-cover"
                          onError={e => e.target.style.display='none'}/>
                      : <LazyPoster animeId={item.animeId} title={item.title} size="md"/>
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => navigate(`/watch/${item.episodeId}`)}>
                    <p className="font-display font-semibold text-sm text-gray-100 line-clamp-1 group-hover:text-accent transition-colors">
                      {item.title}
                    </p>
                    <p className="text-[11px] font-mono mt-0.5 line-clamp-1" style={{ color: '#00d4ff' }}>
                      {item.episodeTitle}
                    </p>
                    <p className="text-[10px] text-gray-600 mt-1 flex items-center gap-1">
                      <Clock size={9}/>{timeAgo(item.timestamp)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <button onClick={() => navigate(`/watch/${item.episodeId}`)}
                      className="p-2 rounded-xl transition-all"
                      style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)', color: '#00d4ff' }}>
                      <Play size={13} fill="currentColor"/>
                    </button>
                    <button onClick={() => removeHistory(item.animeId)}
                      className="p-2 rounded-xl transition-all text-gray-600 hover:text-red-400"
                      style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                      <X size={13}/>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        }
      </div>
    </div>
  )
}