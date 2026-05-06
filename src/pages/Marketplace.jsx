import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import ProductCard from '../components/ui/ProductCard'
import { PRODUCTS, CATEGORIES } from '../utils/mockData'
import { supabase } from '../lib/supabase'

const MOCK_THRESHOLD = 10

export default function Marketplace() {
  const [searchParams] = useSearchParams()
  const [query, setQuery] = useState(() => searchParams.get('q') || '')
  const [activeCategory, setActiveCategory] = useState(() => searchParams.get('categorie') || '')
  const [realProducts, setRealProducts] = useState([])
  const [loadingReal, setLoadingReal] = useState(true)

  // Sync depuis les params URL (navbar search ou clic catégorie)
  useEffect(() => {
    const q   = searchParams.get('q') || ''
    const cat = searchParams.get('categorie') || ''
    if (q)   setQuery(q)
    if (cat) setActiveCategory(cat)
  }, [searchParams])

  useEffect(() => {
    supabase
      .from('products')
      .select('*, profiles(full_name, username, location)')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(100)
      .then(({ data }) => {
        setRealProducts((data || []).map(p => ({
          ...p,
          seller: { name: p.profiles?.full_name || p.profiles?.username || 'Vendeur', id: p.seller_id },
        })))
        setLoadingReal(false)
      })
      .catch(() => setLoadingReal(false))
  }, [])

  const combined = realProducts.length >= MOCK_THRESHOLD
    ? realProducts
    : [...realProducts, ...PRODUCTS.filter(m => !realProducts.some(r => r.slug === m.slug))]

  const results = useMemo(() => {
    let list = [...combined]
    if (query.trim().length >= 2) {
      const q = query.toLowerCase()
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.categoryName?.toLowerCase().includes(q)
      )
    }
    if (activeCategory) {
      list = list.filter(p => p.category === activeCategory)
    }
    return list
  }, [query, activeCategory, combined])

  const showGrid = query.trim().length >= 2 || activeCategory
  const noResults = showGrid && results.length === 0

  return (
    <div className="min-h-full" style={{ background: '#0a0010' }}>

      {/* Header */}
      <div style={{
        padding: '16px 14px 12px',
        background: '#120020',
        borderBottom: '1px solid rgba(139,0,255,0.2)',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <h2 style={{ margin: '0 0 12px', fontFamily: 'Rajdhani, sans-serif', fontSize: 20, fontWeight: 800, color: '#fff' }}>
          Recherche
        </h2>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(139,0,255,0.08)', borderRadius: 12,
          padding: '10px 14px', border: '1px solid rgba(139,0,255,0.25)',
        }}>
          <Search size={16} style={{ color: '#8b00ff', flexShrink: 0 }} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="PS5, manette Xbox, FIFA..."
            style={{
              border: 'none', background: 'transparent', outline: 'none',
              flex: 1, fontSize: 14, color: '#fff', fontFamily: 'Inter, sans-serif',
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ background: 'none', border: 'none', color: '#6b6b8a', cursor: 'pointer', padding: 0, fontSize: 16 }}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Category grid (when no search) */}
      {!showGrid && (
        <div style={{ padding: '14px 14px 20px' }}>
          <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 700, color: '#6b6b8a', textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'Space Grotesk, sans-serif' }}>
            Catégories
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                style={{
                  background: '#1a0038', borderRadius: 12, padding: '12px 14px',
                  display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
                  border: '1px solid rgba(139,0,255,0.2)', textAlign: 'left',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#8b00ff'; e.currentTarget.style.background = '#220048' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(139,0,255,0.2)'; e.currentTarget.style.background = '#1a0038' }}
              >
                <span style={{ fontSize: 24 }}>{c.icon}</span>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14, fontFamily: 'Rajdhani, sans-serif', color: '#fff' }}>
                    {c.name}
                  </p>
                  <p style={{ margin: 0, fontSize: 11, color: '#6b6b8a', fontFamily: 'Inter, sans-serif' }}>
                    {c.count} annonces
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category filter pill (when category active) */}
      {activeCategory && (
        <div style={{ padding: '10px 14px 6px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            onClick={() => setActiveCategory('')}
            style={{
              background: '#8b00ff', borderRadius: 20, padding: '5px 12px',
              fontSize: 12, fontWeight: 700, color: '#fff', cursor: 'pointer',
              border: 'none', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Space Grotesk, sans-serif',
            }}
          >
            {CATEGORIES.find(c => c.id === activeCategory)?.name} ×
          </button>
          <span style={{ fontSize: 12, color: '#6b6b8a' }}>{results.length} résultat(s)</span>
        </div>
      )}

      {/* Results */}
      {loadingReal && showGrid ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid #8b00ff', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
        </div>
      ) : showGrid && !noResults && (
        <>
          {!activeCategory && (
            <div style={{ padding: '8px 14px 6px' }}>
              <span style={{ fontSize: 12, color: '#6b6b8a' }}>{results.length} résultat(s) pour &quot;{query}&quot;</span>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, padding: '4px 12px 20px' }}>
            {results.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}

      {noResults && (
        <div style={{ padding: '50px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 44 }}>🔍</div>
          <p style={{ marginTop: 10, color: '#6b6b8a', fontFamily: 'Inter, sans-serif', fontSize: 14 }}>
            Aucun résultat pour &ldquo;<strong style={{ color: '#aa33ff' }}>{query || CATEGORIES.find(c => c.id === activeCategory)?.name}</strong>&rdquo;
          </p>
        </div>
      )}
    </div>
  )
}
