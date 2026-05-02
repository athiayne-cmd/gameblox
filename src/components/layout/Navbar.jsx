import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, ShoppingCart, Menu, X, Bell, User,
  ChevronDown, LogOut, Settings, Package, MessageCircle, Zap
} from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { useCart } from '../../contexts/CartContext'

export default function Navbar() {
  const [scrolled,      setScrolled]      = useState(false)
  const [mobileOpen,    setMobileOpen]    = useState(false)
  const [userMenuOpen,  setUserMenuOpen]  = useState(false)
  const [searchOpen,    setSearchOpen]    = useState(false)
  const [searchQuery,   setSearchQuery]   = useState('')
  const { user, profile, signOut }        = useAuth()
  const { count }                         = useCart()
  const navigate                          = useNavigate()
  const location                          = useLocation()

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
    { to: '/vendre',      label: 'Vendre', highlight: true },
  ]

  return (
    <>
      <nav className={`
        fixed top-0 left-0 right-0 z-40 transition-all duration-300
        ${scrolled ? 'glass-dark shadow-gaming-lg' : 'bg-transparent'}
      `}>
        <div className="page-container">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-gaming-purple flex items-center justify-center shadow-purple-glow">
                <Zap size={18} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white neon-text tracking-wide">
                GAME<span className="text-gaming-cyan">BLOX</span>
              </span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`
                    px-4 py-2 rounded-xl font-heading font-medium text-sm transition-all duration-200
                    ${link.highlight
                      ? 'bg-gaming-purple hover:bg-gaming-purple-dark text-white shadow-purple-glow'
                      : location.pathname === link.to
                        ? 'text-white bg-gaming-card/50'
                        : 'text-gaming-text-secondary hover:text-white hover:bg-gaming-card/50'
                    }
                  `}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-xl text-gaming-text-secondary hover:text-white hover:bg-gaming-card/60 transition-all duration-200"
              >
                <Search size={18} />
              </button>

              {/* Messages */}
              {user && (
                <Link to="/messages" className="p-2.5 rounded-xl text-gaming-text-secondary hover:text-white hover:bg-gaming-card/60 transition-all duration-200 relative">
                  <MessageCircle size={18} />
                  <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-gaming-neon rounded-full" />
                </Link>
              )}

              {/* Cart */}
              <Link to="/panier" className="p-2.5 rounded-xl text-gaming-text-secondary hover:text-white hover:bg-gaming-card/60 transition-all duration-200 relative">
                <ShoppingCart size={18} />
                {count > 0 && (
                  <motion.span
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gaming-purple rounded-full text-white text-[9px] font-bold flex items-center justify-center"
                  >
                    {count}
                  </motion.span>
                )}
              </Link>

              {/* User */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(o => !o)}
                    className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-gaming-card/60 transition-all duration-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gaming-purple to-gaming-cyan flex items-center justify-center text-sm font-bold text-white">
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
                        className="absolute right-0 mt-2 w-52 glass rounded-2xl shadow-gaming-lg overflow-hidden z-50"
                        onMouseLeave={() => setUserMenuOpen(false)}
                      >
                        <div className="p-3 border-b border-gaming-border/40">
                          <p className="font-heading font-semibold text-sm text-white truncate">
                            {profile?.full_name || 'Mon compte'}
                          </p>
                          <p className="text-xs text-gaming-text-muted truncate">{user.email}</p>
                        </div>
                        {[
                          { to: `/profil/${user.id}`, icon: <User size={14}/>,    label: 'Mon profil' },
                          { to: '/vendre',            icon: <Package size={14}/>, label: 'Mes annonces' },
                          { to: '/messages',          icon: <MessageCircle size={14}/>, label: 'Messages' },
                        ].map(item => (
                          <Link key={item.to} to={item.to} onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gaming-text-secondary hover:text-white hover:bg-gaming-card-hover transition-colors">
                            {item.icon} {item.label}
                          </Link>
                        ))}
                        <div className="border-t border-gaming-border/40">
                          <button onClick={() => { signOut(); setUserMenuOpen(false) }}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gaming-red hover:bg-gaming-red/10 transition-colors w-full text-left">
                            <LogOut size={14} /> Déconnexion
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <Link to="/connexion" className="px-4 py-2 rounded-xl font-heading font-medium text-sm text-gaming-text-secondary hover:text-white transition-colors">
                    Connexion
                  </Link>
                  <Link to="/inscription" className="px-4 py-2 rounded-xl font-heading font-semibold text-sm bg-gaming-purple hover:bg-gaming-purple-dark text-white shadow-purple-glow transition-all duration-200">
                    S'inscrire
                  </Link>
                </div>
              )}

              {/* Mobile menu toggle */}
              <button onClick={() => setMobileOpen(o => !o)}
                className="md:hidden p-2.5 rounded-xl text-gaming-text-secondary hover:text-white hover:bg-gaming-card/60 transition-all">
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden glass-dark border-t border-gaming-border/30"
            >
              <div className="page-container py-4 flex flex-col gap-2">
                {navLinks.map(link => (
                  <Link key={link.to} to={link.to}
                    className={`px-4 py-3 rounded-xl font-heading font-medium text-sm transition-all
                      ${link.highlight ? 'bg-gaming-purple text-white' : 'text-gaming-text-secondary hover:text-white hover:bg-gaming-card/60'}`}>
                    {link.label}
                  </Link>
                ))}
                {!user && (
                  <>
                    <Link to="/connexion" className="px-4 py-3 rounded-xl font-heading font-medium text-sm text-gaming-text-secondary hover:bg-gaming-card/60">Connexion</Link>
                    <Link to="/inscription" className="px-4 py-3 rounded-xl font-heading font-semibold text-sm bg-gaming-purple text-white text-center">S'inscrire</Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Search modal */}
      <AnimatePresence>
        {searchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gaming-bg/80 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
            <motion.form
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              onSubmit={handleSearch}
              className="relative w-full max-w-xl"
            >
              <div className="relative">
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gaming-text-muted" />
                <input
                  autoFocus
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Rechercher PS5, manette, FIFA 24..."
                  className="w-full pl-12 pr-5 py-4 glass rounded-2xl text-gaming-text-primary
                             placeholder:text-gaming-text-muted focus:outline-none focus:border-gaming-purple
                             border border-gaming-border focus:ring-2 focus:ring-gaming-purple/20
                             font-body text-base shadow-gaming-lg"
                />
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
