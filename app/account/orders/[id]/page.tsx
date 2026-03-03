'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface OrderItem {
  id: string
  variantId: string
  quantity: number
  pricePerUnit: number
  variant?: {
    name: string
    product: { name: string }
  }
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/orders/${params.id}`)
      const data = await res.json()
      if (data.error) {
        // redirect if not authorized or not found
        router.push('/account')
        return
      }
      setOrder(data)
      setLoading(false)
    }
    load()
  }, [params.id, router])

  const repeatOrder = async () => {
    if (!order) return
    const payload = {
      email: order.email,
      items: order.items.map((i: OrderItem) => ({
        variantId: i.variantId,
        quantity: i.quantity,
        price: i.pricePerUnit,
      })),
      shippingAddress: {
        streetAddress: order.streetAddress,
        city: order.city,
        state: order.state,
        postalCode: order.postalCode,
        country: order.country,
      },
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      tax: order.tax,
      total: order.total,
      isB2B: order.isB2BOrder,
      companyName: order.companyName,
      vatNumber: order.vatNumber,
    }
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (res.ok) {
      const newOrder = await res.json()
      router.push(`/account/orders/${newOrder.id}`)
    }
  }

  if (loading) return <p>Loading...</p>
  if (!order) return <p>Order not found.</p>

  return (
    <div className="container section-padding">
      <h1 className="mb-4">Order {order.orderNumber}</h1>
      <p>Status: {order.status}</p>
      {order.isB2BOrder && <p className="text-green-600">B2B Order</p>}
      <p>Date: {new Date(order.createdAt).toISOString().slice(0, 10)}</p>
      <a
        href={`/api/orders/${order.id}/invoice`}
        className="text-wood-600 hover:underline"
        target="_blank"
      >
        Download Invoice
      </a>

      <h2 className="mt-6">Items</h2>
      <table className="w-full text-left border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Product</th>
            <th className="p-3">Qty</th>
            <th className="p-3">Price</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((it: OrderItem) => (
            <tr key={it.id} className="border-t">
              <td className="p-3">
                <p className="font-medium">{it.variant?.product?.name ?? 'Product'}</p>
                <p className="text-sm text-gray-500">{it.variant?.name ?? it.variantId}</p>
              </td>
              <td className="p-3">{it.quantity}</td>
              <td className="p-3">${it.pricePerUnit.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6">
        <p>Subtotal: ${order.subtotal.toFixed(2)}</p>
        <p>Shipping: ${order.shippingCost.toFixed(2)}</p>
        <p>Tax: ${order.tax.toFixed(2)}</p>
        <p className="font-semibold">Total: ${order.total.toFixed(2)}</p>
      </div>

      <button
        onClick={repeatOrder}
        className="mt-6 px-4 py-2 bg-wood-600 text-white rounded"
      >
        Repeat Order
      </button>
    </div>
  )
}
