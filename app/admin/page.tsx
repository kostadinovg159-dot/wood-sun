'use client'

import { useState, useEffect } from 'react'

interface Order {
  id: string
  orderNumber: string
  customer: string
  total: number
  status: string
}

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/orders')
      const data = await res.json()
      setOrders(data)
    }
    load()
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-wood-600 text-white py-8">
        <div className="container">
          <h1>Admin Dashboard</h1>
          <p className="mt-2">Manage orders and B2B requests.</p>
        </div>
      </div>

      <div className="container section-padding">
        <h2 className="mb-4">Recent Orders</h2>
        <table className="w-full text-left border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Order #</th>
              <th className="p-3">Customer</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-t">
                <td className="p-3">{o.orderNumber}</td>
                <td className="p-3">{o.customer}</td>
                <td className="p-3">${o.total.toFixed(2)}</td>
                <td className="p-3">{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2 className="mt-12 mb-4">Pending B2B Registrations</h2>
        {/* will add table below */}
        <B2BTable />
      </div>
    </div>
  )
}

function B2BTable() {
  const [requests, setRequests] = useState<any[]>([])

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/b2b/pending')
      const data = await res.json()
      setRequests(data)
    }
    load()
  }, [])

  return (
    <table className="w-full text-left border">
      <thead className="bg-gray-100">
        <tr>
          <th className="p-3">Company</th>
          <th className="p-3">Email</th>
          <th className="p-3">Submitted</th>
          <th className="p-3">Approved</th>
          <th className="p-3">Action</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((r) => (
          <tr key={r.id} className="border-t">
            <td className="p-3">{r.companyName}</td>
            <td className="p-3">{r.email}</td>
            <td className="p-3">{new Date(r.submittedAt).toISOString().slice(0, 10)}</td>
            <td className="p-3">{r.approved ? 'Yes' : 'No'}</td>
            <td className="p-3">
              {!r.approved && (
                <button
                  className="btn btn-primary px-2 py-1 text-sm"
                  onClick={async () => {
                    await fetch('/api/b2b/approve', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: r.id }) })
                    setRequests((prev) => prev.map((x) => (x.id === r.id ? { ...x, approved: true } : x)))
                  }}
                >
                  Approve
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}