import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, AlertCircle, Loader2 } from 'lucide-react'
import { parseVideoUrl } from '../../lib/storage'

/* Hook: déclenche `setInView(true)` dès que l'élément entre dans le viewport */
function useInView(ref, threshold = 0.1) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!window.IntersectionObserver) { setInView(true); return }
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [ref, threshold])
  return inView
}

export default function VideoPlayer({ url, autoPlay = false, className = '', poster }) {
  const [started,    setStarted]    = useState(autoPlay)
  const [iframeLoad, setIframeLoad] = useState(true)
  const [videoLoad,  setVideoLoad]  = useState(false)
  const [error,      setError]      = useState(false)
  const containerRef = useRef(null)
  const inView       = useInView(containerRef)
  const parsed       = parseVideoUrl(url)

  if (!url || !parsed) return null

  /* ── YouTube ────────────────────────────────────────────── */
  if (parsed.type === 'youtube') {
    if (!started) {
      return (
        <div
          ref={containerRef}
          className={`relative aspect-video bg-gaming-surface rounded-xl overflow-hidden cursor-pointer group ${className}`}
          onClick={() => { setStarted(true); setIframeLoad(true) }}
        >
          {/* Skeleton tant que hors viewport */}
          {!inView && (
            <div className="absolute inset-0 animate-pulse bg-gaming-surface" />
          )}

          {/* Thumbnail lazy */}
          {inView && (
            <img
              src={`https://img.youtube.com/vi/${parsed.id}/maxresdefault.jpg`}
              alt="Aperçu vidéo"
              loading="lazy"
              className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity"
              onError={e => { e.target.src = `https://img.youtube.com/vi/${parsed.id}/hqdefault.jpg` }}
            />
          )}

          {/* Bouton play */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
              className="w-16 h-16 rounded-full bg-gaming-red/90 flex items-center justify-center shadow-lg">
              <Play size={28} className="text-white ml-1" fill="white" />
            </motion.div>
          </div>

          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
            <span className="text-xs text-white font-heading">▶ YouTube</span>
          </div>
        </div>
      )
    }

    /* Iframe après clic */
    return (
      <div ref={containerRef} className={`aspect-video rounded-xl overflow-hidden relative bg-black ${className}`}>
        {iframeLoad && (
          <div className="absolute inset-0 flex items-center justify-center bg-gaming-surface z-10">
            <Loader2 size={32} className="animate-spin text-gaming-purple" />
          </div>
        )}
        <iframe
          src={`https://www.youtube.com/embed/${parsed.id}?autoplay=1&rel=0&modestbranding=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          onLoad={() => setIframeLoad(false)}
          className="w-full h-full border-0"
          title="Vidéo YouTube"
        />
      </div>
    )
  }

  /* ── TikTok ─────────────────────────────────────────────── */
  if (parsed.type === 'tiktok') {
    return (
      <div ref={containerRef}
        className={`rounded-xl overflow-hidden bg-black flex items-center justify-center ${className}`}
        style={{ minHeight: 420 }}>
        {!inView ? (
          /* Placeholder avant entrée dans viewport */
          <div className="w-full flex items-center justify-center" style={{ height: 420 }}>
            <div className="flex flex-col items-center gap-3 text-gaming-text-muted">
              <Loader2 size={28} className="animate-spin text-gaming-purple" />
              <span className="text-xs font-body">Chargement TikTok…</span>
            </div>
          </div>
        ) : (
          <>
            {iframeLoad && (
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <Loader2 size={28} className="animate-spin text-gaming-purple" />
              </div>
            )}
            <iframe
              src={`https://www.tiktok.com/embed/v2/${parsed.id}`}
              allow="encrypted-media"
              allowFullScreen
              onLoad={() => setIframeLoad(false)}
              className="w-full border-0"
              style={{ height: 420 }}
              title="Vidéo TikTok"
            />
          </>
        )}
      </div>
    )
  }

  /* ── Vidéo directe (Supabase Storage) ───────────────────── */
  if (parsed.type === 'direct') {
    return (
      <div ref={containerRef} className={`rounded-xl overflow-hidden bg-black relative ${className}`}>
        {error ? (
          <div className="aspect-video flex items-center justify-center gap-3 text-gaming-text-muted">
            <AlertCircle size={24} className="text-gaming-red" />
            <span className="font-body text-sm">Impossible de lire la vidéo</span>
          </div>
        ) : !inView ? (
          /* Skeleton hors viewport */
          <div className="aspect-video flex items-center justify-center bg-gaming-surface">
            <Loader2 size={28} className="animate-spin text-gaming-purple" />
          </div>
        ) : (
          <>
            {/* Indicateur de chargement sur la vidéo */}
            {videoLoad && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
                <div className="flex flex-col items-center gap-3">
                  <Loader2 size={36} className="animate-spin text-white" />
                  <span className="text-xs text-white/70 font-body">Chargement…</span>
                </div>
              </div>
            )}
            <video
              src={parsed.url}
              controls
              autoPlay={autoPlay}
              playsInline
              poster={poster}
              onLoadStart={() => setVideoLoad(true)}
              onCanPlay={() => setVideoLoad(false)}
              onError={() => setError(true)}
              className="w-full max-h-[500px] object-contain"
            />
          </>
        )}
      </div>
    )
  }

  return null
}

/* ── Thumbnail vidéo avec badge 🎬 ──────────────────────────── */
export function VideoThumb({ url, onClick, className = '' }) {
  const parsed     = parseVideoUrl(url)
  const thumbRef   = useRef(null)
  const inView     = useInView(thumbRef)
  if (!parsed) return null

  const thumb = parsed.type === 'youtube'
    ? `https://img.youtube.com/vi/${parsed.id}/mqdefault.jpg`
    : null

  return (
    <motion.button ref={thumbRef} whileTap={{ scale: 0.95 }} onClick={onClick}
      className={`relative aspect-square rounded-xl overflow-hidden bg-gaming-surface border-2 border-gaming-border hover:border-gaming-purple transition-all cursor-pointer group ${className}`}>
      {!inView ? (
        <div className="w-full h-full animate-pulse bg-gaming-surface" />
      ) : thumb ? (
        <img src={thumb} alt="Vidéo" loading="lazy" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gaming-red/30 to-gaming-purple/30 flex items-center justify-center">
          <Play size={20} className="text-white" />
        </div>
      )}
      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <Play size={22} className="text-white" fill="white" />
      </div>
      <span className="absolute top-1 left-1 text-xs bg-gaming-red/90 text-white px-1.5 py-0.5 rounded font-heading">
        🎬
      </span>
    </motion.button>
  )
}
