import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'

const orderSchema = z.object({
  email: z.string().email(),
  items: z.array(
    z.object({
      variantId: z.string(),
      quantity: z.number().min(1),
      price: z.number().positive(),
    })
  ),
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
  companyName: z.string().optional(),
  vatNumber: z.string().optional(),
})

export async function POST(request: Request) {
  const body = await request.json()
  const parse = orderSchema.safeParse(body)
  if (!parse.success) {
    return NextResponse.json({ error: 'Invalid order data' }, { status: 400 })
  }
  const data = parse.data

  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    const order = await prisma.order.create({
      data: {
        orderNumber: `WS-${Date.now()}`,
        userId: userId || undefined,
        email: data.email,
        firstName: '',
        lastName: '',
        streetAddress: data.shippingAddress.streetAddress,
        city: data.shippingAddress.city,
        state: data.shippingAddress.state,
        postalCode: data.shippingAddress.postalCode,
        country: data.shippingAddress.country,
        isB2B: data.isB2B || false,
        companyName: data.companyName,
        vatNumber: data.vatNumber,
        status: 'PENDING',
        subtotal: data.subtotal,
        shippingCost: data.shippingCost,
        tax: data.tax,
        total: data.total,
      },
    })

    // create order items
    for (const item of data.items) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          variantId: item.variantId,
          quantity: item.quantity,
          pricePerUnit: item.price,
        },
      })
    }

    // notify customer
    fetch(`${process.env.NEXTAUTH_URL}/api/emails/send`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: order.email,
        subject: 'Order Confirmation',
        text: `Your order ${order.orderNumber} has been received. Total: $${order.total}`,
      }),
    }).catch(console.error)

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json([])

  const user = session.user as any

  if (user.role === 'ADMIN') {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(orders)
  }

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(orders)
}
