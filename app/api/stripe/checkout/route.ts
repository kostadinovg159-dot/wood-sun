import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

export async function POST(request: Request) {
  const body = await request.json()
  // expect same payload as /api/orders
  const {
    email,
    firstName,
    lastName,
    items,
    shippingAddress,
    subtotal,
    shippingCost,
    tax,
    total,
    isB2B,
    companyName,
    vatNumber,
  } = body

  try {
    // create pending order in DB
    const order = await prisma.order.create({
      data: {
        orderNumber: `WS-${Date.now()}`,
        email,
        firstName: firstName || '',
        lastName: lastName || '',
        streetAddress: shippingAddress.streetAddress,
        city: shippingAddress.city,
        state: shippingAddress.state,
        postalCode: shippingAddress.postalCode,
        country: shippingAddress.country,
        isB2BOrder: isB2B || false,
        companyName,
        vatNumber,
        status: 'PENDING',
        subtotal,
        shippingCost,
        tax,
        total,
      },
    })

    // create order items
    for (const item of items) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          variantId: item.variantId,
          quantity: item.quantity,
          pricePerUnit: item.price,
        },
      })
    }

    // build line items for Stripe
    const lineItems = items.map((it: any) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: it.name || `Item ${it.variantId}` },
        unit_amount: Math.round(it.price * 100),
      },
      quantity: it.quantity,
    }))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/account?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/checkout`,
      metadata: { orderId: order.id },
    })

    // update order with stripe session id
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    })

    return NextResponse.json({ url: session.url })
  } catch (e: any) {
    console.error('checkout error', e)
    return NextResponse.json({ error: e.message || 'Error' }, { status: 500 })
  }
}
