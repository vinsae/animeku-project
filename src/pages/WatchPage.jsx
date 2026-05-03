import { useParams, useNavigate, Link } from 'react-router-dom'
import { useCallback, useEffect, useState, useRef } from 'react'
import {
  ArrowLeft, ChevronLeft, ChevronRight, Layers,
  Play, Server, AlertCircle, SkipForward, X, Tv2, Wifi
} from 'lucide-react'
import { useFetch } from '../hooks/useFetch'
import { getWatch, getServer, getDetail } from '../services/api'
import { SkeletonWatch, SkeletonGrid } from '../components/SkeletonCard'
import { ErrorMessage } from '../components/ErrorMessage'
import { useAppContext } from '../context/AppContext'
import AnimeCard from '../components/AnimeCard'

const AUTO_NEXT_DELAY = 5

export default function WatchPage() {
  const { episodeId } = useParams()
  const navigate = useNavigate()
  const { addHistory, saveProgress } = useAppContext()

  const [activeQuality, setActiveQuality] = useState(0)
  const [activeServer,  setActiveServer]  = useState(0)
  const [streamUrl,     setStreamUrl]     = useState('')
  const [loadingStream, setLoadingStream] = useState(false)
  const [ratio, setRatio] = useState('16/9')  // aspect ratio
  const playerRef = useRef(null)
  const [showUpNext,    setShowUpNext]    = useState(false)
  const [countdown,     setCountdown]     = useState(AUTO_NEXT_DELAY)
  const countdownRef = useRef(null)

  const fetchFn = useCallback(() => getWatch(episodeId), [episodeId])
  const { data, loading, error, refetch } = useFetch(fetchFn, [episodeId])

  const ep          = data?.data?.details || {}
  const title       = ep.title      || 'Episode'
  const animeId     = ep.animeId    || ''
  const poster      = ep.poster     || ''
  const episodeList = ep.episodeList || []
  const prevEp      = ep.prevEpisode || null
  const nextEp      = ep.nextEpisode || null
  const qualityList = ep.server?.qualityList || []
  const defaultUrl  = ep.defaultStreamingUrl || ''
  const currentIdx  = episodeList.findIndex(e => e.episodeId === episodeId)

  // Fetch anime detail for recommendations
  const detailFn = useCallback(() => animeId ? getDetail(animeId) : Promise.resolve(null), [animeId])
  const { data: detailData } = useFetch(detailFn, [animeId])
  const recommended = detailData?.data?.details?.recommendedAnimeList || ep.recommendedAnimeList || []

  // Stream URL
  useEffect(() => {
    if (defaultUrl) {
      const sep = defaultUrl.includes('?') ? '&' : '?'
      setStreamUrl(`${defaultUrl}${sep}autoplay=1`)
    }
  }, [defaultUrl])

  useEffect(() => {
    setShowUpNext(false)
    setCountdown(AUTO_NEXT_DELAY)
    clearInterval(countdownRef.current)
  }, [episodeId])

  useEffect(() => {
    const h = (e) => {
      const d = e.data
      if ((d === 'ended' || d?.event === 'ended' || d?.type === 'ended') && nextEp) setShowUpNext(true)
    }
    window.addEventListener('message', h)
    return () => window.removeEventListener('message', h)
  }, [nextEp])

  useEffect(() => {
    if (ep.title && animeId) {
      addHistory({ animeId, title: ep.title, poster, episodeId, episodeTitle: ep.title })
      saveProgress(animeId, { episodeId, episodeTitle: ep.title, poster, title: ep.title })
    }
  }, [episodeId, animeId]) // eslint-disable-line

  useEffect(() => {
    if (!showUpNext || !nextEp) return
    setCountdown(AUTO_NEXT_DELAY)
    countdownRef.current = setInterval(() => {
      setCountdown(p => {
        if (p <= 1) { clearInterval(countdownRef.current); navigate(`/watch/${nextEp.episodeId}`); return AUTO_NEXT_DELAY }
        return p - 1
      })
    }, 1000)
    return () => clearInterval(countdownRef.current)
  }, [showUpNext]) // eslint-disable-line

  const loadServer = async (serverId) => {
    setLoadingStream(true)
    try {
      const res = await getServer(serverId)
      const url = res?.data?.url || res?.url || ''
      if (url) setStreamUrl(url.includes('?') ? `${url}&autoplay=1` : `${url}?autoplay=1`)
    } catch(e) { console.error(e) }
    finally { setLoadingStream(false) }
  }

  if (loading) return <div className="min-h-screen bg-bg pb-24 md:pt-14"><SkeletonWatch /></div>
  if (error)   return <div className="min-h-screen bg-bg flex items-center justify-center pb-24 pt-14"><ErrorMessage message={error} onRetry={refetch} /></div>

  return (
    <div className="min-h-screen bg-bg pb-24 md:pb-8 md:pt-14">

      {/* Top bar */}
      <div className="sticky top-0 md:top-14 z-40 px-3 py-2.5 flex items-center gap-2.5"
        style={{ background: 'rgba(8,11,16,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <button onClick={() => navigate(animeId ? `/anime/${animeId}` : -1)}
          className="p-2 rounded-xl transition-colors flex-shrink-0"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', color: '#6b7280' }}>
          <ArrowLeft size={16}/>
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-[9px] text-accent font-mono uppercase tracking-widest leading-none mb-0.5 opacity-70">▶ Sedang Diputar</p>
          <h1 className="font-display font-bold text-white text-sm line-clamp-1">{title}</h1>
        </div>
        {currentIdx >= 0 && (
          <div className="flex-shrink-0 flex flex-col items-center px-2.5 py-1 rounded-xl"
            style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.25)' }}>
            <span className="text-[8px] font-mono text-gray-600 uppercase leading-none">EP</span>
            <span className="text-accent font-mono font-black text-sm leading-tight">{currentIdx + 1}</span>
          </div>
        )}
      </div>

      {/* Ratio + Fullscreen bar */}
      <div className="flex items-center gap-1.5 px-4 py-2 md:max-w-4xl md:mx-auto"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
        <span className="text-[10px] text-gray-600 font-mono mr-1">RASIO:</span>
        {[['16/9','16:9'],['4/3','4:3'],['21/9','21:9'],['1/1','1:1']].map(([val, label]) => (
          <button key={val} onClick={() => setRatio(val)}
            className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all active:scale-95"
            style={ratio === val
              ? { background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.4)', color: '#00d4ff' }
              : { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#4b5563' }}>
            {label}
          </button>
        ))}
        <button onClick={() => {
            const el = playerRef.current
            if (el?.requestFullscreen) el.requestFullscreen()
            else if (el?.webkitRequestFullscreen) el.webkitRequestFullscreen()
          }}
          className="ml-auto px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', color: '#6b7280' }}>
          ⛶ Full
        </button>
      </div>

      {/* Video */}
      <div ref={playerRef} className="w-full md:max-w-4xl md:mx-auto md:px-4 md:py-3">
        <div
          style={{
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 0 0 1px rgba(0,212,255,0.12), 0 20px 60px rgba(0,0,0,0.7)',
            background: '#000',
            position: 'relative',
          }}
        >
          {/* Glow top border */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '2px', zIndex: 2,
            background: 'linear-gradient(90deg, transparent, #00d4ff, #7c3aed, transparent)',
          }}/>

          <div style={{ position: 'relative', width: '100%', paddingBottom: `calc(100% / (${ratio}))`, background: '#000' }}>
            {loadingStream ? (
              <div className="absolute inset-0 flex items-center justify-center bg-surface">
                <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin"/>
              </div>
            ) : streamUrl ? (
              <iframe src={streamUrl} title={title}
                allow="autoplay; fullscreen; picture-in-picture; web-share; encrypted-media"
                allowFullScreen className="absolute inset-0 w-full h-full border-0"/>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-surface">
                <AlertCircle size={36} className="text-muted"/>
                <p className="text-subtext text-sm">Pilih server di bawah</p>
              </div>
            )}

          {/* Up Next overlay */}
          {showUpNext && nextEp && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="text-center px-6">
                <p className="text-subtext text-xs font-mono uppercase tracking-widest mb-2">Episode Berikutnya</p>
                <p className="text-text font-display font-bold text-base mb-5 line-clamp-2 max-w-xs mx-auto">{nextEp.title}</p>
                <div className="relative w-16 h-16 mx-auto mb-5">
                  <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="26" fill="none" stroke="#1e2d3d" strokeWidth="5"/>
                    <circle cx="32" cy="32" r="26" fill="none" stroke="#00d4ff" strokeWidth="5"
                      strokeDasharray={`${2*Math.PI*26}`}
                      strokeDashoffset={`${2*Math.PI*26*(countdown/AUTO_NEXT_DELAY)}`}
                      style={{transition:'stroke-dashoffset 1s linear'}}/>
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-accent font-mono font-bold text-xl">{countdown}</span>
                </div>
                <div className="flex gap-2 justify-center">
                  <button onClick={() => { setShowUpNext(false); clearInterval(countdownRef.current) }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-surface2 border border-border text-subtext text-sm hover:text-text transition-all">
                    <X size={13}/> Batal
                  </button>
                  <button onClick={() => navigate(`/watch/${nextEp.episodeId}`)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent/15 border border-accent/40 text-accent text-sm font-semibold hover:bg-accent/25 transition-all glow">
                    <SkipForward size={13}/> Sekarang
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        </div>
      </div>

      {/* ── Server & Quality ── */}
      {qualityList.length > 0 && (
        <div className="md:max-w-4xl md:mx-auto">
          <div className="px-4 pt-3 pb-2 space-y-2.5">
            {/* Quality */}
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1.5 text-xs text-muted w-20 flex-shrink-0">
                <Server size={11}/> Kualitas
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {qualityList.map((q, qi) => (
                  <button key={qi} onClick={() => { setActiveQuality(qi); setActiveServer(0) }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
                      activeQuality === qi
                        ? 'bg-accent text-bg border-accent'
                        : 'bg-surface2 border-border text-subtext hover:border-accent/40 hover:text-text'
                    }`}>{q.title}</button>
                ))}
              </div>
            </div>
            {/* Server */}
            {qualityList[activeQuality]?.serverList?.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-xs text-muted w-20 flex-shrink-0">
                  <Wifi size={11}/> Server
                </div>
                <div className="flex gap-1.5 flex-wrap">
                  {qualityList[activeQuality].serverList.map((srv, si) => (
                    <button key={si} onClick={() => { setActiveServer(si); loadServer(srv.serverId) }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold border transition-all ${
                        activeServer === si
                          ? 'bg-accent/15 border-accent text-accent'
                          : 'bg-surface2 border-border text-subtext hover:border-accent/40 hover:text-text'
                      }`}>{srv.title}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="h-px bg-border mx-4"/>
        </div>
      )}

      {/* ── Prev / Next ── */}
      <div className="px-4 py-3 flex items-center gap-2 md:max-w-4xl md:mx-auto">
        <button onClick={() => prevEp && navigate(`/watch/${prevEp.episodeId}`)} disabled={!prevEp}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium bg-surface2 border border-border text-subtext hover:text-text hover:border-accent/30 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex-1 justify-center">
          <ChevronLeft size={15}/> Sebelumnya
        </button>
        {nextEp && (
          <button onClick={() => setShowUpNext(true)} title="Skip to next"
            className="flex-shrink-0 p-2.5 rounded-xl bg-accent/10 border border-accent/25 text-accent hover:bg-accent/20 transition-all">
            <SkipForward size={15}/>
          </button>
        )}
        <button onClick={() => nextEp && navigate(`/watch/${nextEp.episodeId}`)} disabled={!nextEp}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-sm font-medium bg-accent/10 border border-accent/30 text-accent hover:bg-accent/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex-1 justify-center">
          Selanjutnya <ChevronRight size={15}/>
        </button>
      </div>

      {/* ── Episode list ── */}
      {episodeList.length > 0 && (
        <div className="px-4 md:px-8 md:max-w-4xl md:mx-auto mb-5">
          <div className="flex items-center gap-2 mb-2.5">
            <Layers size={14} className="text-accent"/>
            <span className="font-display font-bold text-text text-sm">Semua Episode</span>
            <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-xs font-mono border border-accent/25">{episodeList.length}</span>
          </div>
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-1.5">
            {episodeList.map((ep) => (
              <button key={ep.episodeId} onClick={() => navigate(`/watch/${ep.episodeId}`)}
                className={`ep-btn ${ep.episodeId === episodeId ? 'active' : 'text-subtext'} hover:scale-105 active:scale-95`}>
                {ep.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Recommended ── */}
      {recommended.length > 0 && (
        <div className="px-4 md:px-8 pb-4">
          <div className="h-px mb-4" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.15), transparent)' }}/>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(124,58,237,0.15)', border: '1px solid rgba(124,58,237,0.3)' }}>
              <Tv2 size={11} style={{ color: '#a78bfa' }}/>
            </div>
            <span className="font-display font-bold text-white text-sm">Rekomendasi Untukmu</span>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
            {recommended.map((anime, i) => {
              const rid    = anime.animeId || anime.id
              const rtitle = anime.title || anime.name || ''
              const rposter = anime.poster || anime.image || ''
              const rep    = anime.episodes || anime.episode || ''
              return (
                <div key={rid || i}
                  onClick={() => navigate(`/anime/${rid}`)}
                  className="cursor-pointer group animate-fadeUp"
                  style={{ animationDelay: `${i*25}ms`, opacity: 0 }}>
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-1"
                    style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                    {rposter ? (
                      <img src={rposter} alt={rtitle} loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-lg font-bold"
                        style={{ background: `hsl(${(rid?.charCodeAt(0)||i)*37%360},30%,12%)`, color: `hsl(${(rid?.charCodeAt(0)||i)*37%360},60%,50%)` }}>
                        {rtitle.charAt(0)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"/>
                    {rep && (
                      <div className="absolute top-1 left-1 px-1 py-0.5 rounded text-[8px] font-mono font-bold"
                        style={{ background: 'rgba(0,212,255,0.25)', color: '#67e8f9' }}>
                        {rep}
                      </div>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ background: 'rgba(0,212,255,0.12)' }}>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center"
                        style={{ background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(0,212,255,0.5)' }}>
                        <span className="text-accent text-xs ml-0.5">▶</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] font-semibold text-gray-500 line-clamp-2 leading-tight group-hover:text-gray-200 transition-colors">
                    {rtitle}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}

    </div>
  )
}