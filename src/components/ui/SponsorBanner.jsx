import { Link } from 'react-router-dom'
import { SPONSORS } from '../../utils/mockData'

/* Logos SVG inline pour chaque marque */
function Logo({ id, size = 28 }) {
  if (id === 'playstation') return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="6" fill="#003087"/>
      <text x="14" y="20" textAnchor="middle" fill="white" fontSize="13" fontWeight="900" fontFamily="Arial, sans-serif">PS</text>
    </svg>
  )
  if (id === 'xbox') return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <circle cx="14" cy="14" r="14" fill="#107c10"/>
      <text x="14" y="20" textAnchor="middle" fill="white" fontSize="16" fontWeight="900" fontFamily="Arial, sans-serif">X</text>
    </svg>
  )
  if (id === 'nintendo') return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="14" fill="#e53935"/>
      <text x="14" y="20" textAnchor="middle" fill="white" fontSize="16" fontWeight="900" fontFamily="Arial, sans-serif">N</text>
    </svg>
  )
  if (id === 'razer') return (
    <svg width={size} height={size} viewBox="0 0 28 28" fill="none">
      <rect width="28" height="28" rx="6" fill="#111"/>
      <text x="14" y="20" textAnchor="middle" fill="#44d62c" fontSize="13" fontWeight="900" fontFamily="Arial, sans-serif">Rz</text>
    </svg>
  )
  return null
}

export { Logo as SponsorLogo }

export default function SponsorBanner() {
  const items = [...SPONSORS, ...SPONSORS]

  return (
    <div style={{
      background: 'linear-gradient(90deg, #0a0010 0%, #1a0a00 30%, #0a0a00 70%, #0a0010 100%)',
      borderTop: '1px solid rgba(255,215,0,0.2)',
      borderBottom: '1px solid rgba(255,215,0,0.2)',
      overflow: 'hidden',
      position: 'relative',
      padding: '10px 0',
    }}>
      {/* Titre fixe */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: 110, zIndex: 10,
        background: 'linear-gradient(90deg, #0a0010 70%, transparent)',
        display: 'flex', alignItems: 'center', paddingLeft: 12,
      }}>
        <Link to="/partenaires" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: '#ffd700', textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'Space Grotesk, sans-serif' }}>
              Partenaires
            </span>
            <span style={{ fontSize: 8, color: 'rgba(255,215,0,0.5)', fontFamily: 'Inter, sans-serif' }}>
              Officiels ›
            </span>
          </div>
        </Link>
      </div>

      {/* Fade droite */}
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0,
        width: 40, zIndex: 10,
        background: 'linear-gradient(270deg, #0a0010 50%, transparent)',
        pointerEvents: 'none',
      }} />

      {/* Défilement */}
      <div style={{
        display: 'flex', gap: 28, paddingLeft: 120,
        animation: 'marquee 18s linear infinite',
        whiteSpace: 'nowrap',
      }}>
        {items.map((sp, i) => (
          <Link
            key={`${sp.id}-${i}`}
            to="/partenaires"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}
          >
            <Logo id={sp.id} size={24} />
            <div>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#fff', fontFamily: 'Rajdhani, sans-serif' }}>
                {sp.name}
              </span>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 3, marginLeft: 6,
                background: 'linear-gradient(90deg, rgba(255,215,0,0.15), rgba(255,140,0,0.1))',
                border: '1px solid rgba(255,215,0,0.35)', borderRadius: 20,
                padding: '1px 6px',
              }}>
                <span style={{ fontSize: 8, color: '#ffd700', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>
                  ★ PARTENAIRE OFFICIEL
                </span>
              </div>
            </div>
            <span style={{ color: 'rgba(255,215,0,0.2)', marginLeft: 8 }}>|</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
