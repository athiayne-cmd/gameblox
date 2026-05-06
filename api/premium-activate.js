import { createClient } from '@supabase/supabase-js'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const { token, userId } = req.body || {}
  if (!token || !userId) {
    return res.status(400).json({ message: 'token et userId sont requis' })
  }

  let payment
  try {
    const r = await fetch(`https://pay.moneyfusion.net/paiementNotif/${token}`)
    payment = await r.json()
  } catch {
    return res.status(502).json({ message: 'Vérification Money Fusion échouée' })
  }

  const isPaid = payment.statut && (
    payment.statusPaiement   === 'paid' ||
    payment.statut_paiement  === 'paid' ||
    payment.status           === 'paid' ||
    payment.statut_paiement  === 'success'
  )

  if (!isPaid) {
    return res.status(402).json({ message: 'Paiement non confirmé', payment })
  }

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const premiumUntil = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()

  const { error } = await supabase
    .from('profiles')
    .update({ is_premium: true, premium_until: premiumUntil })
    .eq('id', userId)

  if (error) {
    return res.status(500).json({ message: 'Erreur activation Premium : ' + error.message })
  }

  return res.status(200).json({ success: true })
}
