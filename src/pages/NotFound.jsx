import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../components/ui/Button'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-gaming-purple/10 rounded-full blur-[120px]" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative z-10 text-center px-4">
        <motion.p
          animate={{ y: [0, -12, 0] }} transition={{ duration: 3, repeat: Infinity }}
          className="text-7xl mb-6">🎮</motion.p>
        <h1 className="font-display font-bold text-8xl text-gaming-border mb-4">404</h1>
        <h2 className="font-display font-bold text-2xl text-white mb-3">Game Over !</h2>
        <p className="text-gaming-text-muted font-body mb-8 max-w-sm mx-auto">
          Cette page n'existe pas ou a été supprimée. Retourne au marketplace et continue à explorer !
        </p>
        <Link to="/">
          <Button size="lg">Retour à l'accueil</Button>
        </Link>
      </motion.div>
    </div>
  )
}
