import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getVivaToken, VIVA_API_URL, VIVA_CHECKOUT_BASE } from '@/lib/viva'

export async function POST(request: Request) {
  const body = await request.json()
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

  const session = await getServerSession(authOptions)
  const userId = (session?.user as any)?.id as string | undefined

  try {
    const sourceCode = process.env.VIVA_SOURCE_CODE
    if (!sourceCode) {
      throw new Error('VIVA_SOURCE_CODE must be set')
    }

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Order must contain at least one item' }, { status: 400 })
    }

    if (!shippingAddress) {
      return NextResponse.json({ error: 'shippingAddress is required' }, { status: 400 })
    }

    // 1. Create our DB order first so we have an orderId for merchantTrns
    const order = await prisma.order.create({
      data: {
        orderNumber: `WS-${Date.now()}`,
        userId: userId || undefined,
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

    // 2. Get Viva OAuth2 token
    const token = await getVivaToken()

    // 3. Create Viva payment order (amount must be in cents as integer)
    const vivaRes = await fetch(`${VIVA_API_URL}/checkout/v2/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: Math.round(total * 100),
        customerTrns: `WoodSun Order ${order.orderNumber}`,
        customer: {
          email,
          fullName: `${firstName || ''} ${lastName || ''}`.trim() || email,
          phone: '', // Viva requires the field; phone collection is not part of this checkout flow
          countryCode: shippingAddress.country || 'BG',
          requestLang: 'en-GB',
        },
        paymentTimeout: 1800,
        preauth: false,
        allowRecurring: false,
        maxInstallments: 0,
        paymentNotification: true,
        merchantTrns: order.id,
        sourceCode,
      }),
    })

    if (!vivaRes.ok) {
      const errText = await vivaRes.text()
      throw new Error(`Viva order creation failed (${vivaRes.status}): ${errText}`)
    }

    const { orderCode } = await vivaRes.json()

    if (!orderCode) {
      throw new Error('Viva returned no orderCode in response')
    }

    // 4. Store Viva order code on our order record
    await prisma.order.update({
      where: { id: order.id },
      data: { vivaOrderCode: String(orderCode) },
    })

    const checkoutUrl = `${VIVA_CHECKOUT_BASE}/web/checkout?ref=${orderCode}`
    return NextResponse.json({ url: checkoutUrl })
  } catch (e: any) {
    console.error('Viva checkout error:', e)
    return NextResponse.json({ error: e.message || 'Checkout failed' }, { status: 500 })
  }
}
