# Invoice Manager

A multi-tenant GST tax invoice tool. Each company signs up with its own account,
manages its own company profile, customers, and product catalog, and creates
invoices that follow the standard Indian Tax Invoice format (Bill to / Ship to,
HSN/SAC, CGST/SGST/IGST, HSN summary, amount in words, bank details, signature block).

## What's included

- **Multi-tenant auth** — each company signs up separately (`/signup`), and everything
  a company creates (customers, products, invoices) is only ever visible to that company.
- **Company profile** — name, address, logo, GSTIN, PAN, bank details, and declaration
  text, stored once and auto-filled onto every invoice.
- **Customer database** — save buyers with their GSTIN/state/place of supply, plus an
  optional default shipping address, so you don't retype them each time.
- **Product catalog** — save products/services with HSN/SAC, rate, GST%, and unit.
  Picking one from the dropdown on an invoice auto-fills the line item.
- **Invoices** — sequential invoice numbering per company, automatic CGST+SGST vs IGST
  detection (based on comparing your state code to the buyer's), editable tax-amount
  overrides for paisa-level rounding, and a print-ready view matching the standard
  Tax Invoice layout.

## Tech stack

Next.js 14 (App Router) · PostgreSQL via Prisma · NextAuth (Credentials + JWT sessions)

## 1. Set up a Postgres database

Pick any managed Postgres — this app just needs a `DATABASE_URL` connection string:

- **Supabase** — new project → Settings → Database → connection string (use the "URI" one, pooled connection recommended for serverless)
- **Neon** — new project → connection string is shown immediately
- **Railway** — new project → Add PostgreSQL plugin → copy `DATABASE_URL` from Variables

## 2. Configure environment variables

```bash
cp .env.example .env
```

Fill in:
- `DATABASE_URL` — from step 1
- `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`
- `NEXTAUTH_URL` — `http://localhost:3000` locally, or your deployed URL in production

## 3. Install dependencies and set up the database

```bash
npm install
npx prisma migrate dev --name init
```

This creates all the tables (Company, User, Customer, Product, Invoice, InvoiceItem).

## 4. Run locally

```bash
npm run dev
```

Visit `http://localhost:3000` → you'll land on `/login`. Click "Create one" to sign up
a new company — this creates the Company record and your first admin user in one step.

## 5. Deploy

**Vercel (recommended):**
1. Push this project to a GitHub repo
2. Import it in Vercel
3. Add the same environment variables (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` — set this to your production URL)
4. Deploy. Then run `npx prisma migrate deploy` once against your production database
   (e.g. via `vercel env pull` locally, or a one-off Vercel deploy hook)

**Railway / Render:** both can host the Postgres database *and* the Next.js app in one
place — just set the same environment variables and add `npx prisma migrate deploy`
as a release/build step.

## Notes on scope

This is a working MVP covering everything you asked for — auth, company/customer/product
databases, dropdown auto-fill, and multi-tenant support. A few things are intentionally
left out to keep the first version manageable, and can be added on request:

- Password reset / email verification (currently just email+password signup)
- Multiple users per company with different roles (currently one admin per signup;
  the schema already supports multiple `User` rows per `Company` if you want to add invites)
- Editing/deleting a saved invoice (currently create + view/print; editing can be added
  the same way the create form works)
- Company logo stored as base64 in the database — fine for an MVP, but for many
  companies with large logos you'll eventually want real file storage (e.g. S3 or
  Vercel Blob) instead
