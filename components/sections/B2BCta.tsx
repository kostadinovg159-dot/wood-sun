'use client'

import Link from 'next/link'

export default function B2BCta() {
  return (
    <section className="section-padding bg-gradient-to-r from-wood-600 to-wood-700 text-white">
      <div className="container">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-white">Looking for Corporate Gifts?</h2>
          <p className="text-xl text-wood-100">
            Personalized wooden sunglasses are perfect for employee rewards, corporate events, and client appreciation gifts. Get wholesale pricing for bulk orders.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/wholesale" className="btn bg-white text-wood-600 hover:bg-wood-50 text-lg px-8 py-3 font-semibold">
              View B2B Pricing
            </Link>
            <a
              href="mailto:b2b@woodsun.com"
              className="btn border-2 border-white text-white hover:bg-white hover:bg-opacity-10 text-lg px-8 py-3 font-semibold"
            >
              Contact Sales
            </a>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t border-wood-500">
            <div className="space-y-2">
              <p className="text-2xl">📦</p>
              <p className="font-semibold">Bulk Orders</p>
              <p className="text-wood-100">Minimum order 50 units</p>
            </div>
            <div className="space-y-2">
              <p className="text-2xl">💰</p>
              <p className="font-semibold">Wholesale Pricing</p>
              <p className="text-wood-100">Up to 40% off retail</p>
            </div>
            <div className="space-y-2">
              <p className="text-2xl">🎁</p>
              <p className="font-semibold">Custom Branding</p>
              <p className="text-wood-100">Logo & text engraving</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
