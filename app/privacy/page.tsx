import { Nav } from "@/components/ui/Nav";
import { CTABand, Footer } from "@/components/ui/Footer";

export const metadata = {
  title: "Privacy Policy | Movera Removals & Storage",
  description: "How Movera collects, uses, and safeguards your personal information.",
};

type Section = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  closing?: string;
};

const sections: Section[] = [
  {
    title: "What Information Do We Collect?",
    paragraphs: [
      "We may collect personal information such as your name, email address, phone number, and other details when you:",
    ],
    bullets: ["Register on our website", "Place an order", "Subscribe to our newsletter", "Fill out a form", "Interact with our site"],
  },
  {
    title: "How Do We Use Your Information?",
    paragraphs: ["We use your information to:"],
    bullets: [
      "Respond to your customer service requests",
      "Process transactions quickly and securely",
      "Send updates regarding your order or services",
      "Improve our services and website",
      "Share occasional promotional emails (if opted in)",
    ],
  },
  {
    title: "How Do We Protect Your Information?",
    bullets: [
      "We use SSL certificates and perform regular malware scans",
      "Our site is regularly checked for vulnerabilities to ensure your visit is secure",
      "Your personal information is stored securely and only accessible by authorised personnel",
    ],
  },
  {
    title: "Use of Cookies",
    paragraphs: ["Yes, we use cookies to:"],
    bullets: ["Store user preferences", "Track site traffic and user interaction for a better experience", "Help remember and process items in your cart"],
    closing: "You can choose to turn off cookies through your browser settings. However, doing so may affect some site features.",
  },
  {
    title: "Third-Party Disclosure",
    paragraphs: ["We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties."],
  },
  {
    title: "Third-Party Links",
    paragraphs: ["Our website may feature third-party products or services. These websites have their own privacy policies, and we are not responsible for their content or practices."],
  },
  {
    title: "Google and Advertising Services",
    paragraphs: ["We use Google services, including:"],
    bullets: ["Google AdSense Remarketing", "Google Analytics", "Demographics and Interests Reporting"],
    closing:
      "These services use first-party and third-party cookies to track interactions with our website. You can manage or opt out through Google Ad Settings or by using the Google Analytics Opt-Out Browser Add-on.",
  },
  {
    title: "Your Rights",
    bullets: [
      "You may visit our site anonymously",
      "Our Privacy Policy link is clearly visible on our homepage",
      "Users will be notified of any privacy policy changes via this page",
      "You may update your personal information by contacting us directly",
    ],
  },
  {
    title: "Do Not Track Signals",
    paragraphs: ["We honour Do Not Track (DNT) browser settings and do not use tracking or advertising cookies when DNT is enabled."],
  },
  {
    title: "Third-Party Behavioral Tracking",
    paragraphs: ["We do not allow third-party behavioral tracking."],
  },
  {
    title: "In Case of a Data Breach",
    paragraphs: ["If a data breach occurs, we will notify users via email within 7 business days."],
  },
  {
    title: "Email Communications & CAN-SPAM Compliance",
    paragraphs: ["We collect your email to:"],
    bullets: ["Send service updates, order confirmations, or promotions", "Respond to inquiries and customer support requests"],
    closing: "We comply with all CAN-SPAM requirements and agree to:",
  },
  {
    title: "",
    bullets: [
      "Never use misleading headers or subject lines",
      "Clearly identify messages as advertisements (if applicable)",
      "Include our business address in all communications",
      "Offer a clear method to unsubscribe",
    ],
  },
  {
    title: "Unsubscribing from Our Communications",
    paragraphs: ["If at any time you would like to stop receiving future emails or services from us, you may:"],
    bullets: [
      "Email us directly at: hello@movera.com.au",
      "Follow the unsubscribe link at the bottom of any of our emails",
      "Unfollow or unsubscribe from the specific service you've signed up for",
    ],
    closing: "We will promptly remove you from all communications upon request.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="bg-gray-50 font-sans text-ink-600">
      <Nav />

      <section className="bg-white border-b border-border">
        <div className="max-w-[840px] mx-auto px-8 py-16 text-center">
          <div className="text-xs font-display font-semibold tracking-[1.5px] uppercase text-ink-400 mb-3">
            Legal
          </div>
          <h1 className="font-display font-bold text-5xl leading-[1.1] text-ink-800 m-0 mb-6">
            Privacy Policy
          </h1>
          <p className="text-[17px] leading-[1.65] max-w-[600px] mx-auto m-0">
            At Movera, we value your privacy and are committed to protecting your personal information.
            This policy explains how we collect, use, and safeguard your data in compliance with
            Australian privacy laws.
          </p>
        </div>
      </section>

      <section className="max-w-[840px] mx-auto px-8 py-16">
        <div className="grid gap-10">
          {sections.map((s, i) => (
            <div key={i}>
              {s.title && (
                <h2 className="font-display font-bold text-xl text-ink-800 m-0 mb-3">{s.title}</h2>
              )}
              {s.paragraphs?.map((p) => (
                <p key={p} className="text-[15px] leading-[1.75] mb-3 m-0">
                  {p}
                </p>
              ))}
              {s.bullets && (
                <div className="grid gap-2.5 my-3">
                  {s.bullets.map((b) => (
                    <div key={b} className="flex items-start gap-3 text-[15px] leading-[1.65]">
                      <span className="w-1.5 h-1.5 rounded-pill bg-teal-500 shrink-0 mt-2.5" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              )}
              {s.closing && <p className="text-[15px] leading-[1.75] mt-3 m-0">{s.closing}</p>}
            </div>
          ))}
        </div>
      </section>

      <div className="max-w-[1180px] mx-auto px-8 pb-16">
        <CTABand />
      </div>

      <Footer />
    </div>
  );
}
