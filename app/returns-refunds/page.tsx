import { Nav } from "@/components/ui/Nav";
import { CTABand, Footer } from "@/components/ui/Footer";

export const metadata = {
  title: "Returns & Refunds Policy | Movera Removals & Storage",
  description: "When deposits, payments and charges are refundable, and how to request a refund from Movera.",
};

type Clause = { title: string; text: string };
type Section = { num: string; title: string; intro?: string; clauses?: Clause[] };

const sections: Section[] = [
  {
    num: "1",
    title: "Overview",
    intro:
      "Movera provides removal and storage services rather than physical goods, so this policy explains when a deposit, payment or charge is refundable — read alongside our Terms & Conditions, which govern the booking itself.",
  },
  {
    num: "2",
    title: "Deposits & Cancellations",
    clauses: [
      {
        title: "More than 7 days' notice",
        text: "Cancel or reschedule your booking more than 7 days before the scheduled job and your deposit will be refunded in full or credited to a new date, whichever you prefer.",
      },
      {
        title: "Within 7 days of the job",
        text: "Cancellations or date changes made within 7 days of the scheduled job are non-refundable, as set out in our Terms & Conditions — the deposit covers crew, vehicle and route allocation already committed to your move.",
      },
      {
        title: "Cancelled by Movera",
        text: "If we cancel or fail to attend a confirmed booking for a reason within our control, any deposit or payment already made is refunded in full.",
      },
    ],
  },
  {
    num: "3",
    title: "Genuine Quote Guarantee",
    intro:
      "We quote upfront based on the details you provide, reflecting the actual work involved in your move. If you're charged above that quote without your agreement to a scope change (e.g. additional items, extra stops, or access issues not disclosed at booking), the difference is refunded on request.",
  },
  {
    num: "4",
    title: "Damage & Loss Claims",
    clauses: [
      {
        title: "Reporting a claim",
        text: "Any damage believed to be caused by our crew must be identified and reported before the job is marked complete and our team leaves the property. Claims raised after this point cannot be accepted, consistent with our Terms & Conditions.",
      },
      {
        title: "How claims are resolved",
        text: "Confirmed claims are covered by our standard $80,000 goods-in-transit insurance. We reserve the right to offer monetary compensation instead of repair or replacement.",
      },
      {
        title: "What isn't covered",
        text: "Claims relating to pre-existing damage, defective self-packing, inherently fragile items, cosmetic wear, or other exclusions listed in our Terms & Conditions are not eligible for a refund or compensation.",
      },
    ],
  },
  {
    num: "5",
    title: "Non-Refundable Charges",
    intro:
      "The following are treated as costs already incurred on your behalf and are non-refundable once paid:",
    clauses: [
      { title: "Tolls & parking", text: "Toll charges and any parking fees or infringements incurred during your move, unless caused by an error on our part." },
      { title: "Storage & redelivery", text: "Storage and redelivery fees where goods couldn't be delivered due to access issues or the absence of an authorised receiver." },
      { title: "Late payment fees", text: "The $45/day administration fee applied to overdue accounts." },
      { title: "Card surcharge", text: "The 1.8% surcharge applied to credit card payments." },
    ],
  },
  {
    num: "6",
    title: "How Refunds Are Processed",
    intro:
      "Approved refunds are returned to the original payment method used at booking. Bank transfers and card payments are typically refunded within 7–10 business days of approval. We'll confirm the amount and timing with you by email once a refund is approved.",
  },
  {
    num: "7",
    title: "Raising a Dispute",
    intro:
      "If you disagree with a decision under this policy, contact us directly and we'll review the details of your move with you. If a dispute can't be resolved directly, it is subject to the jurisdiction set out in our Terms & Conditions — the laws of Victoria, Australia.",
  },
  {
    num: "8",
    title: "Contact Us",
    intro:
      "To request a refund or query a charge, email hello@movera.com.au or call 02 8503 4444 with your booking details and we'll respond as soon as possible.",
  },
];

export default function ReturnsRefundsPage() {
  return (
    <div className="bg-gray-50 font-sans text-ink-600">
      <Nav />

      <section className="bg-white border-b border-border">
        <div className="max-w-[840px] mx-auto px-8 py-16 text-center">
          <div className="text-xs font-display font-semibold tracking-[1.5px] uppercase text-ink-400 mb-3">
            Legal
          </div>
          <h1 className="font-display font-bold text-5xl leading-[1.1] text-ink-800 m-0 mb-6">
            Returns &amp; Refunds Policy
          </h1>
          <p className="text-[17px] leading-[1.65] max-w-[600px] mx-auto m-0">
            As a removals and storage provider, Movera doesn&rsquo;t sell physical goods to return — this
            page sets out when deposits, payments and charges are refundable.
          </p>
        </div>
      </section>

      <section className="max-w-[840px] mx-auto px-8 py-16">
        <div className="grid gap-12">
          {sections.map((s) => (
            <div key={s.num}>
              <h2 className="font-display font-bold text-2xl text-ink-800 m-0 mb-4">
                {s.num}. {s.title}
              </h2>
              {s.intro && <p className="text-[15px] leading-[1.75] mb-6 text-ink-600">{s.intro}</p>}
              {s.clauses && (
                <div className="grid gap-6">
                  {s.clauses.map((c) => (
                    <div key={c.title}>
                      <div className="font-display font-semibold text-[15px] text-ink-800 mb-1.5">
                        {c.title}
                      </div>
                      <p className="text-[15px] leading-[1.75] m-0">{c.text}</p>
                    </div>
                  ))}
                </div>
              )}
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
