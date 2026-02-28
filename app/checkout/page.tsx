'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function CheckoutPage() {
  const [step, setStep] = useState<'address' | 'payment'>('address')
  const [orderType, setOrderType] = useState<'b2c' | 'b2b'>('b2c')
  const [isProcessing, setIsProcessing] = useState(false)

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
    // Payment
    cardNumber: '',
    expiry: '',
    cvc: '',
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
      // TODO: Process payment with Stripe
      setTimeout(() => {
        alert('Order placed successfully!')
        setIsProcessing(false)
      }, 2000)
    }
  }

  const subtotal = 189.98
  const shippingCost = 10
  const tax = 19.998
  const total = subtotal + shippingCost + tax

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

                  <div className="space-y-4">
                    <input
                      type="text"
                      name="cardNumber"
                      placeholder="Card Number"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      required
                      className="input"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="expiry"
                        placeholder="MM/YY"
                        value={formData.expiry}
                        onChange={handleInputChange}
                        required
                        className="input"
                      />
                      <input
                        type="text"
                        name="cvc"
                        placeholder="CVC"
                        value={formData.cvc}
                        onChange={handleInputChange}
                        required
                        className="input"
                      />
                    </div>
                  </div>

                  {/* Billing Address Same as Shipping */}
                  <label className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-wood-600">
                    <input type="checkbox" defaultChecked className="w-4 h-4" />
                    <span className="text-sm text-gray-700">Billing address same as shipping</span>
                  </label>
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
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Classic Walnut x2</span>
                  <span className="text-gray-900">$159.98</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Modern Bamboo x1</span>
                  <span className="text-gray-900">$30.00</span>
                </div>
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
