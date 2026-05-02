import { motion } from 'framer-motion'
import { Heart, Eye, MapPin, Star, ShoppingCart, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { formatPrice, CONDITIONS } from '../../utils/formatters'
import { CAT_STYLE } from '../../utils/mockData'
import Badge from './Badge'
import { useCart } from '../../contexts/CartContext'

export default function ProductCard({ product, index = 0 }) {
  const [liked,    setLiked]    = useState(false)
  const [imgError, setImgError] = useState(false)
  const { addItem }             = useCart()
  const cond = CONDITIONS[product.condition]
  const cat  = CAT_STYLE[product.category] || { emoji: '🎮', gradient: 'from-gaming-surface to-gaming-card' }

  const condVariant = {
    new: 'neon', excellent: 'cyan', good: 'purple', fair: 'gold',
  }[product.condition] || 'default'

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100) : null

  /* Priorité : image produit → image catégorie → emoji */
  const displayImage = !imgError
    ? (product.images?.[0] || cat.image || null)
    : null

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="group relative overflow-hidden flex flex-col rounded-2xl
                 bg-gaming-card border border-gaming-border/60
                 shadow-gaming transition-all duration-300
                 hover:-translate-y-2 hover:border-gaming-purple/50 hover:shadow-card-hover"
    >
      {/* Ligne néon supérieure au hover */}
      <div className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100
                      bg-gradient-to-r from-gaming-purple via-gaming-pink to-gaming-purple
                      transition-opacity duration-300 z-10" />

      {/* ── Visuel produit ── */}
      <Link to={`/produit/${product.slug}`} className="block relative overflow-hidden rounded-t-2xl">
        <div className={`aspect-[4/3] relative overflow-hidden
                         ${!displayImage ? `bg-gradient-to-br ${cat.gradient}` : 'bg-gaming-surface'}`}>

          {displayImage ? (
            /* Photo réelle */
            <>
              <img
                src={displayImage}
                alt={product.title}
                loading="lazy"
                onError={() => setImgError(true)}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Dégradé bas pour lisibilité badges */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </>
          ) : (
            /* Emoji fallback si aucune image */
            <>
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-500" />
              <div className="absolute inset-0 grid-bg opacity-15" />
              <motion.span
                className="absolute inset-0 flex items-center justify-center text-7xl select-none drop-shadow-lg"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: index * 0.3 }}
              >
                {cat.emoji}
              </motion.span>
            </>
          )}

          {/* Badge remise */}
          {discount && (
            <div className="absolute top-2 left-2 z-10 px-2 py-0.5 rounded-full
                            bg-gradient-to-r from-gaming-purple to-gaming-pink
                            text-white text-xs font-mono font-bold shadow-btn-glow">
              -{discount}%
            </div>
          )}
          {/* Badge vedette */}
          {product.featured && !discount && (
            <div className="absolute top-2 left-2 z-10">
              <span className="text-xs font-heading font-bold px-2 py-0.5 rounded-full
                               bg-gradient-to-r from-[#ffd700] to-[#ff8c00] text-black">
                ⭐ Vedette
              </span>
            </div>
          )}

          {/* Vues au hover */}
          <div className="absolute bottom-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="flex items-center gap-1 text-xs text-white bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5">
              <Eye size={10} /> {product.views}
            </span>
          </div>

          {/* Reflet brillance */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500
                          bg-gradient-to-br from-white/[0.04] via-transparent to-transparent" />
        </div>
      </Link>

      {/* Bouton favori */}
      <button
        onClick={() => setLiked(l => !l)}
        className="absolute top-2 right-2 p-2 rounded-full glass transition-all duration-200 hover:scale-110 z-10"
      >
        <Heart size={14} className={liked ? 'fill-gaming-pink text-gaming-pink' : 'text-white/70'} />
      </button>

      {/* ── Contenu texte ── */}
      <div className="p-4 space-y-3 flex-1 flex flex-col">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Badge variant={condVariant}>{cond?.label}</Badge>
          <Badge variant="default">{product.categoryName}</Badge>
        </div>

        <Link to={`/produit/${product.slug}`} className="flex-1">
          <h3 className="font-heading font-semibold text-gaming-text-primary text-sm leading-snug
                         line-clamp-2 hover:text-gaming-purple-light transition-colors duration-200">
            {product.title}
          </h3>
        </Link>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gaming-purple to-gaming-pink
                          flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {product.seller.name[0]}
          </div>
          <span className="text-xs text-gaming-text-secondary font-body truncate flex-1">
            {product.seller.name}
            {product.seller.verified && <span className="text-gaming-neon ml-1">✓</span>}
          </span>
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <Star size={10} className="fill-[#ffd700] text-[#ffd700]" />
            <span className="text-xs text-[#ffd700] font-mono">{product.seller.rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-gaming-text-muted">
          <MapPin size={11} className="text-gaming-purple-light" />
          <span className="text-xs font-body">{product.location}</span>
        </div>

        <div className="flex items-center justify-between pt-2.5 border-t border-gaming-border/50 mt-auto">
          <div>
            <p className="neon-price font-mono font-bold text-base leading-none">{formatPrice(product.price)}</p>
            {product.originalPrice && (
              <p className="text-xs text-gaming-text-muted line-through font-mono mt-0.5">
                {formatPrice(product.originalPrice)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <Link to={`/messages?product=${product.id}`}>
              <motion.button whileTap={{ scale: 0.9 }}
                className="p-2 rounded-xl bg-gaming-surface border border-gaming-border
                           hover:border-gaming-cyan/50 text-gaming-text-muted hover:text-gaming-cyan transition-all duration-200">
                <MessageCircle size={14} />
              </motion.button>
            </Link>
            <motion.button whileTap={{ scale: 0.9 }} onClick={() => addItem(product)}
              className="p-2 rounded-xl bg-gradient-to-r from-gaming-purple/20 to-gaming-pink/10
                         border border-gaming-purple/35 hover:border-gaming-purple
                         hover:from-gaming-purple/40 hover:to-gaming-pink/20
                         text-gaming-purple-light hover:text-white hover:shadow-purple-glow transition-all duration-200">
              <ShoppingCart size={14} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
