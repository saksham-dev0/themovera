import { Card } from "@/components/ui/Card";
import { Nav } from "@/components/ui/Nav";
import { CTABand, Footer } from "@/components/ui/Footer";

export const metadata = {
  title: "Contact Us | Movera Removals & Storage",
  description: "Get in touch with Movera Removals & Storage — call, email, or visit us in Melbourne.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact Us | Movera Removals & Storage",
    description: "Get in touch with Movera Removals & Storage — call, email, or visit us in Melbourne.",
    url: "/contact",
  },
};

const locations = [
  { city: "Head Office", address: ["Suite 1208/530 Little Collins Street,", "Melbourne VIC 3000"] },
];

export default function ContactPage() {
  return (
    <div className="bg-gray-50 font-sans text-ink-600">
      <Nav />

      <section className="max-w-[1180px] mx-auto px-8 pt-16 pb-10">
        <div className="text-xs font-display font-semibold tracking-[1.5px] uppercase text-ink-400 mb-6">
          Contact Movera
        </div>
        <h1 className="font-display font-bold text-5xl leading-[1.1] text-ink-800 m-0 mb-6 max-w-[720px]">
          Get in touch.
        </h1>
        <p className="text-[17px] leading-[1.65] max-w-[640px]">
          Questions about your move, a quote, or an existing booking? Our team is on hand across Melbourne and
          surrounding suburbs.
        </p>
      </section>

      <section className="max-w-[1180px] mx-auto px-8 pb-16 grid md:grid-cols-2 gap-6">
        <Card>
          <div className="font-display font-semibold text-[16px] text-ink-800 mb-2">Call Us</div>
          <p className="m-0 text-sm leading-[1.6]">
            <a href="tel:0370741820" className="text-teal-500 no-underline hover:underline">
              03 7074 1820
            </a>
          </p>
        </Card>
        <Card>
          <div className="font-display font-semibold text-[16px] text-ink-800 mb-2">Email Us</div>
          <p className="m-0 text-sm leading-[1.6]">
            <a href="mailto:sales@themovera.com.au" className="text-teal-500 no-underline hover:underline">
              sales@themovera.com.au
            </a>
          </p>
        </Card>
      </section>

      <section className="bg-white border-y border-border">
        <div className="max-w-[1180px] mx-auto px-8 py-14">
          <div className="text-xs font-display font-semibold tracking-[1.5px] uppercase text-ink-400 mb-3">
            Find Us
          </div>
          <h2 className="font-display font-bold text-[28px] text-ink-800 m-0 mb-8 max-w-[640px]">
            Our office
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {locations.map((loc) => (
              <Card key={loc.city}>
                <div className="font-display font-semibold text-[16px] text-ink-800 mb-2">{loc.city}</div>
                <div className="text-sm leading-[1.6]">
                  {loc.address.map((line) => (
                    <div key={line}>{line}</div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-[1180px] mx-auto px-8 py-16">
        <CTABand />
      </div>

      <Footer />
    </div>
  );
}
