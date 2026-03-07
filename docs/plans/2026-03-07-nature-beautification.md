# WoodSun Nature Beautification Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the WoodSun site into a warm, nature-immersive experience — cream backgrounds, Playfair Display serif headings, amber-gold CTAs, espresso footer.

**Architecture:** Pure CSS/JSX styling pass — no new routes, no DB changes, no API changes. Changes flow from global tokens (Tailwind config + globals.css) outward to individual components. Tailwind v3's built-in `amber` color scale is used (no custom amber needed).

**Tech Stack:** Next.js 15 App Router, Tailwind CSS v3, `next/font/google` (Playfair Display), TypeScript.

**Windows/OneDrive file-writing note:** Edit and Write tools fail on this path. Pattern for ALL file changes:
1. Write new content to `/tmp/<filename>` (resolves to `C:\tmp\`)
2. Copy with: `node -e "const fs=require('fs'); fs.copyFileSync('/tmp/<filename>', 'c:/Users/GK/OneDrive/Desktop/Claude Projects/Wood-y-Sun/<path>');"`
3. For targeted string replacements: `node -e "const fs=require('fs'); let c=fs.readFileSync('c:/Users/GK/...','utf8'); c=c.replace('OLD','NEW'); fs.writeFileSync('c:/Users/GK/...', c);"`
4. Watch for CRLF: existing files use `\r\n` — replacements that include newlines must use `\r\n`.

**Verification:** No unit tests (pure visual). Verification = run dev server (`npm run dev` in background) and confirm visually in browser at http://localhost:3000.

---

### Task 1: Add Playfair Display font to Tailwind config

**Files:**
- Modify: `tailwind.config.ts`

> Note: Tailwind v3 includes amber colours by default — no amber config needed. Only change is adding `playfair` to fontFamily.

**Step 1: Write the updated file to /tmp**

```typescript
// /tmp/tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        wood: {
          50: '#faf6f1',
          100: '#f5ede3',
          200: '#e8dcc9',
          300: '#d9c7a8',
          400: '#c9aa7e',
          500: '#b8905f',
          600: '#a67a4f',
          700: '#8a6343',
          800: '#6e513a',
          900: '#5a4330',
        },
        sage: {
          50: '#f8faf7',
          100: '#f1f5ef',
          200: '#dfe6da',
          300: '#c9d5c1',
          400: '#a8bfa0',
          500: '#8fa883',
          600: '#6d8c60',
          700: '#52704a',
          800: '#3f543a',
          900: '#304230',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        playfair: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}

export default config
```

**Step 2: Copy to project**

```bash
node -e "const fs=require('fs'); fs.copyFileSync('/tmp/tailwind.config.ts', 'c:/Users/GK/OneDrive/Desktop/Claude Projects/Wood-y-Sun/tailwind.config.ts');"
```

Expected: no output (success)

**Step 3: Commit**

```bash
cd "c:/Users/GK/OneDrive/Desktop/Claude Projects/Wood-y-Sun" && git add tailwind.config.ts && git commit -m "style: add Playfair Display font family to tailwind config"
```

---

### Task 2: Load Playfair Display font in app/layout.tsx

**Files:**
- Modify: `app/layout.tsx`

**Step 1: Write updated layout to /tmp**

```typescript
// /tmp/layout.tsx
import '@/app/globals.css'
import { ReactNode } from 'react'
import { Playfair_Display } from 'next/font/google'
import Providers from '@/components/Providers'
import Header from '@/components/layout/Header'
import CartDrawer from '@/components/cart/CartDrawer'
import Footer from '@/components/layout/Footer'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

export const metadata = {
  title: 'WoodSun Gifts - Eco-Friendly Wooden Sunglasses & B2B Corporate Gifts',
  description: 'Personalized wooden sunglasses with custom engraving and laser etching. Perfect for corporate gifts, employee rewards, and eco-conscious gifting.',
  keywords: 'wooden sunglasses, eco-friendly gifts, personalized gifts, corporate gifts, employee rewards, laser engraving',
  openGraph: {
    title: 'WoodSun Gifts - Wooden Sunglasses & Corporate Gifts',
    description: 'Handcrafted wooden sunglasses with personalized engraving.',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={playfair.variable}>
      <body className="font-sans antialiased bg-[#FAF7F2] text-gray-900">
        <Providers>
          <Header />
          <CartDrawer />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
```

**Step 2: Copy to project**

```bash
node -e "const fs=require('fs'); fs.copyFileSync('/tmp/layout.tsx', 'c:/Users/GK/OneDrive/Desktop/Claude Projects/Wood-y-Sun/app/layout.tsx');"
```

**Step 3: Commit**

```bash
cd "c:/Users/GK/OneDrive/Desktop/Claude Projects/Wood-y-Sun" && git add app/layout.tsx && git commit -m "style: load Playfair Display font, set cream body background"
```

---

### Task 3: Update globals.css — heading font, amber CTAs, cream inputs

**Files:**
- Modify: `app/globals.css`

**Step 1: Write updated globals.css to /tmp**

```css
/* /tmp/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: smooth;
  }

  body {
    @apply antialiased;
  }

  h1 {
    @apply text-4xl font-bold sm:text-5xl;
    font-family: var(--font-playfair), Georgia, serif;
  }

  h2 {
    @apply text-3xl font-bold sm:text-4xl;
    font-family: var(--font-playfair), Georgia, serif;
  }

  h3 {
    @apply text-2xl font-semibold sm:text-3xl;
    font-family: var(--font-playfair), Georgia, serif;
  }
}

@layer components {
  .container {
    @apply w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
  }

  .btn {
    @apply inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium transition-colors duration-200;
  }

  .btn-primary {
    @apply bg-amber-600 text-white hover:bg-amber-700;
  }

  .btn-secondary {
    @apply bg-sage-100 text-sage-900 hover:bg-sage-200;
  }

  .btn-outline {
    @apply border-2 border-amber-600 text-amber-700 hover:bg-amber-50;
  }

  .input {
    @apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 bg-[#FAF7F2];
  }

  .card {
    @apply bg-white rounded-lg border border-wood-100 shadow-sm;
  }

  .section-padding {
    @apply py-12 sm:py-16 lg:py-20;
  }
}
```

**Step 2: Copy to project**

```bash
node -e "const fs=require('fs'); fs.copyFileSync('/tmp/globals.css', 'c:/Users/GK/OneDrive/Desktop/Claude Projects/Wood-y-Sun/app/globals.css');"
```

**Step 3: Commit**

```bash
cd "c:/Users/GK/OneDrive/Desktop/Claude Projects/Wood-y-Sun" && git add app/globals.css && git commit -m "style: amber CTAs, Playfair headings, cream input bg in globals.css"
```

---

### Task 4: Update Hero section

**Files:**
- Modify: `components/sections/Hero.tsx`

**Step 1: Write updated Hero to /tmp**

```tsx
// /tmp/Hero.tsx
'use client'

import Link from 'next/link'

export default function Hero() {
  return (
    <section className="relative bg-gradient-to-b from-[#FAF7F2] via-wood-50 to-amber-50 section-padding">
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
          <div className="flex flex-wrap gap-6 pt-8 border-t border-wood-200 text-sm text-gray-600">
            <div>
              <p className="font-semibold text-gray-900">
                <span className="text-amber-600 mr-1">&#9698;</span> 100% Eco-Friendly
              </p>
              <p>No plastic, sustainable materials</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                <span className="text-amber-600 mr-1">&#10022;</span> Hand-Crafted
              </p>
              <p>Each pair is unique</p>
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                <span className="text-amber-600 mr-1">&#10022;</span> Customizable
              </p>
              <p>Laser engraving &amp; branding</p>
            </div>
          </div>
        </div>

        {/* Image Placeholder */}
        <div className="hidden lg:block">
          <div className="aspect-square bg-gradient-to-br from-amber-50 to-wood-100 rounded-2xl flex items-center justify-center text-6xl border border-wood-200">
            &#128526;
          </div>
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Copy to project**

```bash
node -e "const fs=require('fs'); fs.copyFileSync('/tmp/Hero.tsx', 'c:/Users/GK/OneDrive/Desktop/Claude Projects/Wood-y-Sun/components/sections/Hero.tsx');"
```

**Step 3: Commit**

```bash
cd "c:/Users/GK/OneDrive/Desktop/Claude Projects/Wood-y-Sun" && git add components/sections/Hero.tsx && git commit -m "style: nature gradient hero, amber trust signal accents, wood border"
```

---

### Task 5: Create StoryStrip section + insert into homepage

**Files:**
- Create: `components/sections/StoryStrip.tsx`
- Modify: `app/page.tsx`

**Step 1: Write StoryStrip to /tmp**

```tsx
// /tmp/StoryStrip.tsx
export default function StoryStrip() {
  return (
    <div className="bg-wood-800 py-6">
      <div className="container text-center">
        <p className="text-amber-100 text-lg italic font-playfair">
          &ldquo;Every pair tells a story of forests, craftsmanship, and sun.&rdquo;
        </p>
      </div>
    </div>
  )
}
```

**Step 2: Copy StoryStrip to project**

```bash
node -e "const fs=require('fs'); fs.copyFileSync('/tmp/StoryStrip.tsx', 'c:/Users/GK/OneDrive/Desktop/Claude Projects/Wood-y-Sun/components/sections/StoryStrip.tsx');"
```

**Step 3: Write updated page.tsx to /tmp**

```tsx
// /tmp/page.tsx
import Hero from '@/components/sections/Hero'
import StoryStrip from '@/components/sections/StoryStrip'
import FeaturedProducts from '@/components/sections/FeaturedProducts'
import B2BCta from '@/components/sections/B2BCta'
import Testimonials from '@/components/sections/Testimonials'

export default function Home() {
  return (
    <>
      <Hero />
      <StoryStrip />
      <FeaturedProducts />
      <B2BCta />
      <Testimonials />
    </>
  )
}
```

**Step 4: Copy page.tsx to project**

```bash
node -e "const fs=require('fs'); fs.copyFileSync('/tmp/page.tsx', 'c:/Users/GK/OneDrive/Desktop/Claude Projects/Wood-y-Sun/app/page.tsx');"
```

**Step 5: Commit**

```bash
cd "c:/Users/GK/OneDrive/Desktop/Claude Projects/Wood-y-Sun" && git add components/sections/StoryStrip.tsx app/page.tsx && git commit -m "style: add StoryStrip dark wood band between hero and products"
```

---

### Task 6: Update FeaturedProducts cards

**Files:**
- Modify: `components/sections/FeaturedProducts.tsx`

**Step 1: Write updated FeaturedProducts to /tmp**

```tsx
// /tmp/FeaturedProducts.tsx
'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  b2bPrice?: number
  image: string
  material: string
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const { data: session } = useSession()

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(
        data.slice(0, 4).map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          b2bPrice: p.b2bPrice,
          image: p.image || '&#128526;',
          material: p.material,
        }))
      )
    }
    load()
  }, [])

  return (
    <section className="section-padding bg-[#FAF7F2]">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="mb-4">Featured Collection</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover our most popular designs, loved by customers worldwide.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Link href={`/products/${product.slug}`} key={product.id}>
              <div className="card overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer h-full">
                <div className="aspect-square bg-gradient-to-br from-amber-50 to-wood-100 flex items-center justify-center text-5xl p-4">
                  {product.image}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 text-base">{product.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{product.material}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-amber-700">
                      ${(session?.user as any)?.isB2B && product.b2bPrice ? product.b2bPrice : product.price}
                    </span>
                    <button className="btn btn-primary px-3 py-1 text-sm">Add</button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link href="/products" className="btn btn-secondary px-8 py-3 text-lg">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Copy to project**

```bash
node -e "const fs=require('fs'); fs.copyFileSync('/tmp/FeaturedProducts.tsx', 'c:/Users/GK/OneDrive/Desktop/Claude Projects/Wood-y-Sun/components/sections/FeaturedProducts.tsx');"
```

**Step 3: Commit**

```bash
cd "c:/Users/GK/OneDrive/Desktop/Claude Projects/Wood-y-Sun" && git add components/sections/FeaturedProducts.tsx && git commit -m "style: amber product card image gradient, amber price text"
```

---

### Task 7: Update Testimonials section

**Files:**
- Modify: `components/sections/Testimonials.tsx`

**Step 1: Write updated Testimonials to /tmp**

```tsx
// /tmp/Testimonials.tsx
'use client'

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO, Tech Startup',
      text: 'We ordered 200 pairs for our company retreat. The quality exceeded expectations and our team loved the personalization!',
      rating: 5,
    },
    {
      name: 'Michael Chen',
      role: 'HR Manager',
      text: 'Best corporate gift we\'ve given. The eco-friendly aspect resonated with our employees and customers.',
      rating: 5,
    },
    {
      name: 'Emma Davis',
      role: 'Lifestyle Blogger',
      text: 'Sustainable, stylish, and comfortable. WoodSun sunglasses are my go-to gift for friends who care about the environment.',
      rating: 5,
    },
  ]

  return (
    <section className="section-padding bg-wood-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="mb-4">What Our Customers Say</h2>
          <p className="text-xl text-gray-600">Trusted by thousands of happy customers and businesses</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, idx) => (
            <div key={idx} className="bg-white rounded-lg border border-wood-100 shadow-sm p-6 border-l-4 border-l-amber-400">
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <span key={i} className="text-amber-400 text-xl">&#9733;</span>
                ))}
              </div>

              {/* Text */}
              <p className="text-gray-700 mb-6 italic">&ldquo;{testimonial.text}&rdquo;</p>

              {/* Author */}
              <div>
                <p className="font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Copy to project**

```bash
node -e "const fs=require('fs'); fs.copyFileSync('/tmp/Testimonials.tsx', 'c:/Users/GK/OneDrive/Desktop/Claude Projects/Wood-y-Sun/components/sections/Testimonials.tsx');"
```

**Step 3: Commit**

```bash
cd "c:/Users/GK/OneDrive/Desktop/Claude Projects/Wood-y-Sun" && git add components/sections/Testimonials.tsx && git commit -m "style: wood-50 testimonials bg, amber left border and star ratings"
```

---

### Task 8: Update Header

**Files:**
- Modify: `components/layout/Header.tsx`

**Step 1: Write updated Header to /tmp**

Key changes from original:
- `bg-white border-b border-gray-200` → `bg-[#FAF7F2] border-b border-wood-200`
- `hover:text-wood-600` → `hover:text-amber-700` (all nav links)
- Cart badge `bg-wood-600` → `bg-amber-500` (both desktop + mobile)
- Account dropdown: `hover:bg-gray-50` stays, text colors stay

```tsx
// /tmp/Header.tsx
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
          <span className="text-2xl">&#127807;</span>
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
```

**Step 2: Copy to project**

```bash
node -e "const fs=require('fs'); fs.copyFileSync('/tmp/Header.tsx', 'c:/Users/GK/OneDrive/Desktop/Claude Projects/Wood-y-Sun/components/layout/Header.tsx');"
```

**Step 3: Commit**

```bash
cd "c:/Users/GK/OneDrive/Desktop/Claude Projects/Wood-y-Sun" && git add components/layout/Header.tsx && git commit -m "style: cream header bg, wood border, amber nav hover, amber cart badge"
```

---

### Task 9: Update Shop page (products/page.tsx)

**Files:**
- Modify: `app/products/page.tsx`

Key changes:
- Page wrapper: `bg-white` → `bg-[#FAF7F2]`
- Header band: `bg-sage-50` → `bg-gradient-to-r from-wood-800 to-wood-700` with white text
- Filter sidebar: `bg-gray-50` → `bg-white border border-wood-100`
- Product card image gradient: `from-wood-100 to-sage-100` → `from-amber-50 to-wood-100`
- Price: `text-wood-600` → `text-amber-700`

**Step 1: Write updated products page to /tmp**

```tsx
// /tmp/products-page.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

interface ProductVariant {
  id: string
  color: string
}

interface Product {
  id: string
  name: string
  slug: string
  price: number
  b2bPrice?: number
  material: string
  image: string
  variants: ProductVariant[]
}

function colorToHex(color: string): string {
  const map: Record<string, string> = {
    brown: '#8B5E3C',
    black: '#1a1a1a',
    natural: '#C19A6B',
    walnut: '#5C3A1E',
    bamboo: '#8B9B5E',
    oak: '#C8A96E',
    maple: '#D4956A',
    ebony: '#2C1810',
    grey: '#6B6B6B',
    gray: '#6B6B6B',
    blue: '#3B82F6',
    green: '#22C55E',
    red: '#EF4444',
  }
  return map[color.toLowerCase()] ?? '#8B5E3C'
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const { data: session } = useSession()
  const [filterMaterial, setFilterMaterial] = useState('all')
  const [sortBy, setSortBy] = useState('featured')

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/products')
      let data = await res.json()
      if (filterMaterial !== 'all') {
        data = data.filter((p: any) => p.material.toLowerCase() === filterMaterial)
      }
      if (sortBy === 'price-low') data.sort((a: any, b: any) => a.price - b.price)
      if (sortBy === 'price-high') data.sort((a: any, b: any) => b.price - a.price)
      setProducts(
        data.map((p: any) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          b2bPrice: p.b2bPrice,
          material: p.material,
          image: p.image ?? '&#128526;',
          variants: p.variants ?? [],
        }))
      )
    }
    load()
  }, [filterMaterial, sortBy])

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <div className="bg-gradient-to-r from-wood-800 to-wood-700 py-8 sm:py-12">
        <div className="container">
          <h1 className="text-white">Shop Our Collection</h1>
          <p className="text-wood-200 mt-2">Discover our range of eco-friendly wooden sunglasses</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-wood-100 rounded-lg p-6">
              <h3 className="font-semibold text-lg mb-4">Filters</h3>

              {/* Material Filter */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-900 mb-3">Material</p>
                <div className="space-y-2">
                  {['All', 'Walnut', 'Bamboo', 'Oak', 'Maple', 'Ebony'].map((material) => (
                    <label key={material} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="material"
                        value={material.toLowerCase()}
                        checked={filterMaterial === material.toLowerCase()}
                        onChange={(e) => setFilterMaterial(e.target.value)}
                        className="w-4 h-4 accent-amber-600"
                      />
                      <span className="text-sm text-gray-700">{material}</span>
                    </label>
                  ))}
                </div>
              </div>

              <hr className="mb-6 border-wood-100" />

              {/* Price Range */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-900 mb-3">Price Range</p>
                <input type="range" min="0" max="150" className="w-full accent-amber-600" />
                <div className="flex justify-between text-sm text-gray-600 mt-2">
                  <span>$0</span>
                  <span>$150</span>
                </div>
              </div>

              <hr className="mb-6 border-wood-100" />

              {/* Other Filters */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer mb-2">
                  <input type="checkbox" className="w-4 h-4 accent-amber-600" />
                  <span className="text-sm text-gray-700">Polarized Lenses</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-amber-600" />
                  <span className="text-sm text-gray-700">In Stock Only</span>
                </label>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-wood-200">
              <p className="text-sm text-gray-600">
                Showing <strong>{products.length}</strong> products
              </p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input max-w-xs"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link href={`/products/${product.slug}`} key={product.id}>
                  <div className="card overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all cursor-pointer h-full">
                    <div className="aspect-square bg-gradient-to-br from-amber-50 to-wood-100 flex items-center justify-center text-5xl p-4">
                      {product.image}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-1 text-base">{product.name}</h3>
                      <p className="text-sm text-gray-600 mb-3">{product.material} Wood</p>

                      {/* Variant swatches */}
                      {product.variants.length > 0 && (
                        <div className="flex items-center gap-1 mb-3">
                          {product.variants.slice(0, 4).map((v) => (
                            <span
                              key={v.id}
                              className="w-4 h-4 rounded-full border border-gray-300 inline-block"
                              style={{ backgroundColor: colorToHex(v.color) }}
                              title={v.color}
                            />
                          ))}
                          {product.variants.length > 4 && (
                            <span className="text-xs text-gray-500">+{product.variants.length - 4}</span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold text-amber-700">
                          ${
                            (session?.user as any)?.isB2B && product.b2bPrice
                              ? product.b2bPrice.toFixed(2)
                              : product.price.toFixed(2)
                          }
                        </span>
                        <button className="btn btn-primary px-3 py-1 text-sm">Add</button>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Copy to project**

```bash
node -e "const fs=require('fs'); fs.copyFileSync('/tmp/products-page.tsx', 'c:/Users/GK/OneDrive/Desktop/Claude Projects/Wood-y-Sun/app/products/page.tsx');"
```

**Step 3: Commit**

```bash
cd "c:/Users/GK/OneDrive/Desktop/Claude Projects/Wood-y-Sun" && git add app/products/page.tsx && git commit -m "style: dark wood shop header band, cream sidebar, amber accents"
```

---

### Task 10: Update Footer

**Files:**
- Modify: `components/layout/Footer.tsx`

Key changes:
- `bg-gray-900` → `bg-[#1C1008]` (espresso)
- Add tagline *"Wear the forest. Feel the sun."* under brand name
- `hover:text-white` → `hover:text-amber-400`
- `border-gray-800` → `border-[#2a1a08]`
- `text-gray-100` on `<footer>` stays (white text on dark)

**Step 1: Write updated Footer to /tmp**

```tsx
// /tmp/Footer.tsx
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
              <span className="text-2xl">&#127807;</span>
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
```

**Step 2: Copy to project**

```bash
node -e "const fs=require('fs'); fs.copyFileSync('/tmp/Footer.tsx', 'c:/Users/GK/OneDrive/Desktop/Claude Projects/Wood-y-Sun/components/layout/Footer.tsx');"
```

**Step 3: Commit**

```bash
cd "c:/Users/GK/OneDrive/Desktop/Claude Projects/Wood-y-Sun" && git add components/layout/Footer.tsx && git commit -m "style: espresso footer, amber tagline, amber link hover"
```

---

### Task 11: Visual verification

**Step 1: Start dev server (if not already running)**

```bash
cd "c:/Users/GK/OneDrive/Desktop/Claude Projects/Wood-y-Sun" && npm run dev
```

**Step 2: Open browser at http://localhost:3000**

Check each of the following:
- [ ] Header: cream background, amber cart badge, amber nav hover
- [ ] Hero: warm gradient, amber-accented trust signals
- [ ] StoryStrip: dark wood band with italic amber quote
- [ ] Featured Products: amber image gradients, amber price, amber "Add" button
- [ ] Testimonials: wood-50 background, amber left border on cards, amber stars
- [ ] Shop page (/products): dark wood header band, cream sidebar, amber accents
- [ ] Footer: espresso dark bg, amber tagline, amber hover on links

**Step 3: If dev server won't start due to stale cache**

```bash
cd "c:/Users/GK/OneDrive/Desktop/Claude Projects/Wood-y-Sun" && rm -rf .next && npm run dev
```

---

### Task 12: Final commit summary

After verifying everything looks correct, check git log:

```bash
cd "c:/Users/GK/OneDrive/Desktop/Claude Projects/Wood-y-Sun" && git log --oneline -12
```

Expected: 10 new style commits on top of existing commits.

Push to GitHub when ready:

```bash
cd "c:/Users/GK/OneDrive/Desktop/Claude Projects/Wood-y-Sun" && git push origin master
```
