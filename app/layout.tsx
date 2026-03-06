import '@/app/globals.css'
import { ReactNode } from 'react'
import Providers from '@/components/Providers'
import Header from '@/components/layout/Header'
import CartDrawer from '@/components/cart/CartDrawer'
import Footer from '@/components/layout/Footer'

export const metadata = {
  title: 'WoodSun Gifts - Eco-Friendly Wooden Sunglasses & B2B Corporate Gifts',
  description: 'Personalized wooden sunglasses with custom engraving and laser etching. Perfect for corporate gifts, employee rewards, and eco-conscious gifting.',
  keywords: 'wooden sunglasses, eco-friendly gifts, personalized gifts, corporate gifts, employee rewards, laser engraving',
  openGraph: {
    title: 'WoodSun Gifts - Wooden Sunglasses & Corporate Gifts',
    description: 'Personalized wooden sunglasses and eco-friendly corporate gifts',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-white text-gray-900">
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
