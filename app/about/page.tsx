import { Card } from "@/components/ui/Card";
import { Nav } from "@/components/ui/Nav";
import { CTABand, Footer } from "@/components/ui/Footer";

export const metadata = {
  title: "About Us | Movera Removals & Storage",
  description: "Family owned removalists with 5+ years serving Melbourne and surrounding suburbs.",
};

const stats = [
  { value: "3,000+", label: "MOVES COMPLETED" },
  { value: "4.8★", label: "FROM 800+ REVIEWS" },
  { value: "5+ yrs", label: "IN BUSINESS" },
  { value: "$100k", label: "GOODS-IN-TRANSIT COVER" },
];

const values = [
  {
    title: "Family owned, not a bidding site",
    body: "Movera is family owned and operated. When you call us, you're talking to the people who run the crews — not a call centre passing your details around to the highest bidder.",
  },
  {
    title: "Vetted crews, start to finish",
    body: "Every move is handled by a trained, background-checked moving team — our own crews and trusted local partners we hold to the same standard, so the service is consistent every time.",
  },
  {
    title: "A genuine quote, every time",
    body: "We assess volume, distance and access up front, then quote based on the actual work involved. What we assess is what we quote, and what we quote is what's on the invoice.",
  },
  {
    title: "Careful with what matters",
    body: "From everyday furniture to pianos and antiques, every item is wrapped, handled and placed with the same level of care.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-gray-50 font-sans text-ink-600">
      <Nav />

      <section className="max-w-[1180px] mx-auto px-8 pt-16 pb-10">
        <div className="text-xs font-display font-semibold tracking-[1.5px] uppercase text-ink-400 mb-6">
          About Movera
        </div>
        <h1 className="font-display font-bold text-5xl leading-[1.1] text-ink-800 m-0 mb-6 max-w-[720px]">
          Reliable Removalists Melbourne Trusts.
        </h1>
        <p className="text-[17px] leading-[1.65] max-w-[640px]">
          Movera is a family owned and operated removals company serving Melbourne and surrounding suburbs. Over
          5+ years in business, our trained crews and partner teams have completed 3,000+ moves — homes, offices,
          and everything in between — always with a quote based on the actual work involved, and one point of
          accountability.
        </p>
      </section>

      <section className="bg-white border-y border-border">
        <div className="max-w-[1180px] mx-auto px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-display font-bold text-3xl text-teal-500 mb-1.5">{s.value}</div>
              <div className="text-xs font-display font-semibold tracking-[1.2px] uppercase text-ink-400">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[1180px] mx-auto px-8 py-16">
        <div className="text-xs font-display font-semibold tracking-[1.5px] uppercase text-ink-400 mb-3">
          What We Stand For
        </div>
        <h2 className="font-display font-bold text-[28px] text-ink-800 m-0 mb-8 max-w-[640px]">
          Every move, handled properly
        </h2>
        <div className="grid sm:grid-cols-2 gap-6">
          {values.map((v) => (
            <Card key={v.title}>
              <div className="font-display font-semibold text-[16px] text-ink-800 mb-2">{v.title}</div>
              <p className="m-0 text-sm leading-[1.6]">{v.body}</p>
            </Card>
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
