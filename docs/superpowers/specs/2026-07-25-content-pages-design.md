# Content Pages Expansion — Design

Date: 2026-07-25

## Goal

Add the page types competitor removalist sites (CBD Movers, Holloway
Removals, Move My Stuff, Red Rock Van) consistently use and Movera lacks:
About, dedicated Reviews, Pricing, expanded FAQ, and a Moving Guides
blog with real articles. Location/suburb pages and a numeric pricing
calculator are explicitly out of scope (no real multi-city ops data or
rate card to back them). No claims are invented that aren't already
established on the site (12,000+ moves, 4.9★/5,527+ reviews, 13+ yrs
combined experience, $100k goods-in-transit cover, family owned,
Sydney/Melbourne/Brisbane).

Research note: acemovers.com.au is a client-rendered SPA with no
scrapable server content; manwithvan.com.au resolves to an unrelated
business ("Red Rock Van"). Both flagged to user; design draws only on
the 4 sources with real scraped content.

## New routes

- `app/about/page.tsx` — story/positioning section, stats reused from
  home page, trust checklist reused, CTA band.
- `app/reviews/page.tsx` — rating summary strip (4.9★ / 5,527+ reviews)
  + expanded testimonial grid (6-8 entries, same fictional-placeholder
  style as existing 3 on home page).
- `app/pricing/page.tsx` — explains fixed-price model, what's included,
  a "DIY vs comparison-site vs Movera" comparison table (no invented
  dollar figures — qualitative comparison only, mirroring the existing
  home page "Why Movera" checklist).
- `app/faq/page.tsx` — expanded FAQ (12+ Qs covering insurance,
  cancellations, packing, interstate status, storage), reusing the
  `Accordion` component.
- `app/guides/page.tsx` — guides index, cards linking to 3 articles.
- `app/guides/[slug]/page.tsx` — dynamic route, `generateStaticParams`
  for 3 slugs: `moving-checklist`, `packing-tips`,
  `choosing-a-removalist`. Real short guide content (not placeholder),
  written as genuinely useful how-to content matching Movera's tone.
  Unknown slug → `notFound()`.

## Data

- `app/guides/data.ts` — `Guide` type (slug, title, summary, body
  sections) and the 3 guides array, mirroring the `app/services/data.ts`
  pattern already established.

## Nav / Footer wiring

- `components/ui/Nav.tsx`: "RESOURCES" → point at `/guides` (closest
  match to Holloway/CBD Movers' "Resources"/blog nav item).
- `components/ui/Footer.tsx`: "Resources" column links updated —
  "About Us" → `/about`, "Moving Guides" → `/guides`, "Helpful content"
  → `/guides`. Add a "Reviews" and "FAQ" link into an existing column
  (Resources) since none currently exists. "Meet the Team" and
  "Careers" stay `#` — no team/careers content in scope.
- Home page footer CTA / nav already link to quote form; no changes
  needed there.

## Reuse

No new UI components. Compose existing `Card`, `IconTile`, `Button`,
`Accordion`, `CTABand`, `Footer`, `Nav`. Visual style unchanged
(teal/ink/clay palette, `font-display`/`font-sans`).

## Out of scope

- Location/suburb pages (Sydney/Melbourne/Brisbane deep pages).
- Pricing calculator tool / numeric rate card.
- Team/Careers pages.
- AFRA or other accreditation claims (not verified for Movera).
- Named enterprise client logos (not verified for Movera).

## Testing

`npm run lint` and `npm run build` after implementation; manual route
smoke test (200s for all new routes, 404 for bad guide slug) via dev
server, matching the process used for the services pages.
