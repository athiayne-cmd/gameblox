const API_URL = import.meta.env.VITE_MONEYFUSION_API_URL

export async function initPremiumPayment({ userId, name, email, phone }) {
  if (!API_URL) {
    throw new Error('URL MoneyFusion non configurée — ajoute VITE_MONEYFUSION_API_URL dans .env')
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      totalPrice: 6000,
      article: [{ name: 'Abonnement Premium GameBlox', price: 6000, quantite: 1 }],
      nomclient: name || email || 'Client GameBlox',
      personal_Info: [
        { label: 'Email',     data: email || '' },
        { label: 'Téléphone', data: phone || '' },
      ],
      successUrl: `${window.location.origin}/premium/success?user_id=${userId}`,
      failUrl:    `${window.location.origin}/premium/cancel`,
    }),
  })

  if (!res.ok) throw new Error('Erreur réseau Money Fusion')

  const data = await res.json()
  if (!data.statut || !data.payment_url) {
    throw new Error(data.message || 'Paiement non initialisé')
  }

  // Sauvegarde locale en cas de perte des params URL
  localStorage.setItem('mf_premium_token',   data.token   || '')
  localStorage.setItem('mf_premium_user_id', userId)

  return data.payment_url
}
