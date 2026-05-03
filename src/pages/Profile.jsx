import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Star, MessageCircle, CheckCircle, Package } from 'lucide-react'
import { PRODUCTS, SELLERS } from '../utils/mockData'
import ProductCard from '../components/ui/ProductCard'

export default function Profile() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const seller     = SELLERS.find(s => s.id === id) || SELLERS[0]
  const listings   = PRODUCTS.filter(p => p.seller.id === seller.id)

  return (
    <div className="min-h-full" style={{ background: '#0a0010' }}>

      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
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
        <span style={{ fontWeight: 700, fontSize: 16, fontFamily: 'Rajdhani, sans-serif', color: '#fff' }}>
          Profil vendeur
        </span>
      </div>

      {/* Profile header */}
      <div style={{
        background: 'linear-gradient(135deg, #2d0060 0%, #1a0038 60%, #120020 100%)',
        padding: '24px 20px 28px', textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -30, right: -30,
          width: 160, height: 160, borderRadius: '50%',
          background: 'rgba(139,0,255,0.15)', filter: 'blur(60px)',
        }} />

        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'linear-gradient(135deg, #8b00ff, #ff00c8)',
          margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, fontWeight: 800, color: '#fff',
          fontFamily: 'Rajdhani, sans-serif',
          border: '3px solid rgba(139,0,255,0.5)',
          boxShadow: '0 0 30px rgba(139,0,255,0.3)',
          position: 'relative', zIndex: 1,
        }}>
          {seller.name[0]}
        </div>

        <h2 style={{ margin: '10px 0 2px', color: '#fff', fontFamily: 'Rajdhani, sans-serif', fontSize: 20, fontWeight: 800, position: 'relative', zIndex: 1 }}>
          {seller.name}
        </h2>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.55)', fontSize: 12, fontFamily: 'Inter, sans-serif', position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <MapPin size={12} style={{ color: '#8b00ff' }} /> {seller.location}
        </p>

        {seller.verified && (
          <div style={{
            marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 4,
            background: 'rgba(0,255,136,0.1)', borderRadius: 20, padding: '3px 12px',
            border: '1px solid rgba(0,255,136,0.25)', position: 'relative', zIndex: 1,
          }}>
            <CheckCircle size={12} style={{ color: '#00ff88' }} />
            <span style={{ color: '#00ff88', fontSize: 11, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>
              Vendeur vérifié
            </span>
          </div>
        )}
      </div>

      <div style={{ padding: '14px 14px 20px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
          {[
            [listings.length, 'Annonces'],
            [`${seller.rating}★`, 'Note'],
            [seller.reviewCount, 'Avis'],
          ].map(([val, label]) => (
            <div key={label} style={{
              background: '#1a0038', borderRadius: 12, padding: '12px 8px', textAlign: 'center',
              border: '1px solid rgba(139,0,255,0.2)',
            }}>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: '#aa33ff', fontFamily: 'Rajdhani, sans-serif' }}>
                {val}
              </p>
              <p style={{ margin: 0, fontSize: 11, color: '#6b6b8a', fontFamily: 'Inter, sans-serif' }}>
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Stars detail */}
        <div style={{ background: '#1a0038', borderRadius: 12, padding: '14px', marginBottom: 12, border: '1px solid rgba(139,0,255,0.2)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', gap: 2 }}>
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={16} style={{ fill: s <= Math.floor(seller.rating) ? '#ffd700' : '#2d0060', color: s <= Math.floor(seller.rating) ? '#ffd700' : '#2d0060' }} />
              ))}
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: '#6b6b8a', fontFamily: 'Inter, sans-serif' }}>
              {seller.rating}/5 basé sur {seller.reviewCount} avis
            </p>
          </div>
          <button
            onClick={() => {}}
            style={{
              marginLeft: 'auto', background: '#8b00ff', color: '#fff', border: 'none',
              borderRadius: 20, padding: '8px 14px', cursor: 'pointer',
              fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5,
              fontFamily: 'Space Grotesk, sans-serif', boxShadow: '0 0 15px rgba(139,0,255,0.3)',
            }}
          >
            <MessageCircle size={14} /> Contacter
          </button>
        </div>

        {/* Listings */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <p style={{ margin: 0, fontWeight: 800, fontSize: 15, fontFamily: 'Rajdhani, sans-serif', color: '#fff' }}>
            Annonces ({listings.length})
          </p>
        </div>

        {listings.length === 0 ? (
          <div style={{ background: '#1a0038', borderRadius: 12, padding: '40px 20px', textAlign: 'center', border: '1px solid rgba(139,0,255,0.2)' }}>
            <Package size={40} style={{ color: '#6b6b8a', margin: '0 auto' }} />
            <p style={{ color: '#6b6b8a', marginTop: 10, fontFamily: 'Inter, sans-serif' }}>Aucune annonce</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            {listings.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
