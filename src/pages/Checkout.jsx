import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ShieldCheck, Loader2, User, Mail, Phone, MapPin, PackageCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import { useCart } from '../contexts/CartContext'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { formatPrice } from '../utils/formatters'
import toast from 'react-hot-toast'

const isUUID = id => typeof id === 'string' && id.includes('-') && id.length === 36

export default function Checkout() {
  const { items, total, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '' })

  const set = (k) => (e) => setForm(prev => ({ ...prev, [k]: e.target.value }))

  const isValid = form.firstName && form.phone && form.address

  async function handleConfirm() {
    setLoading(true)
    try {
      // Sauvegarder les commandes dans Supabase pour les vrais produits
      if (user) {
        const realItems = items.filter(i => isUUID(i.id))
        await Promise.allSettled(
          realItems.map(item =>
            supabase.from('orders').insert({
              product_id:     item.id,
              buyer_id:       user.id,
              seller_id:      item.seller?.id || null,
              amount:         item.price,
              payment_method: 'cash_on_delivery',
              payment_status: 'pending',
            })
          )
        )
      }
      clearCart()
      toast.success('Commande confirmée !')
      navigate('/paiement-succes')
    } catch {
      toast.error('Erreur lors de la confirmation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-10">
      <div className="page-container max-w-lg">
        <Link to="/panier" className="flex items-center gap-2 text-gaming-text-muted hover:text-gaming-purple transition-colors text-sm font-heading mb-8">
          <ArrowLeft size={16}/> Retour au panier
        </Link>

        <h1 className="font-display font-bold text-3xl text-white mb-2">Finaliser la commande</h1>
        <p className="text-gaming-text-muted font-body mb-8">
          Total : <span className="text-gaming-gold font-mono font-bold">{formatPrice(total)}</span>
        </p>

        <div className="space-y-6">

          {/* Paiement à la livraison — badge */}
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 p-5 rounded-2xl bg-gaming-neon/5 border border-gaming-neon/30">
            <div className="w-12 h-12 rounded-xl bg-gaming-neon/10 flex items-center justify-center flex-shrink-0">
              <PackageCheck size={24} className="text-gaming-neon" />
            </div>
            <div>
              <p className="font-heading font-semibold text-white">Paiement à la livraison</p>
              <p className="text-xs text-gaming-text-muted font-body mt-0.5">
                Vous payez en espèces lors de la réception de votre commande.
              </p>
            </div>
          </motion.div>

          {/* Infos de livraison */}
          <div className="space-y-3">
            <h2 className="font-heading font-semibold text-gaming-text-primary">Informations de livraison</h2>
            <div className="grid grid-cols-2 gap-3">
              <Field icon={<User size={15}/>} placeholder="Prénom *" value={form.firstName} onChange={set('firstName')} />
              <Field icon={<User size={15}/>} placeholder="Nom" value={form.lastName} onChange={set('lastName')} />
            </div>
            <Field icon={<Phone size={15}/>} placeholder="Téléphone * (+221 77…)" type="tel" value={form.phone} onChange={set('phone')} />
            <Field icon={<Mail size={15}/>} placeholder="Email" type="email" value={form.email} onChange={set('email')} />
            <Field icon={<MapPin size={15}/>} placeholder="Adresse de livraison *" value={form.address} onChange={set('address')} />
          </div>

          {/* Récapitulatif */}
          <div className="gaming-card p-5 space-y-3">
            <h3 className="font-heading font-semibold text-gaming-text-primary text-sm">Récapitulatif</h3>
            {items.map(i => (
              <div key={i.id} className="flex justify-between text-sm">
                <span className="text-gaming-text-muted font-body truncate max-w-[200px]">{i.title}</span>
                <span className="font-mono text-gaming-text-primary">{formatPrice(i.price)}</span>
              </div>
            ))}
            <div className="border-t border-gaming-border/40 pt-3 flex justify-between">
              <span className="font-heading font-semibold text-white">Total à payer</span>
              <span className="font-mono font-bold text-gaming-gold">{formatPrice(total)}</span>
            </div>
            <p className="text-xs text-gaming-text-muted font-body">Paiement en espèces à la livraison</p>
          </div>

          <Button fullWidth size="lg" disabled={!isValid || loading} onClick={handleConfirm}>
            {loading
              ? <span className="flex items-center gap-2"><Loader2 size={16} className="animate-spin"/> Traitement…</span>
              : <span className="flex items-center gap-2"><PackageCheck size={16}/> Confirmer la commande</span>}
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs text-gaming-text-muted">
            <ShieldCheck size={14} className="text-gaming-neon" />
            <span className="font-body">Commande sécurisée — Paiement à la livraison</span>
          </div>

        </div>
      </div>
    </div>
  )
}

function Field({ icon, placeholder, value, onChange, type = 'text' }) {
  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gaming-text-muted">{icon}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-4 py-3 bg-gaming-surface border border-gaming-border rounded-xl
                   text-gaming-text-primary placeholder:text-gaming-text-muted focus:outline-none
                   focus:border-gaming-purple focus:ring-2 focus:ring-gaming-purple/20 transition-all font-mono text-sm"
      />
    </div>
  )
}
