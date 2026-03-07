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
