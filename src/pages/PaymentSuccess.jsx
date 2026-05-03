import { motion } from 'framer-motion'
import { CheckCircle2, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="page-container max-w-md text-center"
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gaming-neon/10 border-2 border-gaming-neon flex items-center justify-center">
            <CheckCircle2 size={40} className="text-gaming-neon" />
          </div>
        </div>

        <h1 className="font-display font-bold text-3xl text-white mb-3">Paiement confirmé !</h1>
        <p className="text-gaming-text-muted font-body mb-8 leading-relaxed">
          Ta commande a bien été prise en compte. Tu recevras une confirmation par email ou SMS sous peu.
        </p>

        <div className="flex flex-col gap-3">
          <Link to="/marketplace">
            <Button fullWidth size="lg">
              <ShoppingBag size={18} className="mr-2" />
              Continuer mes achats
            </Button>
          </Link>
          <Link to="/" className="text-sm text-gaming-text-muted hover:text-gaming-purple transition-colors font-heading">
            Retour à l'accueil
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
