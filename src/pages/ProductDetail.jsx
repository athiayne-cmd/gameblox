import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart, Eye, MapPin, Star, ShoppingCart, MessageCircle,
  Share2, ArrowLeft, Shield, CheckCircle, ChevronLeft, ChevronRight
} from 'lucide-react'
import { PRODUCTS, CAT_STYLE } from '../utils/mockData'
import { formatPrice, formatRelativeDate, CONDITIONS } from '../utils/formatters'
import ProductCard from '../components/ui/ProductCard'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import VideoPlayer, { VideoThumb } from '../components/ui/VideoPlayer'
import { useCart } from '../contexts/CartContext'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { slug }              = useParams()
  const navigate              = useNavigate()
  const product               = PRODUCTS.find(p => p.slug === slug)
  const [liked, setLiked]     = useState(false)
  const [mediaIdx, setMediaIdx] = useState(0)
  const [imgErrors, setImgErrors] = useState({})
  const { addItem }           = useCart()

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-5xl mb-4">🎮</p>
        <h2 className="font-display font-bold text-2xl text-white mb-4">Produit introuvable</h2>
        <Button onClick={() => navigate('/marketplace')}>Retour au marketplace</Button>
      </div>
    </div>
  )

  const cond        = CONDITIONS[product.condition]
  const cat         = CAT_STYLE[product.category] || { emoji: '🎮', gradient: 'from-gaming-surface to-gaming-card' }
  const similar     = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
  const discount    = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100) : null
  const condVariant = { new: 'neon', excellent: 'cyan', good: 'purple', fair: 'gold' }[product.condition] || 'default'

  // Build ordered media list: valid images first, then video
  const validImages = (product.images || []).filter(url => !imgErrors[url])
  const allMedia = [
    ...validImages.map(url => ({ type: 'image', url })),
    ...(product.videoUrl ? [{ type: 'video', url: product.videoUrl }] : []),
  ]
  const hasRealMedia = allMedia.length > 0
  const totalSlides  = hasRealMedia ? allMedia.length : 1
  const safeIdx      = Math.min(mediaIdx, totalSlides - 1)
  const currentItem  = hasRealMedia ? allMedia[safeIdx] : null

  const goPrev = () => setMediaIdx(i => Math.max(0, i - 1))
  const goNext = () => setMediaIdx(i => Math.min(totalSlides - 1, i + 1))
  const handleImgError = (url) => {
    setImgErrors(prev => ({ ...prev, [url]: true }))
    // If the broken image was the current slide, stay on same index (will shift to next valid)
  }

  return (
    <div className="min-h-screen py-8">
      <div className="page-container">

        {/* Fil d'Ariane */}
        <div className="flex items-center gap-2 text-sm text-gaming-text-muted mb-6 font-body flex-wrap">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 hover:text-gaming-purple transition-colors">
            <ArrowLeft size={16} /> Retour
          </button>
          <span>/</span>
          <Link to="/marketplace" className="hover:text-gaming-purple transition-colors">Marketplace</Link>
          <span>/</span>
          <span className="text-gaming-text-primary truncate max-w-[200px]">{product.title}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 mb-16">

          {/* ── Carrousel médias ── */}
          <div className="space-y-3">

            {/* Affichage principal */}
            <div className="relative rounded-2xl overflow-hidden group">
              <AnimatePresence mode="wait">
                {!hasRealMedia ? (
                  /* Emoji fallback quand aucune image */
                  <motion.div key="emoji"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className={`aspect-[4/3] bg-gradient-to-br ${cat.gradient} flex items-center justify-center relative`}>
                    <div className="absolute inset-0 grid-bg opacity-20" />
                    <motion.span
                      className="text-[120px] z-10 select-none"
                      animate={{ scale: [1, 1.06, 1] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}>
                      {cat.emoji}
                    </motion.span>
                  </motion.div>

                ) : currentItem?.type === 'image' ? (
                  /* Photo réelle */
                  <motion.div key={`img-${safeIdx}`}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="aspect-[4/3] bg-gaming-surface overflow-hidden">
                    <img
                      src={currentItem.url}
                      alt={`${product.title} — photo ${safeIdx + 1}`}
                      loading="lazy"
                      onError={() => handleImgError(currentItem.url)}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>

                ) : (
                  /* Lecteur vidéo */
                  <motion.div key="video"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="aspect-[4/3] bg-black rounded-2xl overflow-hidden flex items-center justify-center">
                    <VideoPlayer url={product.videoUrl} className="w-full" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Badge remise */}
              {discount && currentItem?.type !== 'video' && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gaming-red text-white text-sm font-mono font-bold z-20">
                  -{discount}%
                </div>
              )}

              {/* Bouton like */}
              <button onClick={() => setLiked(l => !l)}
                className="absolute top-4 right-4 p-3 glass rounded-full transition-all duration-200 hover:scale-110 z-20">
                <Heart size={20} className={liked ? 'fill-gaming-red text-gaming-red' : 'text-white'} />
              </button>

              {/* Flèches navigation */}
              {totalSlides > 1 && (
                <>
                  <button
                    onClick={goPrev}
                    disabled={safeIdx === 0}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/50 backdrop-blur-sm text-white
                               hover:bg-black/70 transition-all disabled:opacity-20 disabled:cursor-not-allowed
                               opacity-0 group-hover:opacity-100">
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    onClick={goNext}
                    disabled={safeIdx === totalSlides - 1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/50 backdrop-blur-sm text-white
                               hover:bg-black/70 transition-all disabled:opacity-20 disabled:cursor-not-allowed
                               opacity-0 group-hover:opacity-100">
                    <ChevronRight size={22} />
                  </button>
                </>
              )}

              {/* Compteur */}
              {totalSlides > 1 && (
                <div className="absolute bottom-4 right-4 z-20 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-mono">
                  {safeIdx + 1} / {totalSlides}
                </div>
              )}
            </div>

            {/* Miniatures */}
            {totalSlides > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                {allMedia.map((item, i) => (
                  item.type === 'image' ? (
                    <button
                      key={i}
                      onClick={() => setMediaIdx(i)}
                      className={`flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all
                        ${safeIdx === i ? 'border-gaming-purple shadow-purple-glow' : 'border-gaming-border hover:border-gaming-purple/50'}`}>
                      <img
                        src={item.url}
                        alt={`Miniature ${i + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ) : (
                    <VideoThumb
                      key={i}
                      url={item.url}
                      onClick={() => setMediaIdx(i)}
                      className={`flex-shrink-0 w-16 h-16 ${safeIdx === i ? '!border-gaming-purple shadow-purple-glow' : ''}`}
                    />
                  )
                ))}
              </div>
            )}
          </div>

          {/* ── Informations produit ── */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={condVariant}>{cond?.label}</Badge>
              <Badge variant="default">{product.categoryName}</Badge>
              {product.featured && <Badge variant="gold">⭐ Vedette</Badge>}
            </div>

            <div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-white leading-tight mb-3">
                {product.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gaming-text-muted flex-wrap">
                <span className="flex items-center gap-1"><Eye size={14}/> {product.views} vues</span>
                <span className="flex items-center gap-1"><Heart size={14}/> {product.likes + (liked ? 1 : 0)} likes</span>
                <span>Publié {formatRelativeDate(product.createdAt)}</span>
              </div>
            </div>

            {/* Prix */}
            <div className="p-5 gaming-card">
              <p className="font-mono font-bold text-3xl text-gaming-gold">{formatPrice(product.price)}</p>
              {product.originalPrice && (
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-sm text-gaming-text-muted line-through font-mono">{formatPrice(product.originalPrice)}</span>
                  <span className="text-sm text-gaming-green font-heading font-semibold">
                    Économie de {formatPrice(product.originalPrice - product.price)}
                  </span>
                </div>
              )}
            </div>

            {/* Localisation */}
            <div className="flex items-center gap-2 text-gaming-text-muted">
              <MapPin size={16} className="text-gaming-purple" />
              <span className="font-body text-sm">{product.location}</span>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col gap-3">
              <Button size="lg" variant="primary" fullWidth icon={<ShoppingCart size={18}/>}
                onClick={() => addItem(product)}>
                Ajouter au panier
              </Button>
              <Link to={`/messages?product=${product.id}`} className="block">
                <Button size="lg" variant="secondary" fullWidth icon={<MessageCircle size={18}/>}>
                  Contacter le vendeur
                </Button>
              </Link>
              <button
                onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success('Lien copié !') }}
                className="flex items-center justify-center gap-2 py-2.5 text-sm text-gaming-text-muted hover:text-gaming-purple transition-colors font-heading">
                <Share2 size={16}/> Partager cette annonce
              </button>
            </div>

            {/* Sécurité */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-gaming-neon/5 border border-gaming-neon/20">
              <Shield size={18} className="text-gaming-neon flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gaming-neon text-sm font-heading font-semibold">Transaction sécurisée</p>
                <p className="text-gaming-text-muted text-xs font-body mt-0.5">
                  Paiement via Wave, Orange Money, MTN ou Moov Money. Remboursement garanti en cas de problème.
                </p>
              </div>
            </div>

            {/* Vendeur */}
            <div className="gaming-card p-5">
              <p className="text-xs text-gaming-text-muted font-heading font-semibold uppercase tracking-wider mb-4">Vendeur</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gaming-purple to-gaming-cyan flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
                  {product.seller.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-heading font-semibold text-gaming-text-primary">{product.seller.name}</p>
                    {product.seller.verified && (
                      <span className="flex items-center gap-1 text-xs text-gaming-cyan">
                        <CheckCircle size={12}/> Vérifié
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={11}
                        className={i < Math.floor(product.seller.rating) ? 'fill-gaming-gold text-gaming-gold' : 'text-gaming-border'} />
                    ))}
                    <span className="text-xs text-gaming-gold font-mono ml-1">{product.seller.rating}</span>
                    <span className="text-xs text-gaming-text-muted font-body ml-1">({product.seller.reviewCount} avis)</span>
                  </div>
                  <p className="text-xs text-gaming-text-muted font-body mt-0.5 flex items-center gap-1">
                    <MapPin size={10}/> {product.seller.location}
                  </p>
                </div>
                <Link to={`/profil/${product.seller.id}`}>
                  <Button size="sm" variant="secondary">Voir le profil</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="gaming-card p-6 mb-12">
          <h2 className="font-heading font-semibold text-gaming-text-primary text-lg mb-4">Description</h2>
          <p className="text-gaming-text-secondary font-body leading-relaxed whitespace-pre-wrap">{product.description}</p>
        </div>

        {/* Produits similaires */}
        {similar.length > 0 && (
          <div>
            <h2 className="section-title mb-7">Produits similaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {similar.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
