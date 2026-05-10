export function formatPrice(amount) {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA'
}

export function formatDate(dateStr) {
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(dateStr))
}

export function formatRelativeDate(dateStr) {
  const now  = new Date()
  const date = new Date(dateStr)
  const diff = Math.floor((now - date) / 1000)

  if (diff < 60)     return "À l'instant"
  if (diff < 3600)   return `Il y a ${Math.floor(diff / 60)} min`
  if (diff < 86400)  return `Il y a ${Math.floor(diff / 3600)} h`
  if (diff < 604800) return `Il y a ${Math.floor(diff / 86400)} j`
  return formatDate(dateStr)
}

export function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Renvoie l'URL si elle est sûre (https://, http://, /, data:image), sinon null.
// Bloque javascript:, vbscript:, file://, etc. — défense en profondeur côté client.
export function safeImageUrl(url) {
  if (!url || typeof url !== 'string') return null
  const trimmed = url.trim()
  if (trimmed.startsWith('https://')) return trimmed
  if (trimmed.startsWith('http://'))  return trimmed
  if (trimmed.startsWith('/'))        return trimmed
  if (trimmed.startsWith('data:image/')) return trimmed
  if (trimmed.startsWith('blob:'))    return trimmed
  return null
}

export const CONDITIONS = {
  new:       { label: 'Neuf',          color: 'bg-gaming-neon/20 text-gaming-neon border-gaming-neon/30' },
  excellent: { label: 'Très bon état', color: 'bg-gaming-cyan/20 text-gaming-cyan border-gaming-cyan/30' },
  good:      { label: 'Bon état',      color: 'bg-gaming-purple/20 text-gaming-purple border-gaming-purple/30' },
  fair:      { label: 'État correct',  color: 'bg-gaming-gold/20 text-gaming-gold border-gaming-gold/30' },
}
