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
  const res = await fetch(`${VIVA_ACCOUNTS_URL}/connect/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.VIVA_CLIENT_ID || '',
      client_secret: process.env.VIVA_CLIENT_SECRET || '',
    }),
  })
  if (!res.ok) {
    throw new Error(`Viva token request failed: ${res.status} ${await res.text()}`)
  }
  const data = await res.json()
  return data.access_token as string
}
