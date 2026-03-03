import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import PDFDocument from 'pdfkit'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params

  const order = await prisma.order.findUnique({
    where: { id },
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
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const user = session.user as any
  if (user.role !== 'ADMIN' && order.userId !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const doc = new PDFDocument({ margin: 50, size: 'A4' })
  const chunks: Buffer[] = []
  doc.on('data', (chunk: Buffer) => chunks.push(chunk))

  await new Promise<void>((resolve) => {
    doc.on('end', resolve)

    // Header
    doc.fontSize(24).font('Helvetica-Bold').fillColor('#7c5c3a').text('WoodSun', 50, 50)
    doc.fontSize(10).font('Helvetica').fillColor('#666').text('Eco-Friendly Wooden Sunglasses', 50, 80)
    doc.fillColor('#333').fontSize(20).font('Helvetica-Bold').text('INVOICE', 400, 50, { align: 'right', width: 145 })

    doc.moveTo(50, 110).lineTo(545, 110).strokeColor('#ddd').stroke()

    // Order info
    doc.fontSize(10).font('Helvetica').fillColor('#333')
    doc.text(`Order Number: ${order.orderNumber}`, 50, 130)
    doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-GB')}`, 50, 148)
    doc.text(`Status: ${order.status}`, 50, 166)

    // Ship-to block
    doc.font('Helvetica-Bold').text('Ship To:', 350, 130)
    doc.font('Helvetica')
    doc.text(`${order.firstName} ${order.lastName}`, 350, 148)
    doc.text(order.streetAddress, 350, 166)
    doc.text(`${order.city}, ${order.state} ${order.postalCode}`, 350, 184)
    doc.text(order.country, 350, 202)

    // Table header
    const tableTop = 240
    doc.moveTo(50, tableTop - 10).lineTo(545, tableTop - 10).strokeColor('#ddd').stroke()
    doc.font('Helvetica-Bold').fontSize(10).fillColor('#333')
    doc.text('Product', 50, tableTop, { width: 290 })
    doc.text('Qty', 350, tableTop, { width: 50, align: 'right' })
    doc.text('Unit Price', 410, tableTop, { width: 65, align: 'right' })
    doc.text('Total', 480, tableTop, { width: 65, align: 'right' })
    doc.moveTo(50, tableTop + 18).lineTo(545, tableTop + 18).strokeColor('#ddd').stroke()

    // Line items
    let y = tableTop + 30
    doc.font('Helvetica').fontSize(10)
    for (const item of order.items) {
      const name = item.variant.product.name +
        (item.variant.name ? ` \u2013 ${item.variant.name}` : '')
      const lineTotal = item.pricePerUnit * item.quantity
      doc.text(name, 50, y, { width: 290 })
      doc.text(String(item.quantity), 350, y, { width: 50, align: 'right' })
      doc.text(`$${item.pricePerUnit.toFixed(2)}`, 410, y, { width: 65, align: 'right' })
      doc.text(`$${lineTotal.toFixed(2)}`, 480, y, { width: 65, align: 'right' })
      y += 22
    }

    // Totals
    doc.moveTo(350, y + 5).lineTo(545, y + 5).strokeColor('#ddd').stroke()
    y += 18
    doc.font('Helvetica').fontSize(10)
    doc.text('Subtotal', 350, y, { width: 125, align: 'right' })
    doc.text(`$${order.subtotal.toFixed(2)}`, 480, y, { width: 65, align: 'right' })
    y += 18
    doc.text('Shipping', 350, y, { width: 125, align: 'right' })
    doc.text(`$${order.shippingCost.toFixed(2)}`, 480, y, { width: 65, align: 'right' })
    y += 18
    doc.text('Tax', 350, y, { width: 125, align: 'right' })
    doc.text(`$${order.tax.toFixed(2)}`, 480, y, { width: 65, align: 'right' })
    y += 6
    doc.moveTo(350, y + 5).lineTo(545, y + 5).strokeColor('#333').stroke()
    y += 14
    doc.font('Helvetica-Bold').fontSize(12)
    doc.text('Total', 350, y, { width: 125, align: 'right' })
    doc.fillColor('#7c5c3a').text(`$${order.total.toFixed(2)}`, 480, y, { width: 65, align: 'right' })

    // Footer
    doc.fontSize(9).font('Helvetica').fillColor('#999')
    doc.text('Thank you for your order!  support@woodsun.com', 50, 750, {
      align: 'center',
      width: 495,
    })

    doc.end()
  })

  const pdf = Buffer.concat(chunks)

  return new Response(pdf, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="invoice-${order.orderNumber}.pdf"`,
    },
  })
}
