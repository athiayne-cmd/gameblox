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
