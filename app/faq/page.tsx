import { Accordion } from "@/components/ui/Accordion";
import { Nav } from "@/components/ui/Nav";
import { CTABand, Footer } from "@/components/ui/Footer";

export const metadata = {
  title: "FAQ | Movera Removals & Storage",
  description: "Answers to common questions about pricing, insurance, packing, and moving day.",
};

const faqs = [
  { q: "How much does a removalist cost?", a: "It depends on the size of your move, distance and access — every move is different. We assess your specific requirements and give you a genuine, itemised quote upfront, confirmed before the day." },
  { q: "Do you charge by the hour, or give a quote upfront?", a: "We quote upfront as standard. We assess volume, distance and access first, so your quote reflects the actual work involved — and that's the number that appears on the invoice." },
  { q: "Do you do last-minute or same-day moves?", a: "Yes — subject to crew availability. Call us and we'll do our best to get a truck to you the same day." },
  { q: "Are my belongings insured during the move?", a: "Every move includes $80,000 goods-in-transit cover as standard, with optional comprehensive cover available." },
  { q: "What areas do you service?", a: "We're a Melbourne-based removalist, servicing the metro area and surrounding suburbs — bayside, inner-city, eastern and northern." },
  { q: "Do you handle packing, fragile items, and pianos?", a: "Yes. We supply materials for full or partial packing and specialise in pianos, pool tables, antiques and other fragile items." },
  { q: "Can I hire your crew just to load or unload my own truck?", a: "Yes — our loading & unloading service is labour-only, for customers who've hired their own truck, trailer or shipping container." },
  { q: "Do you offer storage?", a: "We can arrange short and long-term storage as part of your move — ask your coordinator when you get your quote." },
  { q: "What happens if my move takes longer than expected?", a: "Your quote is based on an accurate upfront assessment of your move, so on-the-day timing matching that assessment won't cost you extra. If the scope changes on the day — extra items, extra stops, or access issues not disclosed at booking — we'll always confirm any adjustment with you before proceeding." },
  { q: "Do I need to empty my drawers and cupboards before you arrive?", a: "Light items can often stay in drawers — your coordinator will confirm what to prep based on your move type." },
  { q: "Can I cancel or reschedule my booking?", a: "Yes — contact us as early as possible and we'll work with you to find a new date or process a cancellation." },
  { q: "Do you provide packing boxes and materials?", a: "Yes, quality packing materials are available and included as part of our packing & unpacking service." },
];

export default function FaqPage() {
  return (
    <div className="bg-gray-50 font-sans text-ink-600">
      <Nav />

      <section className="bg-white">
        <div className="max-w-[1180px] mx-auto px-8 py-16 text-center">
          <div className="text-xs font-display font-semibold tracking-[1.5px] uppercase text-ink-400 mb-3">FAQ</div>
          <h1 className="font-display font-bold text-5xl leading-[1.1] text-ink-800 m-0 mb-8 max-w-[640px] mx-auto">
            Removalist questions, answered honestly
          </h1>
          <div className="max-w-[720px] mx-auto text-left">
            <Accordion items={faqs} />
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
