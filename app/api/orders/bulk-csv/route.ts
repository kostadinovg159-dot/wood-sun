import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

interface CSVRow {
  email: string
  sku: string
  quantity: string
  street_address: string
  city: string
  state: string
  postal_code: string
  country: string
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { rows } = (await request.json()) as { rows: CSVRow[] }

  let created = 0
  const errors: { row: number; message: string }[] = []

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    try {
      const variant = await prisma.productVariant.findUnique({
        where: { sku: row.sku },
        include: { product: true },
      })
      if (!variant) {
        errors.push({ row: i + 1, message: `SKU not found: ${row.sku}` })
        continue
      }

      const qty = parseInt(row.quantity)
      if (!qty || qty < 1) {
        errors.push({ row: i + 1, message: `Invalid quantity: ${row.quantity}` })
        continue
      }

      const price = variant.product.price + variant.priceDifference
      const subtotal = price * qty
      const shippingCost = 10
      const tax = subtotal * 0.1
      const total = subtotal + shippingCost + tax

      const order = await prisma.order.create({
        data: {
          orderNumber: `WS-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`,
          email: row.email,
          firstName: '',
          lastName: '',
          streetAddress: row.street_address,
          city: row.city,
          state: row.state,
          postalCode: row.postal_code,
          country: row.country,
          status: 'PENDING',
          subtotal,
          shippingCost,
          tax,
          total,
          isB2BOrder: false,
        },
      })

      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          variantId: variant.id,
          quantity: qty,
          pricePerUnit: price,
        },
      })

      created++
    } catch (e: any) {
      errors.push({ row: i + 1, message: e.message || 'Unknown error' })
    }
  }

  return NextResponse.json({ success: true, created, errors })
}
