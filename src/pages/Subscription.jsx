import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Zap, ArrowLeft, Loader2, Phone } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { initPremiumPayment } from '../lib/moneyfusion'
import toast from 'react-hot-toast'

const FEATURES_FREE = [
  '1 annonce active',
  'Accès au marketplace',
  'Messagerie acheteurs',
]

const FEATURES_PREMIUM = [
  'Annonces illimitées',
  'Modifier ses annonces',
  'Badge "Vendeur Premium"',
  'Annonces mises en avant',
  'Support prioritaire',
  'Statistiques de vues',
]

export default function Subscription() {
  const { user, profile, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [phone, setPhone] = useState('')

  useEffect(() => {
    if (profile?.phone) setPhone(profile.phone)
  }, [profile?.phone])

  async function handleSubscribe() {
    if (!user) {
      toast.error('Connecte-toi d\'abord.')
      navigate('/connexion')
      return
    }
    if (profile?.is_premium) {
      toast('Tu es déjà Premium !', { icon: '⭐' })
      return
    }

    const cleanPhone = phone.replace(/\s+/g, '')
    if (!/^\+?\d{8,15}$/.test(cleanPhone)) {
      toast.error('Numéro invalide. Format: +225XXXXXXXXXX ou 0XXXXXXXXX')
      return
    }

    setLoading(true)
    try {
      if (cleanPhone !== profile?.phone) {
        await supabase.from('profiles').update({ phone: cleanPhone }).eq('id', user.id)
        await refreshProfile()
      }

      const paymentUrl = await initPremiumPayment({
        userId: user.id,
        name:   profile?.full_name || '',
        email:  user.email         || '',
        phone:  cleanPhone,
      })
      window.location.href = paymentUrl
    } catch (err) {
      toast.error(err.message || 'Erreur paiement. Réessaie.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-12">
      <div className="page-container max-w-3xl">

        <Link to="/vendre" className="flex items-center gap-2 text-gaming-text-muted hover:text-gaming-purple transition-colors text-sm font-heading mb-8">
          <ArrowLeft size={16}/> Retour
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gaming-gold/10 border border-gaming-gold/30 mb-4">
            <Zap size={14} className="text-gaming-gold" />
            <span className="text-xs font-heading font-semibold text-gaming-gold">GAMEBLOX PREMIUM</span>
          </div>
          <h1 className="font-display font-bold text-4xl text-white mb-3">Vendez sans limites</h1>
          <p className="text-gaming-text-muted font-body max-w-md mx-auto">
            Publiez autant d'annonces que vous voulez, modifiez-les à tout moment
            et soyez mis en avant auprès des acheteurs.
          </p>
        </div>

        {/* Comparaison Gratuit / Premium */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <div className="gaming-card p-6">
            <p className="font-heading font-semibold text-gaming-text-muted text-xs uppercase tracking-widest mb-1">Gratuit</p>
            <p className="font-display font-bold text-3xl text-white mb-5">0 FCFA</p>
            <ul className="space-y-2.5">
              {FEATURES_FREE.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gaming-text-secondary font-body">
                  <Check size={14} className="text-gaming-text-muted flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="relative gaming-card p-6 border-gaming-gold/40 shadow-[0_0_30px_rgba(255,184,0,0.08)]">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gaming-gold rounded-full text-xs font-heading font-bold text-gaming-bg">
              RECOMMANDÉ
            </div>
            <p className="font-heading font-semibold text-gaming-gold text-xs uppercase tracking-widest mb-1">Premium</p>
            <p className="font-display font-bold text-3xl text-white mb-5">
              <span className="text-gaming-gold">6 000</span>
              <span className="text-sm font-heading font-normal text-gaming-text-muted ml-1">FCFA</span>
            </p>
            <ul className="space-y-2.5">
              {FEATURES_PREMIUM.map(f => (
                <li key={f} className="flex items-center gap-2 text-sm text-gaming-text-primary font-body">
                  <Check size={14} className="text-gaming-gold flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bouton paiement */}
        <div className="max-w-sm mx-auto space-y-4">
          {profile?.is_premium ? (
            <div className="text-center p-5 rounded-2xl bg-gaming-gold/10 border border-gaming-gold/30">
              <Zap size={24} className="text-gaming-gold mx-auto mb-2" />
              <p className="font-heading font-semibold text-gaming-gold">Tu es déjà Premium !</p>
            </div>
          ) : (
            <>
              <div>
                <label htmlFor="phone" className="block text-xs font-heading font-semibold text-gaming-text-muted uppercase tracking-widest mb-2">
                  Numéro mobile money
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gaming-text-muted pointer-events-none" />
                  <input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    placeholder="+225 07 00 00 00 00"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={loading}
                    className="w-full pl-10 pr-3 py-3 rounded-xl bg-gaming-bg-elevated border border-gaming-border text-white font-body text-sm placeholder:text-gaming-text-muted focus:outline-none focus:border-gaming-gold/60 focus:ring-1 focus:ring-gaming-gold/30 transition-colors"
                  />
                </div>
                <p className="text-[11px] text-gaming-text-muted font-body mt-1.5">
                  Ce numéro recevra la demande de paiement (Wave, Orange Money, MTN, Moov).
                </p>
              </div>

              <Button fullWidth size="lg" onClick={handleSubscribe} disabled={loading}>
                {loading
                  ? <span className="flex items-center gap-2"><Loader2 size={16} className="animate-spin"/> Redirection…</span>
                  : <span className="flex items-center gap-2"><Zap size={16}/> Devenir Premium — 6 000 FCFA</span>}
              </Button>
            </>
          )}

          <p className="text-center text-xs text-gaming-text-muted font-body">
            Paiement sécurisé via Money Fusion · Wave, Orange Money, MTN, Moov
          </p>
        </div>

      </div>
    </div>
  )
}
