import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { SlidersHorizontal, Search, X, ChevronDown } from 'lucide-react'
import ProductCard from '../components/ui/ProductCard'
import Button from '../components/ui/Button'
import { PRODUCTS, CATEGORIES } from '../utils/mockData'

const CONDITIONS = [
  { value: 'new',       label: 'Neuf' },
  { value: 'excellent', label: 'Très bon état' },
  { value: 'good',      label: 'Bon état' },
  { value: 'fair',      label: 'État correct' },
]
const SORT_OPTIONS = [
  { value: 'recent',    label: 'Plus récent' },
  { value: 'price_asc', label: 'Prix croissant' },
  { value: 'price_desc',label: 'Prix décroissant' },
  { value: 'popular',   label: 'Popularité' },
]

export default function Marketplace() {
  const [params]           = useSearchParams()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search,      setSearch]      = useState(params.get('q') || '')
  const [category,    setCategory]    = useState(params.get('categorie') || '')
  const [conditions,  setConditions]  = useState([])
  const [priceMax,    setPriceMax]    = useState(500000)
  const [sort,        setSort]        = useState('recent')

  const results = useMemo(() => {
    let list = [...PRODUCTS]
    if (search)     list = list.filter(p => p.title.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase()))
    if (category)   list = list.filter(p => p.category === category)
    if (conditions.length) list = list.filter(p => conditions.includes(p.condition))
    list = list.filter(p => p.price <= priceMax)
    if (sort === 'price_asc')  list.sort((a, b) => a.price - b.price)
    if (sort === 'price_desc') list.sort((a, b) => b.price - a.price)
    if (sort === 'recent')     list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    if (sort === 'popular')    list.sort((a, b) => b.views - a.views)
    return list
  }, [search, category, conditions, priceMax, sort])

  function toggleCondition(v) {
    setConditions(prev => prev.includes(v) ? prev.filter(c => c !== v) : [...prev, v])
  }

  function clearFilters() {
    setSearch(''); setCategory(''); setConditions([]); setPriceMax(500000)
  }

  const hasFilters = search || category || conditions.length || priceMax < 500000

  const Sidebar = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <h3 className="font-heading font-semibold text-gaming-text-primary text-sm mb-3">Recherche</h3>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gaming-text-muted" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="PS5, manette, FIFA..."
            className="w-full pl-9 pr-4 py-2.5 bg-gaming-surface border border-gaming-border rounded-xl text-sm
                       text-gaming-text-primary placeholder:text-gaming-text-muted focus:outline-none
                       focus:border-gaming-purple transition-all font-body"
          />
        </div>
      </div>

      {/* Category */}
      <div>
        <h3 className="font-heading font-semibold text-gaming-text-primary text-sm mb-3">Catégorie</h3>
        <div className="space-y-1.5">
          <button onClick={() => setCategory('')}
            className={`w-full text-left px-3 py-2 rounded-lg text-sm font-body transition-all duration-150
              ${!category ? 'bg-gaming-purple/15 text-gaming-purple border border-gaming-purple/30' : 'text-gaming-text-muted hover:text-white hover:bg-gaming-card-hover'}`}>
            Toutes les catégories
          </button>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setCategory(c.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-body transition-all duration-150 flex items-center justify-between
                ${category === c.id ? 'bg-gaming-purple/15 text-gaming-purple border border-gaming-purple/30' : 'text-gaming-text-muted hover:text-white hover:bg-gaming-card-hover'}`}>
              <span className="flex items-center gap-2"><span>{c.icon}</span> {c.name}</span>
              <span className="text-xs opacity-60">{c.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div>
        <h3 className="font-heading font-semibold text-gaming-text-primary text-sm mb-3">État</h3>
        <div className="space-y-2">
          {CONDITIONS.map(c => (
            <label key={c.value} className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => toggleCondition(c.value)}
                className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all flex-shrink-0
                  ${conditions.includes(c.value) ? 'bg-gaming-purple border-gaming-purple' : 'border-gaming-border group-hover:border-gaming-purple/50'}`}
              >
                {conditions.includes(c.value) && <span className="text-white text-[10px]">✓</span>}
              </div>
              <span className="text-sm text-gaming-text-muted group-hover:text-white transition-colors font-body">{c.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="font-heading font-semibold text-gaming-text-primary text-sm mb-3">
          Prix max : <span className="text-gaming-gold">{priceMax.toLocaleString('fr-FR')} FCFA</span>
        </h3>
        <input type="range" min="5000" max="500000" step="5000" value={priceMax}
          onChange={e => setPriceMax(Number(e.target.value))}
          className="w-full accent-gaming-purple" />
        <div className="flex justify-between text-xs text-gaming-text-muted mt-1 font-mono">
          <span>5 000</span><span>500 000</span>
        </div>
      </div>

      {hasFilters && (
        <Button variant="ghost" size="sm" fullWidth onClick={clearFilters} icon={<X size={14}/>}>
          Effacer les filtres
        </Button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen py-8">
      <div className="page-container">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl text-white mb-1">Marketplace</h1>
          <p className="text-gaming-text-muted font-body text-sm">
            {results.length} produit{results.length !== 1 ? 's' : ''} trouvé{results.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setSidebarOpen(o => !o)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 glass rounded-xl text-sm font-heading text-gaming-text-secondary hover:text-white transition-all">
            <SlidersHorizontal size={16} /> Filtres
          </button>
          <div className="ml-auto relative">
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="appearance-none bg-gaming-surface border border-gaming-border rounded-xl px-4 py-2.5 pr-8
                         text-sm text-gaming-text-primary focus:outline-none focus:border-gaming-purple font-heading cursor-pointer">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gaming-text-muted pointer-events-none" />
          </div>
        </div>

        <div className="flex gap-7">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="gaming-card p-5 sticky top-20">
              <Sidebar />
            </div>
          </aside>

          {/* Mobile sidebar */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-gaming-bg/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
              <motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
                className="absolute left-0 top-0 bottom-0 w-72 glass-dark overflow-y-auto p-5">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-heading font-bold text-gaming-text-primary">Filtres</h2>
                  <button onClick={() => setSidebarOpen(false)}><X size={20} className="text-gaming-text-muted" /></button>
                </div>
                <Sidebar />
              </motion.div>
            </div>
          )}

          {/* Products grid */}
          <div className="flex-1 min-w-0">
            {results.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-4xl mb-4">🎮</p>
                <h3 className="font-heading font-semibold text-gaming-text-primary text-lg mb-2">Aucun produit trouvé</h3>
                <p className="text-gaming-text-muted font-body text-sm mb-6">Modifie tes filtres pour voir plus de résultats.</p>
                <Button variant="primary" onClick={clearFilters}>Effacer les filtres</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {results.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
