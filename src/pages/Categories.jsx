import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES, PRODUCTS, CAT_STYLE } from '../utils/mockData'

function CatImage({ catId, icon }) {
  const [err, setErr] = useState(false)
  const image = CAT_STYLE[catId]?.image
  if (image && !err) return (
    <img
      src={image} alt={catId}
      onError={() => setErr(true)}
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  )
  return <span style={{ fontSize: 28 }}>{icon}</span>
}

export default function Categories() {
  const navigate = useNavigate()

  return (
    <div className="min-h-full" style={{ background: '#0a0010' }}>

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

      <div style={{ padding: '14px 14px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {CATEGORIES.map(c => {
          const count = PRODUCTS.filter(p => p.category === c.id).length
          return (
            <button
              key={c.id}
              onClick={() => navigate(`/marketplace?categorie=${c.id}`)}
              style={{
                background: '#1a0038', borderRadius: 14, overflow: 'hidden',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                cursor: 'pointer', border: '1px solid rgba(139,0,255,0.2)', textAlign: 'center',
                boxShadow: '0 2px 16px rgba(0,0,0,0.5)', transition: 'transform 0.12s, border-color 0.15s',
                padding: 0,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.borderColor = '#8b00ff' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = 'rgba(139,0,255,0.2)' }}
            >
              {/* Image pleine largeur */}
              <div style={{
                width: '100%', height: 100, overflow: 'hidden', position: 'relative',
                background: 'linear-gradient(135deg, #12002a, #1a0038)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <CatImage catId={c.id} icon={c.icon} />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to bottom, transparent 40%, rgba(10,0,16,0.7) 100%)',
                }} />
              </div>

              {/* Nom + count */}
              <div style={{ padding: '10px 12px 12px', width: '100%' }}>
                <p style={{ margin: 0, fontWeight: 800, fontSize: 13, fontFamily: 'Rajdhani, sans-serif', color: '#fff' }}>
                  {c.name}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: 11, color: '#6b6b8a', fontFamily: 'Inter, sans-serif' }}>
                  {c.count || count} annonce(s)
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
