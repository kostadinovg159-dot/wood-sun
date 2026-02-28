'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="container flex items-center justify-between h-16 sm:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl sm:text-2xl text-wood-700">
          <span className="text-2xl">🌿</span>
          WoodSun
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/products" className="text-gray-700 hover:text-wood-600 transition">
            Shop
          </Link>
          <Link href="/wholesale" className="text-gray-700 hover:text-wood-600 transition">
            B2B Wholesale
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-wood-600 transition">
            About
          </Link>
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/cart" className="btn btn-secondary">
            Cart
          </Link>
          <Link href="/account" className="btn btn-primary">
            Sign In
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 p-4">
            <div className="flex flex-col gap-4">
              <Link href="/products" className="text-gray-700 hover:text-wood-600">
                Shop
              </Link>
              <Link href="/wholesale" className="text-gray-700 hover:text-wood-600">
                B2B Wholesale
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-wood-600">
                About
              </Link>
              <hr />
              <Link href="/cart" className="btn btn-secondary justify-center">
                Cart
              </Link>
              <Link href="/account" className="btn btn-primary justify-center">
                Sign In
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
