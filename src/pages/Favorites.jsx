import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Heart } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import ProductCard from '../components/ui/ProductCard'

export default function Favorites() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) { navigate('/connexion'); return }
    fetchFavorites()
  }, [user])

  async function fetchFavorites() {
    setLoading(true)
    try {
      const { data } = await supabase
        .from('wishlist')
        .select('product_id, products(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      setFavorites((data || []).map(w => w.products).filter(Boolean))
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100%', background: '#0a0010', paddingBottom: 90 }}>

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
          Mes favoris
        </span>
        {favorites.length > 0 && (
          <span style={{
            marginLeft: 'auto', background: 'rgba(139,0,255,0.2)',
            border: '1px solid rgba(139,0,255,0.3)', borderRadius: 20,
            padding: '2px 10px', fontSize: 12, fontWeight: 700,
            color: '#aa33ff', fontFamily: 'Space Grotesk, sans-serif',
          }}>
            {favorites.length}
          </span>
        )}
      </div>

      <div style={{ padding: '14px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              border: '2px solid #8b00ff', borderTopColor: 'transparent',
              animation: 'spin 0.8s linear infinite', margin: '0 auto',
            }} />
          </div>
        ) : favorites.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'rgba(255,51,85,0.1)', border: '1px solid rgba(255,51,85,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto',
            }}>
              <Heart size={30} style={{ color: '#ff3355' }} />
            </div>
            <p style={{ color: '#fff', fontFamily: 'Rajdhani, sans-serif', fontSize: 20, fontWeight: 800, marginTop: 16, marginBottom: 4 }}>
              Aucun favori
            </p>
            <p style={{ color: '#6b6b8a', fontFamily: 'Inter, sans-serif', fontSize: 13, marginBottom: 24 }}>
              Ajoute des produits en cliquant sur le cœur
            </p>
            <button
              onClick={() => navigate('/marketplace')}
              style={{
                background: 'linear-gradient(135deg, #8b00ff, #ff00c8)',
                color: '#fff', border: 'none', borderRadius: 12,
                padding: '12px 28px', fontWeight: 700, cursor: 'pointer',
                fontFamily: 'Space Grotesk, sans-serif', fontSize: 14,
                boxShadow: '0 0 20px rgba(139,0,255,0.4)',
              }}
            >
              Explorer le marketplace
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {favorites.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  )
}
