# 🌿 WoodSun Gifts - Eco-Friendly Wooden Sunglasses Platform

A modern, full-stack e-commerce platform for personalized wooden sunglasses with deep B2B integration for corporate gifts and wholesale orders.

## 🎯 Features

### MVP Phase 1 ✅
- **Homepage** with hero section, featured products, and B2B CTA
- **Products Listing** with filters (material, style, price, polarized)
- **Single Product Page** with:
  - Gallery & variants (frame, lenses)
  - Real-time customization tool (text, font, color, preview)
  - Size guide & specifications
- **Shopping Cart** with quantity management
- **Checkout** with guest/registered options
  - Address entry (shipping & B2B fields)
  - B2B company info (name, VAT)
  - Stripe integration

### Planned Features (Phase 2)
- User dashboard (orders, repeat orders, favorites)
- Admin panel (order dashboard, fulfillment mock)
- B2B registration & approval flow
- Email notifications (order confirmation, shipping)
- API for dropshipping integration
- Wholesale pricing database

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15 (App Router) + React + TypeScript |
| **Styling** | Tailwind CSS |
| **Backend** | Next.js API Routes |
| **Database** | PostgreSQL (Vercel Postgres / Neon) |
| **ORM** | Prisma |
| **Auth** | NextAuth.js v5 (Google OAuth + Email Magic Link) |
| **Payments** | Stripe (Checkout Sessions) |
| **Deployment** | Vercel |

## 📁 Project Structure

```
wood-y-sun/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Homepage
│   ├── products/
│   │   ├── page.tsx        # Products listing
│   │   └── [id]/
│   │       └── page.tsx    # Single product
│   ├── cart/
│   │   └── page.tsx
│   ├── checkout/
│   │   └── page.tsx
│   ├── api/
│   │   ├── products/
│   │   ├── orders/
│   │   └── auth/
│   └── globals.css
├── components/
│   ├── layout/             # Header, Footer
│   ├── sections/           # Page sections
│   ├── ui/                 # Reusable UI components
│   └── checkout/
├── lib/
│   ├── db.ts              # Prisma client
│   ├── auth.ts            # NextAuth config
│   ├── utils.ts           # Helper functions
│   └── constants.ts       # App constants
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/
├── public/                # Static assets
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (npm or pnpm)
- PostgreSQL database (Vercel Postgres / Neon recommended for MVP)
- Stripe account
- Google OAuth credentials (for NextAuth)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Setup environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# 3. Setup database
npx prisma migrate dev --name init

# 4. Start development server
npm run dev
```

Visit `http://localhost:3000`

### Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Open Prisma Studio (visual database editor)
npm run prisma:studio
```

## 📦 Database Schema

### Core Models
- **User** - Customers with B2B support
- **Product** - Products with B2C/B2B pricing
- **ProductVariant** - Frame/lens combinations
- **Cart/CartItem** - Shopping cart
- **Order/OrderItem** - Order history
- **Customization** - Text engraving & branding
- **Account/Session** - NextAuth tables

## 💳 Stripe Integration

### Setup
1. Get your Stripe API keys from [dashboard.stripe.com](https://dashboard.stripe.com)
2. Add to `.env.local`:
   ```
   STRIPE_PUBLIC_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```

### Features
- Hosted Checkout Sessions
- Test cards: `4242 4242 4242 4242`
- Webhooks for order status updates

## 🔐 Authentication (NextAuth.js v5)

### Providers
- **Google OAuth** (recommended for social login)
- **Email Magic Link** (passwordless login)

### Setup
1. Create Google OAuth app at [Google Cloud Console](https://console.cloud.google.com)
2. Add callback URL: `http://localhost:3000/api/auth/callback/google`
3. Add credentials to `.env.local`:
   ```
   GOOGLE_CLIENT_ID=...
   GOOGLE_CLIENT_SECRET=...
   ```

## 🎨 Design System

### Colors (Tailwind)
- **Primary**: `wood-600` (Brown) - CTA, branding
- **Secondary**: `sage-600` (Green) - Eco-friendly accent
- **Neutral**: Gray palette for text/backgrounds

### Typography
- **Headings**: Bold sans-serif
- **Body**: 16px regular

### Components
- Buttons (primary, secondary, outline)
- Cards (elevated design)
- Input fields (consistent styling)
- Modal/Dialog (upcoming)

## 📱 Responsive Design

All pages are mobile-first responsive:
- Mobile: `320px` (sm: `640px`)
- Tablet: `md: 768px` (lg: `1024px`)
- Desktop: `xl: 1280px` (2xl: `1536px`)

## 📖 API Routes

### Products
- `GET /api/products` - List all products with filters (seeds sample data)
- `GET /api/products/[slug]` - Get single product by slug

### Orders
- `POST /api/orders` - Create order directly (used for non‑Stripe flows)
- `GET /api/orders` - Get user orders
- `GET /api/orders/[id]` - Get order detail (with items)

### B2B
- `POST /api/b2b/register` - Submit wholesale account request
- `GET /api/b2b/pending` - Admin list of pending requests
- `POST /api/b2b/approve` - Approve request and create user

### Stripe
- `POST /api/stripe/checkout` - Create Stripe checkout session and order
- `POST /api/stripe/webhook` - Receive events and update order status

### Emails
- `POST /api/emails/send` - Send or log email notifications (uses Nodemailer when EMAIL_SERVER_* vars are set)

_Email configuration in `.env.example` covers SMTP settings; if none provided the server will simply console.log messages._


## 🔄 Phase 2 – B2B & Dashboard

### Completed
- ✅ **User Dashboard** (`/account`) lists past orders and B2B info
- ✅ **Admin Panel** (`/admin`) shows all orders and pending B2B registrations
- ✅ **B2B Registration** form (`/b2b/register`) + success message
- ✅ **API Routes**
  - `POST /api/b2b/register` (creates `B2BRequest` record via Prisma)
  - `GET /api/b2b/pending` (admin view of un‑approved requests)
  - `POST /api/b2b/approve` (admin approval, also creates/updates user)
  - `GET /api/users/me` (returns enriched next-auth session user)
  - `GET /api/orders` (fetch orders scoped by role)
  - `GET /api/orders/[id]` (single order)
  - `POST /api/orders` (create order with B2B flag)
  - `POST /api/orders/bulk` (admin bulk order creation)
  - `GET /api/orders/[id]/invoice` (stub PDF invoice)
  - `POST /api/emails/send` (mock email log)
- ✅ **Prisma Schema** updated with `B2BRequest`, `Order` B2B flag, and user fields
- ✅ **NextAuth session** enrichment callback adds role & B2B info
- ✅ UI components wired to API endpoints (account, admin, order detail)

### Next Steps
- [ ] Integrate real email provider (SendGrid, Mailgun, etc.)
- [ ] Store and serve real invoice PDFs (S3 or similar)
- [ ] Complete admin features: reject requests, update order status, UI for bulk imports
- [ ] Migrate product list to Prisma database instead of mocks
- [ ] Deploy on Vercel with production database & env vars
- [ ] Implement Stripe/payment and fulfillment workflows

## 📚 Resources

- [Next.js Documentation](https://nextjs.org)
- [Tailwind CSS](https://tailwindcss.com)
- [Prisma ORM](https://prisma.io)
- [NextAuth.js](https://next-auth.js.org)
- [Stripe Docs](https://stripe.com/docs)

## 📝 License

This project is private and for internal use only.

## 🤝 Support

For questions or issues, contact: support@woodsun.com

---

**Happy coding! 🚀**
