import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ShieldCheck, Zap, Star, TrendingUp, ChevronRight } from 'lucide-react'
import ProductCard from '../components/ui/ProductCard'
import CategoryCard from '../components/ui/CategoryCard'
import Button from '../components/ui/Button'
import Stories from '../components/ui/Stories'
import Particles from '../components/ui/Particles'
import { PRODUCTS, CATEGORIES, STATS, TESTIMONIALS, CAT_STYLE } from '../utils/mockData'
import { formatPrice } from '../utils/formatters'

/* ── Hero ───────────────────────────────────────────────────── */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden hero-gradient">
      {/* Particules lumineuses */}
      <Particles />

      {/* Grille de fond */}
      <div className="absolute inset-0 grid-bg opacity-30" />

      {/* Orbes de lueur */}
      <div className="absolute top-1/4 left-1/6 w-[500px] h-[500px] bg-gaming-purple/18 rounded-full blur-[140px] animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/6 w-96 h-96 bg-gaming-pink/12 rounded-full blur-[120px] animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gaming-purple/6 rounded-full blur-[100px]" />

      <div className="page-container relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left: Text */}
          <div className="space-y-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-heading font-semibold
                               bg-gradient-to-r from-gaming-purple/20 to-gaming-pink/10
                               border border-gaming-purple/40 text-gaming-purple-light">
                <Zap size={14} className="text-gaming-pink" /> Marketplace N°1 en Afrique de l'Ouest
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="font-display font-bold leading-none"
            >
              <span className="text-5xl sm:text-6xl xl:text-7xl text-white block">TON GEAR</span>
              <span className="text-5xl sm:text-6xl xl:text-7xl gradient-text block">GAMING</span>
              <span className="text-5xl sm:text-6xl xl:text-7xl text-white block">AU MEILLEUR PRIX</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="text-gaming-text-secondary font-body text-lg leading-relaxed max-w-md"
            >
              Achetez, vendez et échangez vos consoles, jeux et accessoires gaming en toute sécurité. Paiement local garanti.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
              className="flex flex-wrap gap-3"
            >
              <Link to="/marketplace">
                <Button size="lg" variant="primary" iconRight={<ArrowRight size={18} />}>
                  Explorer le Marketplace
                </Button>
              </Link>
              <Link to="/vendre">
                <Button size="lg" variant="secondary">
                  Vendre maintenant
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-6 pt-2"
            >
              {STATS.map(s => (
                <div key={s.label} className="flex flex-col">
                  <span className="font-display font-bold text-2xl gradient-text">{s.value}</span>
                  <span className="text-xs text-gaming-text-muted font-body">{s.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Product showcase */}
          <motion.div
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
            className="hidden lg:grid grid-cols-2 gap-4"
          >
            {PRODUCTS.filter(p => p.featured).slice(0, 4).map((p, i) => {
              const cat = CAT_STYLE[p.category] || { emoji: '🎮', gradient: 'from-gaming-surface to-gaming-card' }
              return (
                <motion.div
                  key={p.id}
                  animate={{ y: [0, i % 2 === 0 ? -8 : 8, 0] }}
                  transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                  className={`gaming-card overflow-hidden ${i === 0 ? 'col-span-2' : ''}`}
                >
                  <Link to={`/produit/${p.slug}`}>
                    <div className={`relative overflow-hidden ${i === 0 ? 'h-48' : 'h-36'}`}>
                      {/* Image produit ou catégorie */}
                      {(p.images?.[0] || cat.image) ? (
                        <img
                          src={p.images?.[0] || cat.image}
                          alt={p.title}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${cat.gradient} flex items-center justify-center`}>
                          <span className={i === 0 ? 'text-7xl' : 'text-5xl'}>{cat.emoji}</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute bottom-3 left-3">
                        <p className="font-heading font-semibold text-white text-sm line-clamp-1">{p.title}</p>
                        <p className="neon-price font-mono font-bold text-sm">{formatPrice(p.price)}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>

      {/* Marquee categories */}
      <div className="absolute bottom-0 left-0 right-0 py-3 overflow-hidden border-t border-gaming-purple/15"
           style={{ background: 'rgba(18,0,42,0.7)', backdropFilter: 'blur(12px)' }}>
        <div className="flex animate-marquee whitespace-nowrap">
          {[...CATEGORIES, ...CATEGORIES].map((c, i) => (
            <span key={i} className="inline-flex items-center gap-2 mx-6 text-gaming-text-muted text-sm font-body flex-shrink-0">
              <span className={`inline-block w-4 h-4 rounded-sm bg-gradient-to-br ${c.gradient} flex-shrink-0`} />
              {c.name}
              <span className="text-gaming-purple/30 mx-2">·</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Categories ─────────────────────────────────────────────── */
function CategoriesSection() {
  return (
    <section className="py-20 page-container">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-gaming-purple font-heading font-semibold text-sm mb-2">Parcourir par catégorie</p>
          <h2 className="section-title">Que cherches-tu ?</h2>
        </div>
        <Link to="/marketplace" className="hidden sm:flex items-center gap-1 text-sm text-gaming-text-muted hover:text-gaming-purple-light transition-colors font-heading">
          Voir tout <ChevronRight size={16} />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
        {CATEGORIES.map((cat, i) => (
          <CategoryCard key={cat.id} category={cat} index={i} />
        ))}
      </div>
    </section>
  )
}

/* ── Featured Products ──────────────────────────────────────── */
function FeaturedSection() {
  const featured = PRODUCTS.filter(p => p.featured)
  return (
    <section className="py-16 bg-gaming-surface/40">
      <div className="page-container">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-gaming-gold font-heading font-semibold text-sm mb-2 flex items-center gap-2">
              <TrendingUp size={14} /> En vedette
            </p>
            <h2 className="section-title">Produits du moment</h2>
          </div>
          <Link to="/marketplace" className="hidden sm:flex items-center gap-1 text-sm text-gaming-text-muted hover:text-gaming-purple-light transition-colors font-heading">
            Voir tout <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {featured.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
        </div>
      </div>
    </section>
  )
}

/* ── How it works ───────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { step: '01', icon: '👤', title: 'Créez votre compte', desc: 'Inscription gratuite en 2 minutes. Email ou numéro de téléphone.' },
    { step: '02', icon: '📸', title: 'Publiez votre annonce', desc: 'Photos, description, prix. Votre annonce est en ligne en 5 minutes.' },
    { step: '03', icon: '💸', title: 'Vendez et encaissez', desc: 'Recevez vos paiements via Wave, Orange Money, MTN ou Moov Money.' },
  ]
  return (
    <section className="py-20 page-container" id="how">
      <div className="text-center mb-14">
        <p className="text-gaming-cyan font-heading font-semibold text-sm mb-2">Simple & rapide</p>
        <h2 className="section-title">Comment ça marche ?</h2>
      </div>
      <div className="grid md:grid-cols-3 gap-6 relative">
        <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-px bg-gradient-to-r from-gaming-purple to-gaming-cyan" />
        {steps.map((s, i) => (
          <motion.div
            key={s.step}
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }} viewport={{ once: true }}
            className="relative gaming-card p-7 text-center group"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gaming-purple rounded-full text-xs font-mono font-bold text-white">
              {s.step}
            </div>
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-gaming-purple/20 to-gaming-cyan/20 border border-gaming-border flex items-center justify-center text-3xl group-hover:shadow-purple-glow transition-all duration-300">
              {s.icon}
            </div>
            <h3 className="font-heading font-semibold text-gaming-text-primary text-lg mb-2">{s.title}</h3>
            <p className="text-gaming-text-muted font-body text-sm leading-relaxed">{s.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ── Recent Listings ────────────────────────────────────────── */
function RecentListings() {
  const recent = [...PRODUCTS].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8)
  return (
    <section className="py-16 page-container">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-gaming-neon font-heading font-semibold text-sm mb-2">Dernières annonces</p>
          <h2 className="section-title">Nouvelles arrivées</h2>
        </div>
        <Link to="/marketplace" className="hidden sm:flex items-center gap-1 text-sm text-gaming-text-muted hover:text-gaming-purple-light transition-colors font-heading">
          Voir tout <ChevronRight size={16} />
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {recent.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
      </div>
    </section>
  )
}

/* ── Trust / Testimonials ───────────────────────────────────── */
function TrustSection() {
  return (
    <section className="py-20 bg-gaming-surface/40">
      <div className="page-container">
        {/* Trust badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
          {[
            { icon: <ShieldCheck size={28} className="text-gaming-neon" />, bg: 'from-gaming-neon/20 to-gaming-neon/5',   border: 'border-gaming-neon/25',   title: 'Paiements sécurisés', desc: 'Wave, Orange Money, MTN Money, Moov Money. Transactions 100% protégées.' },
            { icon: <Star size={28} className="text-[#ffd700]" />,          bg: 'from-[#ffd700]/20 to-[#ff8c00]/5',       border: 'border-[#ffd700]/25',     title: 'Vendeurs notés',      desc: 'Chaque vendeur est évalué par la communauté. Achetez en confiance.' },
            { icon: <Zap size={28} className="text-gaming-pink" />,         bg: 'from-gaming-pink/20 to-gaming-purple/5', border: 'border-gaming-pink/25',   title: 'Mise en ligne rapide', desc: "Publiez votre annonce en 5 minutes et touchez des milliers d'acheteurs." },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }} viewport={{ once: true }}
              className="gaming-card p-6 flex gap-4 items-start"
            >
              <div className={`p-3 rounded-xl bg-gradient-to-br ${item.bg} border ${item.border} flex-shrink-0`}>{item.icon}</div>
              <div>
                <h3 className="font-heading font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-gaming-text-muted font-body text-sm leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <h2 className="section-title text-center mb-10">Ce qu'ils disent de nous</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }} viewport={{ once: true }}
              className="gaming-card p-6 space-y-4"
            >
              <div className="flex items-center gap-1">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} size={14} className="fill-[#ffd700] text-[#ffd700]" />
                ))}
              </div>
              <p className="text-gaming-text-secondary font-body text-sm leading-relaxed">"{t.text}"</p>
              <div className="flex items-center gap-3 pt-2 border-t border-gaming-border/40">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gaming-purple to-gaming-pink flex items-center justify-center text-sm font-bold text-white">
                  {t.name[0]}
                </div>
                <div>
                  <p className="font-heading font-semibold text-sm text-gaming-text-primary">{t.name}</p>
                  <p className="text-xs text-gaming-text-muted font-body">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── CTA Banner ─────────────────────────────────────────────── */
function CTABanner() {
  return (
    <section className="py-16 page-container">
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl p-10 md:p-14 text-center
                   border border-gaming-purple/35"
        style={{ background: 'linear-gradient(135deg, #1a0038 0%, #2d006040 50%, #1a0038 100%)' }}
      >
        <div className="absolute inset-0 grid-bg opacity-15" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-gaming-purple/25 rounded-full blur-[90px]" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-gaming-pink/15 rounded-full blur-[80px]" />
        <div className="relative z-10">
          <h2 className="font-display font-bold text-4xl md:text-5xl text-white mb-4">
            Prêt à vendre ton gear gaming ?
          </h2>
          <p className="text-gaming-text-secondary font-body text-lg mb-8 max-w-md mx-auto">
            Rejoins 5 000+ vendeurs et touche des milliers d'acheteurs passionnés de gaming.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/vendre">
              <Button size="xl" variant="primary" iconRight={<ArrowRight size={20} />}>
                Publier une annonce gratuite
              </Button>
            </Link>
            <Link to="/inscription">
              <Button size="xl" variant="outline">S'inscrire gratuitement</Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

/* ── Page ───────────────────────────────────────────────────── */
export default function Home() {
  return (
    <>
      <Hero />
      <Stories />
      <CategoriesSection />
      <FeaturedSection />
      <HowItWorks />
      <RecentListings />
      <TrustSection />
      <CTABanner />
    </>
  )
}
