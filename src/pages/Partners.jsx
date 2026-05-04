import { useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Star } from 'lucide-react'
import { SPONSORS, CATEGORIES, PRODUCTS } from '../utils/mockData'
import { SponsorLogo } from '../components/ui/SponsorBanner'
import ProductCard from '../components/ui/ProductCard'

export default function Partners() {
  const navigate = useNavigate()

  return (
    <div className="min-h-full" style={{ background: '#0a0010' }}>

      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: '#120020', padding: '12px 14px',
        display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '1px solid rgba(255,215,0,0.2)',
      }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ffd700', padding: 0 }}>
          <ArrowLeft size={22} />
        </button>
        <span style={{ fontWeight: 800, fontSize: 16, fontFamily: 'Rajdhani, sans-serif', color: '#fff' }}>
          Nos Partenaires Officiels
        </span>
      </div>

      {/* Hero banner partenaires */}
      <div style={{
        background: 'linear-gradient(135deg, #1a0a00 0%, #0a0a00 50%, #0a1a00 100%)',
        padding: '20px 14px 22px',
        borderBottom: '1px solid rgba(255,215,0,0.15)',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)', width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,215,0,0.06)', filter: 'blur(60px)' }} />
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)',
          borderRadius: 20, padding: '4px 12px', marginBottom: 10,
        }}>
          <Star size={11} style={{ color: '#ffd700', fill: '#ffd700' }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: '#ffd700', fontFamily: 'Space Grotesk, sans-serif', textTransform: 'uppercase', letterSpacing: 1 }}>
            Partenaires Officiels GameBlox
          </span>
        </div>
        <h2 style={{ margin: '0 0 6px', fontFamily: 'Rajdhani, sans-serif', fontSize: 22, fontWeight: 900, color: '#fff', position: 'relative' }}>
          Les grandes marques gaming
        </h2>
        <p style={{ margin: 0, fontSize: 12, color: '#6b6b8a', fontFamily: 'Inter, sans-serif' }}>
          Produits authentiques, vendeurs certifiés, support prioritaire
        </p>
      </div>

      <div style={{ padding: '16px 14px 20px' }}>

        {SPONSORS.map(sp => {
          const sponsoredProducts = PRODUCTS.filter(p => p.sponsored === sp.id)
          const relatedCategories = CATEGORIES.filter(c => sp.categories.includes(c.id))

          return (
            <div key={sp.id} style={{ marginBottom: 24 }}>

              {/* Sponsor card */}
              <div style={{
                background: `linear-gradient(135deg, ${sp.bgColor}, rgba(10,0,16,0.8))`,
                border: `1px solid ${sp.color}33`,
                borderRadius: 16, padding: '16px 14px', marginBottom: 12,
                boxShadow: `0 0 30px ${sp.color}15`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <SponsorLogo id={sp.id} size={48} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                      <h3 style={{ margin: 0, fontFamily: 'Rajdhani, sans-serif', fontSize: 20, fontWeight: 900, color: '#fff' }}>
                        {sp.name}
                      </h3>
                      <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        background: 'linear-gradient(90deg, rgba(255,215,0,0.15), rgba(255,140,0,0.1))',
                        border: '1px solid rgba(255,215,0,0.4)', borderRadius: 20,
                        padding: '2px 8px',
                      }}>
                        <Star size={9} style={{ color: '#ffd700', fill: '#ffd700' }} />
                        <span style={{ fontSize: 9, color: '#ffd700', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>
                          PARTENAIRE OFFICIEL
                        </span>
                      </div>
                    </div>
                    <p style={{ margin: '3px 0 0', fontSize: 12, color: '#6b6b8a', fontFamily: 'Inter, sans-serif', fontStyle: 'italic' }}>
                      "{sp.slogan}"
                    </p>
                  </div>
                </div>

                {/* Catégories couvertes */}
                <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
                  {relatedCategories.map(c => (
                    <Link
                      key={c.id}
                      to={`/marketplace?categorie=${c.id}`}
                      style={{
                        background: `${sp.color}20`, border: `1px solid ${sp.color}40`,
                        borderRadius: 20, padding: '3px 10px',
                        fontSize: 11, fontWeight: 600, color: sp.accentColor,
                        fontFamily: 'Space Grotesk, sans-serif', textDecoration: 'none',
                        display: 'flex', alignItems: 'center', gap: 4,
                      }}
                    >
                      {c.icon} {c.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Produits sponsorisés */}
              {sponsoredProducts.length > 0 && (
                <>
                  <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 700, color: '#ffd700', fontFamily: 'Space Grotesk, sans-serif', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Star size={11} style={{ fill: '#ffd700', color: '#ffd700' }} />
                    Annonces sponsorisées
                  </p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    {sponsoredProducts.map(p => <ProductCard key={p.id} product={p} />)}
                  </div>
                </>
              )}
            </div>
          )
        })}

        {/* CTA devenir partenaire */}
        <div style={{
          background: 'linear-gradient(135deg, #1a0038, #0a0010)',
          border: '1px solid rgba(255,215,0,0.25)', borderRadius: 14,
          padding: '20px', textAlign: 'center',
          boxShadow: '0 0 30px rgba(255,215,0,0.05)',
        }}>
          <Star size={24} style={{ color: '#ffd700', fill: '#ffd700', margin: '0 auto 10px' }} />
          <h3 style={{ margin: '0 0 6px', fontFamily: 'Rajdhani, sans-serif', fontSize: 18, fontWeight: 800, color: '#fff' }}>
            Devenir Partenaire
          </h3>
          <p style={{ margin: '0 0 14px', fontSize: 12, color: '#6b6b8a', fontFamily: 'Inter, sans-serif' }}>
            Tu vends des produits gaming en gros ? Contacte-nous pour un partenariat officiel.
          </p>
          <a
            href="mailto:partenaires@gameblox.sn"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(90deg, rgba(255,215,0,0.15), rgba(255,140,0,0.1))',
              border: '1px solid rgba(255,215,0,0.4)', borderRadius: 10,
              padding: '10px 20px', fontSize: 13, fontWeight: 700,
              color: '#ffd700', textDecoration: 'none', fontFamily: 'Rajdhani, sans-serif',
            }}
          >
            ✉ Nous contacter
          </a>
        </div>
      </div>
    </div>
  )
}
