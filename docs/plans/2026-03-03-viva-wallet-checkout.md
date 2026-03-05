# Viva Wallet Checkout Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add Viva Wallet as a selectable payment option on checkout alongside Stripe, using Viva Smart Checkout (hosted redirect flow).

**Architecture:** New `/api/viva/checkout` route mirrors the existing Stripe route — get OAuth2 token, create Viva payment order, create DB order, return redirect URL. A new `/checkout/viva-success` server page verifies the transaction on return and updates the order status. A `lib/viva.ts` utility holds shared URL constants and the token helper to avoid duplication. The checkout page gets a payment method radio selector replacing the unused card input fields.

**Tech Stack:** Next.js 15 App Router, Prisma (SQLite dev), Viva Wallet Smart Checkout API (OAuth2 + REST), TypeScript

---

## Viva API Reference

| Purpose | Demo | Production |
|---|---|---|
| OAuth token | `https://demo-accounts.vivapayments.com/connect/token` | `https://accounts.vivapayments.com/connect/token` |
| Create order | `https://demo-api.vivapayments.com/checkout/v2/orders` | `https://api.vivapayments.com/checkout/v2/orders` |
| Verify transaction | `https://demo-api.vivapayments.com/checkout/v2/transactions/{t}` | `https://api.vivapayments.com/checkout/v2/transactions/{t}` |
| Hosted checkout | `https://demo.vivapayments.com/web/checkout?ref={orderCode}` | `https://www.vivapayments.com/web/checkout?ref={orderCode}` |

**Transaction status codes:**
- `F` = Full Capture (payment successful — update order to PAID)
- `A` = Authorization only
- `C` = Cancelled
- `E` = Error

**Key fields:**
- `merchantTrns` — arbitrary string we set; we store our DB `orderId` here for round-trip linking
- `t` — transaction ID appended to success URL by Viva on redirect back
- `orderCode` — 16-digit Viva order ID (store in `vivaOrderCode`)

---

## Pre-Requisites (manual steps before coding)

1. Create a Viva Wallet merchant account at [https://www.vivawallet.com](https://www.vivawallet.com)
2. In the **demo** portal, go to **Settings → API Access** → note your `Client ID` and `Client Secret`
3. Go to **Settings → Payment Sources** → create a new **Online** source → note the `Source Code`
4. In the payment source, configure:
   - **Success URL:** `http://localhost:3000/checkout/viva-success`
   - **Failure URL:** `http://localhost:3000/checkout`
5. Add to your `.env.local`:
   ```
   VIVA_CLIENT_ID=your_client_id
   VIVA_CLIENT_SECRET=your_client_secret
   VIVA_SOURCE_CODE=your_source_code
   VIVA_ENVIRONMENT=demo
   ```

---

## Task 1: Update Prisma schema

**Files:**
- Modify: `prisma/schema.prisma`

**Step 1: Add Viva fields to the Order model**

In `prisma/schema.prisma`, find the `// Payment` section of the `Order` model and add two fields after `stripePaymentId`:

```prisma
  // Payment
  status          String   @default("PENDING")
  stripeSessionId String?       @unique
  stripePaymentId String?
  vivaOrderCode   String?
  vivaTransactionId String?
```

**Step 2: Push schema to the dev database**

```bash
npx prisma db push
```

Expected output:
```
Your database is now in sync with your Prisma schema.
```

**Step 3: Regenerate Prisma client**

```bash
npx prisma generate
```

**Step 4: Commit**

```bash
git add prisma/schema.prisma
git commit -m "feat: add vivaOrderCode and vivaTransactionId fields to Order"
```

---

## Task 2: Update .env.example

**Files:**
- Modify: `.env.example`

**Step 1: Add Viva Wallet env vars**

Append after the Stripe block in `.env.example`:

```bash
# Viva Wallet
VIVA_CLIENT_ID=""
VIVA_CLIENT_SECRET=""
VIVA_SOURCE_CODE=""
VIVA_ENVIRONMENT="demo"   # or: production
```

**Step 2: Commit**

```bash
git add .env.example
git commit -m "chore: add Viva Wallet env vars to .env.example"
```

---

## Task 3: Create `lib/viva.ts` utility

**Files:**
- Create: `lib/viva.ts`

**Step 1: Write the shared Viva helpers**

Create `lib/viva.ts`:

```typescript
const isDemo = (process.env.VIVA_ENVIRONMENT || 'demo') !== 'production'

export const VIVA_ACCOUNTS_URL = isDemo
  ? 'https://demo-accounts.vivapayments.com'
  : 'https://accounts.vivapayments.com'

export const VIVA_API_URL = isDemo
  ? 'https://demo-api.vivapayments.com'
  : 'https://api.vivapayments.com'

export const VIVA_CHECKOUT_BASE = isDemo
  ? 'https://demo.vivapayments.com'
  : 'https://www.vivapayments.com'

export async function getVivaToken(): Promise<string> {
  const res = await fetch(`${VIVA_ACCOUNTS_URL}/connect/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: process.env.VIVA_CLIENT_ID || '',
      client_secret: process.env.VIVA_CLIENT_SECRET || '',
    }),
  })
  if (!res.ok) {
    throw new Error(`Viva token request failed: ${res.status} ${await res.text()}`)
  }
  const data = await res.json()
  return data.access_token as string
}
```

**Step 2: Commit**

```bash
git add lib/viva.ts
git commit -m "feat: add Viva Wallet API helpers to lib/viva.ts"
```

---

## Task 4: Create `/api/viva/checkout` route

**Files:**
- Create: `app/api/viva/checkout/route.ts`

**Step 1: Write the route**

Create `app/api/viva/checkout/route.ts`:

```typescript
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
        merchantTrns: order.id,   // our DB orderId — returned in transaction verify response
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
```

**Step 2: Commit**

```bash
git add app/api/viva/checkout/route.ts
git commit -m "feat: add Viva Wallet checkout API route"
```

---

## Task 5: Create `/checkout/viva-success` page

**Files:**
- Create: `app/checkout/viva-success/page.tsx`

**Step 1: Write the success page**

Viva redirects back to `{NEXTAUTH_URL}/checkout/viva-success?t={transactionId}` after payment.
This server component verifies the transaction and updates the order.

Create `app/checkout/viva-success/page.tsx`:

```typescript
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { getVivaToken, VIVA_API_URL } from '@/lib/viva'

interface PageProps {
  searchParams: Promise<{ t?: string }>
}

export default async function VivaSuccessPage({ searchParams }: PageProps) {
  const { t: transactionId } = await searchParams

  if (!transactionId) {
    redirect('/checkout')
  }

  try {
    const token = await getVivaToken()

    const txRes = await fetch(`${VIVA_API_URL}/checkout/v2/transactions/${transactionId}`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })

    if (!txRes.ok) {
      console.error('Viva transaction verify failed:', txRes.status)
      redirect('/checkout')
    }

    const tx = await txRes.json()
    const orderId: string | undefined = tx.merchantTrns

    // statusId 'F' = Full Capture (successful payment)
    if (orderId && tx.statusId === 'F') {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: 'PAID',
          vivaTransactionId: transactionId,
        },
      })
    }
  } catch (e) {
    console.error('Viva success page error:', e)
    // Don't block the redirect even if verification fails
  }

  redirect('/account')
}
```

**Step 2: Commit**

```bash
git add app/checkout/viva-success/page.tsx
git commit -m "feat: add Viva Wallet success verification page"
```

---

## Task 6: Update checkout page — payment method selector

**Files:**
- Modify: `app/checkout/page.tsx`

**Step 1: Add paymentMethod state**

In `app/checkout/page.tsx`, add `paymentMethod` state after the existing state declarations:

```typescript
const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'viva'>('stripe')
```

**Step 2: Remove unused card fields from formData**

The `cardNumber`, `expiry`, and `cvc` fields in `formData` are never used (Stripe/Viva both use hosted checkout). Remove them from the initial state:

```typescript
const [formData, setFormData] = useState({
  firstName: '',
  lastName: '',
  email: '',
  streetAddress: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'US',
  companyName: '',
  vatNumber: '',
})
```

**Step 3: Route submit to correct API**

In `handleSubmit`, replace the hardcoded `/api/stripe/checkout` endpoint:

```typescript
const apiEndpoint = paymentMethod === 'viva'
  ? '/api/viva/checkout'
  : '/api/stripe/checkout'

const res = await fetch(apiEndpoint, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload),
})
```

**Step 4: Replace card inputs with payment method selector**

Replace the entire `{step === 'payment' && ( ... )}` block's inner content (the card number/expiry/cvc inputs) with:

```tsx
{step === 'payment' && (
  <div className="space-y-6">
    <h2>Payment Method</h2>

    <div className="space-y-3">
      <label
        className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition ${
          paymentMethod === 'stripe' ? 'border-wood-600 bg-wood-50' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <input
          type="radio"
          name="paymentMethod"
          value="stripe"
          checked={paymentMethod === 'stripe'}
          onChange={() => setPaymentMethod('stripe')}
          className="w-4 h-4 accent-wood-600"
        />
        <div>
          <p className="font-medium text-gray-900">Card (Stripe)</p>
          <p className="text-sm text-gray-500">Visa, Mastercard, American Express</p>
        </div>
      </label>

      <label
        className={`flex items-center gap-4 p-4 border-2 rounded-lg cursor-pointer transition ${
          paymentMethod === 'viva' ? 'border-wood-600 bg-wood-50' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <input
          type="radio"
          name="paymentMethod"
          value="viva"
          checked={paymentMethod === 'viva'}
          onChange={() => setPaymentMethod('viva')}
          className="w-4 h-4 accent-wood-600"
        />
        <div>
          <p className="font-medium text-gray-900">Viva Wallet</p>
          <p className="text-sm text-gray-500">Cards + local EU payment methods (Bulgaria, Greece, etc.)</p>
        </div>
      </label>
    </div>

    <div className="p-3 bg-sage-50 rounded-lg text-xs text-gray-600">
      You will be redirected to a secure payment page to complete your order.
    </div>
  </div>
)}
```

**Step 5: Commit**

```bash
git add app/checkout/page.tsx
git commit -m "feat: add Viva Wallet payment method selector to checkout"
```

---

## Verification

### End-to-end test (requires Viva demo account and env vars set)

1. Start dev server: `npm run dev`
2. Navigate to `/products`, click a product, click "Add to Cart" (or manually add an item to localStorage cart)
3. Go to `/checkout` — confirm the order summary shows your real cart items
4. Fill in the address form and click "Continue to Payment"
5. On Step 2, confirm you see "Card (Stripe)" and "Viva Wallet" radio options
6. Select **Viva Wallet** and click "Place Order"
7. Confirm redirect to `demo.vivapayments.com/web/checkout?ref=...`
8. Use Viva test card: `4111 1111 1111 1111`, expiry `01/26`, CVV `111`
9. After payment, confirm redirect to `/account`
10. Check `/admin` — order should appear with status `PAID` and `vivaTransactionId` populated

### Stripe still works
- Repeat steps 1-6 but select **Card (Stripe)** instead
- Use test card `4242 4242 4242 4242`
- Confirm same result: redirect to `/account`, order marked PAID via webhook

### Empty state
- Clear localStorage, navigate to `/checkout` directly
- Should see "Your cart is empty" with "Back to Cart" link

### Viva demo test cards
| Card | Result |
|---|---|
| `4111 1111 1111 1111` | Success |
| `4000 0000 0000 0002` | Decline |

---

## Troubleshooting

**"Viva token request failed: 401"** — Check `VIVA_CLIENT_ID` and `VIVA_CLIENT_SECRET` in `.env.local`

**"Viva order creation failed: 400"** — Check `VIVA_SOURCE_CODE` matches your demo payment source. Make sure the source is configured for online payments.

**Redirected to `/checkout` instead of Viva page** — Viva returned a non-200 response. Check server logs for the full error.

**Order status stays PENDING after payment** — The success URL in your Viva payment source dashboard may not match `http://localhost:3000/checkout/viva-success`. Update the payment source configuration.

**`tx.merchantTrns` is undefined** — The Viva API may return `merchantTrns` under a different field name in your account region. Log the full `tx` response body to inspect.
