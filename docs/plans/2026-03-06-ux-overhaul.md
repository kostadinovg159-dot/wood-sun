# UX Overhaul Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Auth-aware header with admin guard, product card grid with variant swatches, slide-out cart drawer.

**Architecture:** CartContext gains drawer state; CartDrawer rendered globally in layout.tsx; Header fully auth-aware; products page fetches variants for swatches.

**Tech Stack:** Next.js 15, React 18, NextAuth, Tailwind CSS

---

### Task 1: Add drawer state to CartContext
**File:** components/cart/CartContext.tsx

Add to CartContextValue interface: isDrawerOpen, openDrawer(), closeDrawer()
Add useState(false) for isDrawerOpen in CartProvider, expose via context value.

Commit: feat: add drawer open/close state to CartContext

---

### Task 2: Create CartDrawer component
**File:** components/cart/CartDrawer.tsx (new)

Returns null when !isDrawerOpen.
When open: fixed backdrop (bg-black/40 z-40, onClick=closeDrawer) + right panel (w-full max-w-sm h-full bg-white z-50 shadow-2xl flex flex-col).
Panel sections: header (title + X close button), scrollable item list (emoji placeholder, name, price, qty +/- buttons, Remove), footer (subtotal + Checkout Link to /checkout onClick=closeDrawer + View full cart link).
Empty state: message + Shop Now link.

Commit: feat: add CartDrawer slide-out component

---

### Task 3: Render CartDrawer in layout
**File:** app/layout.tsx

Import CartDrawer. Add between Header and main.

Commit: feat: render CartDrawer globally in root layout

---

### Task 4: Rewrite Header (auth-aware)
**File:** components/layout/Header.tsx

Changes:
1. Remove hardcoded Admin link from desktop nav
2. Cart icon (bag SVG) calls openDrawer() -- does NOT navigate to /cart
3. Account icon: signed-out = Link to /auth/signin; signed-in = dropdown button with useRef+mousedown-close showing My Account, Sign Out, and Admin Panel ONLY if role === ADMIN
4. Mobile: hamburger + cart icon (openDrawer), slide-down menu with auth-aware links

isAdmin check: (session?.user as any)?.role === ADMIN

Commit: feat: auth-aware header with admin guard and cart drawer trigger

---

### Task 5: Upgrade product grid with variant swatches
**File:** app/products/page.tsx

1. Add image and variants to Product interface
2. Map them in useEffect: image: p.image ?? emoji, variants: p.variants ?? []
3. Add colorToHex helper above component (brown=#8B5E3C, black=#1a1a1a, natural=#C19A6B, etc.)
4. Card: add hover:scale-[1.02] transition-all, show product.image, colour swatch dots (w-4 h-4 rounded-full, inline backgroundColor), max 4 + overflow count

Commit: feat: product grid with variant swatches and hover effects

---

### Task 6: Add guest checkout label
**File:** app/checkout/page.tsx

After email input add:
  No account required -- you can order as a guest.  (text-xs text-gray-500 mt-1)

Commit: feat: add guest checkout label

---

### Task 7: Push and verify
git push

Checklist:
- Non-admin: no Admin link visible
- Admin: Admin Panel in dropdown only
- Cart icon opens drawer (not /cart)
- Badge updates live
- Product cards: swatches + hover scale
- Checkout: guest label visible
- Mobile menu: auth-aware
