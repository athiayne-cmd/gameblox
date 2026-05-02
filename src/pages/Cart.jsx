import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, ShoppingCart, ArrowRight, ShieldCheck } from 'lucide-react'
import { useCart } from '../contexts/CartContext'
import { formatPrice } from '../utils/formatters'
import Button from '../components/ui/Button'

export default function Cart() {
  const { items, removeItem, total, count } = useCart()

  if (count === 0) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl mb-6">🛒</motion.div>
        <h2 className="font-display font-bold text-2xl text-white mb-3">Ton panier est vide</h2>
        <p className="text-gaming-text-muted font-body mb-8">Explore le marketplace et ajoute des produits gaming</p>
        <Link to="/marketplace"><Button size="lg" iconRight={<ArrowRight size={18}/>}>Explorer le marketplace</Button></Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen py-10">
      <div className="page-container max-w-4xl">
        <h1 className="font-display font-bold text-3xl text-white mb-8">
          Mon panier <span className="text-gaming-text-muted text-xl">({count} article{count > 1 ? 's' : ''})</span>
        </h1>

        <div className="grid lg:grid-cols-3 gap-7">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map(item => (
                <motion.div key={item.id}
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                  className="gaming-card p-4 flex gap-4">
                  <div className="w-24 h-20 rounded-xl overflow-hidden bg-gaming-surface flex-shrink-0">
                    <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover"
                      onError={e => { e.target.style.display='none' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`/produit/${item.slug}`}
                      className="font-heading font-semibold text-gaming-text-primary text-sm line-clamp-2 hover:text-gaming-purple transition-colors block mb-1">
                      {item.title}
                    </Link>
                    <p className="text-xs text-gaming-text-muted font-body mb-2">Vendu par {item.seller.name}</p>
                    <p className="font-mono font-bold text-gaming-gold text-base">{formatPrice(item.price)}</p>
                  </div>
                  <button onClick={() => removeItem(item.id)}
                    className="p-2 rounded-xl text-gaming-red/60 hover:text-gaming-red hover:bg-gaming-red/10 transition-all self-start flex-shrink-0">
                    <Trash2 size={16}/>
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="gaming-card p-5 space-y-4">
              <h2 className="font-heading font-semibold text-gaming-text-primary">Récapitulatif</h2>
              <div className="space-y-2">
                {items.map(i => (
                  <div key={i.id} className="flex justify-between text-sm">
                    <span className="text-gaming-text-muted font-body truncate max-w-[160px]">{i.title}</span>
                    <span className="font-mono text-gaming-text-primary flex-shrink-0">{formatPrice(i.price)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gaming-border/40 pt-3">
                <div className="flex justify-between items-center">
                  <span className="font-heading font-semibold text-gaming-text-primary">Total</span>
                  <span className="font-mono font-bold text-gaming-gold text-lg">{formatPrice(total)}</span>
                </div>
              </div>
              <Link to="/paiement">
                <Button fullWidth size="lg" iconRight={<ArrowRight size={18}/>}>
                  Procéder au paiement
                </Button>
              </Link>
            </div>

            {/* Security */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-gaming-neon/5 border border-gaming-neon/20">
              <ShieldCheck size={16} className="text-gaming-neon flex-shrink-0 mt-0.5"/>
              <div>
                <p className="text-xs font-heading font-semibold text-gaming-neon mb-0.5">Paiement sécurisé</p>
                <p className="text-xs text-gaming-text-muted font-body">Wave · Orange Money · MTN Money · Moov Money</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
