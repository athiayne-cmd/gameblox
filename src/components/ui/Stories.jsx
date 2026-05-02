import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Crown, ShoppingCart, MapPin, Star, Volume2, VolumeX } from 'lucide-react'
import { Link } from 'react-router-dom'
import { STORIES, CAT_STYLE } from '../../utils/mockData'
import { formatPrice } from '../../utils/formatters'
import VideoPlayer from './VideoPlayer'
import { useCart } from '../../contexts/CartContext'

const STORY_DURATION = 8000

/* ── Cercle story (accueil) ──────────────────────────────────── */
function StoryCircle({ story, onClick, seen }) {
  const cat = CAT_STYLE[story.product.category] || CAT_STYLE.jeux
  return (
    <motion.button
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer"
    >
      <div className={`relative w-16 h-16 rounded-2xl p-0.5 ${seen ? 'bg-gaming-border' : 'bg-gradient-to-br from-gaming-purple via-gaming-cyan to-gaming-neon'}`}>
        <div className={`w-full h-full rounded-[14px] bg-gradient-to-br ${cat.gradient} flex items-center justify-center text-2xl border-2 border-gaming-bg`}>
          {cat.emoji}
        </div>
        {story.isPremium && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-gaming-gold rounded-full flex items-center justify-center">
            <Crown size={10} className="text-gaming-bg" />
          </div>
        )}
      </div>
      <span className="text-xs font-body text-gaming-text-secondary truncate w-16 text-center">
        {story.seller.name.split(' ')[0]}
      </span>
    </motion.button>
  )
}

/* ── Visionneuse plein écran ─────────────────────────────────── */
function StoryViewer({ stories, initialIndex, onClose }) {
  const [idx,     setIdx]     = useState(initialIndex)
  const [prog,    setProg]    = useState(0)
  const [paused,  setPaused]  = useState(false)
  const [muted,   setMuted]   = useState(false)
  const timerRef              = useRef(null)
  const { addItem }           = useCart()
  const story                 = stories[idx]
  const cat                   = CAT_STYLE[story.product.category] || CAT_STYLE.jeux

  const goNext = useCallback(() => {
    if (idx < stories.length - 1) { setIdx(i => i + 1); setProg(0) }
    else onClose()
  }, [idx, stories.length, onClose])

  const goPrev = () => {
    if (idx > 0) { setIdx(i => i - 1); setProg(0) }
  }

  useEffect(() => {
    setProg(0)
    if (story.videoUrl) return  // la vidéo gère son propre timer
    if (paused) return
    const start  = Date.now()
    const tick   = () => {
      const elapsed = Date.now() - start
      const p       = Math.min((elapsed / STORY_DURATION) * 100, 100)
      setProg(p)
      if (p < 100) timerRef.current = requestAnimationFrame(tick)
      else goNext()
    }
    timerRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(timerRef.current)
  }, [idx, paused, goNext, story.videoUrl])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') goNext()
      if (e.key === 'ArrowLeft')  goPrev()
      if (e.key === 'Escape')     onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [goNext, onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      onClick={() => setPaused(p => !p)}
    >
      {/* Fond flouté coloré */}
      <div className={`absolute inset-0 bg-gradient-to-br ${cat.gradient} opacity-30 blur-3xl`} />

      {/* Conteneur story (format vertical mobile) */}
      <div className="relative w-full max-w-sm mx-auto h-full max-h-[100dvh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}>

        {/* Barres de progression */}
        <div className="absolute top-3 left-3 right-3 z-20 flex gap-1">
          {stories.map((_, i) => (
            <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-none"
                style={{ width: i < idx ? '100%' : i === idx ? `${prog}%` : '0%' }}
              />
            </div>
          ))}
        </div>

        {/* Header vendeur */}
        <div className="absolute top-8 left-3 right-3 z-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gaming-purple to-gaming-cyan flex items-center justify-center text-sm font-bold text-white border-2 border-white/30">
              {story.seller.name[0]}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-heading font-semibold text-white">{story.seller.name}</span>
                {story.isPremium && <Crown size={12} className="text-gaming-gold" />}
              </div>
              <div className="flex items-center gap-1">
                <Star size={9} className="fill-gaming-gold text-gaming-gold" />
                <span className="text-xs text-white/80 font-mono">{story.seller.rating}</span>
                <span className="text-white/40 text-xs mx-1">·</span>
                <MapPin size={9} className="text-white/60" />
                <span className="text-xs text-white/60">{story.seller.location}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setMuted(m => !m)}
              className="p-1.5 rounded-full bg-black/30 backdrop-blur-sm text-white/80 hover:text-white">
              {muted ? <VolumeX size={16}/> : <Volume2 size={16}/>}
            </button>
            <button onClick={onClose}
              className="p-1.5 rounded-full bg-black/30 backdrop-blur-sm text-white/80 hover:text-white">
              <X size={18}/>
            </button>
          </div>
        </div>

        {/* Contenu principal */}
        <AnimatePresence mode="wait">
          <motion.div key={idx}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="flex-1 flex items-center justify-center"
          >
            {story.videoUrl ? (
              <div className="w-full h-full">
                <VideoPlayer url={story.videoUrl} autoPlay className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${cat.gradient} flex items-center justify-center grid-bg`}>
                <motion.span
                  className="text-[140px] select-none"
                  animate={{ scale: [1, 1.07, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {cat.emoji}
                </motion.span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation gauche/droite */}
        <button onClick={goPrev} disabled={idx === 0}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white disabled:opacity-20">
          <ChevronLeft size={22}/>
        </button>
        <button onClick={goNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white">
          <ChevronRight size={22}/>
        </button>

        {/* Footer produit */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
          <p className="text-xs text-gaming-text-muted font-body mb-1">{story.product.categoryName}</p>
          <h3 className="font-display font-bold text-lg text-white leading-tight mb-1 line-clamp-2">
            {story.product.title}
          </h3>
          <p className="font-mono font-bold text-gaming-gold text-xl mb-3">
            {formatPrice(story.product.price)}
          </p>
          <div className="flex gap-2">
            <Link to={`/produit/${story.product.slug}`} onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-gaming-purple font-heading font-semibold text-sm text-white text-center
                         hover:bg-gaming-purple-dark transition-colors">
              Voir le produit
            </Link>
            <button
              onClick={() => { addItem(story.product); onClose() }}
              className="p-2.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors">
              <ShoppingCart size={18} className="text-white"/>
            </button>
          </div>
        </div>

        {/* Pause indicator */}
        <AnimatePresence>
          {paused && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
              <div className="w-14 h-14 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                <span className="text-white text-2xl">⏸</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

/* ── Composant principal Stories ─────────────────────────────── */
export default function Stories() {
  const [viewerOpen,  setViewerOpen]  = useState(false)
  const [activeIdx,   setActiveIdx]   = useState(0)
  const [seenIds,     setSeenIds]     = useState(new Set())

  function openStory(i) {
    setActiveIdx(i)
    setViewerOpen(true)
    setSeenIds(prev => new Set([...prev, STORIES[i].id]))
  }

  if (!STORIES.length) return null

  return (
    <>
      <section className="py-6 page-container">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Crown size={15} className="text-gaming-gold" />
            <span className="font-heading font-semibold text-gaming-text-primary text-sm">
              Stories Premium
            </span>
            <span className="text-xs text-gaming-text-muted font-body">— Vendeurs certifiés</span>
          </div>
          <span className="text-xs text-gaming-purple font-heading cursor-pointer hover:text-gaming-purple-light">
            Tout voir
          </span>
        </div>

        <div className="flex items-start gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {STORIES.map((story, i) => (
            <StoryCircle
              key={story.id}
              story={story}
              seen={seenIds.has(story.id)}
              onClick={() => openStory(i)}
            />
          ))}
          {/* Bouton "Devenir Premium" */}
          <motion.div whileHover={{ scale: 1.06 }} className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer">
            <div className="w-16 h-16 rounded-2xl border-2 border-dashed border-gaming-gold/50 flex items-center justify-center bg-gaming-gold/5">
              <Crown size={22} className="text-gaming-gold" />
            </div>
            <span className="text-xs font-body text-gaming-gold truncate w-16 text-center">Premium</span>
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {viewerOpen && (
          <StoryViewer
            stories={STORIES}
            initialIndex={activeIdx}
            onClose={() => setViewerOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
