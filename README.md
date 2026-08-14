# FarmFreshNow

Marketing + storefront site for FarmFreshNow — fresh, never-frozen chicken cut after you order,
packed cold and delivered in a slot you choose.

Built with TanStack Start (React 19), Vite, Tailwind CSS v4 and shadcn-style UI primitives.

## Development

Requires Node.js 20+.

```sh
npm install
npm run dev      # http://localhost:8080
npm run build    # production build
npm run preview  # preview the production build
npm run lint
```

## Deploying to Vercel

The production build targets the Vercel Build Output API automatically when the `VERCEL`
environment variable is present (Vercel sets this during builds). Locally you can force it with:

```sh
NITRO_PRESET=vercel npm run build
```

On Vercel, import the repository and keep the defaults:

- Build command: `npm run build`
- Output directory: `.vercel/output`
- Install command: `npm install`

Static assets are served with long-lived immutable cache headers (see `vercel.json`), pages are
server-rendered at the edge, and images/JS are code-split per route.

## Project structure

```
src/routes       file-based routes (pages, sitemap, API-free)
src/components   page sections and UI primitives
src/lib          shop data, cart store, motion system, helpers
src/styles.css   design tokens, utilities and the animation system
```
