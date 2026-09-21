import type { Metadata } from "next";
import { Poppins, Mulish } from "next/font/google";
import "./globals.css";
import { JsonLd } from "@/components/seo/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import { OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const mulish = Mulish({
  variable: "--font-mulish",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const title = "Removalists Melbourne | Movera — Furniture & House Movers";
const description =
  "Movera is a trusted removalists Melbourne relies on for local house and office moves. No-surprise quotes, professional movers, no hidden fees. Get your free quote today.";

export const metadata: Metadata = {
  // Makes every relative `alternates.canonical` / OG url absolute.
  metadataBase: new URL(SITE_URL),
  // No `template`: every page sets its own full, brand-suffixed title.
  title,
  description,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_AU",
    url: "/",
    title,
    description,
    images: [{ url: OG_IMAGE, width: 1369, height: 768, alt: `${SITE_NAME} removalists Melbourne` }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [OG_IMAGE],
  },
  // Ownership is verified via a DNS TXT record; this env var is only a
  // fallback if a meta-tag property is ever added in Search Console.
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en-AU"
      className={`${poppins.variable} ${mulish.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden">
        <JsonLd data={[organizationSchema, websiteSchema]} />
        {children}
      </body>
    </html>
  );
}
