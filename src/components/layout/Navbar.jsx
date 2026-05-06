import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, ShoppingCart, Menu, X, User,
  ChevronDown, LogOut, Package, MessageCircle, Zap
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false)
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [searchOpen,   setSearchOpen]   = useState(false)
  const [searchQuery,  setSearchQuery]  = useState('')
  const { user, profile, signOut }      = useAuth()
  const { count }                       = useCart()
  const navigate                        = useNavigate()
  const location                        = useLocation()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  function handleSearch(e) {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/marketplace?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const navLinks = [
    { to: '/',            label: 'Accueil' },
    { to: '/marketplace', label: 'Marketplace' },
  ]

  return (
    <>
      <nav className={`
        fixed top-0 left-0 right-0 z-40 transition-all duration-400
        ${scrolled
          ? 'glass-dark shadow-gaming-lg'
          : 'header-bg-animated'}
      `}>
        {/* Bordure inférieure animée */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px]
                        bg-gradient-to-r from-transparent via-gaming-purple/60 to-transparent
                        animate-gradient-x" style={{ backgroundSize: '200% 100%' }} />

        <div className="page-container">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-gaming-purple to-gaming-pink
                              flex items-center justify-center shadow-purple-glow
                              group-hover:shadow-btn-glow transition-all duration-300">
                <Zap size={18} className="text-white" />
                {/* Halo derrière le logo */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-gaming-purple to-gaming-pink
                                opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300 -z-10" />
              </div>
              <div className="flex items-baseline gap-0">
                <span className="font-display font-black text-xl text-white neon-text tracking-widest">
                  GAME
                </span>
                <span className="font-display font-black text-xl neon-pink-text tracking-widest"
                      style={{ color: '#ff00c8', textShadow: '0 0 8px rgba(255,0,200,0.9), 0 0 20px rgba(255,0,200,0.5)' }}>
                  BLOX
                </span>
              </div>
            </Link>

            {/* ── Liens desktop ── */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    px-4 py-2 rounded-xl font-heading font-medium text-sm transition-all duration-200
                    ${location.pathname === link.to
                      ? 'text-white bg-gaming-purple/20 border border-gaming-purple/40 shadow-purple-glow'
                      : 'text-gaming-text-secondary hover:text-white hover:bg-gaming-card/60 hover:border-gaming-border border border-transparent'
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}

              {/* Bouton Vendre — gradient néon */}
              <Link to="/vendre">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  className="ml-1 px-5 py-2 rounded-xl font-heading font-bold text-sm text-white
                             bg-gradient-to-r from-gaming-purple to-gaming-pink
                             shadow-btn-glow hover:shadow-btn-glow-lg transition-all duration-200 cursor-pointer"
                >
                  + Vendre
                </motion.div>
              </Link>
            </div>

            {/* ── Actions droite ── */}
            <div className="flex items-center gap-1.5">
              {/* Recherche */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-xl text-gaming-text-secondary hover:text-gaming-purple-light
                           hover:bg-gaming-card/60 hover:border hover:border-gaming-border
                           transition-all duration-200 border border-transparent"
              >
                <Search size={18} />
              </button>

              {/* Messages */}
              {user && (
                <Link to="/messages"
                  className="relative p-2.5 rounded-xl text-gaming-text-secondary hover:text-gaming-cyan
                             hover:bg-gaming-card/60 transition-all duration-200 border border-transparent hover:border-gaming-border">
                  <MessageCircle size={18} />
                </Link>
              )}

              {/* Panier */}
              <Link to="/panier"
                className="relative p-2.5 rounded-xl text-gaming-text-secondary hover:text-gaming-purple-light
                           hover:bg-gaming-card/60 transition-all duration-200 border border-transparent hover:border-gaming-border">
                <ShoppingCart size={18} />
                {count > 0 && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-[9px]
                               font-bold flex items-center justify-center
                               bg-gradient-to-r from-gaming-purple to-gaming-pink shadow-purple-glow"
                  >
                    {count}
                  </motion.span>
                )}
              </Link>

              {/* Compte */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(o => !o)}
                    className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl
                               hover:bg-gaming-card/60 border border-transparent hover:border-gaming-border transition-all duration-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gaming-purple to-gaming-pink
                                    flex items-center justify-center text-sm font-bold text-white shadow-purple-glow">
                      {(profile?.full_name || user.email)?.[0]?.toUpperCase()}
                    </div>
                    <ChevronDown size={14} className="text-gaming-text-muted" />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-52 rounded-2xl shadow-gaming-lg overflow-hidden z-50
                                   border border-gaming-purple/25"
                        style={{ background: '#12002a' }}
                        onMouseLeave={() => setUserMenuOpen(false)}
                      >
                        <div className="p-3 border-b border-gaming-border/40">
                          <p className="font-heading font-semibold text-sm text-white truncate">
                            {profile?.full_name || 'Mon compte'}
                          </p>
                          <p className="text-xs text-gaming-text-muted truncate">{user.email}</p>
                        </div>
                        {[
                          { to: `/profil/${user.id}`, icon: <User size={14}/>,         label: 'Mon profil' },
                          { to: '/vendre',            icon: <Package size={14}/>,      label: 'Mes annonces' },
                          { to: '/messages',          icon: <MessageCircle size={14}/>, label: 'Messages' },
                        ].map(item => (
                          <Link key={item.to} to={item.to} onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gaming-text-secondary
                                       hover:text-white hover:bg-gaming-card transition-colors">
                            <span className="text-gaming-purple-light">{item.icon}</span>
                            {item.label}
                          </Link>
                        ))}
                        <div className="border-t border-gaming-border/40">
                          <button onClick={() => { signOut(); setUserMenuOpen(false) }}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gaming-red
                                       hover:bg-gaming-red/10 transition-colors w-full text-left">
                            <LogOut size={14} /> Déconnexion
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/connexion"
                    className="px-4 py-2 rounded-xl font-heading font-medium text-sm text-gaming-text-secondary hover:text-white transition-colors">
                    Connexion
                  </Link>
                  <Link to="/inscription">
                    <motion.div
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      className="px-4 py-2 rounded-xl font-heading font-semibold text-sm text-white
                                 bg-gradient-to-r from-gaming-purple to-gaming-pink shadow-btn-glow
                                 hover:shadow-btn-glow-lg transition-all duration-200 cursor-pointer">
                      S'inscrire
                    </motion.div>
                  </Link>
                </div>
              )}

              {/* Menu mobile */}
              <button onClick={() => setMobileOpen(o => !o)}
                className="md:hidden p-2.5 rounded-xl text-gaming-text-secondary hover:text-white
                           hover:bg-gaming-card/60 transition-all border border-transparent hover:border-gaming-border">
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-gaming-border/30"
              style={{ background: '#0a0010ee', backdropFilter: 'blur(20px)' }}
            >
              <div className="page-container py-4 flex flex-col gap-2">
                {navLinks.map(link => (
                  <Link key={link.to} to={link.to}
                    className={`px-4 py-3 rounded-xl font-heading font-medium text-sm transition-all
                      ${location.pathname === link.to
                        ? 'bg-gaming-purple/20 text-white border border-gaming-purple/40'
                        : 'text-gaming-text-secondary hover:text-white hover:bg-gaming-card/60 border border-transparent'}`}>
                    {link.label}
                  </Link>
                ))}
                <Link to="/vendre"
                  className="px-4 py-3 rounded-xl font-heading font-bold text-sm text-white text-center
                             bg-gradient-to-r from-gaming-purple to-gaming-pink shadow-btn-glow">
                  + Vendre maintenant
                </Link>
                {!user && (
                  <>
                    <Link to="/connexion" className="px-4 py-3 rounded-xl font-heading font-medium text-sm text-gaming-text-secondary hover:bg-gaming-card/60 border border-transparent">Connexion</Link>
                    <Link to="/inscription" className="px-4 py-3 rounded-xl font-heading font-semibold text-sm text-white text-center bg-gradient-to-r from-gaming-purple to-gaming-pink">S'inscrire</Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Modal de recherche ── */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gaming-bg/85 backdrop-blur-sm"
              onClick={() => setSearchOpen(false)}
            />
            <motion.form
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              onSubmit={handleSearch}
              className="relative w-full max-w-xl z-10"
            >
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gaming-purple-light" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Rechercher PS5, manette, FIFA 24…"
                  className="w-full pl-12 pr-5 py-4 rounded-2xl text-gaming-text-primary
                             placeholder:text-gaming-text-muted focus:outline-none
                             border border-gaming-purple/40 focus:border-gaming-purple
                             focus:ring-2 focus:ring-gaming-purple/25
                             font-body text-base shadow-gaming-lg"
                  style={{ background: '#1a0038' }}
                />
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
