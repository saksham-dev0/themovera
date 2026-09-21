import { EMAIL, PHONE_E164, SITE_NAME, SITE_URL, absoluteUrl } from "@/lib/seo";

/** Stable @id so other nodes can reference the same business entity. */
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * The business itself. MovingCompany is a LocalBusiness subtype, which is what
 * Google uses for the local pack / knowledge panel.
 *
 * TODO: add `streetAddress` + `postalCode` once the public office address is
 * confirmed, and keep NAP identical to the Google Business Profile listing.
 */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "MovingCompany",
  "@id": ORGANIZATION_ID,
  name: SITE_NAME,
  url: SITE_URL,
  image: absoluteUrl("/big_movera_logo.png"),
  logo: absoluteUrl("/Logo.png"),
  telephone: PHONE_E164,
  email: EMAIL,
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Melbourne",
    addressRegion: "VIC",
    addressCountry: "AU",
  },
  areaServed: [
    { "@type": "City", name: "Melbourne" },
    { "@type": "State", name: "Victoria" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "07:00",
      closes: "19:00",
    },
  ],
  sameAs: [] as string[],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": WEBSITE_ID,
  url: SITE_URL,
  name: SITE_NAME,
  publisher: { "@id": ORGANIZATION_ID },
  inLanguage: "en-AU",
};

export function breadcrumbSchema(items: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(faqs: Array<{ q: string; a: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };
}

export function serviceSchema({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType: name,
    url: absoluteUrl(path),
    provider: { "@id": ORGANIZATION_ID },
    areaServed: { "@type": "City", name: "Melbourne" },
  };
}
