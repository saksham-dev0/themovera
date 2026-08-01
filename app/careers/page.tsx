import { Suspense } from "react";
import { Card, IconTile } from "@/components/ui/Card";
import { Nav } from "@/components/ui/Nav";
import { CTABand, Footer } from "@/components/ui/Footer";
import { CareerApplicationForm } from "@/components/ui/CareerApplicationForm";

export const metadata = {
  title: "Careers | Movera Removals & Storage",
  description: "Join the Movera team — ground supervisor and sub-contractor roles across Melbourne and surrounding suburbs.",
};

const roles = [
  {
    title: "Ground Supervisor",
    slug: "ground-supervisor",
    location: "Melbourne, VIC",
    type: "Full-time",
    body: "Lead a crew on-site from arrival to sign-off — plan the load, manage timing and access, and be the single point of accountability for the customer on moving day.",
    requirements: [
      "Experience supervising a moving or logistics crew",
      "Confident coordinating access, parking and timing on-site",
      "Valid driver's licence",
      "Physically fit and comfortable leading a team",
    ],
  },
  {
    title: "Sub-Contractor",
    slug: "sub-contractor",
    location: "Melbourne & surrounding suburbs",
    type: "Contract",
    body: "Bring your own truck and crew and work moves through Movera as a trusted partner. We hold every partner crew to the same standard as our own — trained, background-checked and reliable.",
    requirements: [
      "Own truck, current registration and insurance",
      "ABN and relevant licences",
      "Track record in furniture or office removals",
      "Available for regular Melbourne-area jobs",
    ],
  },
];

const benefits = [
  {
    icon: "$",
    title: "Fair, reliable pay",
    body: "Competitive rates paid on time, every time — for crew and partner sub-contractors alike.",
  },
  {
    icon: "★",
    title: "Consistent work",
    body: "Steady bookings across Melbourne's bayside, inner-city, eastern and northern suburbs, year-round.",
  },
  {
    icon: "↑",
    title: "Room to grow",
    body: "We're a family owned business that promotes from within and builds long-term partnerships.",
  },
  {
    icon: "✓",
    title: "Supportive team",
    body: "A dedicated coordinator and office team who back you up on every job, not just at booking.",
  },
];

export default function CareersPage() {
  return (
    <div className="bg-gray-50 font-sans text-ink-600">
      <Nav />

      <section className="max-w-[1180px] mx-auto px-8 pt-16 pb-10">
        <div className="text-xs font-display font-semibold tracking-[1.5px] uppercase text-ink-400 mb-6">
          Careers
        </div>
        <h1 className="font-display font-bold text-5xl leading-[1.1] text-ink-800 m-0 mb-6 max-w-[720px]">
          Build your career with Movera.
        </h1>
        <p className="text-[17px] leading-[1.65] max-w-[640px]">
          We're a family owned removals company growing across Melbourne and surrounding suburbs. We're always
          looking for reliable ground supervisors and sub-contractor crews who care about doing the job properly.
        </p>
      </section>

      <section className="max-w-[1180px] mx-auto px-8 pb-16">
        <div className="text-xs font-display font-semibold tracking-[1.5px] uppercase text-ink-400 mb-3">
          Open Roles
        </div>
        <h2 className="font-display font-bold text-[28px] text-ink-800 m-0 mb-8 max-w-[640px]">
          Current opportunities
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {roles.map((role) => (
            <Card key={role.title} className="p-8">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="font-display font-bold text-xl text-ink-800">{role.title}</div>
                <span className="shrink-0 text-xs font-display font-semibold tracking-wide uppercase text-teal-500 bg-teal-50 rounded-pill px-3 py-1">
                  {role.type}
                </span>
              </div>
              <div className="text-sm text-ink-400 mb-4">{role.location}</div>
              <p className="m-0 mb-4 text-sm leading-[1.6]">{role.body}</p>
              <div className="text-xs font-display font-semibold tracking-wide uppercase text-ink-400 mb-2">
                What we're looking for
              </div>
              <ul className="m-0 mb-6 pl-5 grid gap-1.5 text-sm leading-[1.6]">
                {role.requirements.map((req) => (
                  <li key={req}>{req}</li>
                ))}
              </ul>
              <a
                href={`/careers?role=${role.slug}#apply-form`}
                className="inline-flex items-center justify-center gap-2 font-display font-semibold text-white bg-clay-500 hover:bg-clay-600 rounded-sm text-[15px] px-[26px] py-[14px] no-underline"
              >
                Apply Now
              </a>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-white border-y border-border">
        <div className="max-w-[1180px] mx-auto px-8 py-16">
          <div className="text-xs font-display font-semibold tracking-[1.5px] uppercase text-ink-400 mb-3">
            Why Join Us
          </div>
          <h2 className="font-display font-bold text-[28px] text-ink-800 m-0 mb-8 max-w-[640px]">
            What you get on the Movera team
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <Card key={b.title}>
                <IconTile>{b.icon}</IconTile>
                <div className="font-display font-semibold text-[16px] text-ink-800 mt-4 mb-2">{b.title}</div>
                <p className="m-0 text-sm leading-[1.6]">{b.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="apply-form" className="max-w-[1180px] mx-auto px-8 py-16 scroll-mt-24">
        <div className="text-center mb-10">
          <div className="text-xs font-display font-semibold tracking-[1.5px] uppercase text-ink-400 mb-3">
            Start Your Journey
          </div>
          <h2 className="font-display font-bold text-[28px] text-ink-800 m-0 mb-4 max-w-[560px] mx-auto">
            Don't see the right role listed?
          </h2>
          <p className="text-[17px] leading-[1.65] max-w-[560px] mx-auto">
            We're always looking for motivated people and reliable sub-contractor crews. Fill out the form below
            and we'll get in touch.
          </p>
        </div>
        <Suspense fallback={null}>
          <CareerApplicationForm />
        </Suspense>
      </section>

      <div className="max-w-[1180px] mx-auto px-8 pb-16">
        <CTABand />
      </div>

      <Footer />
    </div>
  );
}
