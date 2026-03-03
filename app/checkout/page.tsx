'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/components/cart/CartContext'

export default function CheckoutPage() {
  const { items, clear } = useCart()
  const [step, setStep] = useState<'address' | 'payment'>('address')
  const [orderType, setOrderType] = useState<'b2c' | 'b2b'>('b2c')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'viva'>('stripe')

  const [formData, setFormData] = useState({
    // Shipping
    firstName: '',
    lastName: '',
    email: '',
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    // B2B
    companyName: '',
    vatNumber: '',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (step === 'address') {
      setStep('payment')
    } else {
      setIsProcessing(true)
      const orderItems = items.map((item) => ({
        variantId: item.id,
        quantity: item.quantity,
        price: item.price,
        name: item.name,
      }))
      const payload = {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        items: orderItems,
        shippingAddress: {
          streetAddress: formData.streetAddress,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        subtotal,
        shippingCost,
        tax,
        total,
        isB2B: orderType === 'b2b',
        companyName: formData.companyName,
        vatNumber: formData.vatNumber,
      }

      try {
        const apiEndpoint = paymentMethod === 'viva'
          ? '/api/viva/checkout'
          : '/api/stripe/checkout'

        const res = await fetch(apiEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        if (res.ok) {
          const data = await res.json()
          if (data.url) {
            clear()
            window.location.href = data.url
          } else {
            alert('Failed to start payment session')
          }
        } else {
          const err = await res.json()
          alert('Failed to initiate checkout: ' + err.error)
        }
      } catch (e) {
        console.error(e)
        alert('Error starting checkout')
      }

      setIsProcessing(false)
    }
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shippingCost = subtotal > 0 ? 10 : 0
  const tax = subtotal * 0.1
  const total = subtotal + shippingCost + tax

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Your cart is empty.</p>
          <Link href="/cart" className="btn btn-primary">Back to Cart</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-wood-700">
            🌿 WoodSun
          </Link>
          <p className="text-sm text-gray-600">Checkout</p>
        </div>
      </div>

      {/* Content */}
      <div className="container section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Step Indicator */}
              <div className="flex items-center gap-4 mb-8">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 'address' || step === 'payment' ? 'bg-wood-600 text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <div className={`h-1 flex-1 ${step === 'payment' ? 'bg-wood-600' : 'bg-gray-200'}`} />
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step === 'payment' ? 'bg-wood-600 text-white' : 'bg-gray-200'}`}>
                  2
                </div>
              </div>

              {step === 'address' && (
                <div className="space-y-6">
                  <h2>Shipping Address</h2>

                  {/* Order Type Selection */}
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`p-4 border-2 rounded-lg cursor-pointer transition ${orderType === 'b2c' ? 'border-wood-600 bg-wood-50' : 'border-gray-200'}`}>
                      <input type="radio" name="orderType" value="b2c" checked={orderType === 'b2c'} onChange={(e) => setOrderType(e.target.value as 'b2c' | 'b2b')} className="mr-2" />
                      <span className="font-medium">Personal Order</span>
                    </label>
                    <label className={`p-4 border-2 rounded-lg cursor-pointer transition ${orderType === 'b2b' ? 'border-wood-600 bg-wood-50' : 'border-gray-200'}`}>
                      <input type="radio" name="orderType" value="b2b" checked={orderType === 'b2b'} onChange={(e) => setOrderType(e.target.value as 'b2c' | 'b2b')} className="mr-2" />
                      <span className="font-medium">Business Order</span>
                    </label>
                  </div>

                  {/* Contact */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="input col-span-2"
                      />
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="input"
                      />
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="input"
                      />
                    </div>
                  </div>

                  {/* Shipping */}
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Shipping Address</h3>
                    <div className="space-y-4">
                      <input
                        type="text"
                        name="streetAddress"
                        placeholder="Street Address"
                        value={formData.streetAddress}
                        onChange={handleInputChange}
                        required
                        className="input w-full"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="city"
                          placeholder="City"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="input"
                        />
                        <input
                          type="text"
                          name="state"
                          placeholder="State/Province"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          className="input"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          name="postalCode"
                          placeholder="ZIP/Postal Code"
                          value={formData.postalCode}
                          onChange={handleInputChange}
                          required
                          className="input"
                        />
                        <select name="country" value={formData.country} onChange={handleInputChange} className="input">
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="UK">United Kingdom</option>
                          <option value="AU">Australia</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* B2B Fields */}
                  {orderType === 'b2b' && (
                    <div className="p-4 bg-sage-50 rounded-lg space-y-4">
                      <h3 className="text-lg font-semibold">Business Information</h3>
                      <input
                        type="text"
                        name="companyName"
                        placeholder="Company Name"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="input"
                      />
                      <input
                        type="text"
                        name="vatNumber"
                        placeholder="VAT Number (optional)"
                        value={formData.vatNumber}
                        onChange={handleInputChange}
                        className="input"
                      />
                    </div>
                  )}
                </div>
              )}

              {step === 'payment' && (
                <div className="space-y-6">
                  <h2>Payment Method</h2>

                  <div className="space-y-3">
                    <label
                      className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition ${
                        paymentMethod === 'stripe' ? 'border-wood-600 bg-wood-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="stripe"
                        checked={paymentMethod === 'stripe'}
                        onChange={() => setPaymentMethod('stripe')}
                        className="w-4 h-4 accent-wood-600"
                      />
                      <div>
                        <p className="font-medium text-gray-900">Card (Stripe)</p>
                        <p className="text-sm text-gray-500">Visa, Mastercard, American Express</p>
                      </div>
                    </label>

                    <label
                      className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition ${
                        paymentMethod === 'viva' ? 'border-wood-600 bg-wood-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="viva"
                        checked={paymentMethod === 'viva'}
                        onChange={() => setPaymentMethod('viva')}
                        className="w-4 h-4 accent-wood-600"
                      />
                      <div>
                        <p className="font-medium text-gray-900">Viva Wallet</p>
                        <p className="text-sm text-gray-500">Cards + local EU payment methods (Bulgaria, Greece, etc.)</p>
                      </div>
                    </label>
                  </div>

                  <div className="p-3 bg-sage-50 rounded-lg text-xs text-gray-600">
                    You will be redirected to a secure payment page to complete your order.
                  </div>
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-4">
                {step === 'payment' && (
                  <button
                    type="button"
                    onClick={() => setStep('address')}
                    className="btn btn-outline flex-1 py-3"
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="btn btn-primary flex-1 py-3"
                >
                  {isProcessing ? 'Processing...' : step === 'address' ? 'Continue to Payment' : 'Place Order'}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h3 className="font-semibold text-lg mb-6">Order Summary</h3>

              {/* Items */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.name} x{item.quantity}</span>
                    <span className="text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Pricing */}
              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-wood-600">${total.toFixed(2)}</span>
              </div>

              {/* Security */}
              <div className="p-4 bg-gray-50 rounded-lg text-center">
                <p className="text-xs text-gray-600">
                  🔒 <strong>Secure Checkout</strong>
                  <br />
                  Your payment info is safe
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
