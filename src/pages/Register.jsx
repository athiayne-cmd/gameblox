import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Mail, Lock, User, Phone, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'

const VILLES = [
  'Dakar','Thiès','Saint-Louis','Ziguinchor',
  'Mbour','Kaolack','Touba','Diourbel',
  'Rufisque','Louga','Tambacounda','Kolda',
]

export default function Register() {
  const [form, setForm]       = useState({ fullName:'', email:'', phone:'', location:'', password:'', confirm:'' })
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const { signUp }            = useAuth()
  const navigate              = useNavigate()

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  const ERREURS = {
    'User already registered':   'Un compte existe déjà avec cet email.',
    'Password should be at least 6 characters': 'Le mot de passe doit contenir au moins 6 caractères.',
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.fullName) return toast.error('Saisis ton nom complet')
    if (!form.email)    return toast.error('Saisis ton adresse email')
    if (form.password.length < 6) return toast.error('Mot de passe trop court (minimum 6 caractères)')
    if (form.password !== form.confirm) return toast.error('Les mots de passe ne correspondent pas')
    setLoading(true)
    try {
      const { needsConfirmation } = await signUp({
        email:    form.email,
        password: form.password,
        fullName: form.fullName,
        phone:    form.phone,
        location: form.location,
      })
      if (needsConfirmation) {
        setEmailSent(true)
      } else {
        toast.success('Compte créé !')
        navigate('/')
      }
    } catch (err) {
      const msg = ERREURS[err.message] || "Erreur lors de l'inscription. Réessaie."
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  if (emailSent) return (
    <div className="min-h-screen bg-gaming-bg grid-bg flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gaming-purple/15 rounded-full blur-[120px]" />
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 text-center max-w-sm glass rounded-3xl p-10">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gaming-neon/10 border border-gaming-neon/30 flex items-center justify-center">
          <CheckCircle2 size={32} className="text-gaming-neon" />
        </div>
        <h2 className="font-display font-bold text-2xl text-white mb-3">Vérifie ton email</h2>
        <p className="text-gaming-text-muted font-body text-sm leading-relaxed mb-6">
          Un lien de confirmation a été envoyé à{' '}
          <span className="text-white font-heading font-semibold">{form.email}</span>.
          <br /><br />
          Clique sur le lien dans l'email pour activer ton compte, puis connecte-toi.
        </p>
        <Link to="/connexion">
          <Button fullWidth>Se connecter</Button>
        </Link>
        <p className="text-xs text-gaming-text-muted mt-4 font-body">
          Tu ne trouves pas l'email ? Vérifie ton dossier spam.
        </p>
      </motion.div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gaming-bg grid-bg flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gaming-purple/15 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-gaming-cyan/10 rounded-full blur-[100px]" />

      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
        className="relative z-10 w-full max-w-md">

        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-gaming-purple flex items-center justify-center shadow-purple-glow">
            <Zap size={20} className="text-white" />
          </div>
          <span className="font-display font-bold text-2xl text-white neon-text">
            GAME<span className="text-gaming-cyan">BLOX</span>
          </span>
        </Link>

        <div className="glass rounded-3xl p-8 shadow-gaming-lg">
          <h1 className="font-display font-bold text-2xl text-white mb-1">Créer un compte</h1>
          <p className="text-gaming-text-muted font-body text-sm mb-7">
            Rejoins la communauté gaming — c'est gratuit !
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Nom complet *" value={form.fullName}
              onChange={e => set('fullName', e.target.value)}
              placeholder="Ex : Moussa Diallo" icon={<User size={16}/>} required />

            <Input label="Adresse email *" type="email" value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="ton@email.com" icon={<Mail size={16}/>} required />

            <div className="grid grid-cols-2 gap-3">
              <Input label="Téléphone" type="tel" value={form.phone}
                onChange={e => set('phone', e.target.value)}
                placeholder="+221 77…" icon={<Phone size={16}/>} />
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-heading font-medium text-gaming-text-secondary">Ville</label>
                <select value={form.location} onChange={e => set('location', e.target.value)}
                  className="w-full bg-gaming-surface border border-gaming-border rounded-xl px-3 py-3 text-sm
                             text-gaming-text-primary focus:outline-none focus:border-gaming-purple transition-all
                             font-body appearance-none cursor-pointer">
                  <option value="">Choisir</option>
                  {VILLES.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
            </div>

            <Input label="Mot de passe *"
              type={showPwd ? 'text' : 'password'} value={form.password}
              onChange={e => set('password', e.target.value)} placeholder="••••••••"
              icon={<Lock size={16}/>}
              iconRight={
                <button type="button" onClick={() => setShowPwd(s => !s)}
                  className="hover:text-gaming-purple transition-colors">
                  {showPwd ? <EyeOff size={16}/> : <Eye size={16}/>}
                </button>
              }
              hint="Minimum 6 caractères" required />

            <Input label="Confirmer le mot de passe *"
              type={showPwd ? 'text' : 'password'} value={form.confirm}
              onChange={e => set('confirm', e.target.value)}
              placeholder="••••••••" icon={<Lock size={16}/>} required />

            <Button type="submit" fullWidth size="lg" loading={loading} className="mt-2">
              {loading ? 'Création du compte...' : 'Créer mon compte gratuit'}
            </Button>
          </form>

          <p className="text-xs text-gaming-text-muted font-body text-center mt-4 leading-relaxed">
            En créant un compte, tu acceptes nos{' '}
            <Link to="#" className="text-gaming-purple hover:underline">conditions d'utilisation</Link>
            {' '}et notre{' '}
            <Link to="#" className="text-gaming-purple hover:underline">politique de confidentialité</Link>.
          </p>

          <div className="mt-5 pt-5 border-t border-gaming-border/40 text-center">
            <p className="text-sm text-gaming-text-muted font-body">
              Déjà un compte ?{' '}
              <Link to="/connexion"
                className="text-gaming-purple hover:text-gaming-purple-light font-heading font-semibold transition-colors">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
