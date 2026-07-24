# Service Pages & Landing Page Expansion — Design

Date: 2026-07-25

## Goal

Give each of Movera's 6 confirmed services (Local Removals, Office & Commercial
Relocations, Packing & Unpacking, Furniture Removals, Specialty Item Removals,
Loading & Unloading Services) its own dedicated page, and round out the home
page with sections a premium removals company's landing page should have.
Interstate Removals is held back (pending internal sign-off) and excluded from
this scope entirely — no page, no card, no nav link.

Messaging tone: professional, reliable, premium, customer-focused — not
generic stock copy. Reuses the existing visual system (teal/ink/clay palette,
`font-display`/`font-sans`, existing `Button`/`Card`/`IconTile` components) —
no new design language.

## Content model

New file `app/services/data.ts` exports:

```ts
export type Service = {
  slug: string;
  title: string;
  tagline: string;       // one-line hook for cards/hero
  description: string;   // user-provided paragraph, lightly edited for web
  features: string[];    // 4-6 bullets, specific not generic
  idealFor: string[];    // short "who this is for" chips
};

export const services: Service[];
```

Six entries, slugs:

- `local-removals`
- `office-commercial-relocations`
- `packing-unpacking`
- `furniture-removals`
- `specialty-item-removals`
- `loading-unloading`

Each `description` is the user-supplied paragraph; `features`/`idealFor` are
derived from it (e.g. Specialty Item Removals features list the named items:
pianos, artwork, mirrors, antiques, large TVs, gym equipment, pool tables).

## Routes

- `app/services/page.tsx` — index/hub page. Reuses Nav/Footer. Grid of all 6
  services as cards (title, tagline, "View details →" linking to
  `/services/[slug]`).
- `app/services/[slug]/page.tsx` — dynamic route.
  - `generateStaticParams()` returns the 6 slugs above.
  - Unknown slug → `notFound()`.
  - `generateMetadata` sets page `<title>`/description from the service data.
  - Layout: hero (title, tagline, short intro line, phone CTA + "Get a Quote"
    button) → full description → feature checklist card (reuse the
    checkmark-row pattern from the home page comparison section) → trust
    strip (fixed price / trained crew / insurance — same 3-4 facts used on
    home page) → `CTABand` → `Footer`.
  - No new components required; compose existing `Card`, `IconTile`,
    `Button`, `CTABand`, `Footer`, `Nav`.

## Home page changes (`app/page.tsx`)

- **Services section**: replace the current 4-item `services` array with all
  6 confirmed services from `app/services/data.ts`. Each card links to
  `/services/[slug]`. Add a "View all services →" link under the heading,
  pointing to `/services`.
- **New: Areas We Service** section, placed after the "Why Movera vs.
  comparison sites" section. Grid of Sydney / Melbourne / Brisbane (reusing
  the city data already in `Footer.tsx`'s `locations`), plus a line noting
  surrounding-suburbs coverage. Same section-heading style as other sections
  (eyebrow label + `h2`).
- **New: Fleet & Crew showcase** section, placed after Areas We Service and
  before Reviews. 3-4 placeholder tiles using the existing diagonal-stripe
  placeholder pattern (as used in the hero photo banner / comparison image),
  each with a short caption: "Our truck fleet", "Trained crew", "Packing
  materials & equipment". No new image assets — placeholders only, matching
  current site convention (no real photos anywhere yet).

## Nav / Footer wiring

- `components/ui/Nav.tsx`: `navItems` gains real `href`s where a matching
  service page exists:
  - "LOCAL REMOVALISTS" → `/services/local-removals`
  - "BUSINESS" → `/services/office-commercial-relocations`
  - "STORAGE" → unchanged (`#`, out of scope — no storage service page)
  - "INTERSTATE" → unchanged (`#`, held back)
  - "RESOURCES" → unchanged (`#`, out of scope)
- `components/ui/Footer.tsx`: "Moving" column links updated to point at the
  matching `/services/[slug]` routes where one exists (Local Moving, Business
  Relocations, Packing & Unpacking). Links with no matching page (Interstate
  Relocation, Warehouse Relocations, Box Shop) stay as plain `#` — unchanged
  from current behavior.

## Out of scope

- Interstate Removals page/card/nav entry (explicitly held back by user).
- Visual/style refresh (palette, typography, layout system) — explicitly
  ruled out; reuse current design system as-is.
- Real photography — placeholders only, consistent with rest of site.
- CMS/data-driven content — service data is a static TS file, no backend.

## Testing

No test suite exists in this repo currently (no test runner configured). This
project uses `next build` / `next lint` as the correctness bar. Plan should
include: `npm run lint` and `npm run build` after implementation, plus a
manual click-through of home → each service page → back, using the dev
server.
