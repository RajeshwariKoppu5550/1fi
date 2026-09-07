# 1Fi Marketplace

The Marketplace UI retrieves products, options, and EMI plans from Neon through the server-only `/api/marketplace` route. No catalog or EMI content is embedded in application code.

## Local setup

1. Copy `.env.example` to `.env.local` and set `DATABASE_URL` to a Neon PostgreSQL connection string.
2. Provision the Marketplace database schema:

```bash
npm run db:migrate-marketplace
```

3. Start the application:

```bash
npm run dev
```

The migration is idempotent. It creates the dedicated Marketplace tables when they are not present. Product, variant, and EMI records are managed directly in Neon and are retrieved at request time by the API.

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform] from the creators of Next.js.

You can find deploy link here: https://1fi-two.vercel.app/
