import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

// reuse existing orderSchema? we'll redefine minimal
const itemSchema = z.object({
  variantId: z.string(),
  quantity: z.number().min(1),
  price: z.number().positive(),
})

const bulkSchema = z.array(
  z.object({
    email: z.string().email(),
    items: z.array(itemSchema),
    shippingAddress: z.object({
      streetAddress: z.string(),
      city: z.string(),
      state: z.string(),
      postalCode: z.string(),
      country: z.string(),
    }),
    subtotal: z.number().positive(),
    shippingCost: z.number().nonnegative(),
    tax: z.number().nonnegative(),
    total: z.number().positive(),
    isB2B: z.boolean().optional(),
  })
)

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as any).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const parse = bulkSchema.safeParse(body)
  if (!parse.success) {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
  }

  const results: any[] = []
  for (const orderData of parse.data) {
    const order = await prisma.order.create({
      data: {
        orderNumber: `WS-${Date.now()}-${Math.random().toString(36).substr(2,5).toUpperCase()}`,
        email: orderData.email,
        firstName: '',
        lastName: '',
        streetAddress: orderData.shippingAddress.streetAddress,
        city: orderData.shippingAddress.city,
        state: orderData.shippingAddress.state,
        postalCode: orderData.shippingAddress.postalCode,
        country: orderData.shippingAddress.country,
        status: 'PENDING',
        subtotal: orderData.subtotal,
        shippingCost: orderData.shippingCost,
        tax: orderData.tax,
        total: orderData.total,
        isB2BOrder: orderData.isB2B || false,
      },
    })
    for (const item of orderData.items) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          variantId: item.variantId,
          quantity: item.quantity,
          pricePerUnit: item.price,
        },
      })
    }
    results.push(order)
  }

  return NextResponse.json({ success: true, created: results.length })
}
