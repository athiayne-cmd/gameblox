import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, MapPin, CheckCircle, Package, MessageCircle, Calendar } from 'lucide-react'
import { PRODUCTS, SELLERS } from '../utils/mockData'
import { formatRelativeDate } from '../utils/formatters'
import ProductCard from '../components/ui/ProductCard'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

export default function Profile() {
  const { id } = useParams()
  const seller = SELLERS.find(s => s.id === id) || SELLERS[0]
  const listings = PRODUCTS.filter(p => p.seller.id === seller.id)

  const stats = [
    { label: 'Annonces',     value: listings.length,      icon: <Package size={16}/> },
    { label: 'Note',         value: `${seller.rating}★`,  icon: <Star size={16}/> },
    { label: 'Avis',         value: seller.reviewCount,   icon: <MessageCircle size={16}/> },
  ]

  return (
    <div className="min-h-screen py-10">
      <div className="page-container">

        {/* Cover */}
        <div className="relative h-48 rounded-3xl overflow-hidden mb-16 bg-gradient-to-br from-gaming-purple/40 via-gaming-surface to-gaming-cyan/20 grid-bg">
          <div className="absolute inset-0 bg-gradient-to-t from-gaming-bg/60 to-transparent" />

          {/* Avatar */}
          <div className="absolute -bottom-10 left-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gaming-purple to-gaming-cyan flex items-center justify-center text-3xl font-bold text-white shadow-gaming-lg border-4 border-gaming-bg">
              {seller.name[0]}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Left: profile info */}
          <div className="space-y-5">
            <div className="gaming-card p-5 space-y-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-heading font-bold text-xl text-white">{seller.name}</h1>
                  {seller.verified && (
                    <span className="flex items-center gap-1 text-xs text-gaming-cyan font-heading font-semibold">
                      <CheckCircle size={13}/> Vérifié
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13}
                      className={i < Math.floor(seller.rating) ? 'fill-gaming-gold text-gaming-gold' : 'text-gaming-border'} />
                  ))}
                  <span className="text-sm text-gaming-gold font-mono ml-1">{seller.rating}</span>
                  <span className="text-xs text-gaming-text-muted font-body">({seller.reviewCount} avis)</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-gaming-text-muted">
                <MapPin size={14} className="text-gaming-purple"/>
                <span className="text-sm font-body">{seller.location}</span>
              </div>

              <div className="flex items-center gap-2 text-gaming-text-muted">
                <Calendar size={14} className="text-gaming-cyan"/>
                <span className="text-sm font-body">Membre depuis janvier 2023</span>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2 border-t border-gaming-border/40">
                {stats.map(s => (
                  <div key={s.label} className="text-center">
                    <p className="font-display font-bold text-xl text-white">{s.value}</p>
                    <p className="text-xs text-gaming-text-muted font-body">{s.label}</p>
                  </div>
                ))}
              </div>

              <Button fullWidth variant="secondary" icon={<MessageCircle size={16}/>}>
                Contacter
              </Button>
            </div>

            {/* Badges */}
            <div className="gaming-card p-5">
              <h3 className="font-heading font-semibold text-gaming-text-primary text-sm mb-3">Badges</h3>
              <div className="flex flex-wrap gap-2">
                {seller.verified && <Badge variant="cyan">✓ Profil vérifié</Badge>}
                {seller.rating >= 4.5 && <Badge variant="gold">⭐ Top vendeur</Badge>}
                {seller.reviewCount >= 20 && <Badge variant="neon">🏆 +20 ventes</Badge>}
                <Badge variant="purple">🎮 Gamer confirmé</Badge>
              </div>
            </div>
          </div>

          {/* Right: listings */}
          <div className="lg:col-span-2">
            <h2 className="font-heading font-semibold text-gaming-text-primary text-lg mb-5">
              Annonces de {seller.name.split(' ')[0]} ({listings.length})
            </h2>
            {listings.length === 0 ? (
              <div className="gaming-card p-10 text-center">
                <Package size={40} className="text-gaming-text-muted mx-auto mb-3 opacity-40"/>
                <p className="text-gaming-text-muted font-body">Aucune annonce pour le moment</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-5">
                {listings.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
