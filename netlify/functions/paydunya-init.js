const https = require('https')

const MODE       = process.env.PAYDUNYA_MODE || 'test'
const BASE_URL   = MODE === 'live'
  ? 'app.paydunya.com'
  : 'app.paydunya.com'
const BASE_PATH  = MODE === 'live'
  ? '/api/v1/checkout-invoice/create'
  : '/sandbox-api/v1/checkout-invoice/create'

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ message: 'Method Not Allowed' }) }
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return { statusCode: 400, body: JSON.stringify({ message: 'Corps de requête invalide' }) }
  }

  const { amount, description, customer } = body
  const siteUrl = process.env.URL || 'http://localhost:5173'

  const payload = JSON.stringify({
    invoice: {
      items: {
        item_0: {
          name:        description || 'Commande GameBlox',
          quantity:    1,
          unit_price:  String(amount),
          total_price: String(amount),
          description: description || 'Commande GameBlox',
        },
      },
      total_amount: amount,
      description:  description || 'Commande GameBlox',
    },
    store: {
      name:    'GameBlox',
      tagline: 'Le marketplace gaming N°1',
      logo_url: `${siteUrl}/favicon.svg`,
    },
    actions: {
      cancel_url:   `${siteUrl}/panier`,
      return_url:   `${siteUrl}/paiement-succes`,
      callback_url: `${siteUrl}/.netlify/functions/paydunya-callback`,
    },
    customer_info: {
      customer_name:  customer?.name  || '',
      customer_email: customer?.email || '',
      customer_phone: customer?.phone || '',
    },
  })

  const options = {
    hostname: BASE_URL,
    path:     BASE_PATH,
    method:   'POST',
    headers: {
      'Content-Type':          'application/json',
      'Content-Length':        Buffer.byteLength(payload),
      'PAYDUNYA-MASTER-KEY':   process.env.PAYDUNYA_MASTER_KEY  || '',
      'PAYDUNYA-PRIVATE-KEY':  process.env.PAYDUNYA_PRIVATE_KEY || '',
      'PAYDUNYA-TOKEN':        process.env.PAYDUNYA_TOKEN        || '',
    },
  }

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', chunk => { data += chunk })
      res.on('end', () => {
        try {
          const json = JSON.parse(data)
          if (json.response_code === '00') {
            resolve({
              statusCode: 200,
              body: JSON.stringify({ checkout_url: json.checkout_url }),
            })
          } else {
            resolve({
              statusCode: 502,
              body: JSON.stringify({ message: json.response_text || 'Erreur PayDunya' }),
            })
          }
        } catch {
          resolve({ statusCode: 502, body: JSON.stringify({ message: 'Réponse PayDunya invalide' }) })
        }
      })
    })

    req.on('error', (err) => {
      resolve({ statusCode: 500, body: JSON.stringify({ message: err.message }) })
    })

    req.write(payload)
    req.end()
  })
}
