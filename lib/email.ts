import { prisma } from '@/lib/db'

export async function sendOrderConfirmation(orderId: string): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          variant: {
            include: { product: true },
          },
        },
      },
    },
  })

  if (!order) {
    console.error(`sendOrderConfirmation: order ${orderId} not found`)
    return
  }

  const itemLines = order.items.map((item) => {
    const name = item.variant.product.name + (item.variant.name ? ` – ${item.variant.name}` : '')
    return `  ${name} × ${item.quantity}  $${(item.pricePerUnit * item.quantity).toFixed(2)}`
  })

  const text = [
    `Hi ${order.firstName || order.email},`,
    ``,
    `Thank you for your order! Here is your receipt:`,
    ``,
    `Order: ${order.orderNumber}`,
    `Date: ${new Date(order.createdAt).toLocaleDateString('en-GB')}`,
    ``,
    `Items:`,
    ...itemLines,
    ``,
    `Subtotal:  $${order.subtotal.toFixed(2)}`,
    `Shipping:  $${order.shippingCost.toFixed(2)}`,
    `Tax:       $${order.tax.toFixed(2)}`,
    `Total:     $${order.total.toFixed(2)}`,
    ``,
    `Shipping to:`,
    `  ${order.firstName} ${order.lastName}`,
    `  ${order.streetAddress}`,
    `  ${order.city}, ${order.state} ${order.postalCode}`,
    `  ${order.country}`,
    ``,
    `Questions? Email us at support@woodsun.com`,
  ].join('\n')

  const htmlItems = order.items
    .map((item) => {
      const name = item.variant.product.name + (item.variant.name ? ` – ${item.variant.name}` : '')
      return `<tr>
        <td style="padding:6px 12px;border-bottom:1px solid #eee;">${name}</td>
        <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
        <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:right;">$${item.pricePerUnit.toFixed(2)}</td>
        <td style="padding:6px 12px;border-bottom:1px solid #eee;text-align:right;">$${(item.pricePerUnit * item.quantity).toFixed(2)}</td>
      </tr>`
    })
    .join('\n')

  const html = `<!DOCTYPE html>
<html>
<body style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;color:#333;">
  <h2 style="color:#7c5c3a;">&#127807; WoodSun — Order Confirmed</h2>
  <p>Hi ${order.firstName || order.email},</p>
  <p>Thank you for your order! Here is your receipt.</p>
  <h3 style="margin-top:24px;">Order ${order.orderNumber}</h3>
  <p style="color:#666;font-size:14px;">${new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
  <table style="width:100%;border-collapse:collapse;margin-top:16px;">
    <thead>
      <tr style="background:#f5f0eb;">
        <th style="padding:8px 12px;text-align:left;">Product</th>
        <th style="padding:8px 12px;text-align:center;">Qty</th>
        <th style="padding:8px 12px;text-align:right;">Unit Price</th>
        <th style="padding:8px 12px;text-align:right;">Total</th>
      </tr>
    </thead>
    <tbody>
      ${htmlItems}
    </tbody>
  </table>
  <table style="width:100%;margin-top:16px;">
    <tr><td style="padding:4px 12px;text-align:right;color:#666;">Subtotal</td><td style="padding:4px 12px;text-align:right;">$${order.subtotal.toFixed(2)}</td></tr>
    <tr><td style="padding:4px 12px;text-align:right;color:#666;">Shipping</td><td style="padding:4px 12px;text-align:right;">$${order.shippingCost.toFixed(2)}</td></tr>
    <tr><td style="padding:4px 12px;text-align:right;color:#666;">Tax</td><td style="padding:4px 12px;text-align:right;">$${order.tax.toFixed(2)}</td></tr>
    <tr style="font-weight:bold;font-size:16px;">
      <td style="padding:8px 12px;text-align:right;border-top:2px solid #eee;">Total</td>
      <td style="padding:8px 12px;text-align:right;border-top:2px solid #eee;color:#7c5c3a;">$${order.total.toFixed(2)}</td>
    </tr>
  </table>
  <div style="margin-top:24px;padding:16px;background:#f9f7f5;border-radius:8px;">
    <h4 style="margin:0 0 8px;">Shipping to</h4>
    <p style="margin:0;line-height:1.6;">${order.firstName} ${order.lastName}<br>
    ${order.streetAddress}<br>
    ${order.city}, ${order.state} ${order.postalCode}<br>
    ${order.country}</p>
  </div>
  <p style="margin-top:24px;color:#666;font-size:14px;">
    Questions? Email us at <a href="mailto:support@woodsun.com" style="color:#7c5c3a;">support@woodsun.com</a>
  </p>
</body>
</html>`

  if (process.env.NODE_ENV !== 'production') {
    console.log('\n========================================')
    console.log(`📧  ORDER CONFIRMATION for ${order.email}`)
    console.log(`    Order: ${order.orderNumber}  Total: $${order.total.toFixed(2)}`)
    console.log('========================================\n')
    return
  }

  const { createTransport } = await import('nodemailer')
  const transport = createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT || '465'),
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  })
  await transport.sendMail({
    to: order.email,
    from: process.env.EMAIL_FROM || 'noreply@woodsun.com',
    subject: `Your WoodSun order ${order.orderNumber} is confirmed`,
    text,
    html,
  })
}
