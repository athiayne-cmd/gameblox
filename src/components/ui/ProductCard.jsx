import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, MapPin } from 'lucide-react'
import { formatPrice } from '../../utils/formatters'
import { CAT_STYLE } from '../../utils/mockData'

export default function ProductCard({ product, index = 0 }) {
  const [liked, setLiked] = useState(false)
  const [imgErr, setImgErr] = useState(false)
  const cat = CAT_STYLE[product.category] || { emoji: '🎮', gradient: 'from-gaming-surface to-gaming-card' }

  const displayImg = !imgErr && product.images?.[0] ? product.images[0] : null

  return (
    <div
      className="rounded-2xl overflow-hidden cursor-pointer relative border border-gaming-border/60
                 transition-all duration-200 hover:-translate-y-1 hover:border-gaming-purple/50"
      style={{ background: '#1a0038', boxShadow: '0 2px 16px rgba(0,0,0,0.5)' }}
    >
      {/* Image */}
      <Link to={`/produit/${product.slug}`} className="block relative" style={{ height: 140 }}>
        <div
          className="w-full h-full flex items-center justify-center text-5xl relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #12002a 0%, #1a0038 100%)' }}
        >
          {displayImg ? (
            <img
              src={displayImg}
              alt={product.title}
              className="w-full h-full object-cover"
              onError={() => setImgErr(true)}
            />
          ) : (
            <span className="select-none">{cat.emoji}</span>
          )}

          {/* Overlay gradient on image */}
          {displayImg && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          )}

          {/* Premium badge */}
          {product.featured && (
            <div
              className="absolute top-2 left-2 flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold"
              style={{ background: 'linear-gradient(90deg, #ffd700, #ff8c00)', color: '#000' }}
            >
              👑 PREMIUM
            </div>
          )}

          {/* Condition badge */}
          <div
            className="absolute top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
            style={{ background: 'rgba(139,0,255,0.8)' }}
          >
            {product.condition === 'new' ? 'Neuf' :
             product.condition === 'excellent' ? 'Très bon' :
             product.condition === 'good' ? 'Bon état' : 'Correct'}
          </div>
        </div>
      </Link>

      {/* Info */}
      <div style={{ padding: '10px 12px 12px' }}>
        <Link to={`/produit/${product.slug}`}>
          <p className="font-heading font-bold text-white leading-snug line-clamp-2" style={{ fontSize: 13 }}>
            {product.title}
          </p>
          <p className="font-mono font-bold mt-1" style={{ fontSize: 16, color: '#aa33ff' }}>
            {formatPrice(product.price)}
          </p>
          <p className="flex items-center gap-1 mt-1" style={{ fontSize: 11, color: '#6b6b8a' }}>
            <MapPin size={11} style={{ color: '#8b00ff' }} />
            {product.location}
          </p>
        </Link>

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5">
            <div
              className="flex items-center justify-center rounded-full text-white font-bold flex-shrink-0"
              style={{
                width: 22, height: 22, fontSize: 10,
                background: 'linear-gradient(135deg, #8b00ff, #ff00c8)',
              }}
            >
              {product.seller?.name?.[0] || '?'}
            </div>
            <span className="truncate" style={{ fontSize: 11, color: '#a0a0b0', maxWidth: 80 }}>
              {product.seller?.name?.split(' ')[0] || ''}
            </span>
          </div>

          <button
            onClick={e => { e.preventDefault(); e.stopPropagation(); setLiked(l => !l) }}
            className="flex items-center gap-1 transition-colors"
            style={{ fontSize: 11, color: liked ? '#ff3355' : '#6b6b8a', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <Heart size={13} style={{ fill: liked ? '#ff3355' : 'none', stroke: liked ? '#ff3355' : '#6b6b8a' }} />
            {(product.likes || 0) + (liked ? 1 : 0)}
          </button>
        </div>
      </div>
    </div>
  )
}
