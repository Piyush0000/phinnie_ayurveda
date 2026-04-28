# Phinnie Aurvadic — Ayurvedic E-Commerce

A complete, production-ready Ayurvedic e-commerce site built with Next.js 14, MongoDB, NextAuth, Razorpay, Cloudinary, and Resend.

## Quick start

```bash
# 1. Install dependencies (already done if you ran npm install)
npm install

# 2. Copy env template and fill in your keys
cp .env.local.example .env.local

# 3. (Optional now, required later) Add MongoDB URI to .env.local

# 4. Start the dev server
npm run dev
# → http://localhost:3000

# 5. Once MongoDB is configured, seed sample data
npm run seed
```

The app runs even without MONGODB_URI — pages show a friendly "database not configured" notice instead of crashing. Add the URI to `.env.local`, restart, run `npm run seed`, and you have a fully populated store.

## Default admin login

After running `npm run seed`:

- Email: **admin@phinnieaurvadic.com**
- Password: **Admin@123**
- Admin URL: http://localhost:3000/admin

## What you get

- **Storefront** — Hero, category showcase, featured products, benefits, testimonials, newsletter, full shop with filters/search/sort/pagination, product detail with reviews, cart drawer + cart page, checkout, order confirmation, profile, orders, about, contact.
- **Admin panel** — Dashboard with revenue/orders charts, products CRUD with image upload, orders with status workflow, customers with CSV export, categories with delete-guard, site settings.
- **Auth** — NextAuth v5 (credentials + optional Google OAuth), bcrypt-hashed passwords, role-based admin guard.
- **Payments** — Razorpay checkout, HMAC-SHA256 signature verification, atomic stock decrement on payment success, webhook handler for capture/failure events.
- **Email** — Resend-powered order confirmation emails (skipped silently if RESEND_API_KEY not set).
- **Image uploads** — Cloudinary signed uploads with URL fallback for admin image manager.
- **Cart** — Zustand store persisted to localStorage, automatic free-shipping threshold, coupon support, GST tax calculation.

## Environment variables

See `.env.local.example` for all variables. The app gracefully degrades when optional services aren't configured:

| Variable | Required | Without it |
|---|---|---|
| `MONGODB_URI` | Yes (for full functionality) | Pages show setup banner |
| `NEXTAUTH_SECRET` | Yes | Auth won't work |
| `RAZORPAY_*` | For checkout | Checkout button returns 503 |
| `CLOUDINARY_*` | For image upload | Admin can paste image URLs instead |
| `RESEND_API_KEY` | For email | Order email skipped silently |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Optional | Google OAuth disabled |

## Stack

- Next.js 14 (App Router)
- MongoDB Atlas + Mongoose 8
- NextAuth.js v5 (beta)
- Tailwind CSS 3 with custom Ayurvedic palette
- Zustand (cart) + React Hook Form + Zod
- Razorpay (payments) + Cloudinary (images) + Resend (email)
- Recharts (admin dashboard charts)
- TypeScript end-to-end, zero `any` in business logic

## Notes

- Stock decrement uses atomic `findOneAndUpdate` with `$gte` guard to prevent overselling.
- Razorpay signature verification uses `crypto.timingSafeEqual`.
- Admin routes are protected at the layout level (server-side session check) AND in every admin API route.
- All seed operations are idempotent — `npm run seed` is safe to run multiple times.
"# phinnie_ayurveda" 
