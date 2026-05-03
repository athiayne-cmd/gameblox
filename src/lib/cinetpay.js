export function payCinetPay({ amount, description, customer, onSuccess, onError }) {
  if (!window.CinetPay) {
    onError({ message: 'SDK CinetPay non chargé. Rechargez la page.' })
    return
  }

  const transactionId = `GB_${Date.now()}_${Math.floor(Math.random() * 9999)}`

  window.CinetPay.setConfig({
    apikey:     import.meta.env.VITE_CINETPAY_API_KEY,
    site_id:    import.meta.env.VITE_CINETPAY_SITE_ID,
    notify_url: `${window.location.origin}/.netlify/functions/cinetpay-notify`,
    return_url: `${window.location.origin}/paiement-succes`,
    mode:       import.meta.env.VITE_CINETPAY_MODE || 'TEST',
  })

  window.CinetPay.getCheckout({
    transaction_id:       transactionId,
    amount,
    currency:             'XOF',
    channels:             'ALL',
    description,
    customer_name:        customer.firstName || '',
    customer_surname:     customer.lastName  || '',
    customer_email:       customer.email     || '',
    customer_phone_number: customer.phone    || '',
    customer_address:     'Non spécifié',
    customer_city:        customer.city      || 'Dakar',
    customer_country:     'SN',
    customer_state:       'SN',
    customer_zip_code:    '00000',
  })

  window.CinetPay.waitResponse(data => {
    if (data.status === 'ACCEPTED') onSuccess(data)
    else onError({ message: 'Paiement refusé', ...data })
  })

  window.CinetPay.onError(data => onError(data))
}
