import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

export default function Login() {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [loading,  setLoading]  = useState(false)
  const { signIn }              = useAuth()
  const navigate                = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await signIn({ email, password })
      navigate('/')
    } catch (err) {
      toast.error(err.message || 'Identifiants incorrects')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gaming-bg grid-bg flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-gaming-purple/15 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-gaming-cyan/10 rounded-full blur-[100px]" />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md">

        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gaming-purple flex items-center justify-center shadow-purple-glow">
            <Zap size={20} className="text-white" />
          </div>
          <span className="font-display font-bold text-2xl text-white neon-text">
            GAME<span className="text-gaming-cyan">BLOX</span>
          </span>
        </Link>

        <div className="glass rounded-3xl p-8 shadow-gaming-lg">
          <h1 className="font-display font-bold text-2xl text-white mb-1">Bon retour !</h1>
          <p className="text-gaming-text-muted font-body text-sm mb-7">Connecte-toi à ton compte GameBlox</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Adresse email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="ton@email.com"
              icon={<Mail size={16}/>}
              required
            />
            <Input
              label="Mot de passe"
              type={showPwd ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              icon={<Lock size={16}/>}
              iconRight={
                <button type="button" onClick={() => setShowPwd(s => !s)} className="hover:text-gaming-purple transition-colors">
                  {showPwd ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              }
              required
            />

            <div className="flex items-center justify-end">
              <Link to="#" className="text-xs text-gaming-purple hover:text-gaming-purple-light transition-colors font-heading">
                Mot de passe oublié ?
              </Link>
            </div>

            <Button type="submit" fullWidth size="lg" loading={loading}>
              Se connecter
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gaming-border/40 text-center">
            <p className="text-sm text-gaming-text-muted font-body">
              Pas encore de compte ?{' '}
              <Link to="/inscription" className="text-gaming-purple hover:text-gaming-purple-light font-heading font-semibold transition-colors">
                S'inscrire gratuitement
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
