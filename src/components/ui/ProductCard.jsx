import { motion } from 'framer-motion'
import { Heart, Eye, MapPin, Star, ShoppingCart, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { formatPrice, CONDITIONS } from '../../utils/formatters'
import Badge from './Badge'
import { useCart } from '../../contexts/CartContext'

export default function ProductCard({ product, index = 0 }) {
  const [liked, setLiked] = useState(false)
  const { addItem } = useCart()
  const cond = CONDITIONS[product.condition]

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="gaming-card group relative overflow-hidden"
    >
      {/* Image */}
      <Link to={`/produit/${product.slug}`} className="block relative overflow-hidden rounded-t-2xl">
        <div className="aspect-[4/3] overflow-hidden bg-gaming-surface">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            onError={e => {
              e.target.style.display = 'none'
              e.target.parentNode.classList.add('flex','items-center','justify-center')
            }}
          />
        </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-gaming-bg/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Stats overlay */}
        <div className="absolute bottom-2 left-2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="flex items-center gap-1 text-xs text-white bg-gaming-bg/70 backdrop-blur-sm rounded-full px-2 py-0.5">
            <Eye size={10} /> {product.views}
          </span>
        </div>

        {/* Featured badge */}
        {product.featured && (
          <div className="absolute top-2 left-2">
            <span className="text-xs font-heading font-bold px-2 py-0.5 rounded-full bg-gaming-gold/90 text-gaming-bg">
              ⭐ Vedette
            </span>
          </div>
        )}
      </Link>

      {/* Wishlist button */}
      <button
        onClick={() => setLiked(l => !l)}
        className="absolute top-2 right-2 p-2 rounded-full glass transition-all duration-200 hover:scale-110"
      >
        <Heart
          size={15}
          className={liked ? 'fill-gaming-red text-gaming-red' : 'text-gaming-text-secondary'}
        />
      </button>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Badges */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant={product.condition === 'new' ? 'neon' : product.condition === 'excellent' ? 'cyan' : 'purple'}>
            {cond?.label}
          </Badge>
          <Badge variant="default">{product.categoryName}</Badge>
        </div>

        {/* Title */}
        <Link to={`/produit/${product.slug}`}>
          <h3 className="font-heading font-semibold text-gaming-text-primary text-sm leading-snug
                         line-clamp-2 hover:text-gaming-purple transition-colors duration-200">
            {product.title}
          </h3>
        </Link>

        {/* Seller */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-gaming-purple to-gaming-cyan flex items-center justify-center text-xs font-bold text-white">
            {product.seller.name[0]}
          </div>
          <div className="flex items-center gap-1 min-w-0">
            <span className="text-xs text-gaming-text-secondary font-body truncate">
              {product.seller.name}
            </span>
            {product.seller.verified && (
              <span className="text-gaming-cyan text-xs">✓</span>
            )}
          </div>
          <div className="flex items-center gap-0.5 ml-auto flex-shrink-0">
            <Star size={10} className="fill-gaming-gold text-gaming-gold" />
            <span className="text-xs text-gaming-gold font-mono">{product.seller.rating}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 text-gaming-text-muted">
          <MapPin size={11} />
          <span className="text-xs font-body">{product.location}</span>
        </div>

        {/* Price + actions */}
        <div className="flex items-center justify-between pt-1 border-t border-gaming-border/40">
          <div>
            <p className="font-mono font-bold text-gaming-gold text-base">{formatPrice(product.price)}</p>
            {product.originalPrice && (
              <p className="text-xs text-gaming-text-muted line-through font-mono">
                {formatPrice(product.originalPrice)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <Link to={`/messages?product=${product.id}`}>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-xl bg-gaming-surface border border-gaming-border hover:border-gaming-cyan/50
                           text-gaming-text-muted hover:text-gaming-cyan transition-all duration-200"
              >
                <MessageCircle size={15} />
              </motion.button>
            </Link>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => addItem(product)}
              className="p-2 rounded-xl bg-gaming-purple/10 border border-gaming-purple/30
                         hover:bg-gaming-purple hover:border-gaming-purple text-gaming-purple hover:text-white
                         transition-all duration-200"
            >
              <ShoppingCart size={15} />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
