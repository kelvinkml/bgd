# bgd

A portfolio site for a small handmade bag practice. Built as a static MVP with room to grow into an interactive bag designer and a payment-enabled order flow.

## About

Each bag is built one at a time. The site is designed to:

- Showcase finished and in-progress work
- Maintain an archive of past pieces kept for reference, not for sale
- _(planned)_ Offer a "design your own" experience where visitors can configure a custom bag and submit an inquiry
- _(planned)_ Accept orders and payment directly through the site

The project is also intended as a portfolio piece — the bag designer in particular is the showcase feature for software development skills.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router) — chosen for its ability to ship as a static site today and grow into a server-rendered application later without a framework migration
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com)
- Static export via `output: "export"` — the MVP deploys as plain HTML/CSS/JS to any static host

When the designer and payment features land, removing the static export config unlocks API routes and server-side rendering without changing anything else.

## Project structure

```
app/
  layout.tsx           # shared nav, footer, fonts
  page.tsx             # landing page with featured bags
  bags/
    page.tsx           # gallery of current/recent bags
    [slug]/page.tsx    # individual bag detail page
  archive/page.tsx     # past pieces, kept for reference
  design/page.tsx      # placeholder for future custom designer
  about/page.tsx
  contact/page.tsx
components/
  BagCard.tsx          # gallery card
  BagDetail.tsx        # full listing template
  BagPlaceholder.tsx   # visual placeholder until real photography is added
  Nav.tsx, Footer.tsx, StatusBadge.tsx
data/
  bags.ts              # placeholder bag data
lib/
  types.ts             # Bag type and availability label helper
```

### The `Bag` model

Bag availability is modelled as two independent flags plus an archive marker:

```ts
forSale: boolean           // this exact piece is purchasable now
customAvailable: boolean   // commissions for similar work are open
archived: boolean          // archive-only display, hidden from /bags
```

The display label ("Available — custom orders welcome", "Made to order", "Sold", etc.) is derived from these flags rather than stored separately, keeping the data as the single source of truth.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build

```bash
npm run build
```

Produces a static export in `out/` ready to deploy to any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages, etc.).

## Roadmap

- [x] Static portfolio site with gallery, detail pages, and archive
- [ ] Real photography and content
- [ ] "Design your own" interactive configurator
- [ ] Order placement and payment integration

## Status

Early stage — placeholder content throughout. The structure and data model are in place; real bags, photography, and copy are forthcoming.
