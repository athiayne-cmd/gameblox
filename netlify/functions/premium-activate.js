const https   = require('https')
const { createClient } = require('@supabase/supabase-js')

function verifyPayment(token) {
  return new Promise((resolve, reject) => {
    https.get(`https://pay.moneyfusion.net/paiementNotif/${token}`, res => {
      let raw = ''
      res.on('data', c => { raw += c })
      res.on('end', () => {
        try { resolve(JSON.parse(raw)) }
        catch { reject(new Error('Réponse Money Fusion invalide')) }
      })
    }).on('error', reject)
  })
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  let token, userId
  try {
    ;({ token, userId } = JSON.parse(event.body || '{}'))
  } catch {
    return { statusCode: 400, body: JSON.stringify({ message: 'Corps de requête invalide' }) }
  }

  if (!token || !userId) {
    return { statusCode: 400, body: JSON.stringify({ message: 'token et userId sont requis' }) }
  }

  // ── 1. Vérifier le paiement auprès de Money Fusion ────────────────────
  let payment
  try {
    payment = await verifyPayment(token)
  } catch {
    return { statusCode: 502, body: JSON.stringify({ message: 'Vérification Money Fusion échouée' }) }
  }

  const isPaid = payment.statut && (
    payment.statusPaiement   === 'paid' ||
    payment.statut_paiement  === 'paid' ||
    payment.status           === 'paid' ||
    payment.statut_paiement  === 'success'
  )

  if (!isPaid) {
    return { statusCode: 402, body: JSON.stringify({ message: 'Paiement non confirmé', payment }) }
  }

  // ── 2. Activer le Premium dans Supabase (service role bypasse le RLS) ──
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
    return { statusCode: 500, body: JSON.stringify({ message: 'Erreur activation Premium : ' + error.message }) }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ success: true }),
  }
}
