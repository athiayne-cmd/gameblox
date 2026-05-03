export async function payPayDunya({ amount, description, customer }) {
  const res = await fetch('/.netlify/functions/paydunya-init', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount, description, customer }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Erreur lors de l\'initialisation PayDunya')
  }

  const { checkout_url } = await res.json()
  window.location.href = checkout_url
}
