# Design: Order Emails, Invoice PDF, Admin Bulk Import

**Date:** 2026-03-03
**Status:** Approved

---

## Feature 1 — Order Confirmation Emails

### Approach
Shared `lib/email.ts` helper called directly from both payment completion points. No HTTP overhead. Reuses nodemailer pattern already established in `lib/auth.ts`. Dev mode logs to terminal instead of sending.

### Architecture

**New file: `lib/email.ts`**
- Exports `sendOrderConfirmation(orderId: string): Promise<void>`
- Fetches order with items + variant + product names from Prisma
- Builds plain-text + HTML full receipt email
- Uses nodemailer with `EMAIL_SERVER_*` env vars in production
- In dev (`NODE_ENV !== 'production'`): logs full email content to terminal
- Called with `.catch(console.error)` — a failed email never breaks the caller

**Email content:**
- Greeting: `Hi {firstName},`
- Order number and date
- Itemized list: product name × qty = line total
- Subtotal / shipping / tax / **total**
- Shipping address
- Closing note with support email

**Trigger points:**
- `app/api/stripe/webhook/route.ts` — after `status: 'PAID'` update on `checkout.session.completed`
- `app/checkout/viva-success/page.tsx` — after `status: 'PAID'` update when `tx.statusId === 'F'`

### Files Changed
| File | Change |
|---|---|
| `lib/email.ts` | Create |
| `app/api/stripe/webhook/route.ts` | Add `sendOrderConfirmation` call |
| `app/checkout/viva-success/page.tsx` | Add `sendOrderConfirmation` call |

---

## Feature 2 — Invoice PDF (pdfkit)

### Approach
Replace the raw PDF stub in the invoice route with a proper pdfkit document. No schema changes needed — the route already has auth checks and order fetching.

### Architecture

**Install:** `pdfkit` + `@types/pdfkit`

**Modified: `app/api/orders/[id]/invoice/route.ts`**
- Fetch order with full include: `items → variant → product`
- Build pdfkit document with:
  - Header: "WoodSun" branding + "INVOICE" label
  - Order info: order number, date, status
  - Customer & shipping address block
  - Line items table: product name | qty | unit price | line total
  - Totals footer: subtotal / shipping / tax / **total**
- Stream pdfkit output to `Response` with `Content-Type: application/pdf` and `Content-Disposition: attachment; filename="invoice-{orderNumber}.pdf"`

### Files Changed
| File | Change |
|---|---|
| `app/api/orders/[id]/invoice/route.ts` | Replace stub with pdfkit document |

---

## Feature 3 — Admin Bulk Import (CSV)

### Approach
Client-side CSV parse with `papaparse` → preview table → POST resolved rows to a new `/api/orders/bulk-csv` route. The server resolves SKU → variant, calculates prices, and creates orders.

### Architecture

**Install:** `papaparse` + `@types/papaparse`

**CSV format (8 columns):**
```
email,sku,quantity,street_address,city,state,postal_code,country
customer@example.com,WS-WALNUT-DARK-001,2,123 Main St,Sofia,Sofia,1000,BG
```

**New API route: `app/api/orders/bulk-csv/route.ts`**
- Auth check: ADMIN only
- Accepts `POST { rows: CSVRow[] }`
- For each row:
  - Resolves `sku` → `ProductVariant` (with product for price)
  - Calculates `price = product.price + variant.priceDifference`
  - Groups rows by email+address into one order per unique customer/address combination
  - Creates `Order` + `OrderItem` records
- Returns `{ created: N, errors: [{ row, message }] }`

**Modified: `app/admin/page.tsx`**
- New `BulkImport` component added below B2B table
- "Download Template" button — triggers download of hardcoded CSV template string
- File input `accept=".csv"` — on change: parse with papaparse, store rows in state
- Preview table showing first 5 rows + total row count
- "Import N orders" submit button → POST to `/api/orders/bulk-csv` → show result banner
- Error rows listed individually so admin knows which ones failed

### Files Changed
| File | Change |
|---|---|
| `app/api/orders/bulk-csv/route.ts` | Create |
| `app/admin/page.tsx` | Add `BulkImport` component |

---

## Dependencies to Install
```bash
npm install pdfkit papaparse
npm install -D @types/pdfkit @types/papaparse
```

## No Schema Changes Required
All three features work with the existing Prisma schema.
