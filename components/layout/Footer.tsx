'use client'

import Link from 'next/link'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#1C1008] text-gray-100 mt-20">
      <div className="container py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 font-bold text-xl mb-2">
              <span className="text-2xl">🌿</span>
              WoodSun
            </div>
            <p className="text-amber-200 text-sm italic mb-3">
              Wear the forest. Feel the sun.
            </p>
            <p className="text-gray-400 text-sm">
              Eco-friendly wooden sunglasses with personalized customization for everyone.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-semibold mb-4 text-base">Shop</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/products?category=classic" className="hover:text-amber-400 transition">
                  Classic
                </Link>
              </li>
              <li>
                <Link href="/products?category=modern" className="hover:text-amber-400 transition">
                  Modern
                </Link>
              </li>
              <li>
                <Link href="/products?category=polarized" className="hover:text-amber-400 transition">
                  Polarized
                </Link>
              </li>
              <li>
                <Link href="/customize" className="hover:text-amber-400 transition">
                  Customize
                </Link>
              </li>
            </ul>
          </div>

          {/* B2B */}
          <div>
            <h3 className="font-semibold mb-4 text-base">For Business</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/wholesale" className="hover:text-amber-400 transition">
                  Wholesale Pricing
                </Link>
              </li>
              <li>
                <Link href="/bulk-orders" className="hover:text-amber-400 transition">
                  Bulk Orders
                </Link>
              </li>
              <li>
                <Link href="/corporate-gifts" className="hover:text-amber-400 transition">
                  Corporate Gifts
                </Link>
              </li>
              <li>
                <a href="mailto:b2b@woodsun.com" className="hover:text-amber-400 transition">
                  Contact B2B
                </a>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold mb-4 text-base">Info</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/about" className="hover:text-amber-400 transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-amber-400 transition">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-amber-400 transition">
                  Returns
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-amber-400 transition">
                  Privacy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <hr className="border-[#2a1a08] mb-8" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400">
          <p>&copy; {currentYear} WoodSun Gifts. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="https://instagram.com" className="hover:text-amber-400 transition">
              Instagram
            </a>
            <a href="https://facebook.com" className="hover:text-amber-400 transition">
              Facebook
            </a>
            <a href="https://twitter.com" className="hover:text-amber-400 transition">
              Twitter
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
