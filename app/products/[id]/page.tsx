'use client'

import { useState } from 'react'
import Link from 'next/link'

interface PageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: PageProps) {
  const [selectedVariant, setSelectedVariant] = useState('brown-dark')
  const [quantity, setQuantity] = useState(1)
  const [customization, setCustomization] = useState({
    text: '',
    fontFamily: 'Arial',
    fontColor: '#000000',
  })

  const product = {
    id: params.id,
    name: 'Classic Walnut Sunglasses',
    price: 79.99,
    rating: 4.8,
    reviews: 127,
    description: 'Handcrafted wooden sunglasses made from premium walnut wood. Perfect for everyday wear or special occasions.',
    variants: [
      { id: 'brown-dark', name: 'Brown Frame + Dark Lenses', priceAdd: 0 },
      { id: 'brown-light', name: 'Brown Frame + Light Lenses', priceAdd: 5 },
      { id: 'brown-polarized', name: 'Brown Frame + Polarized Lenses', priceAdd: 20 },
    ],
    features: [
      '100% Eco-friendly wood material',
      'Comfortable all-day wear',
      'UV protection',
      'Personalization available',
      'Sustainable packaging',
      '2-year warranty',
    ],
  }

  const selectedVariantData = product.variants.find((v) => v.id === selectedVariant)
  const finalPrice = product.price + (selectedVariantData?.priceAdd || 0)

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="container py-4 text-sm text-gray-600 border-b border-gray-200">
        <Link href="/" className="hover:text-wood-600">
          Home
        </Link>
        {' / '}
        <Link href="/products" className="hover:text-wood-600">
          Products
        </Link>
        {' / '}
        <span>{product.name}</span>
      </div>

      {/* Main Content */}
      <div className="container section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gradient-to-br from-wood-100 to-sage-100 rounded-lg flex items-center justify-center text-9xl p-4">
              😎
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-gray-100 rounded-lg cursor-pointer hover:ring-2 ring-wood-600 flex items-center justify-center text-4xl">
                  😎
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="mb-2">{product.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="text-lg">
                      {i < 4 ? '⭐' : '☆'}
                    </span>
                  ))}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="text-4xl font-bold text-wood-600">${finalPrice.toFixed(2)}</div>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed">{product.description}</p>

            {/* Variants */}
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm font-semibold text-gray-900 mb-4">Select Style</p>
              <div className="space-y-2">
                {product.variants.map((variant) => (
                  <label
                    key={variant.id}
                    className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${selectedVariant === variant.id
                        ? 'border-wood-600 bg-wood-50'
                        : 'border-gray-200 hover:border-wood-600'
                      }`}
                  >
                    <input
                      type="radio"
                      name="variant"
                      value={variant.id}
                      checked={selectedVariant === variant.id}
                      onChange={(e) => setSelectedVariant(e.target.value)}
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{variant.name}</p>
                    </div>
                    {variant.priceAdd > 0 && <span className="text-sm text-gray-600">+${variant.priceAdd.toFixed(2)}</span>}
                  </label>
                ))}
              </div>
            </div>

            {/* Customization */}
            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm font-semibold text-gray-900 mb-4">📝 Personalization (Optional)</p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Text to Engrave</label>
                  <input
                    type="text"
                    maxLength={20}
                    value={customization.text}
                    onChange={(e) => setCustomization({ ...customization, text: e.target.value })}
                    placeholder="Your text here"
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Font</label>
                  <select
                    value={customization.fontFamily}
                    onChange={(e) => setCustomization({ ...customization, fontFamily: e.target.value })}
                    className="input"
                  >
                    <option>Arial</option>
                    <option>Times New Roman</option>
                    <option>Comic Sans</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
                  <input
                    type="color"
                    value={customization.fontColor}
                    onChange={(e) => setCustomization({ ...customization, fontColor: e.target.value })}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>

                {customization.text && (
                  <div className="p-4 bg-gray-50 rounded-lg text-center">
                    <p className="text-xs text-gray-600 mb-2">Preview:</p>
                    <p style={{ fontFamily: customization.fontFamily, color: customization.fontColor }} className="text-xl font-bold">
                      {customization.text}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-900">Quantity</label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="px-4 py-2 text-gray-600 hover:text-gray-900">
                    −
                  </button>
                  <input type="number" value={quantity} readOnly className="w-12 text-center py-2 border-l border-r border-gray-300" />
                  <button onClick={() => setQuantity(quantity + 1)} className="px-4 py-2 text-gray-600 hover:text-gray-900">
                    +
                  </button>
                </div>
              </div>

              <button className="btn btn-primary w-full py-3 text-lg font-semibold">
                Add to Cart
              </button>

              <button className="btn btn-outline w-full py-3">
                Save for Later
              </button>
            </div>

            {/* Features */}
            <div className="bg-sage-50 rounded-lg p-6">
              <p className="text-sm font-semibold text-gray-900 mb-4">✨ Key Features</p>
              <ul className="space-y-2 text-sm text-gray-700">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <span className="text-wood-600">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="bg-gray-50 section-padding">
        <div className="container">
          <h2 className="mb-8">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gradient-to-br from-wood-100 to-sage-100 flex items-center justify-center text-5xl">
                  😎
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Related Product {i}</h3>
                  <p className="text-sm text-gray-600 mb-4">Walnut Wood</p>
                  <span className="text-2xl font-bold text-wood-600">$79.99</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
