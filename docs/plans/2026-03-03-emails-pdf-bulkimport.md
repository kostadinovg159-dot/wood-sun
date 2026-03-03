# Emails, Invoice PDF & Bulk Import — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add order confirmation emails, real invoice PDF generation, and an admin bulk CSV import UI.

**Architecture:** (1) A shared `lib/email.ts` helper sends full-receipt emails from the Stripe webhook and Viva success page. (2) The invoice stub is replaced with a pdfkit-generated PDF that includes all order data. (3) A new admin `BulkImport` component parses a CSV with papaparse and posts to a new `/api/orders/bulk-csv` route that resolves SKUs and creates orders.

**Tech Stack:** Next.js 15 App Router, TypeScript, Prisma SQLite, nodemailer (already installed), pdfkit (new), papaparse (new)

---

## Task 1: Install dependencies

**Files:** none (package.json updated automatically)

**Step 1: Install runtime deps**

```bash
npm install pdfkit papaparse
```

Expected: both packages added to `node_modules/`, no errors.

**Step 2: Install type definitions**

```bash
npm install -D @types/pdfkit @types/papaparse
```

Expected: type packages installed, TypeScript will find them.

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install pdfkit and papaparse"
```

---

## Task 2: Create `lib/email.ts` — order confirmation helper

**Files:**
- Create: `lib/email.ts`

**Step 1: Create the file**

Create `lib/email.ts` with this exact content:

```typescript
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
```

**Step 2: Verify it compiles**

```bash
npx tsc --noEmit
```

Expected: no errors relating to `lib/email.ts`.

**Step 3: Commit**

```bash
git add lib/email.ts
git commit -m "feat: add sendOrderConfirmation email helper"
```

---

## Task 3: Wire confirmation email into Stripe webhook

**Files:**
- Modify: `app/api/stripe/webhook/route.ts`

**Step 1: Add the import at the top of the file**

In `app/api/stripe/webhook/route.ts`, add after the existing imports:

```typescript
import { sendOrderConfirmation } from '@/lib/email'
```

**Step 2: Call it after the order update**

Find this block (around line 29):
```typescript
      await prisma.order.update({
        where: { id: orderId },
        data: { status: 'PAID', stripePaymentId: session.payment_intent as string | null },
      })
```

Add one line immediately after it:
```typescript
      sendOrderConfirmation(orderId).catch(console.error)
```

The full `if (event.type === 'checkout.session.completed')` block should now look like:

```typescript
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
```

**Step 3: Verify it compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

**Step 4: Manual verification (dev)**

Trigger a Stripe test checkout. After payment, check the terminal running `npm run dev` for:
```
========================================
📧  ORDER CONFIRMATION for customer@email.com
    Order: WS-xxxxx  Total: $xx.xx
========================================
```

**Step 5: Commit**

```bash
git add app/api/stripe/webhook/route.ts
git commit -m "feat: send order confirmation email on Stripe payment"
```

---

## Task 4: Wire confirmation email into Viva success page

**Files:**
- Modify: `app/checkout/viva-success/page.tsx`

**Step 1: Add the import at the top of the file**

In `app/checkout/viva-success/page.tsx`, add after existing imports:

```typescript
import { sendOrderConfirmation } from '@/lib/email'
```

**Step 2: Call it after the PAID update**

Find this block (around line 34):
```typescript
      if (orderId && tx.statusId === 'F') {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'PAID',
            vivaTransactionId: transactionId,
          },
        })
```

Add one line immediately after the `prisma.order.update(...)` call, still inside the `if` block:

```typescript
      if (orderId && tx.statusId === 'F') {
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: 'PAID',
            vivaTransactionId: transactionId,
          },
        })
        sendOrderConfirmation(orderId).catch(console.error)
```

**Step 3: Verify it compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

**Step 4: Commit**

```bash
git add app/checkout/viva-success/page.tsx
git commit -m "feat: send order confirmation email on Viva payment"
```

---

## Task 5: Replace invoice PDF stub with pdfkit

**Files:**
- Modify: `app/api/orders/[id]/invoice/route.ts`

**Step 1: Replace the entire file content**

Replace `app/api/orders/[id]/invoice/route.ts` with:

```typescript
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
```

**Step 2: Verify it compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

**Step 3: Manual verification**

With the dev server running, sign in as admin and click "Invoice" on any order in `/admin`. Browser should prompt to download a PDF file named `invoice-WS-xxx.pdf`. Open it — should show WoodSun header, order details, line items table, and totals.

**Step 4: Commit**

```bash
git add "app/api/orders/[id]/invoice/route.ts"
git commit -m "feat: replace invoice PDF stub with real pdfkit document"
```

---

## Task 6: Create `/api/orders/bulk-csv` route

**Files:**
- Create: `app/api/orders/bulk-csv/route.ts`

**Step 1: Create the file**

Create `app/api/orders/bulk-csv/route.ts`:

```typescript
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
```

**Step 2: Verify it compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

**Step 3: Commit**

```bash
git add app/api/orders/bulk-csv/route.ts
git commit -m "feat: add bulk CSV order import API route"
```

---

## Task 7: Add BulkImport component to admin page

**Files:**
- Modify: `app/admin/page.tsx`

**Step 1: Add the BulkImport call inside AdminPage JSX**

In `app/admin/page.tsx`, find the closing of the container div (after `<B2BTable />`):

```tsx
        <h2 className="mt-12 mb-4">Pending B2B Registrations</h2>
        {/* will add table below */}
        <B2BTable />
      </div>
    </div>
  )
```

Replace with:

```tsx
        <h2 className="mt-12 mb-4">Pending B2B Registrations</h2>
        <B2BTable />

        <BulkImport />
      </div>
    </div>
  )
```

**Step 2: Add the BulkImport component at the bottom of the file**

After the closing brace of the `B2BTable` function, append:

```tsx
function BulkImport() {
  const TEMPLATE = [
    'email,sku,quantity,street_address,city,state,postal_code,country',
    'customer@example.com,WS-WALNUT-DARK-001,2,123 Main St,Sofia,Sofia,1000,BG',
  ].join('\n')

  const [rows, setRows] = useState<any[]>([])
  const [result, setResult] = useState<{ created: number; errors: any[] } | null>(null)
  const [importing, setImporting] = useState(false)

  function downloadTemplate() {
    const blob = new Blob([TEMPLATE], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bulk-order-template.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    import('papaparse').then(({ default: Papa }) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (res) => setRows(res.data as any[]),
      })
    })
  }

  async function handleImport() {
    setImporting(true)
    setResult(null)
    const res = await fetch('/api/orders/bulk-csv', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rows }),
    })
    const data = await res.json()
    setResult(data)
    setImporting(false)
  }

  return (
    <div className="mt-12">
      <h2 className="mb-4">Bulk Import Orders</h2>
      <div className="flex gap-4 mb-4">
        <button onClick={downloadTemplate} className="btn btn-outline text-sm px-3 py-2">
          Download CSV Template
        </button>
        <label className="btn btn-outline text-sm px-3 py-2 cursor-pointer">
          Choose CSV File
          <input type="file" accept=".csv" onChange={handleFile} className="hidden" />
        </label>
      </div>

      {rows.length > 0 && (
        <>
          <p className="text-sm text-gray-600 mb-2">
            {rows.length} row{rows.length !== 1 ? 's' : ''} detected. Preview (first 5):
          </p>
          <table className="w-full text-left border text-sm mb-4">
            <thead className="bg-gray-100">
              <tr>
                {Object.keys(rows[0]).map((k) => (
                  <th key={k} className="p-2">{k}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 5).map((r, i) => (
                <tr key={i} className="border-t">
                  {Object.values(r).map((v: any, j) => (
                    <td key={j} className="p-2">{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={handleImport}
            disabled={importing}
            className="btn btn-primary px-4 py-2"
          >
            {importing ? 'Importing…' : `Import ${rows.length} order${rows.length !== 1 ? 's' : ''}`}
          </button>
        </>
      )}

      {result && (
        <div className={`mt-4 p-4 rounded-lg ${result.errors.length === 0 ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'}`}>
          <p className="font-medium">
            {result.created} order{result.created !== 1 ? 's' : ''} created successfully.
          </p>
          {result.errors.length > 0 && (
            <ul className="mt-2 text-sm list-disc list-inside">
              {result.errors.map((e: any, i: number) => (
                <li key={i}>Row {e.row}: {e.message}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
```

**Step 3: Verify it compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

**Step 4: Manual verification**

1. Sign in as admin and go to `/admin`
2. Scroll to bottom — "Bulk Import Orders" section should appear
3. Click "Download CSV Template" — browser downloads `bulk-order-template.csv`
4. Open the CSV — should have header row + one example row
5. Edit it with a real product SKU (find a SKU in Prisma Studio: `npx prisma studio`)
6. Upload the CSV via "Choose CSV File"
7. Preview table should appear showing your rows
8. Click "Import N orders" — success banner should appear: "1 order created successfully."
9. Check `/admin` orders table — new order should appear

**Step 5: Commit**

```bash
git add app/admin/page.tsx
git commit -m "feat: add admin bulk CSV import UI"
```

---

## Verification Summary

| Feature | How to verify |
|---|---|
| Order confirmation email (Stripe) | Complete a Stripe test checkout → check terminal for `📧 ORDER CONFIRMATION` log |
| Order confirmation email (Viva) | Complete a Viva test checkout → check terminal for same log |
| Invoice PDF | Go to `/admin` → click Invoice on any order → PDF downloads with correct data |
| Bulk import | Upload template CSV with valid SKU → success banner + order appears in admin |
