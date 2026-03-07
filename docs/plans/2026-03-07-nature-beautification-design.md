# WoodSun Nature Beautification Design

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the WoodSun site into a warm, nature-immersive experience targeting eco-conscious sun lovers.

**Approach:** Deep Nature Immersion (Option A) — cream backgrounds, Playfair Display serif headings, amber-gold CTAs, espresso footer, wood-grain personality throughout.

---

## Section 1: Global Tokens (Approved)

### Colours
- Background: `#FAF7F2` (warm cream) — replaces `white` on `<body>`
- Amber accent scale added to Tailwind config:
  - `amber-400: #FBBF24`, `amber-500: #F59E0B`, `amber-600: #D97706`
- Primary CTA: `amber-600` bg / `amber-700` hover — replaces `wood-600` everywhere
- Existing `wood` and `sage` scales kept as-is

### Typography
- Headings (`h1`–`h3`, `.font-serif`): **Playfair Display** (Google Font, loaded via `next/font/google`)
- Body: keep existing sans-serif stack
- Implementation: add `font-playfair` Tailwind utility via `fontFamily` config

### CSS Changes (`app/globals.css`)
- `body`: bg `#FAF7F2`
- `h1, h2, h3`: `font-family: var(--font-playfair), serif`
- `.btn-primary`: amber-600 bg, white text, amber-700 hover

---

## Section 2: Homepage (Approved)

### Hero (`components/sections/Hero.tsx`)
- Background: gradient `from-[#FAF7F2] via-wood-50 to-amber-50`
- H1: Playfair Display (applied via global CSS)
- Replace 😎 placeholder with a styled wood-grain SVG illustration panel (amber/wood tones)
- Trust signals: replace bullet icons with small leaf SVG inline icons

### Story Strip (new component `components/sections/StoryStrip.tsx`)
- Full-width band: `bg-wood-800` dark brown, cream text
- Single line: *"Every pair tells a story of forests, craftsmanship, and sun."*
- Inserted between Hero and FeaturedProducts in `app/page.tsx`

### Featured Products (`components/sections/FeaturedProducts.tsx`)
- Section bg: `#FAF7F2`
- Product card: `bg-white` with `border border-wood-100`, rounded-2xl, shadow-sm
- Image area gradient: `from-amber-50 to-wood-100`
- Price colour: `text-amber-700` (replaces `text-wood-600`)
- "Add" button: `btn-primary` → picks up amber from global tokens

### Testimonials (`components/sections/Testimonials.tsx`)
- Section bg: `bg-wood-50`
- Quote card: white with `border-l-4 border-amber-400`

---

## Section 3: Header, Shop, Footer, Other Pages (Approved)

### Header (`components/layout/Header.tsx`)
- `bg-[#FAF7F2]` + `border-b border-wood-200` (replaces white/gray border)
- Nav links: `hover:text-amber-700` (replaces hover:text-wood-600)
- Cart badge: `bg-amber-500` (replaces wood-600)
- Logo: keep existing mark, ensure Playfair weight on "WoodSun" text

### Shop Page (`app/products/page.tsx`)
- Page header band: `bg-gradient-to-r from-wood-800 to-wood-700` with white Playfair heading
- Filter sidebar: cream `bg-[#FAF7F2]`, `border border-wood-100`
- Active filter pill: amber-600 bg

### Footer (`components/layout/Footer.tsx`)
- Background: `#1C1008` (deep espresso — replaces `bg-gray-900`)
- Tagline added under brand: *"Wear the forest. Feel the sun."* in `text-amber-200` italic
- Link hover: `hover:text-amber-400` (replaces hover:text-white)
- Divider: `border-wood-900`

### Other Page Headers (checkout, auth, b2b, admin)
- All page-header banner `<div>`s: `bg-gradient-to-r from-wood-800 to-wood-700` + white Playfair heading
- Form inputs: `bg-[#FAF7F2]` with `focus:ring-amber-400`

---

## Implementation Notes

- Use `next/font/google` to load Playfair Display with `variable: '--font-playfair'`; apply `className` to `<html>` in `app/layout.tsx`
- All file writes use the Windows/OneDrive workaround: Write to `/tmp/`, copy with `node -e "fs.copyFileSync()"`
- No new pages; no new API routes; no DB changes — purely CSS/JSX styling
- Target files (in order):
  1. `tailwind.config.ts` — add amber scale + fontFamily
  2. `app/layout.tsx` — Playfair font + cream body bg
  3. `app/globals.css` — heading font-family, btn-primary amber
  4. `components/sections/Hero.tsx` — gradient, trust signal icons
  5. `components/sections/StoryStrip.tsx` — new component (create)
  6. `app/page.tsx` — insert StoryStrip
  7. `components/sections/FeaturedProducts.tsx` — card styles
  8. `components/sections/Testimonials.tsx` — bg + quote border
  9. `components/layout/Header.tsx` — cream bg, amber hovers
  10. `app/products/page.tsx` — dark header band, cream sidebar
  11. `components/layout/Footer.tsx` — espresso bg, tagline, amber hovers
  12. Other page headers (checkout, auth, b2b, admin) — dark wood gradient bands
