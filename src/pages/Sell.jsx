import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, ArrowRight, ArrowLeft, Camera, Video, Zap, Lock } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import VideoPlayer from '../components/ui/VideoPlayer'
import { CATEGORIES } from '../utils/mockData'
import { formatPrice } from '../utils/formatters'
import { validateVideoSize, getVideoDuration, parseVideoUrl } from '../lib/storage'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

const CONDITIONS = [
  { value: 'new',       label: 'Neuf',          desc: "Jamais utilisé, boîte d'origine scellée" },
  { value: 'excellent', label: 'Très bon état',  desc: 'Peu utilisé, aucune marque visible' },
  { value: 'good',      label: 'Bon état',       desc: "Quelques traces d'utilisation légères" },
  { value: 'fair',      label: 'État correct',   desc: 'Marques visibles mais fonctionne parfaitement' },
]

const ETAPES = ['Catégorie', 'Détails', 'Médias', 'Prix', 'Confirmation']

const VILLES_SN = [
  'Dakar', 'Thiès', 'Saint-Louis', 'Ziguinchor',
  'Mbour', 'Kaolack', 'Touba', 'Diourbel',
  'Rufisque', 'Louga', 'Tambacounda', 'Kolda',
]

export default function Sell() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()

  const [etape, setEtape]         = useState(0)
  const [termine, setTermine]     = useState(false)
  const [checkingLimit, setCheckingLimit] = useState(true)
  const [limitReached, setLimitReached]   = useState(false)
  const [form, setForm] = useState({
    category: '', title: '', description: '', condition: '',
    images: [], videoFile: null, videoUrl: '', price: '', location: '', phone: ''
  })
  const [videoMode, setVideoMode]       = useState('url')
  const [videoPreview, setVideoPreview] = useState(null)
  const [publishing, setPublishing]     = useState(false)

  useEffect(() => {
    if (!user) { navigate('/connexion'); return }
    checkProductLimit()
  }, [user])

  async function checkProductLimit() {
    if (profile?.is_premium) { setCheckingLimit(false); return }
    try {
      const { count } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true })
        .eq('seller_id', user.id)
      setLimitReached((count ?? 0) >= 1)
    } catch {
      // En cas d'erreur réseau, on laisse passer
    } finally {
      setCheckingLimit(false)
    }
  }

  function set(key, val) { setForm(f => ({ ...f, [key]: val })) }

  function suivant() {
    if (etape === 0 && !form.category)  return toast.error('Sélectionne une catégorie')
    if (etape === 1 && (!form.title || !form.description || !form.condition))
      return toast.error('Remplis tous les champs obligatoires')
    if (etape === 3 && !form.price)     return toast.error('Indique un prix')
    if (etape === 3 && !form.location)  return toast.error('Indique ta ville')
    if (etape === 3 && !form.phone)     return toast.error('Indique ton numéro de téléphone')
    if (etape === ETAPES.length - 1)    { publier(); return }
    setEtape(s => s + 1)
  }

  async function publier() {
    setPublishing(true)
    try {
      // Upload des images vers Supabase Storage
      const uploadedUrls = []
      for (const img of form.images) {
        try {
          const ext = img.file.name.split('.').pop()
          const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
          const { error: upErr } = await supabase.storage.from('product-images').upload(path, img.file)
          if (!upErr) {
            const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(path)
            uploadedUrls.push(urlData.publicUrl)
          }
        } catch { /* image ignorée si upload échoue */ }
      }

      // Génération du slug unique
      const base = form.title.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      const slug = `${base}-${Date.now()}`

      // Upload vidéo si fichier sélectionné
      let finalVideoUrl = form.videoUrl || null
      if (form.videoFile) {
        const ext  = form.videoFile.name.split('.').pop()
        const path = `${user.id}/${Date.now()}.${ext}`
        const { error: vidErr } = await supabase.storage.from('videos').upload(path, form.videoFile)
        if (vidErr) {
          toast.error('Upload vidéo échoué — vérifie que le bucket "videos" est créé dans Supabase Storage')
          setPublishing(false)
          return
        }
        const { data: vUrl } = supabase.storage.from('videos').getPublicUrl(path)
        finalVideoUrl = vUrl.publicUrl
      }

      const { error } = await supabase.from('products').insert({
        title:       form.title,
        slug,
        description: form.description,
        price:       parseInt(form.price),
        category:    form.category,
        condition:   form.condition,
        images:      uploadedUrls,
        video_url:   finalVideoUrl,
        seller_id:   user.id,
        location:    form.location,
        status:      'active',
      })

      if (error) throw error
      setTermine(true)
    } catch (err) {
      toast.error(err.message || 'Erreur lors de la publication')
    } finally {
      setPublishing(false)
    }
  }

  async function ajouterVideo(e) {
    const file = e.target.files[0]
    if (!file) return
    try {
      validateVideoSize(file)
      await getVideoDuration(file)
      const url = URL.createObjectURL(file)
      set('videoFile', file)
      setVideoPreview(url)
      toast.success('Vidéo ajoutée !')
    } catch (err) {
      toast.error(err.message)
    }
  }

  function validerVideoUrl(url) {
    const parsed = parseVideoUrl(url)
    if (!parsed) return toast.error('Lien invalide — colle un lien YouTube ou TikTok')
    set('videoUrl', url)
    toast.success('Lien vidéo validé !')
  }

  function ajouterPhotos(e) {
    const fichiers = Array.from(e.target.files)
    if (form.images.length + fichiers.length > 5)
      return toast.error('Maximum 5 photos autorisées')
    const nouvelles = fichiers.map(f => ({ url: URL.createObjectURL(f), file: f }))
    set('images', [...form.images, ...nouvelles])
    toast.success(`${fichiers.length} photo(s) ajoutée(s)`)
  }

  if (checkingLimit) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-gaming-purple border-t-transparent animate-spin" />
    </div>
  )

  if (limitReached) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-sm p-8 gaming-card border-gaming-gold/30">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gaming-gold/10 border border-gaming-gold/30 flex items-center justify-center">
          <Lock size={28} className="text-gaming-gold" />
        </div>
        <h2 className="font-display font-bold text-2xl text-white mb-3">
          Limite gratuite atteinte
        </h2>
        <p className="text-gaming-text-muted font-body leading-relaxed mb-6">
          Vous avez atteint la limite gratuite.<br />
          Passez Premium pour publier des<br />
          annonces illimitées&nbsp;🚀
        </p>
        <Link to="/abonnement">
          <Button fullWidth size="lg">
            <Zap size={16} className="mr-2" /> Devenir Premium
          </Button>
        </Link>
        <Link to="/marketplace" className="block mt-4 text-sm text-gaming-text-muted hover:text-gaming-purple transition-colors font-heading">
          Voir le marketplace
        </Link>
      </motion.div>
    </div>
  )

  if (termine) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md p-8">
        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 0.5 }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-gaming-neon/10 border border-gaming-neon/30 flex items-center justify-center">
          <CheckCircle size={40} className="text-gaming-neon" />
        </motion.div>
        <h2 className="font-display font-bold text-3xl text-white mb-3">Annonce publiée !</h2>
        <p className="text-gaming-text-muted font-body mb-8 leading-relaxed">
          Ton annonce <strong className="text-white">"{form.title}"</strong> est maintenant visible
          par des milliers d'acheteurs au Sénégal.
        </p>
        <div className="flex flex-col gap-3">
          <Button fullWidth onClick={() => {
            setTermine(false); setEtape(0)
            setForm({ category:'', title:'', description:'', condition:'', images:[], videoFile:null, videoUrl:'', price:'', location:'', phone:'' })
            setCheckingLimit(true)
            checkProductLimit()
          }}>
            Publier une autre annonce
          </Button>
          <Button variant="secondary" fullWidth onClick={() => window.location.href = '/marketplace'}>
            Voir le marketplace
          </Button>
        </div>
      </motion.div>
    </div>
  )

  const contenu = [

    /* Étape 0 — Catégorie */
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
          <p className="text-xs text-gaming-text-muted mt-0.5">{c.count} annonces</p>
        </button>
      ))}
    </div>,

    /* Étape 1 — Détails */
    <div key="details" className="space-y-5">
      <Input label="Titre de l'annonce *" value={form.title} onChange={e => set('title', e.target.value)}
        placeholder="Ex : PS5 Edition Disque + 2 manettes" maxLength={80}
        hint={`${form.title.length}/80 caractères`} />
      <div>
        <label className="text-sm font-heading font-medium text-gaming-text-secondary block mb-1.5">
          Description * <span className="text-gaming-text-muted font-normal">(état, contenu, historique)</span>
        </label>
        <textarea value={form.description} onChange={e => set('description', e.target.value)}
          placeholder="Décris l'état du produit, ce qui est inclus dans la vente, depuis combien de temps tu l'as..."
          rows={5} maxLength={1000}
          className="w-full bg-gaming-surface border border-gaming-border rounded-xl px-4 py-3 text-gaming-text-primary
                     placeholder:text-gaming-text-muted focus:outline-none focus:border-gaming-purple focus:ring-2
                     focus:ring-gaming-purple/20 transition-all font-body text-sm resize-none" />
        <p className="text-xs text-gaming-text-muted mt-1 text-right">{form.description.length}/1000</p>
      </div>
      <div>
        <label className="text-sm font-heading font-medium text-gaming-text-secondary block mb-3">État du produit *</label>
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

    /* Étape 2 — Médias (Photos + Vidéo) */
    <div key="medias" className="space-y-6">
      {/* ── Section Photos ── */}
      <div>
        <h3 className="font-heading font-semibold text-gaming-text-primary text-sm mb-3 flex items-center gap-2">
          <Camera size={16} className="text-gaming-purple" /> Photos du produit
        </h3>
      <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200
        ${form.images.length < 5
          ? 'border-gaming-border hover:border-gaming-purple/50 cursor-pointer'
          : 'border-gaming-border/30 opacity-50 cursor-not-allowed'}`}>
        <label className={`${form.images.length < 5 ? 'cursor-pointer' : 'cursor-not-allowed'} block`}>
          <Camera size={36} className="text-gaming-text-muted mx-auto mb-3" />
          <p className="font-heading font-semibold text-gaming-text-primary mb-1">Ajouter des photos</p>
          <p className="text-sm text-gaming-text-muted font-body">Maximum 5 photos · JPG, PNG, WEBP</p>
          <p className="text-xs text-gaming-purple mt-2 font-heading">
            Les annonces avec photos reçoivent 5× plus de vues
          </p>
          <input type="file" multiple accept="image/*" className="hidden"
            onChange={ajouterPhotos} disabled={form.images.length >= 5} />
        </label>
      </div>

      {form.images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-3">
          {form.images.map((img, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden group">
              <img src={img.url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
              <button onClick={() => set('images', form.images.filter((_, j) => j !== i))}
                className="absolute inset-0 bg-gaming-bg/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <X size={20} className="text-white" />
              </button>
              {i === 0 && <span className="absolute top-1 left-1 text-xs bg-gaming-purple/90 text-white px-1.5 py-0.5 rounded font-heading">Principale</span>}
            </div>
          ))}
        </div>
      )}
      </div>

      {/* ── Section Vidéo ── */}
      <div className="border-t border-gaming-border/30 pt-5">
        <h3 className="font-heading font-semibold text-gaming-text-primary text-sm mb-1 flex items-center gap-2">
          <Video size={16} className="text-gaming-cyan" /> Vidéo du produit
          <span className="text-xs font-normal text-gaming-text-muted">(facultatif)</span>
        </h3>
        <p className="text-xs text-gaming-text-muted font-body mb-4">
          Ajoute une vidéo pour attirer 10× plus d'acheteurs. Max 30 secondes · 50 Mo.
        </p>

        {/* Onglets upload / lien */}
        <div className="flex gap-2 mb-4">
          {[
            { id: 'url',    label: '🔗 Lien YouTube / TikTok' },
            { id: 'upload', label: '📤 Uploader une vidéo' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setVideoMode(tab.id)}
              className={`flex-1 py-2 rounded-xl text-xs font-heading font-semibold transition-all
                ${videoMode === tab.id ? 'bg-gaming-cyan/15 border border-gaming-cyan/40 text-gaming-cyan' : 'bg-gaming-surface border border-gaming-border text-gaming-text-muted hover:text-white'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {videoMode === 'url' ? (
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                value={form.videoUrl}
                onChange={e => set('videoUrl', e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... ou TikTok"
                className="flex-1 bg-gaming-surface border border-gaming-border rounded-xl px-4 py-2.5 text-sm
                           text-gaming-text-primary placeholder:text-gaming-text-muted focus:outline-none
                           focus:border-gaming-cyan transition-all font-body"
              />
              <Button size="sm" variant="cyan" onClick={() => validerVideoUrl(form.videoUrl)}>
                Valider
              </Button>
            </div>
            {form.videoUrl && parseVideoUrl(form.videoUrl) && (
              <div className="rounded-xl overflow-hidden border border-gaming-border">
                <VideoPlayer url={form.videoUrl} />
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {!videoPreview ? (
              <label className="flex flex-col items-center gap-3 p-6 border-2 border-dashed border-gaming-border rounded-2xl hover:border-gaming-cyan/50 cursor-pointer transition-all">
                <Video size={32} className="text-gaming-text-muted" />
                <div className="text-center">
                  <p className="font-heading font-semibold text-gaming-text-primary text-sm">Choisir une vidéo</p>
                  <p className="text-xs text-gaming-text-muted font-body mt-0.5">MP4, MOV, WEBM · Max 30s · Max 50 Mo</p>
                </div>
                <input type="file" accept="video/*" className="hidden" onChange={ajouterVideo} />
              </label>
            ) : (
              <div className="relative rounded-xl overflow-hidden">
                <video src={videoPreview} controls className="w-full rounded-xl max-h-48 object-cover" />
                <button onClick={() => { setVideoPreview(null); set('videoFile', null) }}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-gaming-bg/70 text-white hover:bg-gaming-red/80 transition-colors">
                  <X size={14}/>
                </button>
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1">
                  <span className="text-xs text-gaming-neon font-heading">✓ Vidéo prête</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>,

    /* Étape 3 — Prix */
    <div key="prix" className="space-y-5">
      <div>
        <label className="text-sm font-heading font-medium text-gaming-text-secondary block mb-1.5">
          Prix de vente *
        </label>
        <div className="relative">
          <input type="number" value={form.price} onChange={e => set('price', e.target.value)}
            placeholder="45 000" min="1000"
            className="w-full bg-gaming-surface border border-gaming-border rounded-xl px-4 py-3 pr-20
                       text-gaming-text-primary placeholder:text-gaming-text-muted focus:outline-none
                       focus:border-gaming-purple focus:ring-2 focus:ring-gaming-purple/20 transition-all font-mono text-lg" />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gaming-text-muted font-heading text-sm">FCFA</span>
        </div>
        {form.price && (
          <p className="text-gaming-gold font-mono text-lg font-bold mt-2">{formatPrice(Number(form.price))}</p>
        )}
      </div>

      <div>
        <label className="text-sm font-heading font-medium text-gaming-text-secondary block mb-1.5">Ville *</label>
        <select value={form.location} onChange={e => set('location', e.target.value)}
          className="w-full bg-gaming-surface border border-gaming-border rounded-xl px-4 py-3 text-gaming-text-primary
                     focus:outline-none focus:border-gaming-purple transition-all font-body text-sm appearance-none cursor-pointer">
          <option value="">Choisir une ville</option>
          {VILLES_SN.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
      </div>

      <Input label="Numéro de téléphone (WhatsApp) *" value={form.phone}
        onChange={e => set('phone', e.target.value)}
        placeholder="Ex : +221 77 XXX XX XX" type="tel" />

      <div className="p-4 rounded-xl bg-gaming-neon/5 border border-gaming-neon/20 space-y-1.5">
        <p className="text-sm font-heading font-semibold text-gaming-neon">💵 Paiement à la livraison</p>
        <p className="text-xs text-gaming-text-muted font-body leading-relaxed">
          Le vendeur gère ses paiements directement avec l'acheteur. GameBlox ne prélève aucune commission.
        </p>
      </div>
    </div>,

    /* Étape 4 — Confirmation */
    <div key="confirm" className="space-y-5">
      <div className="gaming-card p-5 space-y-3">
        <h3 className="font-heading font-semibold text-gaming-text-primary mb-2">Récapitulatif de l'annonce</h3>
        {[
          { label: 'Catégorie',  value: CATEGORIES.find(c => c.id === form.category)?.name },
          { label: 'Titre',      value: form.title },
          { label: 'État',       value: CONDITIONS.find(c => c.value === form.condition)?.label },
          { label: 'Prix',       value: form.price ? formatPrice(Number(form.price)) : null },
          { label: 'Ville',      value: form.location },
          { label: 'Téléphone',  value: form.phone },
          { label: 'Photos',     value: `${form.images.length} photo(s)` },
        ].filter(i => i.value).map(item => (
          <div key={item.label} className="flex justify-between items-center py-2 border-b border-gaming-border/30 last:border-0">
            <span className="text-sm text-gaming-text-muted font-body">{item.label}</span>
            <span className="text-sm font-heading font-semibold text-gaming-text-primary">{item.value}</span>
          </div>
        ))}
      </div>
      <div className="flex items-start gap-3 p-4 rounded-xl bg-gaming-neon/5 border border-gaming-neon/20">
        <CheckCircle size={16} className="text-gaming-neon flex-shrink-0 mt-0.5" />
        <p className="text-xs text-gaming-text-secondary font-body leading-relaxed">
          En publiant cette annonce, tu confirmes que le produit t'appartient et tu acceptes les
          conditions d'utilisation de GameBlox.
        </p>
      </div>
      {!profile?.is_premium && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-gaming-gold/5 border border-gaming-gold/20">
          <Lock size={15} className="text-gaming-gold flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gaming-text-muted font-body leading-relaxed">
            <span className="text-gaming-gold font-heading font-semibold">Compte gratuit —</span>{' '}
            Cette annonce ne pourra pas être modifiée après publication.{' '}
            <Link to="/abonnement" className="text-gaming-gold underline hover:no-underline">
              Passez Premium
            </Link>{' '}
            pour débloquer la modification illimitée.
          </p>
        </div>
      )}
    </div>,
  ]

  return (
    <div className="min-h-screen py-12">
      <div className="page-container max-w-2xl">
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-white mb-1">Publier une annonce</h1>
          <p className="text-gaming-text-muted font-body">Gratuit · En ligne en 5 minutes</p>
        </div>

        {/* Barre de progression */}
        <div className="flex items-center gap-2 mb-10">
          {ETAPES.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all duration-300
                ${i < etape
                  ? 'bg-gaming-neon text-gaming-bg'
                  : i === etape
                    ? 'bg-gaming-purple text-white shadow-purple-glow'
                    : 'bg-gaming-surface border border-gaming-border text-gaming-text-muted'}`}>
                {i < etape ? '✓' : i + 1}
              </div>
              {i < ETAPES.length - 1 && (
                <div className={`flex-1 h-px transition-all duration-500 ${i < etape ? 'bg-gaming-neon' : 'bg-gaming-border'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Contenu de l'étape */}
        <div className="gaming-card p-6 mb-6">
          <h2 className="font-heading font-semibold text-gaming-text-primary text-lg mb-6">
            Étape {etape + 1} — {ETAPES[etape]}
          </h2>
          <AnimatePresence mode="wait">
            <motion.div key={etape}
              initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
              {contenu[etape]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setEtape(s => Math.max(0, s - 1))}
            disabled={etape === 0} icon={<ArrowLeft size={16}/>}>
            Précédent
          </Button>
          <Button onClick={suivant} disabled={publishing}
            iconRight={etape === ETAPES.length - 1 ? <CheckCircle size={16}/> : <ArrowRight size={16}/>}>
            {publishing ? 'Publication...' : etape === ETAPES.length - 1 ? "Publier l'annonce" : 'Continuer'}
          </Button>
        </div>
      </div>
    </div>
  )
}
