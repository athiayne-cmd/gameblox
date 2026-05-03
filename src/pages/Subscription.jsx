import { motion } from 'framer-motion'
import { Check, Zap, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import { useAuth } from '../contexts/AuthContext'
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

const PLANS = [
  { id: 'monthly', label: 'Mensuel',   price: 2_500,  period: '/mois',  highlight: false },
  { id: 'yearly',  label: 'Annuel',    price: 20_000, period: '/an',    highlight: true, badge: '-33%' },
]

export default function Subscription() {
  const { user } = useAuth()

  function handleSubscribe(planId) {
    if (!user) {
      toast.error('Connecte-toi d\'abord pour souscrire.')
      return
    }
    toast('Paiement Premium bientôt disponible — intégration CinetPay/PayDunya en cours.', { icon: '🚀' })
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
          <h1 className="font-display font-bold text-4xl text-white mb-3">
            Vendez sans limites
          </h1>
          <p className="text-gaming-text-muted font-body max-w-md mx-auto">
            Publiez autant d'annonces que vous voulez, modifiez-les à tout moment et soyez mis en avant auprès des acheteurs.
          </p>
        </div>

        {/* Comparaison */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {/* Plan Gratuit */}
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

          {/* Plan Premium */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            className="relative gaming-card p-6 border-gaming-gold/40 shadow-[0_0_30px_rgba(255,184,0,0.08)]"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gaming-gold rounded-full text-xs font-heading font-bold text-gaming-bg">
              RECOMMANDÉ
            </div>
            <p className="font-heading font-semibold text-gaming-gold text-xs uppercase tracking-widest mb-1">Premium</p>
            <p className="font-display font-bold text-3xl text-white mb-5">
              Dès <span className="text-gaming-gold">2 500</span> <span className="text-sm font-heading font-normal text-gaming-text-muted">FCFA/mois</span>
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

        {/* Plans tarifaires */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          {PLANS.map(plan => (
            <div key={plan.id}
              className={`relative gaming-card p-5 flex flex-col gap-4 ${plan.highlight ? 'border-gaming-gold/40' : ''}`}>
              {plan.badge && (
                <span className="absolute top-3 right-3 text-xs font-heading font-bold px-2 py-0.5 rounded-full bg-gaming-gold/15 text-gaming-gold border border-gaming-gold/30">
                  {plan.badge}
                </span>
              )}
              <div>
                <p className="font-heading font-semibold text-gaming-text-primary">{plan.label}</p>
                <p className="font-display font-bold text-2xl text-white mt-1">
                  {plan.price.toLocaleString('fr-FR')} FCFA
                  <span className="text-sm font-heading font-normal text-gaming-text-muted ml-1">{plan.period}</span>
                </p>
              </div>
              <Button fullWidth variant={plan.highlight ? 'primary' : 'secondary'} onClick={() => handleSubscribe(plan.id)}>
                <Zap size={14} className="mr-1.5" /> Choisir ce plan
              </Button>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gaming-text-muted font-body">
          Paiement sécurisé via CinetPay ou PayDunya · Annulable à tout moment
        </p>
      </div>
    </div>
  )
}
