import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, CheckCircle2, Loader2, XCircle } from 'lucide-react'
import Button from '../components/ui/Button'
import { useAuth } from '../contexts/AuthContext'

export default function PremiumSuccess() {
  const [searchParams]   = useSearchParams()
  const [status, setStatus]   = useState('loading') // loading | success | error
  const [message, setMessage] = useState('')
  const { refreshProfile }    = useAuth()

  useEffect(() => {
    const token  = searchParams.get('token')   || localStorage.getItem('mf_premium_token')
    const userId = searchParams.get('user_id') || localStorage.getItem('mf_premium_user_id')

    if (!userId) {
      setStatus('error')
      setMessage('Session introuvable. Contacte le support.')
      return
    }

    activate(token, userId)
  }, [])

  async function activate(token, userId) {
    try {
      const res  = await fetch('/api/premium-activate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ token, userId }),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        localStorage.removeItem('mf_premium_token')
        localStorage.removeItem('mf_premium_user_id')
        await refreshProfile()
        setStatus('success')
      } else {
        setStatus('error')
        setMessage(data.message || 'Activation échouée.')
      }
    } catch {
      setStatus('error')
      setMessage('Erreur réseau. Réessaie ou contacte le support.')
    }
  }

  if (status === 'loading') return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 size={40} className="text-gaming-gold animate-spin mx-auto" />
        <p className="font-heading text-gaming-text-muted">Activation Premium en cours…</p>
      </div>
    </div>
  )

  if (status === 'error') return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-sm gaming-card p-10 border-red-500/30">
        <XCircle size={48} className="text-red-400 mx-auto mb-4" />
        <h2 className="font-display font-bold text-2xl text-white mb-3">Activation échouée</h2>
        <p className="text-gaming-text-muted font-body text-sm mb-6">{message}</p>
        <Link to="/abonnement"><Button fullWidth>Réessayer</Button></Link>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-sm gaming-card p-10 border-gaming-gold/40 shadow-[0_0_40px_rgba(255,184,0,0.1)]">

        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.5 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-gaming-gold/10 border-2 border-gaming-gold/50 flex items-center justify-center">
          <Zap size={36} className="text-gaming-gold" />
        </motion.div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gaming-gold/10 border border-gaming-gold/30 mb-4">
          <CheckCircle2 size={13} className="text-gaming-gold" />
          <span className="text-xs font-heading font-bold text-gaming-gold">PREMIUM ACTIVÉ</span>
        </div>

        <h2 className="font-display font-bold text-3xl text-white mb-3">
          Bienvenue dans le Premium !
        </h2>
        <p className="text-gaming-text-muted font-body text-sm leading-relaxed mb-8">
          Ton compte est maintenant Premium. Tu peux publier des annonces illimitées
          et profiter de tous les avantages GameBlox.
        </p>

        <div className="flex flex-col gap-3">
          <Link to="/vendre"><Button fullWidth size="lg"><Zap size={16} className="mr-2"/>Publier une annonce</Button></Link>
          <Link to="/" className="text-sm text-gaming-text-muted hover:text-gaming-gold transition-colors font-heading">
            Retour à l'accueil
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
