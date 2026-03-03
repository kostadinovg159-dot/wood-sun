const isDemo = (process.env.VIVA_ENVIRONMENT || 'demo') !== 'production'

export const VIVA_ACCOUNTS_URL = isDemo
  ? 'https://demo-accounts.vivapayments.com'
  : 'https://accounts.vivapayments.com'

export const VIVA_API_URL = isDemo
  ? 'https://demo-api.vivapayments.com'
  : 'https://api.vivapayments.com'

export const VIVA_CHECKOUT_BASE = isDemo
  ? 'https://demo.vivapayments.com'
  : 'https://www.vivapayments.com'

export async function getVivaToken(): Promise<string> {
  const clientId = process.env.VIVA_CLIENT_ID
  const clientSecret = process.env.VIVA_CLIENT_SECRET
  if (!clientId || !clientSecret) {
    throw new Error('VIVA_CLIENT_ID and VIVA_CLIENT_SECRET must be set')
  }

  const res = await fetch(`${VIVA_ACCOUNTS_URL}/connect/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  })
  if (!res.ok) {
    throw new Error(`Viva token request failed: ${res.status} ${await res.text()}`)
  }
  const data = await res.json()
  if (!data.access_token || typeof data.access_token !== 'string') {
    throw new Error('Invalid token response from Viva API')
  }
  return data.access_token
}
