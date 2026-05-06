import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Plus, Heart, Package, Bell, LogOut, Zap, Star, Edit2, Lock, ChevronRight, X, Camera, Save } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { formatPrice } from '../utils/formatters'
import toast from 'react-hot-toast'

const VILLES = ['Dakar','Thiès','Saint-Louis','Ziguinchor','Mbour','Kaolack','Touba','Diourbel','Rufisque','Louga','Tambacounda','Kolda']

/* ── Petit composant badge abonnement ── */
function SubscriptionBadge({ isPremium }) {
  if (isPremium) return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: 'linear-gradient(90deg, rgba(255,215,0,0.15), rgba(255,140,0,0.1))',
      border: '1px solid rgba(255,215,0,0.4)', borderRadius: 20,
      padding: '3px 10px',
    }}>
      <Star size={11} style={{ color: '#ffd700', fill: '#ffd700' }} />
      <span style={{ fontSize: 11, color: '#ffd700', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>
        PREMIUM ACTIF
      </span>
    </div>
  )
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: 'rgba(107,107,138,0.15)', border: '1px solid rgba(107,107,138,0.3)',
      borderRadius: 20, padding: '3px 10px',
    }}>
      <span style={{ fontSize: 11, color: '#6b6b8a', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>
        GRATUIT
      </span>
    </div>
  )
}

export default function MyProfile() {
  const { user, profile, signOut, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [myListings, setMyListings] = useState([])
  const [loadingListings, setLoadingListings] = useState(false)
  const [favCount, setFavCount] = useState(0)
  const [notifCount, setNotifCount] = useState(0)
  const [editOpen, setEditOpen] = useState(false)
  const [editForm, setEditForm] = useState({ full_name: '', phone: '', location: '' })
  const [editSaving, setEditSaving] = useState(false)
  const [newAvatar, setNewAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const avatarRef = useRef(null)

  function openEdit() {
    setEditForm({ full_name: profile?.full_name || '', phone: profile?.phone || '', location: profile?.location || '' })
    setNewAvatar(null)
    setAvatarPreview(null)
    setEditOpen(true)
  }

  function handleAvatarPick(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { toast.error('Image trop lourde (max 5 Mo)'); return }
    setNewAvatar(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  async function saveProfile(e) {
    e.preventDefault()
    setEditSaving(true)
    try {
      let avatar_url = profile?.avatar_url || null
      if (newAvatar) {
        const ext  = newAvatar.name.split('.').pop()
        const path = `${user.id}.${ext}`
        const { error: upErr } = await supabase.storage.from('avatars').upload(path, newAvatar, { upsert: true })
        if (!upErr) {
          const { data } = supabase.storage.from('avatars').getPublicUrl(path)
          avatar_url = data.publicUrl
        }
      }
      const { error } = await supabase.from('profiles').update({
        full_name:  editForm.full_name,
        phone:      editForm.phone,
        location:   editForm.location,
        avatar_url,
      }).eq('id', user.id)
      if (error) throw error
      await refreshProfile()
      toast.success('Profil mis à jour !')
      setEditOpen(false)
    } catch {
      toast.error('Erreur lors de la mise à jour')
    } finally {
      setEditSaving(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchMyListings()
      supabase.from('wishlist').select('id', { count: 'exact', head: true }).eq('user_id', user.id)
        .then(({ count }) => setFavCount(count || 0))
      supabase.from('notifications').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('read', false)
        .then(({ count }) => setNotifCount(count || 0))
    }
  }, [user])

  async function fetchMyListings() {
    setLoadingListings(true)
    try {
      const { data } = await supabase
        .from('products')
        .select('id, title, price, images')
        .eq('seller_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)
      setMyListings(data || [])
    } catch {
      // silent
    } finally {
      setLoadingListings(false)
    }
  }

  function handleEditBlocked() {
    toast.error('Modification réservée aux membres Premium')
    navigate('/abonnement')
  }

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

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'Utilisateur'
  const username    = profile?.username   || user.email?.split('@')[0] || 'user'
  const location    = profile?.location   || 'Dakar'
  const isPremium   = profile?.is_premium === true

  /* Date d'expiration simulée : 1 an après l'activation */
  const premiumUntil = profile?.premium_until
    ? new Date(profile.premium_until).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  const MENU_ITEMS = [
    { icon: Heart, label: 'Mes favoris',     sub: `${favCount} produit${favCount > 1 ? 's' : ''}`,       action: () => navigate('/favoris') },
    { icon: Bell,  label: 'Notifications',   sub: `${notifCount} nouvelle${notifCount > 1 ? 's' : ''}`,  action: () => navigate('/notifications'), badge: notifCount > 0 },
    { icon: Star,  label: 'Nos Partenaires', sub: 'PlayStation · Xbox · Nintendo · Razer',               action: () => navigate('/partenaires'), gold: true },
  ]

  return (
    <div className="min-h-full" style={{ background: '#0a0010' }}>

      {/* ── Header gradient ── */}
      <div style={{
        background: 'linear-gradient(135deg, #2d0060 0%, #1a0038 60%, #120020 100%)',
        padding: '24px 20px 28px', textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(139,0,255,0.15)', filter: 'blur(60px)' }} />

        {/* Avatar */}
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: isPremium ? 'linear-gradient(135deg, rgba(255,215,0,0.3), rgba(255,140,0,0.2))' : 'rgba(139,0,255,0.2)',
          margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 28, fontWeight: 800, color: '#fff', fontFamily: 'Rajdhani, sans-serif',
          border: isPremium ? '3px solid rgba(255,215,0,0.5)' : '3px solid rgba(139,0,255,0.5)',
          boxShadow: isPremium ? '0 0 30px rgba(255,215,0,0.25)' : '0 0 30px rgba(139,0,255,0.3)',
          position: 'relative', zIndex: 1,
        }}>
          {displayName[0].toUpperCase()}
          {isPremium && (
            <div style={{ position: 'absolute', bottom: -4, right: -4, width: 20, height: 20, background: '#ffd700', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Star size={11} style={{ fill: '#000', color: '#000' }} />
            </div>
          )}
        </div>

        <h2 style={{ margin: '12px 0 2px', color: '#fff', fontFamily: 'Rajdhani, sans-serif', fontSize: 20, fontWeight: 800, position: 'relative', zIndex: 1 }}>
          {displayName}
        </h2>
        <p style={{ margin: '0 0 10px', color: 'rgba(255,255,255,0.55)', fontSize: 12, fontFamily: 'Inter, sans-serif', position: 'relative', zIndex: 1 }}>
          @{username} · {location}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, position: 'relative', zIndex: 1 }}>
          <SubscriptionBadge isPremium={isPremium} />
          <button onClick={openEdit} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(139,0,255,0.15)', border: '1px solid rgba(139,0,255,0.3)', borderRadius: 20, padding: '3px 10px', cursor: 'pointer', color: '#aa33ff', fontSize: 11, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>
            <Edit2 size={10} /> Modifier
          </button>
        </div>
      </div>

      <div style={{ padding: '14px 14px 24px' }}>

        {/* ── Stats ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 14 }}>
          {[[myListings.length || '0', 'Annonces'], [favCount, 'Favoris'], ['0', 'Ventes']].map(([val, label]) => (
            <div key={label} style={{
              background: '#1a0038', borderRadius: 12, padding: '12px 8px', textAlign: 'center',
              border: '1px solid rgba(139,0,255,0.2)',
            }}>
              <p style={{ margin: 0, fontSize: 20, fontWeight: 900, color: '#8b00ff', fontFamily: 'Rajdhani, sans-serif' }}>{val}</p>
              <p style={{ margin: 0, fontSize: 11, color: '#6b6b8a', fontFamily: 'Inter, sans-serif' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* ── MON ABONNEMENT ── */}
        <div style={{
          borderRadius: 14, padding: '14px', marginBottom: 14,
          background: isPremium
            ? 'linear-gradient(135deg, rgba(255,215,0,0.08), rgba(10,0,16,0.9))'
            : 'linear-gradient(135deg, #1a0038, #120020)',
          border: isPremium ? '1px solid rgba(255,215,0,0.3)' : '1px solid rgba(107,107,138,0.25)',
          boxShadow: isPremium ? '0 0 20px rgba(255,215,0,0.08)' : 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#6b6b8a', textTransform: 'uppercase', letterSpacing: 1, fontFamily: 'Space Grotesk, sans-serif' }}>
              Mon abonnement
            </p>
            <SubscriptionBadge isPremium={isPremium} />
          </div>

          {isPremium ? (
            /* ── Premium actif ── */
            <div>
              <p style={{ margin: '0 0 4px', fontSize: 16, fontWeight: 800, color: '#ffd700', fontFamily: 'Rajdhani, sans-serif', display: 'flex', alignItems: 'center', gap: 6 }}>
                <Star size={16} style={{ fill: '#ffd700', color: '#ffd700' }} /> Annonces illimitées
              </p>
              {premiumUntil && (
                <p style={{ margin: '0 0 12px', fontSize: 12, color: '#6b6b8a', fontFamily: 'Inter, sans-serif' }}>
                  Expire le {premiumUntil}
                </p>
              )}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                {['✓ Annonces illimitées', '✓ Modification', '✓ Badge Premium', '✓ Mise en avant'].map(t => (
                  <span key={t} style={{ background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.25)', borderRadius: 20, padding: '2px 8px', fontSize: 10, fontWeight: 600, color: '#ffd700', fontFamily: 'Space Grotesk, sans-serif' }}>{t}</span>
                ))}
              </div>
              {/* Bouton Renouveler - toujours visible */}
              <Link to="/abonnement" style={{
                display: 'block', textAlign: 'center', padding: '9px 0',
                background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)',
                borderRadius: 10, color: '#ffd700', fontWeight: 700, fontSize: 13,
                textDecoration: 'none', fontFamily: 'Rajdhani, sans-serif',
              }}>
                ↺ Renouveler — 6 000 FCFA
              </Link>
            </div>
          ) : (
            /* ── Plan gratuit ── */
            <div>
              <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 700, color: '#fff', fontFamily: 'Rajdhani, sans-serif' }}>
                Plan Gratuit
              </p>
              <p style={{ margin: '0 0 12px', fontSize: 12, color: '#6b6b8a', fontFamily: 'Inter, sans-serif' }}>
                1 annonce active · Sans modification · Sans mise en avant
              </p>
              {/* Bouton Passer Premium - toujours visible */}
              <Link to="/abonnement" style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '11px 0',
                background: 'linear-gradient(135deg, #8b00ff, #ff00c8)',
                borderRadius: 10, color: '#fff', fontWeight: 800, fontSize: 14,
                textDecoration: 'none', fontFamily: 'Rajdhani, sans-serif',
                boxShadow: '0 0 20px rgba(139,0,255,0.35)',
              }}>
                <Zap size={15} /> Passer Premium — 6 000 FCFA
              </Link>
            </div>
          )}
        </div>

        {/* ── MES ANNONCES ── */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: 'Rajdhani, sans-serif' }}>
              Mes annonces
            </p>
            <button
              onClick={() => navigate('/vendre')}
              style={{ background: '#8b00ff', color: '#fff', border: 'none', borderRadius: 8, padding: '5px 10px', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontFamily: 'Space Grotesk, sans-serif' }}
            >
              <Plus size={12} /> Publier
            </button>
          </div>

          {loadingListings ? (
            <div style={{ background: '#1a0038', borderRadius: 12, padding: '20px', textAlign: 'center', border: '1px solid rgba(139,0,255,0.2)' }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #8b00ff', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
            </div>
          ) : myListings.length === 0 ? (
            <div style={{ background: '#1a0038', borderRadius: 12, padding: '16px', textAlign: 'center', border: '1px solid rgba(139,0,255,0.2)' }}>
              <p style={{ margin: 0, fontSize: 12, color: '#6b6b8a', fontFamily: 'Inter, sans-serif' }}>
                Aucune annonce publiée
              </p>
            </div>
          ) : (
            myListings.map(listing => (
              <div key={listing.id} style={{
                background: '#1a0038', borderRadius: 12, padding: '11px 12px', marginBottom: 6,
                display: 'flex', alignItems: 'center', gap: 10,
                border: '1px solid rgba(139,0,255,0.2)',
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: '#120020', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, overflow: 'hidden' }}>
                  {listing.images?.[0] ? (
                    <img src={listing.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : '🎮'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: '#fff', fontFamily: 'Rajdhani, sans-serif', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {listing.title}
                  </p>
                  <p style={{ margin: 0, fontSize: 11, color: '#8b00ff', fontFamily: 'Space Mono, monospace', fontWeight: 700 }}>
                    {formatPrice(listing.price)}
                  </p>
                </div>
                {/* Bouton modifier — bloqué si pas premium */}
                <button
                  onClick={isPremium ? () => {} : handleEditBlocked}
                  style={{
                    background: isPremium ? 'rgba(139,0,255,0.15)' : 'rgba(107,107,138,0.1)',
                    border: isPremium ? '1px solid rgba(139,0,255,0.3)' : '1px solid rgba(107,107,138,0.2)',
                    borderRadius: 8, padding: '6px 8px', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 4,
                    color: isPremium ? '#aa33ff' : '#6b6b8a',
                    fontSize: 11, fontWeight: 600, fontFamily: 'Space Grotesk, sans-serif',
                  }}
                  title={isPremium ? 'Modifier' : 'Réservé aux membres Premium'}
                >
                  {isPremium ? <Edit2 size={13} /> : <Lock size={13} />}
                  {isPremium ? 'Modifier' : 'Premium'}
                </button>
              </div>
            ))
          )}
        </div>

        {/* ── Menu items ── */}
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
              width: 36, height: 36, borderRadius: 10,
              background: item.gold ? 'rgba(255,215,0,0.1)' : 'rgba(139,0,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: item.gold ? '#ffd700' : '#8b00ff',
              border: item.gold ? '1px solid rgba(255,215,0,0.3)' : '1px solid rgba(139,0,255,0.3)',
            }}>
              <item.icon size={17} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, fontFamily: 'Rajdhani, sans-serif', color: '#fff' }}>{item.label}</p>
              <p style={{ margin: 0, fontSize: 11, color: '#6b6b8a', fontFamily: 'Inter, sans-serif' }}>{item.sub}</p>
            </div>
            <ChevronRight size={16} style={{ color: '#6b6b8a' }} />
          </button>
        ))}

        {/* ── Se déconnecter ── */}
        <button
          onClick={handleSignOut}
          style={{
            background: 'rgba(255,51,85,0.08)', borderRadius: 12, padding: '13px 14px', marginTop: 4,
            display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
            width: '100%', textAlign: 'left', border: '1px solid rgba(255,51,85,0.2)',
            color: '#ff3355',
          }}
        >
          <div style={{ width: 36, height: 36, background: 'rgba(255,51,85,0.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LogOut size={17} />
          </div>
          <span style={{ fontWeight: 700, fontSize: 14, fontFamily: 'Rajdhani, sans-serif' }}>Se déconnecter</span>
        </button>
      </div>

      {/* ── Modal édition profil ── */}
      {editOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'flex-end', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
          onClick={() => setEditOpen(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{ width: '100%', maxWidth: 480, margin: '0 auto', background: '#12002a', borderRadius: '20px 20px 0 0', padding: '20px 20px 40px', border: '1px solid rgba(139,0,255,0.3)', borderBottom: 'none' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h3 style={{ margin: 0, color: '#fff', fontFamily: 'Rajdhani, sans-serif', fontSize: 18, fontWeight: 800 }}>
                Modifier mon profil
              </h3>
              <button onClick={() => setEditOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b6b8a', padding: 0 }}>
                <X size={20} />
              </button>
            </div>

            {/* Avatar */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
              <input ref={avatarRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarPick} />
              <button type="button" onClick={() => avatarRef.current?.click()} style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', border: '2px dashed rgba(139,0,255,0.5)', cursor: 'pointer', background: 'rgba(139,0,255,0.1)', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {avatarPreview || profile?.avatar_url ? (
                  <img src={avatarPreview || profile?.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <span style={{ color: '#fff', fontFamily: 'Rajdhani, sans-serif', fontWeight: 800, fontSize: 24 }}>{displayName[0]}</span>
                )}
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Camera size={18} style={{ color: '#fff' }} />
                </div>
              </button>
            </div>

            <form onSubmit={saveProfile} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b6b8a', marginBottom: 6, fontFamily: 'Space Grotesk, sans-serif' }}>Nom complet</label>
                <input value={editForm.full_name} onChange={e => setEditForm(f => ({ ...f, full_name: e.target.value }))}
                  placeholder="Ton nom complet"
                  style={{ width: '100%', background: 'rgba(139,0,255,0.08)', border: '1px solid rgba(139,0,255,0.25)', borderRadius: 12, padding: '10px 14px', fontSize: 14, color: '#fff', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b6b8a', marginBottom: 6, fontFamily: 'Space Grotesk, sans-serif' }}>Téléphone</label>
                <input value={editForm.phone} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+221 77 XXX XX XX" type="tel"
                  style={{ width: '100%', background: 'rgba(139,0,255,0.08)', border: '1px solid rgba(139,0,255,0.25)', borderRadius: 12, padding: '10px 14px', fontSize: 14, color: '#fff', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b6b8a', marginBottom: 6, fontFamily: 'Space Grotesk, sans-serif' }}>Ville</label>
                <select value={editForm.location} onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))}
                  style={{ width: '100%', background: '#1a0038', border: '1px solid rgba(139,0,255,0.25)', borderRadius: 12, padding: '10px 14px', fontSize: 14, color: '#fff', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box', cursor: 'pointer' }}>
                  <option value="">Choisir une ville</option>
                  {VILLES.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <button type="submit" disabled={editSaving} style={{ marginTop: 4, background: 'linear-gradient(135deg, #8b00ff, #ff00c8)', color: '#fff', border: 'none', borderRadius: 12, padding: '13px 0', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'Rajdhani, sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, opacity: editSaving ? 0.7 : 1, boxShadow: '0 0 20px rgba(139,0,255,0.4)' }}>
                <Save size={16} /> {editSaving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
