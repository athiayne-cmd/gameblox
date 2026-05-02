import { Link } from 'react-router-dom'
import { Zap, Instagram, Twitter, Facebook, Youtube } from 'lucide-react'

const LINKS = {
  marketplace: [
    { to: '/marketplace',             label: 'Tous les produits' },
    { to: '/marketplace?categorie=ps5',  label: 'PlayStation 5' },
    { to: '/marketplace?categorie=xbox', label: 'Xbox Series' },
    { to: '/marketplace?categorie=nintendo', label: 'Nintendo' },
    { to: '/marketplace?categorie=jeux',  label: 'Jeux CD' },
  ],
  vendre: [
    { to: '/vendre',       label: 'Publier une annonce' },
    { to: '/profil/me',    label: 'Mon espace vendeur' },
    { to: '/messages',     label: 'Messagerie' },
  ],
  aide: [
    { to: '/#how', label: 'Comment ça marche' },
    { to: '/#faq',  label: 'FAQ' },
    { to: '/#contact', label: 'Nous contacter' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-gaming-surface border-t border-gaming-border/30 mt-20">
      <div className="page-container py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gaming-purple flex items-center justify-center shadow-purple-glow">
                <Zap size={18} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white neon-text">
                GAME<span className="text-gaming-cyan">BLOX</span>
              </span>
            </Link>
            <p className="text-sm text-gaming-text-muted font-body leading-relaxed max-w-xs">
              Le marketplace gaming de référence en Afrique de l'Ouest. Achetez, vendez et échangez en toute sécurité.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: <Instagram size={16} />, href: '#' },
                { icon: <Twitter size={16} />,   href: '#' },
                { icon: <Facebook size={16} />,  href: '#' },
                { icon: <Youtube size={16} />,   href: '#' },
              ].map((s, i) => (
                <a key={i} href={s.href}
                  className="p-2 rounded-xl bg-gaming-card border border-gaming-border hover:border-gaming-purple/50
                             text-gaming-text-muted hover:text-gaming-purple transition-all duration-200">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: 'Marketplace', links: LINKS.marketplace },
            { title: 'Vendre',      links: LINKS.vendre },
            { title: 'Aide',        links: LINKS.aide },
          ].map(col => (
            <div key={col.title} className="space-y-4">
              <h4 className="font-heading font-semibold text-gaming-text-primary text-sm">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm text-gaming-text-muted hover:text-gaming-purple transition-colors font-body">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-gaming-border/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gaming-text-muted font-body">
            © 2024 GameBlox. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4">
            {['CGV', 'Confidentialité', 'Cookies'].map(t => (
              <Link key={t} to="#" className="text-xs text-gaming-text-muted hover:text-gaming-purple transition-colors font-body">{t}</Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gaming-neon animate-pulse-slow" />
            <span className="text-xs text-gaming-text-muted font-body">Paiement sécurisé</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
