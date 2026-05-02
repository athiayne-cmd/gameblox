import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, X, CheckCircle, ArrowRight, ArrowLeft, Camera } from 'lucide-react'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { CATEGORIES } from '../utils/mockData'
import { formatPrice, slugify } from '../utils/formatters'
import toast from 'react-hot-toast'

const CONDITIONS = [
  { value: 'new',       label: 'Neuf', desc: 'Jamais utilisé, boîte d\'origine' },
  { value: 'excellent', label: 'Très bon état', desc: 'Peu utilisé, aucune marque visible' },
  { value: 'good',      label: 'Bon état', desc: 'Quelques traces d\'utilisation légères' },
  { value: 'fair',      label: 'État correct', desc: 'Marques visibles mais fonctionne parfaitement' },
]

const STEPS = ['Catégorie', 'Détails', 'Photos', 'Prix', 'Confirmation']

export default function Sell() {
  const [step, setStep]   = useState(0)
  const [done, setDone]   = useState(false)
  const [form, setForm]   = useState({
    category: '', title: '', description: '', condition: '',
    images: [], price: '', location: '', phone: ''
  })

  function set(key, val) { setForm(f => ({ ...f, [key]: val })) }

  function next() {
    if (step === 0 && !form.category) return toast.error('Sélectionne une catégorie')
    if (step === 1 && (!form.title || !form.description || !form.condition)) return toast.error('Remplis tous les champs')
    if (step === 3 && !form.price) return toast.error('Indique un prix')
    if (step === STEPS.length - 2) { setDone(true); return }
    setStep(s => s + 1)
  }

  function handleImageUpload(e) {
    const files = Array.from(e.target.files)
    if (form.images.length + files.length > 5) return toast.error('Maximum 5 photos')
    const newImgs = files.map(f => ({ url: URL.createObjectURL(f), file: f }))
    set('images', [...form.images, ...newImgs])
  }

  if (done) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md p-8">
        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.5 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-gaming-neon/10 border border-gaming-neon/30 flex items-center justify-center">
          <CheckCircle size={40} className="text-gaming-neon" />
        </motion.div>
        <h2 className="font-display font-bold text-3xl text-white mb-3">Annonce publiée !</h2>
        <p className="text-gaming-text-muted font-body mb-8">
          Ton annonce <strong className="text-white">"{form.title}"</strong> est maintenant visible par des milliers d'acheteurs.
        </p>
        <div className="flex flex-col gap-3">
          <Button fullWidth onClick={() => { setDone(false); setStep(0); setForm({ category:'',title:'',description:'',condition:'',images:[],price:'',location:'',phone:'' }) }}>
            Publier une autre annonce
          </Button>
          <Button variant="secondary" fullWidth onClick={() => window.location.href = '/marketplace'}>
            Voir le marketplace
          </Button>
        </div>
      </motion.div>
    </div>
  )

  const stepContent = [
    /* Step 0 — Catégorie */
    <div key="cat" className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {CATEGORIES.map(c => (
        <button key={c.id} onClick={() => set('category', c.id)}
          className={`p-4 rounded-2xl border text-center transition-all duration-200 group
            ${form.category === c.id
              ? 'border-gaming-purple bg-gaming-purple/15 shadow-purple-glow'
              : 'border-gaming-border bg-gaming-card hover:border-gaming-purple/40 hover:bg-gaming-card-hover'}`}>
          <div className={`w-12 h-12 mx-auto mb-2 rounded-xl flex items-center justify-center text-2xl bg-gradient-to-br ${c.gradient}`}>
            {c.icon}
          </div>
          <p className="text-sm font-heading font-semibold text-gaming-text-primary">{c.name}</p>
          <p className="text-xs text-gaming-text-muted mt-0.5">{c.count} produits</p>
        </button>
      ))}
    </div>,

    /* Step 1 — Détails */
    <div key="details" className="space-y-5">
      <Input label="Titre de l'annonce *" value={form.title} onChange={e => set('title', e.target.value)}
        placeholder="Ex : PS5 Edition Disque + 2 manettes" maxLength={80} />
      <div>
        <label className="text-sm font-heading font-medium text-gaming-text-secondary block mb-1.5">Description *</label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)}
          placeholder="Décris l'état, ce qui est inclus, l'historique d'utilisation..."
          rows={5} maxLength={1000}
          className="w-full bg-gaming-surface border border-gaming-border rounded-xl px-4 py-3 text-gaming-text-primary
                     placeholder:text-gaming-text-muted focus:outline-none focus:border-gaming-purple focus:ring-2
                     focus:ring-gaming-purple/20 transition-all font-body text-sm resize-none" />
        <p className="text-xs text-gaming-text-muted mt-1 text-right">{form.description.length}/1000</p>
      </div>
      <div>
        <label className="text-sm font-heading font-medium text-gaming-text-secondary block mb-3">État *</label>
        <div className="grid sm:grid-cols-2 gap-3">
          {CONDITIONS.map(c => (
            <button key={c.value} onClick={() => set('condition', c.value)}
              className={`p-4 rounded-xl border text-left transition-all duration-200
                ${form.condition === c.value
                  ? 'border-gaming-purple bg-gaming-purple/15'
                  : 'border-gaming-border bg-gaming-card hover:border-gaming-purple/40'}`}>
              <p className="font-heading font-semibold text-sm text-gaming-text-primary">{c.label}</p>
              <p className="text-xs text-gaming-text-muted mt-0.5 font-body">{c.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>,

    /* Step 2 — Photos */
    <div key="photos" className="space-y-4">
      <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200
        ${form.images.length < 5 ? 'border-gaming-border hover:border-gaming-purple/50 cursor-pointer' : 'border-gaming-border/30 opacity-50'}`}>
        <label className="cursor-pointer block">
          <Camera size={36} className="text-gaming-text-muted mx-auto mb-3" />
          <p className="font-heading font-semibold text-gaming-text-primary mb-1">Ajouter des photos</p>
          <p className="text-sm text-gaming-text-muted font-body">Maximum 5 photos · JPG, PNG, WEBP</p>
          <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={form.images.length >= 5} />
        </label>
      </div>
      {form.images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {form.images.map((img, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
              <img src={img.url} alt="" className="w-full h-full object-cover" />
              <button onClick={() => set('images', form.images.filter((_, j) => j !== i))}
                className="absolute inset-0 bg-gaming-bg/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <X size={20} className="text-white" />
              </button>
              {i === 0 && <span className="absolute top-1 left-1 text-xs bg-gaming-purple/90 text-white px-1.5 py-0.5 rounded font-heading">Photo principale</span>}
            </div>
          ))}
        </div>
      )}
      {form.images.length === 0 && (
        <p className="text-center text-sm text-gaming-text-muted font-body py-2">
          Les annonces avec photos reçoivent 5× plus de vues
        </p>
      )}
    </div>,

    /* Step 3 — Prix */
    <div key="prix" className="space-y-5">
      <div>
        <label className="text-sm font-heading font-medium text-gaming-text-secondary block mb-1.5">Prix de vente *</label>
        <div className="relative">
          <input type="number" value={form.price} onChange={e => set('price', e.target.value)}
            placeholder="45000" min="1000"
            className="w-full bg-gaming-surface border border-gaming-border rounded-xl px-4 py-3 pr-20
                       text-gaming-text-primary placeholder:text-gaming-text-muted focus:outline-none
                       focus:border-gaming-purple focus:ring-2 focus:ring-gaming-purple/20 transition-all font-mono text-lg" />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gaming-text-muted font-heading text-sm">FCFA</span>
        </div>
        {form.price && <p className="text-gaming-gold font-mono text-lg font-bold mt-2">{formatPrice(Number(form.price))}</p>}
      </div>
      <Input label="Ville / Localisation *" value={form.location} onChange={e => set('location', e.target.value)}
        placeholder="Ex : Dakar, Plateau" />
      <Input label="Numéro de téléphone *" value={form.phone} onChange={e => set('phone', e.target.value)}
        placeholder="Ex : +221 77 XXX XX XX" type="tel" />
      <div className="p-4 rounded-xl bg-gaming-purple/5 border border-gaming-purple/20 space-y-2">
        <p className="text-sm font-heading font-semibold text-gaming-text-primary">Commission GameBlox</p>
        <p className="text-xs text-gaming-text-muted font-body">Une commission de 3% est prélevée uniquement à la vente. Publication gratuite.</p>
        {form.price && <p className="text-xs text-gaming-gold font-mono">Tu recevras : {formatPrice(Math.round(Number(form.price) * 0.97))}</p>}
      </div>
    </div>,

    /* Step 4 — Confirmation */
    <div key="confirm" className="space-y-5">
      <div className="gaming-card p-5 space-y-3">
        <h3 className="font-heading font-semibold text-gaming-text-primary">Récapitulatif</h3>
        {[
          { label: 'Catégorie', value: CATEGORIES.find(c => c.id === form.category)?.name },
          { label: 'Titre', value: form.title },
          { label: 'État', value: CONDITIONS.find(c => c.value === form.condition)?.label },
          { label: 'Prix', value: formatPrice(Number(form.price)) },
          { label: 'Localisation', value: form.location },
          { label: 'Photos', value: `${form.images.length} photo(s)` },
        ].filter(i => i.value).map(item => (
          <div key={item.label} className="flex justify-between items-center py-2 border-b border-gaming-border/30 last:border-0">
            <span className="text-sm text-gaming-text-muted font-body">{item.label}</span>
            <span className="text-sm font-heading font-semibold text-gaming-text-primary">{item.value}</span>
          </div>
        ))}
      </div>
      <div className="flex items-start gap-3 p-4 rounded-xl bg-gaming-neon/5 border border-gaming-neon/20">
        <CheckCircle size={16} className="text-gaming-neon flex-shrink-0 mt-0.5" />
        <p className="text-xs text-gaming-text-secondary font-body">En publiant cette annonce, tu acceptes les conditions d'utilisation de GameBlox et confirmes que le produit t'appartient.</p>
      </div>
    </div>,
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="page-container max-w-2xl">
        <h1 className="font-display font-bold text-3xl text-white mb-2">Publier une annonce</h1>
        <p className="text-gaming-text-muted font-body mb-8">Gratuit · En ligne en 5 minutes</p>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all duration-300
                ${i < step ? 'bg-gaming-neon text-gaming-bg' : i === step ? 'bg-gaming-purple text-white shadow-purple-glow' : 'bg-gaming-surface border border-gaming-border text-gaming-text-muted'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px transition-all duration-500 ${i < step ? 'bg-gaming-neon' : 'bg-gaming-border'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="gaming-card p-6 mb-6">
          <h2 className="font-heading font-semibold text-gaming-text-primary text-lg mb-6">
            {STEPS[step]}
          </h2>
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              {stepContent[step]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}
            icon={<ArrowLeft size={16}/>}>
            Précédent
          </Button>
          <Button onClick={next} iconRight={step === STEPS.length - 1 ? <CheckCircle size={16}/> : <ArrowRight size={16}/>}>
            {step === STEPS.length - 1 ? 'Publier l\'annonce' : 'Continuer'}
          </Button>
        </div>
      </div>
    </div>
  )
}
