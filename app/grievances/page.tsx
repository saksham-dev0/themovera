import { Nav } from "@/components/ui/Nav";
import { CTABand, Footer } from "@/components/ui/Footer";
import { GrievanceForm } from "@/components/ui/GrievanceForm";

export const metadata = {
  title: "Share Your Grievance | Movera Removals & Storage",
  description:
    "Something went wrong on your move? Lodge a formal grievance with Movera — customer details, move details, issue type and supporting photos or documents.",
};

const disclaimer = [
  "The issue of this complaint form is not an admission of liability on our part and is a procedural requirement. Please read our terms and conditions properly before making a claim.",
  "This form is to assist the investigation process and is not a formal claim form of the insurance company.",
  "All questions must be fully answered.",
  "The information provided in the form will be used in any legal disputes that may arise in future.",
  "Incomplete forms, incomplete information or unclear pictures will not be accepted.",
  "If we accept liability for the damage, you will need to provide two repair estimates for the damaged items. Estimates must clearly describe the damage, the intended repair and the cost of each repair, and must be limited to the damage claimed.",
];

export default function GrievancesPage() {
  return (
    <div className="bg-gray-50 font-sans text-ink-600">
      <Nav />

      <section className="max-w-[1180px] mx-auto px-8 pt-16 pb-10 text-center">
        <div className="text-xs font-display font-semibold tracking-[1.5px] uppercase text-ink-400 mb-6">
          Share Your Grievance
        </div>
        <h1 className="font-display font-bold text-5xl leading-[1.1] text-ink-800 m-0 mb-6 max-w-[720px] mx-auto">
          Something go wrong on your move?
        </h1>
        <p className="text-[17px] leading-[1.65] max-w-[620px] mx-auto">
          Fill in the form below with as much detail as you can. A Movera coordinator reviews every
          grievance and will come back to you. If it&apos;s urgent, call{" "}
          <a href="tel:0285034444" className="text-teal-500 font-display font-semibold">
            02 8503 4444
          </a>
          .
        </p>
      </section>

      <section className="max-w-[1180px] mx-auto px-8 pb-12">
        <GrievanceForm />
      </section>

      <section className="max-w-[1180px] mx-auto px-8 pb-16">
        <div className="max-w-[760px] mx-auto border border-border rounded-md bg-white p-6 sm:p-8">
          <div className="font-display font-bold text-lg text-ink-800 mb-4">Disclaimer</div>
          <ul className="m-0 pl-5 grid gap-2.5 text-sm leading-[1.65] text-ink-400">
            {disclaimer.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </section>

      <div className="max-w-[1180px] mx-auto px-8 pb-16">
        <CTABand />
      </div>

      <Footer />
    </div>
  );
}
