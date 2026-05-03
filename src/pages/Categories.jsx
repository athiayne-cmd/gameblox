import { useNavigate } from 'react-router-dom'
import { CATEGORIES, PRODUCTS } from '../utils/mockData'

export default function Categories() {
  const navigate = useNavigate()

  return (
    <div className="min-h-full" style={{ background: '#0a0010' }}>

      {/* Header */}
      <div style={{
        padding: '16px 14px 12px',
        background: '#120020',
        borderBottom: '1px solid rgba(139,0,255,0.2)',
        position: 'sticky', top: 0, zIndex: 10,
      }}>
        <h2 style={{ margin: 0, fontFamily: 'Rajdhani, sans-serif', fontSize: 20, fontWeight: 800, color: '#fff' }}>
          Catégories
        </h2>
      </div>

      {/* Grid */}
      <div style={{ padding: '14px 14px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {CATEGORIES.map(c => {
          const count = PRODUCTS.filter(p => p.category === c.id).length

          return (
            <button
              key={c.id}
              onClick={() => navigate(`/marketplace?categorie=${c.id}`)}
              style={{
                background: '#1a0038', borderRadius: 14, padding: '18px 14px',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                cursor: 'pointer', border: '1px solid rgba(139,0,255,0.2)', textAlign: 'center',
                boxShadow: '0 2px 16px rgba(0,0,0,0.5)', transition: 'transform 0.12s, border-color 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.borderColor = '#8b00ff' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = 'rgba(139,0,255,0.2)' }}
            >
              <div style={{
                width: 56, height: 56,
                background: 'rgba(139,0,255,0.1)',
                border: '1px solid rgba(139,0,255,0.3)',
                borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28,
              }}>
                {c.icon}
              </div>
              <p style={{ margin: 0, fontWeight: 800, fontSize: 14, fontFamily: 'Rajdhani, sans-serif', color: '#fff' }}>
                {c.name}
              </p>
              <p style={{ margin: 0, fontSize: 11, color: '#6b6b8a', fontFamily: 'Inter, sans-serif' }}>
                {c.count || count} annonce(s)
              </p>
            </button>
          )
        })}
      </div>
    </div>
  )
}
