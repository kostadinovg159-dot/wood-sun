'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

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
    }
    load()
  }, [])

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
            {user.isB2B && <p className="text-green-600">B2B account approved</p>}
          </div>
        )}
        {orders.length === 0 ? (
          <p>You haven't placed any orders yet.</p>
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
