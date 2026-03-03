import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/db'
import { sendOrderConfirmation } from '@/lib/email'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

export async function POST(request: Request) {
  const body = await request.arrayBuffer()
  const sig = request.headers.get('stripe-signature') || ''

  let event: Stripe.Event
  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(Buffer.from(body as any), sig, webhookSecret)
    } else {
      // if no secret provided we parse without verification
      event = JSON.parse(Buffer.from(body).toString('utf8'))
    }
  } catch (err: any) {
    console.error('Webhook signature verification failed.', err.message)
    return new Response(`Webhook Error: ${err.message}`, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const orderId = session.metadata?.orderId as string | undefined
    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'PAID', stripePaymentId: session.payment_intent as string | null },
      })
      sendOrderConfirmation(orderId).catch(console.error)
    }
  }

  return NextResponse.json({ received: true })
}
