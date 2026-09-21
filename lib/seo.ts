/**
 * Single source of truth for canonical URLs and business identity.
 *
 * Every absolute URL in metadata, the sitemap, robots.txt and the JSON-LD
 * blocks is derived from SITE_URL, so switching hosts is a one-line change
 * (or an env var on the deploy platform).
 */

const RAW_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.themovera.com.au";

/** Canonical origin, never with a trailing slash. */
export const SITE_URL = RAW_SITE_URL.replace(/\/+$/, "");

export const SITE_NAME = "Movera";

export const PHONE_DISPLAY = "02 8503 4444";
export const PHONE_E164 = "+61285034444";
export const EMAIL = "hello@movera.com.au";

/** Default social share image (1200x630-ish source in /public). */
export const OG_IMAGE = "/banner.png";

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
