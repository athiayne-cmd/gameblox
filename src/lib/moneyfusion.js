const API_URL = import.meta.env.VITE_MONEYFUSION_API_URL?.trim()

export async function initPremiumPayment({ userId, name, email, phone }) {
  if (!API_URL) {
    throw new Error('URL MoneyFusion non configurée — ajoute VITE_MONEYFUSION_API_URL dans .env')
  }

  if (!phone) {
    throw new Error('Numéro de téléphone requis. Ajoute-le dans ton profil.')
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      totalPrice: 6000,
      article: [{ name: 'Abonnement Premium GameBlox', price: 6000, quantite: 1 }],
      numeroSend: phone,
      nomclient: name || email || 'Client GameBlox',
      personal_Info: [{ userId, email: email || '' }],
      return_url: `${window.location.origin}/premium/success?user_id=${userId}`,
    }),
  })

  if (!res.ok) throw new Error('Erreur réseau Money Fusion')

  const data = await res.json()
  const paymentUrl = data.url || data.payment_url
  if (!data.statut || !paymentUrl) {
    throw new Error(data.message || 'Paiement non initialisé')
  }

  // Sauvegarde locale en cas de perte des params URL
  localStorage.setItem('mf_premium_token',   data.token   || '')
  localStorage.setItem('mf_premium_user_id', userId)

  return paymentUrl
}
