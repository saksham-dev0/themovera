import { Nav } from "@/components/ui/Nav";
import { CTABand, Footer } from "@/components/ui/Footer";

export const metadata = {
  title: "Terms & Conditions | Movera Removals & Storage",
  description: "The terms and conditions that apply when you book or use Movera's removal services.",
};

type Clause = { num: string; title?: string; text: string };
type Subsection = { num: string; title: string; lead?: string; clauses: Clause[] };
type Section = {
  num: string;
  title: string;
  intro?: string;
  clauses?: Clause[];
  subsections?: Subsection[];
};

const sections: Section[] = [
  {
    num: "1",
    title: "Obligations and Warranties",
    clauses: [
      {
        num: "1.1",
        title: "Information Supplied by You",
        text: "We rely on the accuracy of the information You provide, including but not limited to Date, Addresses, and Contact Details. You warrant that this information is correct and complete.",
      },
      {
        num: "1.2",
        title: "Owner or Authorised Agent",
        text: "You confirm that You are either the legal owner of the goods or are authorised to act on behalf of the owner.",
      },
      {
        num: "1.3",
        title: "Presence at Loading/Unloading",
        text: "No inventory of the goods will be taken. The existing condition of items is verbally agreed. You or an authorised adult representative must be present during the entire loading and unloading process to sign off on documentation. Absence may void any damage claims.",
      },
      {
        num: "1.4",
        title: "Fragile Goods",
        text: "You must verbally inform our team of any fragile or brittle items not obviously so. If special care is required, it must be communicated before the move commences.",
      },
      {
        num: "1.5",
        title: "Goods Left Behind or Taken in Error",
        text: "It is Your responsibility to ensure all intended items are moved and that nothing is left behind or mistakenly taken. The moving vehicle must be inspected by You or Your representative upon job completion. Claims for missing items post-move will not be accepted.",
      },
      {
        num: "1.6",
        title: "Mode of Carriage",
        text: "We may transport goods via any reasonable route and method, taking into account road conditions and delivery destinations.",
      },
      {
        num: "1.7",
        title: "Awkward Access",
        text: "You must inform us during booking of any difficult access points (e.g. narrow hallways, stairs, limited parking). We are not responsible for disassembly of fittings or arranging access solutions (e.g. window removal). You must organise any required specialists in advance.",
      },
      {
        num: "1.8",
        title: "Delivery",
        text: "Goods will only be delivered to You or an authorised receiver. If we cannot deliver due to lack of access or an authorised person, the goods may be stored at Your cost. Additional charges will apply for storage and redelivery. Delays due to factors outside our control (e.g. keys not handed over, weather, traffic) will incur additional costs payable by You.",
      },
    ],
  },
  {
    num: "2",
    title: "Charges and Payments",
    clauses: [
      {
        num: "2.1",
        title: "Delays",
        text: "Arrival times are estimates only. Delays caused by traffic, breakdowns, or other external factors are not within our control. We are not liable for consequential losses due to such delays.",
      },
      {
        num: "2.2",
        title: "Cancellations or Alterations",
        text: "Cancellations or date changes within 7 days of the scheduled job will result in forfeiture of the deposit to cover incurred losses.",
      },
      {
        num: "2.3",
        title: "Lien on Goods",
        text: "We reserve the right to retain goods as security for any unpaid charges. If payment is not received within 14 days, we may dispose of the goods to recover costs.",
      },
      {
        num: "2.4",
        title: "Payment Terms",
        text: "We accept bank transfers and major credit cards (a 1.8% surcharge applies). Payment is due upon job completion unless otherwise requested by Us. Late payments will incur an administration fee of $45/day. Unpaid accounts will be referred to a debt collection agency. You will be responsible for any debt recovery costs.",
      },
      {
        num: "2.5",
        title: "Parking Infringements",
        text: "You will be advised if parking in restricted zones is necessary. You may either accept any fines or instruct us to park elsewhere (additional time may be billed).",
      },
      {
        num: "2.6",
        title: "Tolls",
        text: "All toll charges are payable by You unless a written request is submitted not to use toll routes.",
      },
      {
        num: "2.7",
        title: "Right to Subcontract",
        text: "We may subcontract all or part of the service. These terms still apply in such cases.",
      },
    ],
  },
  {
    num: "3",
    title: "Exclusions & Responsibilities",
    intro: "We are not liable for any loss, damage, or delay caused by factors beyond our control.",
    subsections: [
      {
        num: "3.1",
        title: "Damages",
        lead: "We are not liable for:",
        clauses: [
          { num: "3.1.1", text: "Damage due to poor or defective packing by You." },
          { num: "3.1.2", text: "Inherently fragile items (e.g. electronics, pressed wood furniture, instruments) that are naturally prone to damage." },
          { num: "3.1.3", text: "Pre-existing damage or damage caused by contravening our recommended handling standards." },
          { num: "3.1.4", text: "Defects not visible to our team (e.g. hidden faults, pre-wrapped items)." },
          { num: "3.1.5", text: "Internal faults in electronics with no external signs of damage." },
          { num: "3.1.6", text: "Cosmetic damage (e.g. minor dents or scratches)." },
          { num: "3.1.7", text: "Damage caused when You or Your representatives assist with the move." },
          { num: "3.1.8", text: "Fire, flood, or collision damage (unless covered by our insurer, and limited to what we receive as compensation)." },
          { num: "3.1.9", text: "Compensation for part of a pair/set/suite will only be for the affected portion." },
          { num: "3.1.10", text: "Fragile items include but are not limited to: picture glass, mirrors, glass table tops, marble, granite, composite materials." },
        ],
      },
      {
        num: "3.2",
        title: "Client's Responsibility",
        clauses: [
          { num: "3.2.1", text: "Prepare all items (remove shelves, defrost fridges/freezers, pack breakables, secure drawers, etc.)" },
          { num: "3.2.2", text: "Secure electronics in original packaging or bubble wrap." },
          { num: "3.2.3", text: "Ensure clear hallways and dry, clean appliances." },
          { num: "3.2.4", text: "Obtain all required permits, permissions, and access arrangements prior to move." },
        ],
      },
      {
        num: "3.3",
        title: "Services Not Included",
        clauses: [
          { num: "3.3.1", text: "Our team can only dismantle/reassemble basic furniture with standard tools." },
          { num: "3.3.2", text: "We do not disconnect/reconnect utilities or equipment." },
          { num: "3.3.3", text: "We do not dismantle complex fixtures, appliances, or garden setups." },
        ],
      },
      {
        num: "3.4",
        title: "Restricted Goods",
        lead: "We do not transport the following:",
        clauses: [
          { num: "3.4.1", text: "Hazardous or flammable items (including aerosols, gas cylinders, paint, etc.)" },
          { num: "3.4.2", text: "Perishable goods or liquids." },
          { num: "3.4.3", text: "Pets or live animals." },
          { num: "3.4.4", text: "High-value or irreplaceable goods (cash, jewellery, personal documents, medicines)." },
          { num: "3.4.5", text: "Transport of these items must be arranged separately by You." },
        ],
      },
    ],
  },
  {
    num: "4",
    title: "Notification of Damages",
    clauses: [
      {
        num: "4.1",
        title: "Inspection Upon Completion",
        text: "You must inspect all goods as they are unloaded. Any damage believed to be caused by Us must be reported before completion of the job. No claims will be accepted after we leave the property.",
      },
      {
        num: "4.2",
        title: "Compensation Option",
        text: "We reserve the right to offer monetary compensation instead of repair for any confirmed damage.",
      },
    ],
  },
  {
    num: "5",
    title: "Termination",
    clauses: [
      {
        num: "5.1",
        title: "Right to Refuse Service",
        text: "We reserve the right to refuse service if the environment is deemed unsafe or for any other valid reason.",
      },
      {
        num: "5.2",
        title: "Booking Cancellation",
        text: "We may cancel any booking at any time if there is a lack of cooperation or concern over the likelihood of payment.",
      },
    ],
  },
  {
    num: "6",
    title: "Amendments",
    intro: "These Terms and Conditions may be updated at any time without prior notice. Please check this page regularly for changes.",
  },
  {
    num: "7",
    title: "Jurisdiction",
    intro: "These Terms are governed by and construed in accordance with the laws of the State of Victoria, Australia. Any disputes arising from these terms shall be subject to the exclusive jurisdiction of the courts in Victoria.",
  },
];

export default function TermsPage() {
  return (
    <div className="bg-gray-50 font-sans text-ink-600">
      <Nav />

      <section className="bg-white border-b border-border">
        <div className="max-w-[840px] mx-auto px-8 py-16 text-center">
          <div className="text-xs font-display font-semibold tracking-[1.5px] uppercase text-ink-400 mb-3">
            Legal
          </div>
          <h1 className="font-display font-bold text-5xl leading-[1.1] text-ink-800 m-0 mb-6">
            Terms &amp; Conditions
          </h1>
          <p className="text-[17px] leading-[1.65] max-w-[600px] mx-auto m-0">
            Welcome to Movera. By booking or using our services, you agree to be bound by the following
            Terms and Conditions. Please read them carefully.
          </p>
        </div>
      </section>

      <section className="max-w-[840px] mx-auto px-8 py-16">
        <div className="grid gap-14">
          {sections.map((s) => (
            <div key={s.num}>
              <h2 className="font-display font-bold text-2xl text-ink-800 m-0 mb-4">
                {s.num}. {s.title}
              </h2>
              {s.intro && <p className="text-[15px] leading-[1.75] mb-6 text-ink-600">{s.intro}</p>}

              {s.clauses && (
                <div className="grid gap-6">
                  {s.clauses.map((c) => (
                    <div key={c.num}>
                      {c.title && (
                        <div className="font-display font-semibold text-[15px] text-ink-800 mb-1.5">
                          {c.num} {c.title}
                        </div>
                      )}
                      <p className="text-[15px] leading-[1.75] m-0">{c.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {s.subsections && (
                <div className="grid gap-8">
                  {s.subsections.map((sub) => (
                    <div key={sub.num} className="bg-white border border-border rounded-md p-6">
                      <div className="font-display font-semibold text-lg text-ink-800 mb-1.5">
                        {sub.num} {sub.title}
                      </div>
                      {sub.lead && (
                        <p className="text-[15px] leading-[1.7] mb-3 text-ink-800 font-display font-semibold">
                          {sub.lead}
                        </p>
                      )}
                      <div className="grid gap-3">
                        {sub.clauses.map((c) => (
                          <div key={c.num} className="flex items-start gap-3 text-[15px] leading-[1.65]">
                            <span className="text-xs font-display font-semibold text-ink-400 mt-1 shrink-0">
                              {c.num}
                            </span>
                            <span>{c.text}</span>
                          </div>
                        ))}
                      </div>
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
