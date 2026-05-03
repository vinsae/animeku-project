import { useState, useEffect, useRef } from 'react'
import api from '../services/api'

const cache = {}

export default function LazyPoster({ animeId, title, size = 'sm' }) {
  const [poster, setPoster] = useState(cache[animeId] || null)
  const [loaded, setLoaded] = useState(!!cache[animeId])
  const ref = useRef(null)
  const hue = (animeId?.charCodeAt(0) || 0) * 37 % 360

  useEffect(() => {
    if (cache[animeId]) { setPoster(cache[animeId]); setLoaded(true); return }
    if (!animeId) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      api.get(`/anime/${animeId}`)
        .then(res => {
          const p = res?.data?.details?.poster || ''
          if (p) { cache[animeId] = p; setPoster(p) }
        })
        .catch(() => {})
    }, { rootMargin: '120px' })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [animeId])

  return (
    <div ref={ref} className={`${size === 'sm' ? 'w-10 h-14' : 'w-14 h-20'} rounded-xl flex-shrink-0 overflow-hidden`}
      style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
      {poster ? (
        <img src={poster} alt={title}
          className={`w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          onError={() => setPoster(null)}/>
      ) : (
        <div className="w-full h-full flex items-center justify-center"
          style={{ background: `hsl(${hue}, 35%, 13%)` }}>
          <span className="text-base font-bold" style={{ color: `hsl(${hue}, 60%, 55%)`, opacity: 0.7 }}>
            {title?.charAt(0)?.toUpperCase() || '?'}
          </span>
        </div>
      )}
    </div>
  )
}
