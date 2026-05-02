import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, ArrowLeft, ShieldCheck, Smartphone } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import { useCart } from '../contexts/CartContext'
import { formatPrice } from '../utils/formatters'

const METHODS = [
  { id: 'wave',   name: 'Wave',         emoji: '🌊', color: 'border-blue-500/50 hover:border-blue-500',   active: 'border-blue-500 bg-blue-500/10' },
  { id: 'orange', name: 'Orange Money', emoji: '🟠', color: 'border-orange-500/50 hover:border-orange-500', active: 'border-orange-500 bg-orange-500/10' },
  { id: 'mtn',    name: 'MTN Money',    emoji: '💛', color: 'border-yellow-500/50 hover:border-yellow-500', active: 'border-yellow-500 bg-yellow-500/10' },
  { id: 'moov',   name: 'Moov Money',   emoji: '🔵', color: 'border-cyan-500/50 hover:border-cyan-500',    active: 'border-cyan-500 bg-cyan-500/10' },
]

export default function Checkout() {
  const [selected, setSelected] = useState(null)
  const [phone,    setPhone]    = useState('')
  const { items, total, clearCart } = useCart()

  return (
    <div className="min-h-screen py-10">
      <div className="page-container max-w-lg">
        <Link to="/panier" className="flex items-center gap-2 text-gaming-text-muted hover:text-gaming-purple transition-colors text-sm font-heading mb-8">
          <ArrowLeft size={16}/> Retour au panier
        </Link>

        <h1 className="font-display font-bold text-3xl text-white mb-2">Paiement</h1>
        <p className="text-gaming-text-muted font-body mb-8">Total : <span className="text-gaming-gold font-mono font-bold">{formatPrice(total)}</span></p>

        {/* Payment method selection */}
        <div className="space-y-6">
          <div>
            <h2 className="font-heading font-semibold text-gaming-text-primary mb-4">Choisis ta méthode de paiement</h2>
            <div className="grid grid-cols-2 gap-3">
              {METHODS.map(m => (
                <button key={m.id} onClick={() => setSelected(m.id)}
                  className={`p-4 rounded-2xl border-2 text-center transition-all duration-200 cursor-pointer
                    ${selected === m.id ? m.active : 'border-gaming-border bg-gaming-card ' + m.color}`}>
                  <div className="text-3xl mb-2">{m.emoji}</div>
                  <p className="font-heading font-semibold text-sm text-gaming-text-primary">{m.name}</p>
                </button>
              ))}
            </div>
          </div>

          {selected && (
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="space-y-4">
              <div>
                <label className="text-sm font-heading font-medium text-gaming-text-secondary block mb-1.5">
                  Numéro {METHODS.find(m => m.id === selected)?.name}
                </label>
                <div className="relative">
                  <Smartphone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gaming-text-muted" />
                  <input value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="+221 77 XXX XX XX" type="tel"
                    className="w-full pl-10 pr-4 py-3 bg-gaming-surface border border-gaming-border rounded-xl
                               text-gaming-text-primary placeholder:text-gaming-text-muted focus:outline-none
                               focus:border-gaming-purple focus:ring-2 focus:ring-gaming-purple/20 transition-all font-mono" />
                </div>
              </div>
            </motion.div>
          )}

          {/* Simulation banner */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="flex items-start gap-3 p-5 rounded-2xl bg-gaming-gold/5 border border-gaming-gold/30"
          >
            <Clock size={20} className="text-gaming-gold flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-heading font-semibold text-gaming-gold text-sm mb-1">
                Paiement en cours de configuration
              </p>
              <p className="text-xs text-gaming-text-muted font-body leading-relaxed">
                L'intégration Money Fusion sera activée très prochainement. Les paiements Wave, Orange Money, MTN Money et Moov Money seront disponibles dès validation de l'API.
              </p>
            </div>
          </motion.div>

          {/* Order summary */}
          <div className="gaming-card p-5 space-y-3">
            <h3 className="font-heading font-semibold text-gaming-text-primary text-sm">Commande</h3>
            {items.map(i => (
              <div key={i.id} className="flex justify-between text-sm">
                <span className="text-gaming-text-muted font-body truncate max-w-[200px]">{i.title}</span>
                <span className="font-mono text-gaming-text-primary">{formatPrice(i.price)}</span>
              </div>
            ))}
            <div className="border-t border-gaming-border/40 pt-3 flex justify-between">
              <span className="font-heading font-semibold text-white">Total</span>
              <span className="font-mono font-bold text-gaming-gold">{formatPrice(total)}</span>
            </div>
          </div>

          <Button fullWidth size="lg" disabled={!selected || !phone}
            onClick={() => alert('Paiement en cours de configuration — bientôt disponible !')}>
            Confirmer le paiement
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs text-gaming-text-muted">
            <ShieldCheck size={14} className="text-gaming-neon" />
            <span className="font-body">Transaction sécurisée par Money Fusion</span>
          </div>
        </div>
      </div>
    </div>
  )
}
