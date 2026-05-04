import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Search, ChevronRight } from 'lucide-react'
import ProductCard from '../components/ui/ProductCard'
import Stories from '../components/ui/Stories'
import SponsorBanner from '../components/ui/SponsorBanner'
import { PRODUCTS, CATEGORIES } from '../utils/mockData'
import { supabase } from '../lib/supabase'

const MOCK_THRESHOLD = 10

export default function Home() {
  const navigate = useNavigate()
  const location = useLocation()
  const [activeCategory, setActiveCategory] = useState('')
  const [realProducts, setRealProducts] = useState([])
  const [loadingReal, setLoadingReal] = useState(true)

  const fetchProducts = useCallback(() => {
    setLoadingReal(true)
    supabase
      .from('products')
      .select('*, profiles(full_name, username, location)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(40)
      .then(({ data }) => {
        setRealProducts((data || []).map(p => ({
          ...p,
          seller: { name: p.profiles?.full_name || p.profiles?.username || 'Vendeur', id: p.seller_id },
        })))
        setLoadingReal(false)
      })
      .catch(() => setLoadingReal(false))
  }, [])

  useEffect(() => { fetchProducts() }, [location.key, fetchProducts])

  const combined = realProducts.length >= MOCK_THRESHOLD
    ? realProducts
    : [...realProducts, ...PRODUCTS.filter(m => !realProducts.some(r => r.slug === m.slug))]

  const filtered = activeCategory
    ? combined.filter(p => p.category === activeCategory)
    : combined

  return (
    <div className="min-h-full" style={{ background: '#0a0010' }}>

      {/* ── Hero Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #2d0060 0%, #1a0038 50%, #0a0010 100%)',
        padding: '20px 16px 22px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Orbes de fond */}
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 180, height: 180, borderRadius: '50%',
          background: 'rgba(139,0,255,0.15)', filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute', bottom: -20, left: 40,
          width: 120, height: 120, borderRadius: '50%',
          background: 'rgba(255,0,200,0.1)', filter: 'blur(50px)',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ margin: 0, fontSize: 11, color: 'rgba(170,51,255,0.9)', letterSpacing: 2, textTransform: 'uppercase', fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600 }}>
            Marketplace N°1 · Sénégal
          </p>
          <h1 style={{ margin: '4px 0 6px', fontSize: 28, fontWeight: 900, fontFamily: 'Rajdhani, sans-serif', letterSpacing: 1, color: '#fff', lineHeight: 1.1 }}>
            GAMEBLOX 🎮
          </h1>
          <p style={{ margin: 0, fontSize: 13, color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter, sans-serif' }}>
            Achète, vends et échange consoles &amp; jeux
          </p>

          {/* Search bar */}
          <div
            onClick={() => navigate('/marketplace')}
            style={{
              marginTop: 14, background: 'rgba(255,255,255,0.08)',
              borderRadius: 12, padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: 8,
              border: '1px solid rgba(139,0,255,0.3)', cursor: 'pointer',
            }}
          >
            <Search size={15} style={{ color: 'rgba(170,51,255,0.8)', flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', fontFamily: 'Inter, sans-serif' }}>
              PS5, Xbox, manettes, jeux...
            </span>
          </div>
        </div>
      </div>

      {/* ── Sponsor Banner ── */}
      <SponsorBanner />

      {/* ── Stories ── */}
      <Stories />

      {/* ── Category pills ── */}
      <div style={{
        padding: '14px 0 6px',
        overflowX: 'auto',
        display: 'flex',
        gap: 8,
        paddingLeft: 14,
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}>
        <button
          onClick={() => setActiveCategory('')}
          style={{
            background: !activeCategory ? '#8b00ff' : 'rgba(139,0,255,0.1)',
            border: `1px solid ${!activeCategory ? '#8b00ff' : 'rgba(139,0,255,0.3)'}`,
            borderRadius: 20, padding: '6px 12px',
            fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', cursor: 'pointer',
            color: !activeCategory ? '#fff' : '#aa33ff', flexShrink: 0,
            fontFamily: 'Space Grotesk, sans-serif',
          }}
        >
          Tout
        </button>
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id === activeCategory ? '' : c.id)}
            style={{
              background: activeCategory === c.id ? '#8b00ff' : 'rgba(139,0,255,0.1)',
              border: `1px solid ${activeCategory === c.id ? '#8b00ff' : 'rgba(139,0,255,0.3)'}`,
              borderRadius: 20, padding: '6px 12px',
              fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', cursor: 'pointer',
              color: activeCategory === c.id ? '#fff' : '#aa33ff', flexShrink: 0,
              display: 'flex', alignItems: 'center', gap: 5,
              fontFamily: 'Space Grotesk, sans-serif',
            }}
          >
            {c.icon} {c.name}
          </button>
        ))}
        <div style={{ width: 8, flexShrink: 0 }} />
      </div>

      {/* ── Section header ── */}
      <div style={{
        padding: '12px 14px 8px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <p style={{ margin: 0, fontWeight: 800, fontSize: 15, fontFamily: 'Rajdhani, sans-serif', color: '#fff' }}>
          {activeCategory ? CATEGORIES.find(c => c.id === activeCategory)?.name : 'Annonces récentes'}
        </p>
        <Link
          to="/marketplace"
          style={{ fontSize: 12, color: '#aa33ff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 2, textDecoration: 'none' }}
        >
          Tout voir <ChevronRight size={14} />
        </Link>
      </div>

      {/* ── Product Grid 2 columns ── */}
      {loadingReal ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid #8b00ff', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <p style={{ fontSize: 40 }}>🎮</p>
          <p style={{ color: '#6b6b8a', marginTop: 8, fontFamily: 'Inter, sans-serif' }}>
            Aucune annonce dans cette catégorie
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '0 12px 20px' }}>
          {filtered.slice(0, 12).map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
