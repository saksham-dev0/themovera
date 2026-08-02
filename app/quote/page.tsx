import { Suspense } from "react";
import { Nav } from "@/components/ui/Nav";
import { CTABand, Footer } from "@/components/ui/Footer";
import { QuoteFormSection } from "./QuoteFormSection";

export const metadata = {
  title: "Get a Free Quote | Movera Removals & Storage",
  description: "Tell us about your move and get a genuine upfront quote from Movera, confirmed before the day.",
};

export default function QuotePage() {
  return (
    <div className="bg-gray-50 font-sans text-ink-600">
      <Nav />

      <section className="max-w-[1180px] mx-auto px-8 pt-16 pb-10">
        <div className="text-xs font-display font-semibold tracking-[1.5px] uppercase text-ink-400 mb-8 text-center">
          Get Started
        </div>

        <div className="max-w-[520px] mx-auto">
          <Suspense fallback={null}>
            <QuoteFormSection />
          </Suspense>
        </div>
      </section>

      <section className="max-w-[1180px] mx-auto px-8 pb-16">
        <CTABand />
      </section>

      <Footer />
    </div>
  );
}
