'use client'

import { useState } from 'react'
import Link from 'next/link'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  customization?: string
}

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Classic Walnut + Dark Lenses',
      price: 79.99,
      quantity: 2,
      customization: 'JOHN DOE',
    },
    {
      id: '2',
      name: 'Modern Bamboo + Polarized',
      price: 109.99,
      quantity: 1,
    },
  ])

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingCost = 10
  const tax = subtotal * 0.1
  const total = subtotal + shippingCost + tax

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id)
    } else {
      setItems(items.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-sage-50 py-8 sm:py-12">
        <div className="container">
          <h1>Shopping Cart</h1>
        </div>
      </div>

      {/* Content */}
      <div className="container section-padding">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <Link href="/products" className="btn btn-primary">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="card p-6 flex gap-4">
                    {/* Image */}
                    <div className="hidden sm:block w-20 h-20 bg-gradient-to-br from-wood-100 to-sage-100 rounded-lg flex-shrink-0 flex items-center justify-center text-3xl">
                      😎
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                      {item.customization && <p className="text-xs text-gray-600 mb-3">Customization: {item.customization}</p>}

                      <p className="text-lg font-bold text-wood-600 mb-4">${item.price.toFixed(2)}</p>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50"
                        >
                          −
                        </button>
                        <input type="number" value={item.quantity} readOnly className="w-12 text-center border border-gray-300 rounded py-1" />
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50">
                          +
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end gap-2">
                      <p className="text-sm font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                      <button onClick={() => removeItem(item.id)} className="text-xs text-gray-600 hover:text-red-600">
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Continue Shopping */}
              <Link href="/products" className="text-sm text-wood-600 hover:text-wood-700 mt-6 inline-block">
                ← Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h3 className="font-semibold text-lg mb-6">Order Summary</h3>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-900">${shippingCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax (10%)</span>
                    <span className="text-gray-900">${tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between mb-6">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-wood-600">${total.toFixed(2)}</span>
                </div>

                <Link href="/checkout" className="btn btn-primary w-full py-3 justify-center mb-3">
                  Proceed to Checkout
                </Link>

                <button className="btn btn-outline w-full py-3">
                  Continue Shopping
                </button>

                {/* Info */}
                <div className="mt-6 p-4 bg-sage-50 rounded-lg">
                  <p className="text-xs text-gray-600">
                    <strong>🚚 Free shipping</strong> on orders over $100. <strong>30-day returns</strong> guaranteed.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
