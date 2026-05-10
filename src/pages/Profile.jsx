import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, MapPin, Star, MessageCircle, CheckCircle, Package } from 'lucide-react'
import { PRODUCTS, SELLERS } from '../utils/mockData'
import { safeImageUrl } from '../utils/formatters'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import ProductCard from '../components/ui/ProductCard'
import toast from 'react-hot-toast'

const isUUID = id => typeof id === 'string' && id.includes('-') && id.length === 36

export default function Profile() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const { user }     = useAuth()
  const [profile,   setProfile]   = useState(null)
  const [listings,  setListings]  = useState([])
  const [loading,   setLoading]   = useState(true)
  const [contacting, setContacting] = useState(false)

  const isMock = !isUUID(id)

  useEffect(() => {
    if (isMock) {
      // Vendeur mock
      const seller = SELLERS.find(s => s.id === id) || SELLERS[0]
      setProfile({ name: seller.name, location: seller.location, rating: seller.rating, reviewCount: seller.reviewCount, is_premium: seller.verified })
      setListings(PRODUCTS.filter(p => p.seller.id === seller.id))
      setLoading(false)
      return
    }

    // Vendeur réel
    Promise.all([
      supabase.from('profiles').select('*').eq('id', id).single(),
      supabase.from('products')
        .select('*, profiles(full_name, username, location)')
        .eq('seller_id', id)
        .eq('status', 'active')
        .order('created_at', { ascending: false }),
    ]).then(([{ data: prof }, { data: prods }]) => {
      setProfile(prof)
      setListings((prods || []).map(p => ({
        ...p,
        seller: { name: p.profiles?.full_name || p.profiles?.username || 'Vendeur', id: p.seller_id },
      })))
    }).finally(() => setLoading(false))
  }, [id])

  async function handleContact() {
    if (!user) { navigate('/connexion'); return }
    if (user.id === id) { toast.error('C\'est ton propre profil !'); return }

    // On cherche une conversation existante ou on en crée une sans produit spécifique
    // On prend le premier produit du vendeur s'il en a un
    setContacting(true)
    try {
      const firstProductId = listings.find(p => isUUID(p.id))?.id || null

      let convId = null
      if (firstProductId) {
        const { data: existing } = await supabase
          .from('conversations')
          .select('id')
          .eq('buyer_id', user.id)
          .eq('seller_id', id)
          .eq('product_id', firstProductId)
          .maybeSingle()
        convId = existing?.id
      }

      if (!convId) {
        const { data: created, error } = await supabase
          .from('conversations')
          .insert({
            product_id: firstProductId,
            buyer_id:   user.id,
            seller_id:  id,
            last_message: '',
            updated_at: new Date().toISOString(),
          })
          .select('id')
          .single()
        if (error) throw error
        convId = created.id
      }

      navigate('/messages', { state: { convId } })
    } catch {
      toast.error('Erreur lors de l\'ouverture du chat')
    } finally {
      setContacting(false)
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0010' }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', border: '3px solid #8b00ff', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  if (!profile) return (
    <div style={{ minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0010' }}>
      <div style={{ textAlign: 'center', padding: 40 }}>
        <p style={{ fontSize: 48 }}>👤</p>
        <h2 style={{ color: '#fff', fontFamily: 'Rajdhani, sans-serif', fontSize: 22, fontWeight: 800, marginTop: 12 }}>Profil introuvable</h2>
        <button onClick={() => navigate(-1)} style={{ marginTop: 16, background: '#8b00ff', color: '#fff', border: 'none', borderRadius: 12, padding: '12px 24px', fontWeight: 700, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif' }}>
          Retour
        </button>
      </div>
    </div>
  )

  const name       = profile.full_name || profile.name || profile.username || 'Vendeur'
  const location   = profile.location || 'Sénégal'
  const isPremium  = profile.is_premium || false
  const rating     = profile.rating ?? 4.5
  const reviewCount = profile.review_count ?? profile.reviewCount ?? 0

  return (
    <div className="min-h-full" style={{ background: '#0a0010' }}>

      {/* Header */}
      <div style={{ position: 'sticky', top: 0, zIndex: 10, background: '#120020', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '1px solid rgba(139,0,255,0.2)' }}>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8b00ff', padding: 0 }}>
          <ArrowLeft size={22} />
        </button>
        <span style={{ fontWeight: 700, fontSize: 16, fontFamily: 'Rajdhani, sans-serif', color: '#fff' }}>
          Profil vendeur
        </span>
      </div>

      {/* Profile hero */}
      <div style={{ background: 'linear-gradient(135deg, #2d0060 0%, #1a0038 60%, #120020 100%)', padding: '24px 20px 28px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(139,0,255,0.15)', filter: 'blur(60px)' }} />

        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: isPremium ? 'linear-gradient(135deg, rgba(255,215,0,0.3), rgba(255,140,0,0.2))' : 'linear-gradient(135deg, #8b00ff, #ff00c8)',
          margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: 'Rajdhani, sans-serif',
          border: isPremium ? '3px solid rgba(255,215,0,0.5)' : '3px solid rgba(139,0,255,0.5)',
          boxShadow: isPremium ? '0 0 30px rgba(255,215,0,0.25)' : '0 0 30px rgba(139,0,255,0.3)',
          position: 'relative', zIndex: 1, overflow: 'hidden',
        }}>
          {safeImageUrl(profile.avatar_url)
            ? <img src={safeImageUrl(profile.avatar_url)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : name[0].toUpperCase()}
        </div>

        <h2 style={{ margin: '10px 0 2px', color: '#fff', fontFamily: 'Rajdhani, sans-serif', fontSize: 20, fontWeight: 800, position: 'relative', zIndex: 1 }}>
          {name}
        </h2>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.55)', fontSize: 12, fontFamily: 'Inter, sans-serif', position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
          <MapPin size={12} style={{ color: '#8b00ff' }} /> {location}
        </p>

        {isPremium && (
          <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 4, background: 'rgba(255,215,0,0.1)', borderRadius: 20, padding: '3px 12px', border: '1px solid rgba(255,215,0,0.3)', position: 'relative', zIndex: 1 }}>
            <CheckCircle size={12} style={{ color: '#ffd700' }} />
            <span style={{ color: '#ffd700', fontSize: 11, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>Vendeur Premium</span>
          </div>
        )}
      </div>

      <div style={{ padding: '14px 14px 90px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
          {[
            [listings.length, 'Annonces'],
            [`${Number(rating).toFixed(1)}★`, 'Note'],
            [reviewCount, 'Avis'],
          ].map(([val, label]) => (
            <div key={label} style={{ background: '#1a0038', borderRadius: 12, padding: '12px 8px', textAlign: 'center', border: '1px solid rgba(139,0,255,0.2)' }}>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: '#aa33ff', fontFamily: 'Rajdhani, sans-serif' }}>{val}</p>
              <p style={{ margin: 0, fontSize: 11, color: '#6b6b8a', fontFamily: 'Inter, sans-serif' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Note + Contacter */}
        <div style={{ background: '#1a0038', borderRadius: 12, padding: '14px', marginBottom: 12, border: '1px solid rgba(139,0,255,0.2)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', gap: 2 }}>
              {[1,2,3,4,5].map(s => (
                <Star key={s} size={16} style={{ fill: s <= Math.floor(rating) ? '#ffd700' : '#2d0060', color: s <= Math.floor(rating) ? '#ffd700' : '#2d0060' }} />
              ))}
            </div>
            <p style={{ margin: '4px 0 0', fontSize: 12, color: '#6b6b8a', fontFamily: 'Inter, sans-serif' }}>
              {Number(rating).toFixed(1)}/5 · {reviewCount} avis
            </p>
          </div>
          {!isMock && user?.id !== id && (
            <button
              onClick={handleContact}
              disabled={contacting}
              style={{ marginLeft: 'auto', background: '#8b00ff', color: '#fff', border: 'none', borderRadius: 20, padding: '8px 14px', cursor: 'pointer', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5, fontFamily: 'Space Grotesk, sans-serif', boxShadow: '0 0 15px rgba(139,0,255,0.3)', opacity: contacting ? 0.7 : 1 }}
            >
              <MessageCircle size={14} /> {contacting ? '...' : 'Contacter'}
            </button>
          )}
        </div>

        {/* Annonces */}
        <p style={{ margin: '0 0 10px', fontWeight: 800, fontSize: 15, fontFamily: 'Rajdhani, sans-serif', color: '#fff' }}>
          Annonces ({listings.length})
        </p>

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
