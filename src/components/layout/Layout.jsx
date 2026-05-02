import { Outlet, useLocation, Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import Navbar from './Navbar'
import Footer from './Footer'

export default function Layout() {
  const { pathname } = useLocation()
  const hideFloatBtn = pathname === '/vendre' || pathname.startsWith('/connexion') || pathname.startsWith('/inscription')

  return (
    <div className="min-h-screen flex flex-col bg-gaming-bg">
      <Navbar />

      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.22 }}
          className="flex-1 pt-16"
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>

      <Footer />

      {/* ── Bouton flottant "Vendre" avec pulse néon ── */}
      <AnimatePresence>
        {!hideFloatBtn && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Link to="/vendre">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.93 }}
                className="relative flex items-center gap-2 px-5 py-3 rounded-2xl font-heading font-bold text-white
                           bg-gradient-to-r from-gaming-purple to-gaming-pink
                           btn-float-pulse overflow-hidden"
              >
                {/* Halo derrière le bouton */}
                <span className="absolute inset-0 rounded-2xl bg-gradient-to-r from-gaming-purple to-gaming-pink opacity-50 blur-lg -z-10 scale-110" />
                <Plus size={18} strokeWidth={2.5} />
                <span className="text-sm">Vendre</span>
              </motion.button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
