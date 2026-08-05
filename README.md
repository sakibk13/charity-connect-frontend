# Charity Connect Web

Frontend for Charity Connect — a donation, volunteer, and community platform.
Built with Next.js (App Router), TypeScript, Tailwind CSS, and shadcn/ui.
Talks to [`charity-connect-api`](https://github.com/mirza-shafi/charity-connect-api)
(FastAPI) for all data, auth, and payments.

See `../plan.md` and `../progress.md` in the project root for the full
architecture, feature scope, and phase tracker.

## Getting started

```bash
cp .env.local.example .env.local   # fill in NEXT_PUBLIC_API_URL etc.
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- **Next.js** (App Router, TypeScript)
- **Tailwind CSS** for styling
- **shadcn/ui** for components (generated into `src/components/ui`, restyled
  to match the charity's brand — not an installed dependency you can't edit)
- **Recharts** for admin dashboard analytics (added when the admin panel is built)
- **lucide-react** for icons

## Project structure

```
src/
  app/            # routes (App Router)
  components/
    ui/           # shadcn/ui primitives
    site/         # site-wide components (e.g. WhatsappButton)
  lib/            # api.ts (fetch wrapper to charity-connect-api), env.ts
  types/          # shared TypeScript types
```

## Notes for future work

- This project was scaffolded on Next.js 16, which introduces **Cache
  Components** (`cacheComponents` config + `"use cache"` directive) as an
  opt-in caching model, alongside the previous fetch-based caching model.
  We are **not** enabling `cacheComponents` yet — using the classic model
  (`fetch` + `revalidate`/`force-dynamic`) for predictability. Revisit once
  data-fetching patterns are in place.
- shadcn/ui in this version dropped the old react-hook-form-based `form.tsx`
  component in favor of a `field.tsx` primitive (`FieldSet`, `FieldLegend`,
  etc.). Build forms around `field.tsx` + native `<form>`/Server Actions,
  not react-hook-form, unless a real need for it comes up.
