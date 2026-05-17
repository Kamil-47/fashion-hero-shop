# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (localhost:3000)
npm run build    # Production build
npm run lint     # ESLint check
```

No test suite is configured.

## What This Project Is

A high-fidelity Allbirds.com clone rebranded as **FashionHero** — a multi-seller fashion marketplace. Built as an educational template for AI Product Heroes workshops. All data is hardcoded (no backend); students swap it for a real API.

Currency is PLN throughout (not USD).

## Architecture

### Data layer (`src/data/`)
All product, collection, and seller data lives in static TypeScript files:
- `products.ts` — product catalog with helper functions (`getProduct`, `getRelatedProducts`, `getProductsByCollection`)
- `collections.ts` — collection definitions
- `sellers.ts` — seller profiles with helpers (`getSeller`, `getSellerById`, `getAllSellers`)

There is no API layer. Pages import data functions directly.

### Provider tree (`src/components/shell.tsx`)
`Shell` wraps the entire app with four context providers (inside `layout.tsx`):
`AuthProvider → CartProvider → WishlistProvider → QuickViewProvider`

State for cart, wishlist, quick-view modal, and auth all live in client-side context. The `ShellInner` component reads from these contexts to pass counts to `Header`.

### Pages and routing (`src/app/`)
- `/` — homepage with hero carousel, category rows, product carousels, promo tiles
- `/collections/[slug]` — PLP with sticky filter sidebar, sort, and seller header strip
- `/products/[slug]` — PDP with image gallery, product info, accordion details, related & recently-viewed sections
- `/account`, `/account/login`, `/account/register`, `/checkout`, `/wishlist`, `/about`

Static params are generated via `generateStaticParams` on collection and product pages.

### Seller filtering
The collection page accepts a `?seller=<slug>` query param that pre-selects the seller filter in `CollectionView`. The seller header strip is shown when exactly one seller is active.

### Key types (`src/types/index.ts`)
`Product` has a `sellerId` (links to `Seller.id`), `category` (men/women/unisex), `productCategory` (shoes/socks/apparel/accessories), and `collections: string[]`. Price filter thresholds in `CollectionView` are tuned for PLN values.

## Code Style (from AGENTS.md)
- TypeScript strict, no `any`
- Named exports, PascalCase components, camelCase utils
- Tailwind utility classes only — no inline styles
- 2-space indentation, mobile-first responsive

## Important Next.js Note (from AGENTS.md)
This uses **Next.js 16** with breaking changes from earlier versions. Check `node_modules/next/dist/docs/` before writing Next.js-specific code. `params` and `searchParams` in page props are **Promises** and must be awaited.
