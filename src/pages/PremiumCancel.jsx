import { motion } from 'framer-motion'
import { XCircle, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function PremiumCancel() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-sm gaming-card p-10">
        <XCircle size={48} className="text-gaming-text-muted mx-auto mb-5" />
        <h2 className="font-display font-bold text-2xl text-white mb-3">Paiement annulé</h2>
        <p className="text-gaming-text-muted font-body text-sm leading-relaxed mb-8">
          Ton paiement a été annulé. Aucun montant n'a été débité.
          Tu peux réessayer à tout moment.
        </p>
        <div className="flex flex-col gap-3">
          <Link to="/abonnement"><Button fullWidth>Réessayer</Button></Link>
          <Link to="/" className="flex items-center justify-center gap-1.5 text-sm text-gaming-text-muted hover:text-white transition-colors font-heading">
            <ArrowLeft size={14}/> Retour à l'accueil
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
