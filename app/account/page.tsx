'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'

interface Order {
  id: string
  orderNumber: string
  date: string
  status: string
  total: number
}

export default function AccountPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [user, setUser] = useState<any>(null)
  const [loaded, setLoaded] = useState(false)
  const [guestEmail, setGuestEmail] = useState('')
  const [magicSent, setMagicSent] = useState(false)
  const searchParams = useSearchParams()
  const fromCheckout = searchParams.get('checkout') === '1'

  useEffect(() => {
    async function load() {
      const [uRes, oRes] = await Promise.all([fetch('/api/users/me'), fetch('/api/orders')])
      const userData = await uRes.json()
      setUser(userData.user)
      const data = await oRes.json()
      setOrders(
        data.map((o: any) => ({
          ...o,
          date: new Date(o.createdAt).toISOString().slice(0, 10),
        }))
      )
      setLoaded(true)
    }
    load()
  }, [])

  // Guest view — not signed in
  if (loaded && !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 max-w-md w-full">
          {fromCheckout && (
            <div className="mb-6 p-4 bg-sage-50 rounded-lg text-center">
              <p className="text-lg font-semibold text-gray-900 mb-1">Order placed!</p>
              <p className="text-sm text-gray-600">Create an account to track it anytime.</p>
            </div>
          )}

          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {fromCheckout ? 'Save your order history' : 'Sign in to your account'}
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            Sign in or create an account — no password needed, we'll email you a link.
          </p>

          {/* Google */}
          <button
            onClick={() => signIn('google', { callbackUrl: '/account' })}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-500">or use email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {magicSent ? (
            <div className="text-center p-4 bg-sage-50 rounded-lg">
              <p className="font-medium text-gray-900">Check your inbox!</p>
              <p className="text-sm text-gray-600 mt-1">We sent a sign-in link to <strong>{guestEmail}</strong></p>
            </div>
          ) : (
            <form
              onSubmit={async (e) => {
                e.preventDefault()
                await signIn('email', { email: guestEmail, callbackUrl: '/account', redirect: false })
                setMagicSent(true)
              }}
              className="space-y-3"
            >
              <input
                type="email"
                placeholder="your@email.com"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                required
                className="input w-full"
              />
              <button type="submit" className="btn btn-primary w-full py-3">
                Send sign-in link
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <Link href="/products" className="text-sm text-gray-500 hover:text-wood-600">
              Continue shopping without account →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-sage-50 py-8">
        <div className="container">
          <h1>My Account</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here are your recent orders.</p>
        </div>
      </div>

      <div className="container section-padding">
        {user && user.companyName && (
          <div className="mb-6 p-4 bg-sage-50 rounded">
            <p className="font-semibold">Company:</p> {user.companyName}
            {user.vatNumber && (
              <>
                <p className="font-semibold">VAT:</p> <span>{user.vatNumber}</span>
              </>
            )}
            {user.b2bApproved && <p className="text-green-600">B2B account approved</p>}
          </div>
        )}
        {user && !user.b2bApproved && (
          <div className="mt-6">
            <Link href="/b2b/register" className="btn btn-primary">
              Apply for B2B Account
            </Link>
          </div>
        )}
        {orders.length === 0 ? (
          <p>You have not placed any orders yet.</p>
        ) : (
          <table className="w-full text-left border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3">Order #</th>
                <th className="p-3">Date</th>
                <th className="p-3">Status</th>
                <th className="p-3">Total</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t">
                  <td className="p-3">{o.orderNumber}</td>
                  <td className="p-3">{o.date}</td>
                  <td className="p-3">{o.status}</td>
                  <td className="p-3">${o.total.toFixed(2)}</td>
                  <td className="p-3">
                    <Link href={`/account/orders/${o.id}`} className="text-wood-600 hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
