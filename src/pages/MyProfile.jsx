import { useNavigate, Link } from 'react-router-dom'
import { Plus, Heart, Package, Bell, LogOut, Zap, Star } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { PRODUCTS } from '../utils/mockData'

export default function MyProfile() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()

  if (!user) return (
    <div className="min-h-full flex items-center justify-center" style={{ background: '#0a0010' }}>
      <div style={{ textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: 48 }}>👤</div>
        <h2 style={{ color: '#fff', fontFamily: 'Rajdhani, sans-serif', fontSize: 22, fontWeight: 800, marginTop: 12 }}>
          Mon Profil
        </h2>
        <p style={{ color: '#6b6b8a', fontFamily: 'Inter, sans-serif', marginTop: 6, marginBottom: 20 }}>
          Connecte-toi pour accéder à ton profil
        </p>
        <button
          onClick={() => navigate('/connexion')}
          style={{
            background: '#8b00ff', color: '#fff', border: 'none',
            borderRadius: 12, padding: '12px 24px', fontWeight: 700, cursor: 'pointer',
            fontFamily: 'Space Grotesk, sans-serif', fontSize: 14,
            boxShadow: '0 0 20px rgba(139,0,255,0.4)',
          }}
        >
          Se connecter
        </button>
      </div>
    </div>
  )

  const myListings = PRODUCTS.slice(0, 2)
  const displayName = profile?.full_name || user.email?.split('@')[0] || 'Utilisateur'
  const username = profile?.username || user.email?.split('@')[0] || 'user'
  const location = profile?.location || 'Dakar'

  const MENU_ITEMS = [
    {
      icon: Plus,
      label: 'Ajouter une annonce',
      sub: profile?.is_premium ? 'Illimité' : '1 annonce gratuite',
      action: () => navigate('/vendre'),
    },
    {
      icon: Heart,
      label: 'Mes favoris',
      sub: '0 produit',
      action: () => {},
    },
    {
      icon: Package,
      label: 'Mes annonces',
      sub: `${myListings.length} annonce(s)`,
      action: () => navigate('/vendre'),
    },
    {
      icon: Bell,
      label: 'Notifications',
      sub: '3 nouvelles',
      action: () => {},
    },
    {
      icon: Star,
      label: 'Nos Partenaires',
      sub: 'PlayStation · Xbox · Nintendo · Razer',
      action: () => navigate('/partenaires'),
      gold: true,
    },
  ]

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-full" style={{ background: '#0a0010' }}>

      {/* ── Header gradient ── */}
      <div style={{
        background: 'linear-gradient(135deg, #2d0060 0%, #1a0038 60%, #120020 100%)',
        padding: '24px 20px 28px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -30, right: -30,
          width: 160, height: 160, borderRadius: '50%',
          background: 'rgba(139,0,255,0.15)', filter: 'blur(60px)',
        }} />

        {/* Avatar */}
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: 'rgba(139,0,255,0.2)',
          margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, fontWeight: 800, color: '#fff',
          fontFamily: 'Rajdhani, sans-serif',
          border: '3px solid rgba(139,0,255,0.5)',
          boxShadow: '0 0 30px rgba(139,0,255,0.3)',
          position: 'relative', zIndex: 1,
        }}>
          {displayName[0].toUpperCase()}
        </div>

        <h2 style={{ margin: '10px 0 2px', color: '#fff', fontFamily: 'Rajdhani, sans-serif', fontSize: 20, fontWeight: 800, position: 'relative', zIndex: 1 }}>
          {displayName}
        </h2>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.55)', fontSize: 12, fontFamily: 'Inter, sans-serif', position: 'relative', zIndex: 1 }}>
          @{username} · {location}
        </p>

        {profile?.is_premium && (
          <div style={{
            marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 4,
            background: 'rgba(255,215,0,0.15)', borderRadius: 20, padding: '3px 12px',
            border: '1px solid rgba(255,215,0,0.3)', position: 'relative', zIndex: 1,
          }}>
            <Zap size={12} style={{ color: '#ffd700' }} />
            <span style={{ color: '#ffd700', fontSize: 11, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>
              Abonné Premium
            </span>
          </div>
        )}
      </div>

      <div style={{ padding: '14px 14px 20px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
          {[['2', 'Annonces'], ['0', 'Favoris'], ['0', 'Ventes']].map(([val, label]) => (
            <div key={label} style={{
              background: '#1a0038', borderRadius: 12, padding: '12px 8px', textAlign: 'center',
              border: '1px solid rgba(139,0,255,0.2)', boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
            }}>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: '#8b00ff', fontFamily: 'Rajdhani, sans-serif' }}>
                {val}
              </p>
              <p style={{ margin: 0, fontSize: 11, color: '#6b6b8a', fontFamily: 'Inter, sans-serif' }}>
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* Premium card (if not premium) */}
        {!profile?.is_premium && (
          <div style={{
            background: 'linear-gradient(135deg, #2d0060, #1a0038)',
            border: '1px solid rgba(255,215,0,0.3)',
            borderRadius: 14, padding: '16px', marginBottom: 12,
            boxShadow: '0 0 30px rgba(139,0,255,0.15)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Zap size={16} style={{ color: '#ffd700' }} />
              <span style={{ fontWeight: 800, fontSize: 15, fontFamily: 'Rajdhani, sans-serif', color: '#fff' }}>
                Devenir Vendeur Premium
              </span>
            </div>
            <p style={{ margin: '0 0 12px', fontSize: 12, color: 'rgba(255,255,255,0.65)', fontFamily: 'Inter, sans-serif' }}>
              Publiez des annonces illimitées, badge Premium et mise en avant.
            </p>
            <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
              {['✓ Annonces illimitées', '✓ Badge Premium', '✓ Mise en avant'].map(t => (
                <span key={t} style={{
                  background: 'rgba(139,0,255,0.2)', borderRadius: 20, padding: '3px 8px',
                  fontSize: 10, fontWeight: 600, color: '#aa33ff', border: '1px solid rgba(139,0,255,0.3)',
                  fontFamily: 'Space Grotesk, sans-serif',
                }}>{t}</span>
              ))}
            </div>
            <Link
              to="/abonnement"
              style={{
                display: 'block', width: '100%',
                background: 'linear-gradient(135deg, #8b00ff, #ff00c8)',
                color: '#fff', border: 'none', borderRadius: 10, padding: '10px 0',
                fontWeight: 800, fontSize: 14, cursor: 'pointer',
                fontFamily: 'Rajdhani, sans-serif', textAlign: 'center', textDecoration: 'none',
                boxShadow: '0 0 20px rgba(139,0,255,0.4)',
              }}
            >
              S'abonner — 6 000 FCFA
            </Link>
          </div>
        )}

        {/* Menu items */}
        {MENU_ITEMS.map(item => (
          <button
            key={item.label}
            onClick={item.action}
            style={{
              background: '#1a0038', borderRadius: 12, padding: '13px 14px', marginBottom: 8,
              display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
              width: '100%', textAlign: 'left',
              border: item.gold ? '1px solid rgba(255,215,0,0.2)' : '1px solid rgba(139,0,255,0.2)',
              boxShadow: '0 1px 8px rgba(0,0,0,0.4)', transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = item.gold ? 'rgba(255,215,0,0.5)' : 'rgba(139,0,255,0.5)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = item.gold ? 'rgba(255,215,0,0.2)' : 'rgba(139,0,255,0.2)'}
          >
            <div style={{
              width: 36, height: 36,
              background: item.gold ? 'rgba(255,215,0,0.1)' : 'rgba(139,0,255,0.15)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: item.gold ? '#ffd700' : '#8b00ff',
              border: item.gold ? '1px solid rgba(255,215,0,0.3)' : '1px solid rgba(139,0,255,0.3)',
            }}>
              <item.icon size={17} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, fontFamily: 'Rajdhani, sans-serif', color: '#fff' }}>
                {item.label}
              </p>
              <p style={{ margin: 0, fontSize: 11, color: '#6b6b8a', fontFamily: 'Inter, sans-serif' }}>
                {item.sub}
              </p>
            </div>
            <span style={{ color: '#6b6b8a', fontSize: 18 }}>›</span>
          </button>
        ))}

        {/* Sign out */}
        <button
          onClick={handleSignOut}
          style={{
            background: 'rgba(255,51,85,0.08)', borderRadius: 12, padding: '13px 14px', marginTop: 4,
            display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
            width: '100%', textAlign: 'left', border: '1px solid rgba(255,51,85,0.2)',
            color: '#ff3355', boxShadow: '0 1px 8px rgba(0,0,0,0.4)',
          }}
        >
          <div style={{
            width: 36, height: 36, background: 'rgba(255,51,85,0.1)',
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <LogOut size={17} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 14, fontFamily: 'Rajdhani, sans-serif' }}>
            Se déconnecter
          </span>
        </button>
      </div>
    </div>
  )
}
