import { createClient } from '@supabase/supabase-js'

const PREMIUM_PRICE = 6000
const PREMIUM_DURATION_MS = 365 * 24 * 60 * 60 * 1000

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const authHeader = req.headers.authorization || req.headers.Authorization || ''
  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authentification requise' })
  }
  const jwt = authHeader.slice(7)

  const admin = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { data: { user }, error: userErr } = await admin.auth.getUser(jwt)
  if (userErr || !user) {
    return res.status(401).json({ message: 'Session invalide' })
  }
  const authUid = user.id

  const { token } = req.body || {}
  if (!token || typeof token !== 'string') {
    return res.status(400).json({ message: 'Token requis' })
  }

  const { data: existing } = await admin
    .from('premium_tokens')
    .select('token')
    .eq('token', token)
    .maybeSingle()
  if (existing) {
    return res.status(409).json({ message: 'Token déjà consommé' })
  }

  let payment
  try {
    const r = await fetch(`https://pay.moneyfusion.net/paiementNotif/${encodeURIComponent(token)}`)
    payment = await r.json()
  } catch {
    return res.status(502).json({ message: 'Vérification Money Fusion échouée' })
  }

  const data = payment.data || payment

  const isPaid = payment.statut === true && (
    data.statut === 'paid' ||
    data.statut === 'success' ||
    data.statusPaiement === 'paid' ||
    data.statut_paiement === 'paid' ||
    data.statut_paiement === 'success' ||
    data.status === 'paid'
  )
  if (!isPaid) {
    return res.status(402).json({ message: 'Paiement non confirmé' })
  }

  const amount = Number(data.totalPrice ?? payment.totalPrice ?? data.amount)
  if (amount !== PREMIUM_PRICE) {
    return res.status(402).json({ message: `Montant invalide (${amount} ≠ ${PREMIUM_PRICE})` })
  }

  const personalInfo = data.personal_Info || payment.personal_Info || []
  const paidUserId = personalInfo[0]?.userId
  if (paidUserId !== authUid) {
    return res.status(403).json({ message: 'Token ne correspond pas à cet utilisateur' })
  }

  const { error: tokenErr } = await admin
    .from('premium_tokens')
    .insert({ token, user_id: authUid })
  if (tokenErr) {
    if (tokenErr.code === '23505') {
      return res.status(409).json({ message: 'Token déjà consommé' })
    }
    return res.status(500).json({ message: 'Erreur enregistrement token : ' + tokenErr.message })
  }

  const premiumUntil = new Date(Date.now() + PREMIUM_DURATION_MS).toISOString()
  const { error } = await admin
    .from('profiles')
    .update({ is_premium: true, premium_until: premiumUntil })
    .eq('id', authUid)

  if (error) {
    return res.status(500).json({ message: 'Erreur activation Premium : ' + error.message })
  }

  return res.status(200).json({ success: true })
}
