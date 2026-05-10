import { supabase } from './supabase'

/* ── Bucket : "videos" dans Supabase Storage ─────────────────
   À créer dans le dashboard Supabase :
   Storage → New bucket → Name: "videos" → Public: true
   Storage → New bucket → Name: "images" → Public: true
   ─────────────────────────────────────────────────────────── */

export async function uploadVideo(file, productId) {
  const ext  = file.name.split('.').pop()
  const path = `products/${productId}/${Date.now()}.${ext}`

  const { data, error } = await supabase.storage
    .from('videos')
    .upload(path, file, { cacheControl: '3600', upsert: false })

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from('videos')
    .getPublicUrl(path)

  return publicUrl
}

export async function uploadImage(file, productId) {
  const ext  = file.name.split('.').pop()
  const path = `products/${productId}/${Date.now()}.${ext}`

  const { data, error } = await supabase.storage
    .from('images')
    .upload(path, file, { cacheControl: '3600', upsert: false })

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(path)

  return publicUrl
}

export async function deleteFile(bucket, url) {
  const path = url.split(`/${bucket}/`)[1]
  if (!path) return
  await supabase.storage.from(bucket).remove([path])
}

/* ── Compression image (resize + qualité) ────────────────────
   Accepte JPG/PNG/WebP. Retourne un File JPEG optimisé.
   ─────────────────────────────────────────────────────────── */
export const MAX_IMAGE_SIZE_MB = 10
export const IMAGE_MAX_WIDTH   = 1600
export const IMAGE_QUALITY     = 0.85
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']

export async function compressImage(file) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type))
    throw new Error(`Format "${file.type || 'inconnu'}" non supporté (JPG, PNG, WebP uniquement)`)

  const sizeMB = file.size / (1024 * 1024)
  if (sizeMB > MAX_IMAGE_SIZE_MB)
    throw new Error(`Image trop lourde (max ${MAX_IMAGE_SIZE_MB} Mo, actuel : ${sizeMB.toFixed(1)} Mo)`)

  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Lecture du fichier impossible'))
    reader.readAsDataURL(file)
  })

  const img = await new Promise((resolve, reject) => {
    const i = new Image()
    i.onload  = () => resolve(i)
    i.onerror = () => reject(new Error('Image illisible'))
    i.src = dataUrl
  })

  const ratio  = img.width > IMAGE_MAX_WIDTH ? IMAGE_MAX_WIDTH / img.width : 1
  const width  = Math.round(img.width  * ratio)
  const height = Math.round(img.height * ratio)

  const canvas  = document.createElement('canvas')
  canvas.width  = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(img, 0, 0, width, height)

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(b => b ? resolve(b) : reject(new Error('Compression échouée')), 'image/jpeg', IMAGE_QUALITY)
  })

  const baseName = file.name.replace(/\.[^.]+$/, '')
  return new File([blob], `${baseName}.jpg`, { type: 'image/jpeg', lastModified: Date.now() })
}

/* ── Validation vidéo ───────────────────────────────────────── */
export const MAX_VIDEO_SIZE_MB = 50
export const MAX_VIDEO_DURATION_S = 30

export function validateVideoSize(file) {
  const sizeMB = file.size / (1024 * 1024)
  if (sizeMB > MAX_VIDEO_SIZE_MB)
    throw new Error(`Vidéo trop lourde (max ${MAX_VIDEO_SIZE_MB} Mo, actuel : ${sizeMB.toFixed(1)} Mo)`)
  return true
}

export function getVideoDuration(file) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = () => {
      URL.revokeObjectURL(video.src)
      if (video.duration > MAX_VIDEO_DURATION_S)
        reject(new Error(`Vidéo trop longue (max ${MAX_VIDEO_DURATION_S}s, actuel : ${Math.round(video.duration)}s)`))
      else resolve(video.duration)
    }
    video.onerror = () => reject(new Error('Impossible de lire la vidéo'))
    video.src = URL.createObjectURL(file)
  })
}

/* ── Parsing URL YouTube / TikTok / Supabase Storage ────────── */
export function parseVideoUrl(url) {
  if (!url || typeof url !== 'string') return null
  const u = url.trim()

  const yt = u.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
  if (yt) return { type: 'youtube', id: yt[1], original: u }

  const tt = u.match(/tiktok\.com\/@[\w.]+\/video\/(\d+)/)
  if (tt) return { type: 'tiktok', id: tt[1], original: u }

  // Fichier vidéo direct ou URL Supabase Storage
  if (
    u.match(/\.(mp4|webm|mov|avi|mkv)(\?|$)/i) ||
    u.includes('/storage/v1/object/public/videos/')
  ) return { type: 'direct', url: u, original: u }

  return null
}
