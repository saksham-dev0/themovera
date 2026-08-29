import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { StepTwoForm } from "@/components/landing/StepTwoForm";
import { MobileCallBar } from "@/components/landing/MobileCallBar";
import { IconPhone } from "@/components/landing/Icons";
import { PHONE_DISPLAY, PHONE_TEL } from "../content";

export const metadata: Metadata = {
  title: "Thank You | Movera — Local Movers Melbourne",
  description: "Your quote request is in. Add a few more details for a faster, firmer price.",
  robots: { index: false, follow: false },
};

export default async function ThankYouPage({
  searchParams,
}: {
  searchParams: Promise<{ t?: string; ref?: string }>;
}) {
  const { t: token, ref } = await searchParams;

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-ink-600">
      <header className="bg-ink-900">
        <div className="mx-auto flex max-w-[900px] items-center gap-3 px-5 py-3.5">
          <Link href="/local-movers-melbourne" className="flex shrink-0 items-center gap-2.5 no-underline">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-sm border border-border bg-white p-1">
              <Image
                src="/landing/logo.webp"
                alt="Movera"
                width={32}
                height={32}
                priority
                className="h-full w-full object-contain"
              />
            </div>
            <div className="hidden font-display text-lg font-bold leading-none tracking-[1px] text-white sm:block">
              MOVERA
            </div>
          </Link>
          <a
            href={`tel:${PHONE_TEL}`}
            className="ml-auto inline-flex shrink-0 flex-col items-center rounded-sm border-2 border-sage-500 px-3 py-2 text-white no-underline hover:bg-sage-500/15 sm:px-5"
          >
            <span className="font-display text-[10px] font-semibold uppercase tracking-[1.5px] text-sage-500">
              Call Now
            </span>
            <span className="flex items-center gap-2 font-display text-[20px] font-bold leading-tight sm:text-[22px]">
              <IconPhone className="h-4 w-4" />
              {PHONE_DISPLAY}
            </span>
          </a>
        </div>
      </header>

      <main className="mx-auto max-w-[900px] px-5 pb-24 pt-10 md:pb-14">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-pill bg-teal-100 text-3xl text-teal-500">
            ✓
          </div>
          <h1 className="m-0 mb-3 font-display text-[28px] font-bold leading-[1.2] text-ink-800 sm:text-[34px]">
            Thank you — your quote request is in
          </h1>
          <p className="mx-auto m-0 max-w-[560px] text-[15px] leading-[1.7] text-ink-600">
            A confirmation email is on its way, and one of our Melbourne removalists will call you
            shortly with your price.
          </p>
          {ref && (
            <div className="mt-5 inline-block rounded-pill bg-white px-5 py-2 font-display text-sm font-semibold text-ink-800 shadow-raised">
              Your reference:{" "}
              <span className="text-teal-500">MOV-{ref.replace(/[^0-9]/g, "")}</span>
            </div>
          )}
        </div>

        {token ? (
          <StepTwoForm token={token} />
        ) : (
          <div className="rounded-md border border-border bg-white p-8 text-center">
            <p className="m-0 text-sm leading-[1.7] text-ink-600">
              We couldn&apos;t match this page to a quote request. If you&apos;ve just submitted the
              form, we still have your details — we&apos;ll be in touch. Otherwise give us a call on{" "}
              <a href={`tel:${PHONE_TEL}`} className="font-semibold text-teal-500 no-underline">
                {PHONE_DISPLAY}
              </a>
              .
            </p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/local-movers-melbourne"
            className="font-display text-sm font-semibold text-teal-500 no-underline hover:underline"
          >
            ← Back to Local Movers Melbourne
          </Link>
        </div>
      </main>

      <MobileCallBar />
    </div>
  );
}
