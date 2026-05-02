import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Heart, Eye, MapPin, Star, ShoppingCart, MessageCircle,
  Share2, ArrowLeft, Shield, CheckCircle, ChevronLeft, ChevronRight
} from 'lucide-react'
import { PRODUCTS } from '../utils/mockData'
import { formatPrice, formatRelativeDate, CONDITIONS } from '../utils/formatters'
import ProductCard from '../components/ui/ProductCard'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import { useCart } from '../contexts/CartContext'
import toast from 'react-hot-toast'

export default function ProductDetail() {
  const { slug }           = useParams()
  const navigate           = useNavigate()
  const product            = PRODUCTS.find(p => p.slug === slug)
  const [imgIdx, setImgIdx]= useState(0)
  const [liked, setLiked]  = useState(false)
  const { addItem }        = useCart()
  const cond               = CONDITIONS[product?.condition]

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-5xl mb-4">🎮</p>
        <h2 className="font-display font-bold text-2xl text-white mb-4">Produit introuvable</h2>
        <Button onClick={() => navigate('/marketplace')}>Retour au marketplace</Button>
      </div>
    </div>
  )

  const similar = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4)
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null

  return (
    <div className="min-h-screen py-8">
      <div className="page-container">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gaming-text-muted mb-6 font-body">
          <button onClick={() => navigate(-1)} className="flex items-center gap-1 hover:text-gaming-purple transition-colors">
            <ArrowLeft size={16} /> Retour
          </button>
          <span>/</span>
          <Link to="/marketplace" className="hover:text-gaming-purple transition-colors">Marketplace</Link>
          <span>/</span>
          <span className="text-gaming-text-primary truncate max-w-[200px]">{product.title}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 mb-16">

          {/* Images */}
          <div className="space-y-3">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gaming-surface group">
              <img src={product.images[imgIdx]} alt={product.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={e => { e.target.style.display='none' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gaming-bg/30 via-transparent to-transparent" />

              {discount && (
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-gaming-red text-white text-sm font-mono font-bold">
                  -{discount}%
                </div>
              )}

              <button onClick={() => setLiked(l => !l)}
                className="absolute top-4 right-4 p-3 glass rounded-full transition-all duration-200 hover:scale-110">
                <Heart size={20} className={liked ? 'fill-gaming-red text-gaming-red' : 'text-white'} />
              </button>

              {product.images.length > 1 && (
                <>
                  <button onClick={() => setImgIdx(i => (i - 1 + product.images.length) % product.images.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 glass rounded-full hover:bg-gaming-card-hover transition-all">
                    <ChevronLeft size={18} className="text-white" />
                  </button>
                  <button onClick={() => setImgIdx(i => (i + 1) % product.images.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 glass rounded-full hover:bg-gaming-card-hover transition-all">
                    <ChevronRight size={18} className="text-white" />
                  </button>
                </>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-2">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setImgIdx(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${imgIdx === i ? 'border-gaming-purple' : 'border-gaming-border'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={product.condition === 'new' ? 'neon' : product.condition === 'excellent' ? 'cyan' : 'purple'}>
                {cond?.label}
              </Badge>
              <Badge variant="default">{product.categoryName}</Badge>
              {product.featured && <Badge variant="gold">⭐ Vedette</Badge>}
            </div>

            <div>
              <h1 className="font-display font-bold text-2xl sm:text-3xl text-white leading-tight mb-3">
                {product.title}
              </h1>
              <div className="flex items-center gap-4 text-sm text-gaming-text-muted">
                <span className="flex items-center gap-1"><Eye size={14}/> {product.views} vues</span>
                <span className="flex items-center gap-1"><Heart size={14}/> {product.likes + (liked ? 1 : 0)} likes</span>
                <span>{formatRelativeDate(product.createdAt)}</span>
              </div>
            </div>

            {/* Price */}
            <div className="p-4 gaming-card">
              <p className="font-mono font-bold text-3xl text-gaming-gold">{formatPrice(product.price)}</p>
              {product.originalPrice && (
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-gaming-text-muted line-through font-mono">{formatPrice(product.originalPrice)}</span>
                  <span className="text-sm text-gaming-green font-heading font-semibold">Vous économisez {formatPrice(product.originalPrice - product.price)}</span>
                </div>
              )}
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-gaming-text-muted">
              <MapPin size={16} className="text-gaming-purple" />
              <span className="font-body text-sm">{product.location}</span>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <Button size="lg" variant="primary" fullWidth icon={<ShoppingCart size={18}/>} onClick={() => addItem(product)}>
                Ajouter au panier
              </Button>
              <Link to={`/messages?product=${product.id}`} className="block">
                <Button size="lg" variant="secondary" fullWidth icon={<MessageCircle size={18}/>}>
                  Contacter le vendeur
                </Button>
              </Link>
              <button onClick={() => { navigator.clipboard?.writeText(window.location.href); toast.success('Lien copié !') }}
                className="flex items-center justify-center gap-2 py-2.5 text-sm text-gaming-text-muted hover:text-gaming-purple transition-colors font-heading">
                <Share2 size={16}/> Partager cette annonce
              </button>
            </div>

            {/* Security */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-gaming-neon/5 border border-gaming-neon/20">
              <Shield size={18} className="text-gaming-neon flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-gaming-neon text-sm font-heading font-semibold">Transaction sécurisée</p>
                <p className="text-gaming-text-muted text-xs font-body mt-0.5">Paiement via Wave, Orange Money, MTN ou Moov Money. Remboursement garanti en cas de problème.</p>
              </div>
            </div>

            {/* Seller */}
            <div className="gaming-card p-5">
              <p className="text-xs text-gaming-text-muted font-heading font-semibold uppercase tracking-wider mb-3">Vendeur</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gaming-purple to-gaming-cyan flex items-center justify-center text-lg font-bold text-white flex-shrink-0">
                  {product.seller.name[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
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
                  <Button size="sm" variant="secondary">Voir profil</Button>
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

        {/* Similar */}
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
