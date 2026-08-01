import { Button } from "@/components/ui/Button";
import { Nav } from "@/components/ui/Nav";
import { CTABand, Footer } from "@/components/ui/Footer";

export const metadata = {
  title: "Pricing | Movera Removals & Storage",
  description: "An accurate quote based on your move's actual volume, distance and access — confirmed before the day, no depot-to-depot tricks.",
};

const comparison = [
  {
    title: "DIY move",
    points: ["Your time, your vehicle, your risk", "No insurance on your belongings", "No equipment for heavy or fragile items"],
  },
  {
    title: "Comparison-site mover",
    points: ["Details sold to 4-5 competing movers", "Crew and quality can vary quote to quote", "Hourly meter can run over quoted time"],
  },
  {
    title: "Movera",
    points: ["One dedicated, trained crew", "Quote based on your move's actual requirements", "$100,000 goods-in-transit cover included"],
    highlight: true,
  },
];

const included = [
  "Volume, distance and access assessed before you're quoted",
  "Furniture wrap and blanket protection",
  "Trained, background-checked moving teams — own crews and vetted partners",
  "$100,000 goods-in-transit insurance",
  "Live phone support — call your coordinator for a real-time update on moving day",
  "A dedicated coordinator for your move",
];

export default function PricingPage() {
  return (
    <div className="bg-gray-50 font-sans text-ink-600">
      <Nav />

      <section className="max-w-[1180px] mx-auto px-8 pt-16 pb-10">
        <div className="text-xs font-display font-semibold tracking-[1.5px] uppercase text-ink-400 mb-6">
          Pricing
        </div>
        <h1 className="font-display font-bold text-5xl leading-[1.1] text-ink-800 m-0 mb-6 max-w-[720px]">
          A Genuine Quote, Based on Your Move.
        </h1>
        <p className="text-[17px] leading-[1.65] max-w-[620px] mb-8">
          Every quote is calculated from your move&rsquo;s actual requirements — volume, distance and access —
          not a guess. Choose a fixed price or an hourly rate, whichever suits your move: what we assess is what
          we quote, and what we quote is what&rsquo;s on the invoice. No depot-to-depot charges, no bidding war.
        </p>
        <Button variant="primary">Get My Free Quote →</Button>
      </section>

      <section className="bg-white">
        <div className="max-w-[1180px] mx-auto px-8 py-16">
          <h2 className="font-display font-bold text-[28px] text-ink-800 m-0 mb-10 max-w-[640px]">
            Why a genuine, work-based quote beats the alternatives
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {comparison.map((c) => (
              <div
                key={c.title}
                className={`rounded-md p-6 border ${c.highlight ? "border-teal-500 bg-teal-50" : "border-border bg-gray-50"}`}
              >
                <div className="font-display font-semibold text-[16px] text-ink-800 mb-4">{c.title}</div>
                <div className="grid gap-3">
                  {c.points.map((p) => (
                    <div key={p} className="flex items-start gap-2.5 text-sm">
                      <span
                        className={`w-5 h-5 rounded-pill grid place-items-center text-xs shrink-0 mt-0.5 ${
                          c.highlight ? "bg-teal-500 text-white" : "bg-ink-400/20 text-ink-400"
                        }`}
                      >
                        {c.highlight ? "✓" : "•"}
                      </span>
                      {p}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[1180px] mx-auto px-8 py-16">
        <h2 className="font-display font-bold text-[28px] text-ink-800 m-0 mb-8 max-w-[640px]">
          What&rsquo;s included in every quote
        </h2>
        <div className="grid sm:grid-cols-2 gap-3 max-w-[820px]">
          {included.map((item) => (
            <div key={item} className="flex items-start gap-3 text-sm">
              <span className="w-5 h-5 rounded-pill bg-teal-500 text-white grid place-items-center text-xs shrink-0 mt-0.5">
                ✓
              </span>
              {item}
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
