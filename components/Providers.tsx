'use client'

import { ReactNode } from 'react'
import { SessionProvider } from 'next-auth/react'

import { CartProvider } from './cart/CartContext'

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>{children}</CartProvider>
    </SessionProvider>
  )
}
