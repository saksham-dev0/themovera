import { Nav } from "@/components/ui/Nav";
import { CTABand, Footer } from "@/components/ui/Footer";
import { FeedbackForm } from "@/components/ui/FeedbackForm";

export const metadata = {
  title: "Give Feedback | Movera Removals & Storage",
  description: "Tell us about your move with Movera — share your name, email, comments, and a photo or video if you have one.",
};

export default function FeedbackPage() {
  return (
    <div className="bg-gray-50 font-sans text-ink-600">
      <Nav />

      <section className="max-w-[1180px] mx-auto px-8 pt-16 pb-10 text-center">
        <div className="text-xs font-display font-semibold tracking-[1.5px] uppercase text-ink-400 mb-6">
          Give Feedback
        </div>
        <h1 className="font-display font-bold text-5xl leading-[1.1] text-ink-800 m-0 mb-6 max-w-[720px] mx-auto">
          How did we do?
        </h1>
        <p className="text-[17px] leading-[1.65] max-w-[560px] mx-auto">
          Whether it&apos;s a compliment for the crew or something we should improve, we read every piece of
          feedback. Add a photo or video of your move if you&apos;d like to show us.
        </p>
      </section>

      <section className="max-w-[1180px] mx-auto px-8 pb-16">
        <FeedbackForm />
      </section>

      <div className="max-w-[1180px] mx-auto px-8 pb-16">
        <CTABand />
      </div>

      <Footer />
    </div>
  );
}
