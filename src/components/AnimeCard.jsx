import { useNavigate } from 'react-router-dom'
import { Play, Star, Clock } from 'lucide-react'

export default function AnimeCard({ anime }) {
  const navigate = useNavigate()
  if (!anime) return null

  const id      = anime.animeId || anime.id || anime.slug
  const title   = anime.title || anime.name || 'Unknown'
  const poster  = anime.poster || anime.image || anime.thumbnail || ''
  const episode = anime.episodes || anime.episode || anime.currentEpisode || ''
  const score   = anime.score || anime.rating || ''
  const status  = anime.latestReleaseDate || anime.releaseDay || anime.status || ''

  return (
    <div className="anime-card group" onClick={() => id && navigate(`/anime/${id}`)}
      role="button" tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/anime/${id}`)}>

      <div className="relative aspect-[3/4] bg-[#0f1520] overflow-hidden rounded-2xl">
        {poster ? (
          <img src={poster} alt={title} loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108"
            onError={(e) => { e.target.src = '/placeholder.svg' }}/>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Play size={28} className="text-gray-700"/>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/10 to-transparent"/>

        {/* Top badges */}
        <div className="absolute top-2 left-2 right-2 flex items-start justify-between">
          {episode && (
            <span className="px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold"
              style={{ background: 'rgba(0,212,255,0.2)', border: '1px solid rgba(0,212,255,0.4)', color: '#00d4ff' }}>
              EP {episode}
            </span>
          )}
          {score && (
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-lg text-[9px] font-mono font-bold ml-auto"
              style={{ background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', color: '#fbbf24' }}>
              <Star size={8} fill="currentColor"/>{score}
            </span>
          )}
        </div>

        {/* Play button hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
          <div className="w-11 h-11 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(0,212,255,0.2)', border: '1.5px solid rgba(0,212,255,0.7)', backdropFilter: 'blur(8px)', boxShadow: '0 0 20px rgba(0,212,255,0.4)' }}>
            <Play size={18} className="text-accent ml-0.5" fill="currentColor"/>
          </div>
        </div>

        {/* Bottom title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-2.5">
          <p className="text-[11px] font-display font-bold text-white leading-tight line-clamp-2 drop-shadow-lg">
            {title}
          </p>
          {status && (
            <p className="text-[9px] text-cyan-400/70 mt-0.5 flex items-center gap-1 font-mono">
              <Clock size={8}/>{status}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
