# Viva Wallet Checkout Integration Design

**Date:** 2026-03-03
**Status:** Approved

## Problem

WoodSun Gifts targets Bulgaria and European markets but only has Stripe for payments. Viva Wallet is dominant in Bulgaria and supports local EU payment methods (cards, digital wallets, BNPL). Adding it increases conversion for European customers.

## Approach

Option A: Separate API route per provider, mirroring the existing Stripe route. Payment method selector on checkout Step 2 drives which route is called. Both return `{ url }` for identical redirect logic.

## Viva Wallet Smart Checkout Flow

1. **Get OAuth2 token** — POST `https://[demo-]accounts.vivapayments.com/connect/token`
   - `grant_type=client_credentials`, scope `urn:viva:payments:core:api:redirectcheckout`
2. **Create payment order** — POST `https://[demo-]api.vivapayments.com/checkout/v2/orders`
   - `amount` in cents, `merchantTrns` = our DB orderId (round-trip link), `sourceCode`
   - Returns `{ orderCode }`
3. **Redirect** — `https://[demo.]vivapayments.com/web/checkout?ref={orderCode}`
4. **Success callback** — Viva appends `?t={transactionId}` to success URL
5. **Verify** — GET `https://[demo-]api.vivapayments.com/checkout/v2/transactions/{t}`
   - Response includes `merchantTrns` (our orderId) → update order to PAID

## Files

| File | Change |
|---|---|
| `app/checkout/page.tsx` | Replace dummy card inputs with Stripe/Viva selector |
| `app/api/viva/checkout/route.ts` | New: token → order → DB order → redirect URL |
| `app/checkout/viva-success/page.tsx` | New: verify transaction → update DB → redirect to /account |
| `prisma/schema.prisma` | Add `vivaOrderCode String?` and `vivaTransactionId String?` to Order |

## Environment Variables

```
VIVA_CLIENT_ID=
VIVA_CLIENT_SECRET=
VIVA_SOURCE_CODE=
VIVA_ENVIRONMENT=demo   # or: production
```

## API Endpoint Reference

| Purpose | Demo | Production |
|---|---|---|
| OAuth token | `https://demo-accounts.vivapayments.com/connect/token` | `https://accounts.vivapayments.com/connect/token` |
| Create order | `https://demo-api.vivapayments.com/checkout/v2/orders` | `https://api.vivapayments.com/checkout/v2/orders` |
| Checkout page | `https://demo.vivapayments.com/web/checkout?ref={code}` | `https://www.vivapayments.com/web/checkout?ref={code}` |
| Verify transaction | `https://demo-api.vivapayments.com/checkout/v2/transactions/{t}` | `https://api.vivapayments.com/checkout/v2/transactions/{t}` |

## Success Handling

- Success URL set on Viva order: `{NEXTAUTH_URL}/checkout/viva-success`
- Failure URL set on Viva order: `{NEXTAUTH_URL}/checkout`
- `/checkout/viva-success` (server component): reads `t`, verifies, updates order, redirects to `/account`

## Schema

```prisma
model Order {
  // existing fields...
  vivaOrderCode     String?
  vivaTransactionId String?
}
```

## Out of Scope

- Viva webhooks (success-page verification is sufficient for MVP)
- Currency conversion (BGN/EUR handled by Viva's checkout UI)
- Refund flows
