import { NextResponse } from 'next/server'
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

  try {
    // 1. Create our DB order first so we have an orderId for merchantTrns
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
          phone: '',
          countryCode: shippingAddress.country === 'BG' ? 'BG' : 'GB',
          requestLang: 'en-GB',
        },
        paymentTimeout: 1800,
        preauth: false,
        allowRecurring: false,
        maxInstallments: 0,
        paymentNotification: true,
        merchantTrns: order.id,
        sourceCode: process.env.VIVA_SOURCE_CODE || '',
      }),
    })

    if (!vivaRes.ok) {
      const errText = await vivaRes.text()
      throw new Error(`Viva order creation failed (${vivaRes.status}): ${errText}`)
    }

    const { orderCode } = await vivaRes.json()

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
