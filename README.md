# Movera

Marketing site and lead-capture app for **Movera**, a Melbourne removalist business ([themovera.com.au](https://www.themovera.com.au)).

- **Frontend:** [Next.js 16](https://nextjs.org) (App Router) + React 19 + Tailwind CSS v4
- **Backend:** [Convex](https://convex.dev) — database, file storage, server functions, HTTP endpoints
- **Email:** [Resend](https://resend.com) (sent from Convex actions)
- **Analytics:** Google Analytics 4 + Google Ads conversion tracking (IDs set in `app/layout.tsx`)

---

## Prerequisites

| Tool | Version |
| --- | --- |
| Node.js | 20.x or newer (developed on 24.x) |
| npm | Comes with Node (the repo uses `package-lock.json`) |
| Convex account | Free at [dashboard.convex.dev](https://dashboard.convex.dev). Ask the project owner to invite you to the existing project. |
| Resend account | Only needed if you want emails to actually send locally |

---

## Quick start

```bash
# 1. Clone
git clone https://github.com/saksham-dev0/themovera.git
cd themovera

# 2. Install dependencies
npm install

# 3. Start Convex (first run logs you in, links/creates a dev deployment,
#    and writes CONVEX_DEPLOYMENT + NEXT_PUBLIC_CONVEX_URL to .env.local)
npx convex dev

# 4. In a second terminal, start Next.js
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Keep **both** processes running while you develop: `npx convex dev` watches `convex/`, pushes function and schema changes to your dev deployment, and regenerates `convex/_generated/`.

---

## Environment variables

There are two separate places to configure variables.

### 1. Next.js — `.env.local` (project root, git-ignored)

```bash
# Written automatically by `npx convex dev`
CONVEX_DEPLOYMENT=dev:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment-name.convex.cloud

# Add manually: same deployment, but the .convex.site domain (HTTP actions)
NEXT_PUBLIC_CONVEX_SITE_URL=https://your-deployment-name.convex.site

# Optional
NEXT_PUBLIC_SITE_URL=http://localhost:3000     # canonical URLs/sitemap; defaults to https://www.themovera.com.au
GOOGLE_SITE_VERIFICATION=                      # Search Console token; falls back to value in app/layout.tsx
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=               # present in existing setups, not currently read by the code
```

| Variable | Required | Used in | Purpose |
| --- | --- | --- | --- |
| `CONVEX_DEPLOYMENT` | Yes | Convex CLI | Which deployment `npx convex dev` pushes to |
| `NEXT_PUBLIC_CONVEX_URL` | Yes | `app/ConvexClientProvider.tsx` | Convex React client (WebSocket) |
| `NEXT_PUBLIC_CONVEX_SITE_URL` | Yes | `components/landing/LandingQuoteForm.tsx`, `StepTwoForm.tsx` | Base URL for the landing page's plain-HTTP quote endpoints |
| `NEXT_PUBLIC_SITE_URL` | No | `lib/seo.ts` | Canonical site URL for metadata, sitemap, robots |
| `GOOGLE_SITE_VERIFICATION` | No | `app/layout.tsx` | Google Search Console verification |

### 2. Convex — deployment environment (set in Convex, **not** in `.env.local`)

Convex functions run on Convex's servers and cannot see `.env.local`. Set these per deployment (dev and prod separately) with the CLI or in the Convex dashboard → Settings → Environment Variables:

```bash
npx convex env set RESEND_API_KEY re_xxxxxxxx
npx convex env set RESEND_FROM_ADDRESS "Movera <noreply@themovera.com.au>"
npx convex env set SALES_EMAIL_ADDRESS sales@themovera.com.au
npx convex env set ALLOWED_FORM_ORIGINS "http://localhost:3000,https://www.themovera.com.au"

# For production, add --prod
npx convex env set --prod RESEND_API_KEY re_xxxxxxxx
```

| Variable | Required | Used in | Purpose |
| --- | --- | --- | --- |
| `RESEND_API_KEY` | For email | `convex/emails.ts` | Sends quote thank-yous, sales and grievance notifications. Without it, emails are skipped. |
| `RESEND_FROM_ADDRESS` | No | `convex/emails.ts` | Sender. Default `Movera <noreply@themovera.com.au>` (domain must be verified in Resend) |
| `SALES_EMAIL_ADDRESS` | No | `convex/emails.ts` | Where new-lead notifications go. Default `sales@themovera.com.au` |
| `ALLOWED_FORM_ORIGINS` | No | `convex/http.ts` | Comma-separated CORS allow-list for the landing quote endpoints. Empty = allow all (`*`) |

> Never commit secrets. All `.env*` files are git-ignored.

---

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Next.js dev server on port 3000 |
| `npx convex dev` | Sync `convex/` to your dev deployment and watch for changes |
| `npm run build` | Production build of the Next.js app |
| `npm start` | Serve the production build (run `npm run build` first) |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | Type-check the project |
| `node scripts/optimize-landing-images.mjs` | Regenerates resized WebP images in `public/landing/` for `/local-movers-melbourne`. Needs `sharp` (`npm i -D sharp` if it is not installed). Re-run after changing the source PNGs. |

---

## Project structure

```
app/                         Next.js App Router routes
  layout.tsx                 Root layout: fonts, metadata, GA4 / Google Ads tags
  page.tsx                   Home page
  ConvexClientProvider.tsx   Wraps the app in the Convex React client
  local-movers-melbourne/    Paid-ads landing page (no Convex JS; posts to HTTP endpoints)
  quote/                     Main quote form
  services/[slug]/           Service pages (content in services/data.ts)
  guides/[slug]/             Guide/blog pages (content in guides/data.ts)
  pricing/ reviews/ faq/ about/ contact/ careers/ feedback/ grievances/ ...
  data/suburbs.ts            Suburb data for SEO content
  sitemap.ts, robots.ts      Generated sitemap and robots.txt
  design-system/             Internal UI component reference page
components/
  landing/                   Landing-page components (quote form, step-2 form, ads conversion)
  seo/                       Structured data / SEO helpers
  ui/                        Shared UI components
lib/
  pricing.ts                 Pricing data/logic
  seo.ts                     Site URL + metadata helpers
  schema.ts                  JSON-LD schema builders
convex/                      Backend (see below)
  _generated/                Auto-generated by Convex — do not edit
public/                      Static assets (images, videos, logos)
scripts/                     One-off maintenance scripts
```

### Backend (Convex)

| File | Contents |
| --- | --- |
| `schema.ts` | Tables: `feedback`, `grievances`, `quoteRequests`, `counters`, `jobApplications` |
| `quotes.ts` | Quote submission mutation + internal landing-page quote mutations |
| `http.ts` | HTTP routes `POST /landing-quote` and `POST /landing-quote-step2` (served from the `.convex.site` URL) |
| `emails.ts` | Resend email actions (customer thank-you, sales notification, grievance notification) |
| `feedback.ts`, `careers.ts`, `grievances.ts` | Form submissions with file upload (`generateUploadUrl` + `submit`) |

Browse data, logs and functions in the Convex dashboard (`npx convex dashboard`).

Before writing Convex code, read `convex/_generated/ai/guidelines.md`. It covers current Convex API patterns.

---

## Important notes for developers

- **This is Next.js 16.** APIs and conventions differ from older versions. Check `node_modules/next/dist/docs/` before relying on older patterns (see `AGENTS.md`).
- **Don't edit `convex/_generated/`.** `npx convex dev` regenerates it.
- **Schema changes** go live on your dev deployment as soon as you save. Existing documents have to match the new schema, so add new fields as `v.optional(...)` or migrate the data first.
- **Analytics IDs** (GA4 `G-...`, Google Ads `AW-...`) are hard-coded in `app/layout.tsx` and `components/landing/AdsConversion.tsx`. Local dev sends real events, so don't trigger test conversions against production tags.

---

## Deployment

The frontend is a standard Next.js app (Vercel recommended); Convex hosts the backend.

1. **Deploy Convex to production:**
   ```bash
   npx convex deploy
   ```
   Set the production Convex env vars listed above (`npx convex env set --prod ...`).
2. **Deploy the frontend.** On Vercel, set these environment variables:
   - `NEXT_PUBLIC_CONVEX_URL`: production `.convex.cloud` URL
   - `NEXT_PUBLIC_CONVEX_SITE_URL`: production `.convex.site` URL
   - `NEXT_PUBLIC_SITE_URL=https://www.themovera.com.au`
   - optionally `GOOGLE_SITE_VERIFICATION`

   You can also have Vercel deploy Convex on each build by setting `CONVEX_DEPLOY_KEY` (from the Convex dashboard) and using the build command
   `npx convex deploy --cmd 'npm run build'`.

---

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `Could not find public function ...` / blank data | `npx convex dev` isn't running, or `NEXT_PUBLIC_CONVEX_URL` points at a different deployment |
| Landing quote form fails / CORS error | `NEXT_PUBLIC_CONVEX_SITE_URL` is missing or wrong, or your origin isn't in `ALLOWED_FORM_ORIGINS` |
| Emails not arriving | `RESEND_API_KEY` isn't set in the **Convex** env (not `.env.local`), or the sender domain isn't verified in Resend. Check `npx convex logs` |
| Env var change not picked up | Restart `npm run dev`. `NEXT_PUBLIC_*` values are inlined at build time |
