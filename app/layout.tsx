import type { Metadata } from "next";
import { Poppins, Mulish } from "next/font/google";
import Script from "next/script";
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

// Google tag (gtag.js), loaded on every route via the root layout.
// One gtag.js load serves both the Analytics and Ads IDs.
const GOOGLE_ANALYTICS_ID = "G-S2KBYP9ZMN";
const GOOGLE_ADS_ID = "AW-18470170169";
const GOOGLE_SITE_VERIFICATION = "Nhq-XZ65njsEGpLASrNwVb34hLunEi_bpaneCAC3dLc";

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
  // Search Console meta-tag verification (env var overrides if set).
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || GOOGLE_SITE_VERIFICATION,
  },
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
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GOOGLE_ANALYTICS_ID}');
            gtag('config', '${GOOGLE_ADS_ID}');
          `}
        </Script>
      </body>
    </html>
  );
}
