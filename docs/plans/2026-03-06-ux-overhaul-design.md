# UX Overhaul Design — WoodSun Gifts

**Date:** 2026-03-06
**Reference:** wildwoodeyewear.ca
**Approach:** Option B — Selective upgrades (auth-aware header, product card grid, slide-out cart drawer)

## Context

The live site has a functional but bare-bones UI. The goal is to bring it up to the standard of wildwoodeyewear.ca: clean navigation with role-aware links, a polished product grid with variant swatches, and a slide-out cart drawer accessible from any page.

---

## 1. Header / Nav

- Desktop: Logo left, nav links centre, account icon + cart icon right
- Account icon: signed out → /auth/signin; signed in → dropdown with "Hi [name]", My Account, Sign Out, Admin (only if role=ADMIN)
- Cart icon → opens slide-out CartDrawer (no page navigation)
- Mobile: hamburger → slide-down with all links + auth state

Files: components/layout/Header.tsx

---

## 2. Product Grid

- 3-col desktop / 2-col tablet / 1-col mobile
- Card: image placeholder, product name, price, colour swatch dots per variant
- Hover: scale(1.02) + shadow
- Entire card links to /products/[slug]

Files: app/products/page.tsx

---

## 3. Slide-out Cart Drawer

- CartContext gains isDrawerOpen, openDrawer(), closeDrawer()
- CartDrawer: fixed right panel, backdrop overlay, item list with +/- controls, subtotal, Checkout button
- Cart icon in Header calls openDrawer()
- CartDrawer rendered globally in app/layout.tsx

Files: components/cart/CartContext.tsx, components/cart/CartDrawer.tsx, components/layout/Header.tsx, app/layout.tsx

---

## 4. Guest Checkout (minor)

Add "No account required" label near email field.

Files: app/checkout/page.tsx

---

## Verification

1. Non-admin: no Admin link visible
2. Admin: Admin link in account dropdown only
3. Cart icon opens drawer, badge updates live
4. Product grid: 3-col, swatches, hover
5. Mobile menu: correct links + auth state
6. Guest checkout label visible
