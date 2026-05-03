import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart, MapPin, MessageCircle } from 'lucide-react'
import { PRODUCTS, CAT_STYLE } from '../utils/mockData'
import { formatPrice, CONDITIONS } from '../utils/formatters'
import ProductCard from '../components/ui/ProductCard'

export default function ProductDetail() {
  const { slug }    = useParams()
  const navigate    = useNavigate()
  const product     = PRODUCTS.find(p => p.slug === slug)
  const [liked, setLiked]     = useState(false)
  const [activeImg, setActiveImg] = useState(0)
  const [imgErrors, setImgErrors] = useState({})

  if (!product) return (
    <div style={{ minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0010' }}>
      <div style={{ textAlign: 'center', padding: 40 }}>
        <p style={{ fontSize: 48 }}>🎮</p>
        <h2 style={{ color: '#fff', fontFamily: 'Rajdhani, sans-serif', fontSize: 22, fontWeight: 800, marginTop: 12 }}>
          Produit introuvable
        </h2>
        <button
          onClick={() => navigate('/marketplace')}
          style={{ marginTop: 16, background: '#8b00ff', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 24px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}
        >
          Retour au marketplace
        </button>
      </div>
    </div>
  )

  const cat        = CAT_STYLE[product.category] || { emoji: '🎮', gradient: 'from-gaming-surface to-gaming-card' }
  const cond       = CONDITIONS[product.condition]
  const similar    = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
  const discount   = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : null

  const validImages = (product.images || []).filter(url => !imgErrors[url])
  const displayImages = validImages.length > 0 ? validImages : null

  const safeIdx = Math.min(activeImg, Math.max(0, (displayImages?.length || 1) - 1))

  return (
    <div style={{ minHeight: '100%', background: '#0a0010', paddingBottom: 90 }}>

      {/* ── Sticky Header ── */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 20,
        background: '#120020', padding: '12px 14px',
        display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '1px solid rgba(139,0,255,0.2)',
      }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8b00ff', padding: 0 }}
        >
          <ArrowLeft size={22} />
        </button>
        <span style={{ fontWeight: 700, fontSize: 16, fontFamily: 'Rajdhani, sans-serif', color: '#fff', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {product.title}
        </span>
        <button
          onClick={() => setLiked(l => !l)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: liked ? '#ff3355' : '#6b6b8a' }}
        >
          <Heart size={20} style={{ fill: liked ? '#ff3355' : 'none', stroke: liked ? '#ff3355' : '#6b6b8a' }} />
        </button>
      </div>

      {/* ── Image carousel ── */}
      <div style={{
        height: 220, position: 'relative',
        background: 'linear-gradient(135deg, #120020 0%, #1a0038 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {displayImages ? (
          <img
            src={displayImages[safeIdx]}
            alt={product.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={() => setImgErrors(prev => ({ ...prev, [displayImages[safeIdx]]: true }))}
          />
        ) : (
          <span style={{ fontSize: 80, userSelect: 'none' }}>{cat.emoji}</span>
        )}

        {/* Discount badge */}
        {discount && (
          <div style={{
            position: 'absolute', top: 12, left: 12,
            background: '#ff3355', color: '#fff', borderRadius: 20,
            padding: '3px 10px', fontSize: 12, fontWeight: 700, fontFamily: 'Space Mono, monospace',
          }}>
            -{discount}%
          </div>
        )}

        {/* Premium badge */}
        {product.featured && (
          <div style={{
            position: 'absolute', top: 12, left: discount ? 80 : 12,
            background: 'linear-gradient(90deg, #ffd700, #ff8c00)',
            color: '#000', borderRadius: 20,
            padding: '3px 10px', fontSize: 11, fontWeight: 700,
            display: 'flex', alignItems: 'center', gap: 4,
          }}>
            👑 VENDEUR PREMIUM
          </div>
        )}
      </div>

      {/* ── Thumbnails ── */}
      {displayImages && displayImages.length > 1 && (
        <div style={{ display: 'flex', gap: 8, padding: '10px 14px' }}>
          {displayImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImg(i)}
              style={{
                width: 50, height: 50, borderRadius: 8, overflow: 'hidden', cursor: 'pointer',
                border: `2px solid ${safeIdx === i ? '#8b00ff' : 'rgba(139,0,255,0.2)'}`,
                background: '#1a0038', padding: 0,
                boxShadow: safeIdx === i ? '0 0 10px rgba(139,0,255,0.4)' : 'none',
              }}
            >
              <img src={img} alt={`Photo ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </button>
          ))}
        </div>
      )}

      {/* ── Content ── */}
      <div style={{ padding: '8px 14px 20px' }}>

        {/* Title + Price + Like */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginTop: 4 }}>
          <div style={{ flex: 1, marginRight: 10 }}>
            <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: '#fff', fontFamily: 'Rajdhani, sans-serif', lineHeight: 1.2 }}>
              {product.title}
            </h2>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
              <p style={{ margin: 0, fontSize: 24, fontWeight: 900, color: '#aa33ff', fontFamily: 'Space Mono, monospace' }}>
                {formatPrice(product.price)}
              </p>
              {product.originalPrice && (
                <p style={{ margin: 0, fontSize: 14, color: '#6b6b8a', textDecoration: 'line-through', fontFamily: 'Space Mono, monospace' }}>
                  {formatPrice(product.originalPrice)}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={() => setLiked(l => !l)}
            style={{
              background: liked ? 'rgba(255,51,85,0.15)' : '#1a0038',
              border: `1px solid ${liked ? 'rgba(255,51,85,0.3)' : 'rgba(139,0,255,0.2)'}`,
              cursor: 'pointer', borderRadius: '50%', width: 42, height: 42,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: liked ? '#ff3355' : '#6b6b8a', flexShrink: 0,
            }}
          >
            <Heart size={20} style={{ fill: liked ? '#ff3355' : 'none', stroke: liked ? '#ff3355' : '#6b6b8a' }} />
          </button>
        </div>

        {/* Badges */}
        <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
          <span style={{
            background: 'rgba(139,0,255,0.2)', color: '#aa33ff', borderRadius: 20,
            padding: '3px 10px', fontSize: 11, fontWeight: 600, border: '1px solid rgba(139,0,255,0.3)',
            fontFamily: 'Space Grotesk, sans-serif',
          }}>
            {cond?.label || product.condition}
          </span>
          <span style={{
            background: 'rgba(0,200,255,0.1)', color: '#00c8ff', borderRadius: 20,
            padding: '3px 10px', fontSize: 11, fontWeight: 600, border: '1px solid rgba(0,200,255,0.25)',
            fontFamily: 'Space Grotesk, sans-serif',
          }}>
            {product.categoryName}
          </span>
        </div>

        {/* Location */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 10, color: '#6b6b8a', fontSize: 12, fontFamily: 'Inter, sans-serif' }}>
          <MapPin size={13} style={{ color: '#8b00ff' }} />
          {product.location}
        </div>

        {/* Description */}
        <div style={{ marginTop: 14, padding: 14, background: '#1a0038', borderRadius: 12, border: '1px solid rgba(139,0,255,0.2)' }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#6b6b8a', textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'Space Grotesk, sans-serif' }}>
            Description
          </p>
          <p style={{ margin: '8px 0 0', fontSize: 14, color: '#a0a0b0', lineHeight: 1.6, fontFamily: 'Inter, sans-serif' }}>
            {product.description}
          </p>
        </div>

        {/* Seller */}
        <div style={{ marginTop: 10, padding: 14, background: '#1a0038', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 12, border: '1px solid rgba(139,0,255,0.2)' }}>
          <div style={{
            width: 44, height: 44, borderRadius: '50%',
            background: 'linear-gradient(135deg, #8b00ff, #ff00c8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, fontWeight: 800, color: '#fff',
            fontFamily: 'Rajdhani, sans-serif', flexShrink: 0,
          }}>
            {product.seller?.name?.[0] || '?'}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 14, fontFamily: 'Rajdhani, sans-serif', color: '#fff' }}>
              {product.seller?.name}
            </p>
            <div style={{ display: 'flex', gap: 1, marginTop: 2 }}>
              {[1,2,3,4,5].map(s => (
                <span key={s} style={{ color: s <= Math.floor(product.seller?.rating || 4) ? '#ffd700' : '#2d0060', fontSize: 12 }}>★</span>
              ))}
              <span style={{ fontSize: 11, color: '#6b6b8a', marginLeft: 4, fontFamily: 'Inter, sans-serif' }}>
                ({product.seller?.reviewCount || 0} avis)
              </span>
            </div>
            {product.seller?.verified && (
              <span style={{ fontSize: 10, color: '#00ff88', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>
                ✓ Vendeur certifié
              </span>
            )}
          </div>
          <Link
            to={`/messages`}
            style={{
              background: '#8b00ff', color: '#fff', border: 'none',
              borderRadius: 20, padding: '8px 14px', cursor: 'pointer',
              fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5,
              textDecoration: 'none', boxShadow: '0 0 15px rgba(139,0,255,0.3)',
              fontFamily: 'Space Grotesk, sans-serif',
            }}
          >
            <MessageCircle size={14} /> Contacter
          </Link>
        </div>

        {/* Similar products */}
        {similar.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <p style={{ margin: '0 0 10px', fontWeight: 800, fontSize: 15, fontFamily: 'Rajdhani, sans-serif', color: '#fff' }}>
              Annonces similaires
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {similar.slice(0, 4).map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Fixed bottom CTA ── */}
      <div style={{
        position: 'fixed', bottom: 64, left: '50%', transform: 'translateX(-50%)',
        width: 'min(440px, 100%)', padding: '10px 14px',
        background: 'rgba(10,0,16,0.95)', borderTop: '1px solid rgba(139,0,255,0.2)',
        backdropFilter: 'blur(20px)', zIndex: 30,
      }}>
        <Link
          to="/messages"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            width: '100%', background: 'linear-gradient(135deg, #8b00ff, #ff00c8)',
            color: '#fff', border: 'none', borderRadius: 12,
            padding: '13px 0', fontWeight: 800, fontSize: 14, cursor: 'pointer',
            fontFamily: 'Rajdhani, sans-serif', textDecoration: 'none',
            boxShadow: '0 0 25px rgba(139,0,255,0.4)',
          }}
        >
          <MessageCircle size={16} /> Discuter avec le vendeur
        </Link>
      </div>
    </div>
  )
}
