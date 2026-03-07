'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useCart } from '@/components/cart/CartContext'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const accountRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()
  const { items, openDrawer } = useCart()
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)
  const isAdmin = (session?.user as any)?.role === 'ADMIN'

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false)
      }
    }
    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [])

  return (
    <header className="bg-[#FAF7F2] border-b border-wood-200 sticky top-0 z-50">
      <nav className="container flex items-center justify-between h-16 sm:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl sm:text-2xl text-wood-700">
          <span className="text-2xl">🌿</span>
          WoodSun
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/products" className="text-gray-700 hover:text-amber-700 transition">
            Shop
          </Link>
          <Link href="/b2b/register" className="text-gray-700 hover:text-amber-700 transition">
            B2B Wholesale
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-amber-700 transition">
            About
          </Link>
        </div>

        {/* Desktop Icons */}
        <div className="hidden md:flex items-center gap-3">
          {/* Cart icon */}
          <button
            onClick={openDrawer}
            className="relative p-2 hover:bg-wood-100 rounded-lg transition"
            aria-label="Open cart"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>

          {/* Account icon */}
          {!session?.user ? (
            <Link href="/auth/signin" className="p-2 hover:bg-wood-100 rounded-lg transition" aria-label="Sign in">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </Link>
          ) : (
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setAccountOpen((o) => !o)}
                className="flex items-center gap-2 p-2 hover:bg-wood-100 rounded-lg transition"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm text-gray-700">Hi, {session.user.name?.split(' ')[0] ?? 'Account'}</span>
              </button>
              {accountOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#FAF7F2] border border-wood-200 rounded-lg shadow-lg py-1 z-10">
                  <Link href="/account" onClick={() => setAccountOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-wood-50">
                    My Account
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setAccountOpen(false)} className="block px-4 py-2 text-sm text-gray-700 hover:bg-wood-50">
                      Admin Panel
                    </Link>
                  )}
                  <hr className="my-1 border-wood-200" />
                  <button
                    onClick={() => { setAccountOpen(false); signOut() }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-wood-50"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile: hamburger + cart */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={openDrawer}
            className="relative p-2 hover:bg-wood-100 rounded-lg"
            aria-label="Open cart"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount > 99 ? '99+' : itemCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 hover:bg-wood-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#FAF7F2] border-b border-wood-200 p-4">
            <div className="flex flex-col gap-4">
              <Link href="/products" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-amber-700">
                Shop
              </Link>
              <Link href="/b2b/register" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-amber-700">
                B2B Wholesale
              </Link>
              <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-amber-700">
                About
              </Link>
              <hr className="border-wood-200" />
              {!session?.user ? (
                <Link href="/auth/signin" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary justify-center">
                  Sign In
                </Link>
              ) : (
                <>
                  <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-amber-700">
                    My Account
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="text-gray-700 hover:text-amber-700">
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={() => { setMobileMenuOpen(false); signOut() }}
                    className="btn btn-secondary justify-center"
                  >
                    Sign Out
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
