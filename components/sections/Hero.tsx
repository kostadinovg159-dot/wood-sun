'use client'

import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-sage-50 to-white section-padding">
      <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div className="space-y-6">
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight">
            Eco-Friendly Wooden Sunglasses
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Handcrafted wooden sunglasses with personalized engraving. Perfect for personal style, corporate gifts, or employee rewards.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/products" className="btn btn-primary text-lg px-8 py-3">
              Shop Now
            </Link>
            <Link href="/wholesale" className="btn btn-outline text-lg px-8 py-3">
              B2B Pricing
            </Link>
          </div>

          {/* Trust Signals */}
          <div className="flex flex-wrap gap-6 pt-8 border-t border-gray-200 text-sm text-gray-600">
            <div>
              <p className="font-semibold text-gray-900">🌱 100% Eco-Friendly</p>
              <p>No plastic, sustainable materials</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">✨ Hand-Crafted</p>
              <p>Each pair is unique</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">🎁 Customizable</p>
              <p>Laser engraving & branding</p>
            </div>
          </div>
        </div>

        {/* Image Placeholder */}
        <div className="hidden lg:block">
          <div className="aspect-square bg-gradient-to-br from-wood-100 to-sage-100 rounded-2xl flex items-center justify-center text-6xl">
            😎
          </div>
        </div>
      </div>
    </section>
  )
}
