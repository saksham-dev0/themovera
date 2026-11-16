import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { PHONE_DISPLAY, PHONE_E164 } from "@/lib/seo";
import type { Img } from "@/components/content/images";

export type ContentLink = { label: string; href: string };

export type Block = {
  heading: string;
  /** Paragraphs before the list. */
  body?: string[];
  list?: string[];
  /** "check" = ticked list, "chips" = pill tags (suburbs, labels). */
  listStyle?: "check" | "chips";
  /** Paragraphs after the list. */
  after?: string[];
  image?: Img;
  links?: ContentLink[];
};

export type ClosingCta = { heading: string; body: string[]; label: string; href?: string };

const wrap = "max-w-[1180px] mx-auto px-5 sm:px-8";
const eyebrowCls = "text-xs font-display font-semibold tracking-[1.5px] uppercase text-ink-400";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className={`${eyebrowCls} mb-4`}>{children}</div>;
}

function Paragraphs({ items, className = "" }: { items?: string[]; className?: string }) {
  if (!items?.length) return null;
  return (
    <>
      {items.map((p) => (
        <p key={p} className={`text-[15px] leading-[1.75] m-0 mb-4 last:mb-0 ${className}`}>
          {p}
        </p>
      ))}
    </>
  );
}

export function CheckList({ items, columns = 1 }: { items: string[]; columns?: 1 | 2 }) {
  return (
    <ul className={`list-none m-0 p-0 grid gap-3 ${columns === 2 ? "sm:grid-cols-2 gap-x-6" : ""}`}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-[15px] leading-[1.5] text-ink-600">
          <span
            aria-hidden
            className="w-5 h-5 rounded-pill bg-teal-500 text-white grid place-items-center text-xs shrink-0 mt-0.5"
          >
            ✓
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export function ChipList({ items }: { items: string[] }) {
  return (
    <ul className="list-none m-0 p-0 flex flex-wrap gap-2.5">
      {items.map((item) => (
        <li
          key={item}
          className="text-xs font-display font-semibold tracking-wide uppercase text-teal-500 bg-teal-100 rounded-pill px-3.5 py-1.5"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

function Links({ links }: { links?: ContentLink[] }) {
  if (!links?.length) return null;
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-6">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="text-sm font-display font-semibold text-teal-500 no-underline hover:underline"
        >
          {l.label} →
        </Link>
      ))}
    </div>
  );
}

export function Photo({ image, priority = false, className = "" }: { image: Img; priority?: boolean; className?: string }) {
  return (
    <div className={`rounded-md overflow-hidden border border-border shadow-raised bg-white ${className}`}>
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        priority={priority}
        sizes="(min-width: 1024px) 560px, 100vw"
        className="w-full h-auto block"
      />
    </div>
  );
}

/** Split hero: H1 + intro copy on the left, photo (natural orientation) on the right. */
export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  ctaLabel,
  ctaHref = "/quote#quote-form",
}: {
  eyebrow: ReactNode;
  title: string;
  intro: string[];
  image?: Img;
  ctaLabel: string;
  ctaHref?: string;
}) {
  return (
    <section className={`${wrap} pt-14 pb-14`}>
      <div className={`grid gap-10 lg:gap-14 items-center ${image ? "lg:grid-cols-[1.05fr_0.95fr]" : ""}`}>
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="font-display font-bold text-4xl sm:text-5xl leading-[1.1] text-ink-800 m-0 mb-6 max-w-[720px]">
            {title}
          </h1>
          <div className="max-w-[620px] mb-8">
            {intro.map((p, i) => (
              <p key={p} className={`leading-[1.7] m-0 mb-4 last:mb-0 ${i === 0 ? "text-[17px] text-ink-800" : "text-[15px]"}`}>
                {p}
              </p>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <ButtonLink variant="primary" href={ctaHref}>
              {ctaLabel} →
            </ButtonLink>
            <a
              href={`tel:${PHONE_E164}`}
              className="font-display font-semibold text-[15px] text-teal-500 no-underline hover:underline"
            >
              ☎ {PHONE_DISPLAY}
            </a>
          </div>
        </div>
        {image && <Photo image={image} priority />}
      </div>
    </section>
  );
}

/**
 * One content section. Layout follows the content:
 * - with an image → text/photo split, alternating sides
 * - with a long checklist → text left, list in a card on the right
 * - otherwise → single readable column
 */
export function ContentSection({ block, index }: { block: Block; index: number }) {
  const tinted = index % 2 === 0;
  const longList = (block.list?.length ?? 0) >= 6 && block.listStyle !== "chips";
  const heading = (
    <h2 className="font-display font-bold text-[26px] sm:text-[28px] leading-[1.2] text-ink-800 m-0 mb-5">
      {block.heading}
    </h2>
  );
  const list = block.list?.length ? (
    block.listStyle === "chips" ? (
      <ChipList items={block.list} />
    ) : (
      <CheckList items={block.list} columns={!block.image && !longList && block.list.length > 4 ? 2 : 1} />
    )
  ) : null;

  let inner: ReactNode;

  if (block.image) {
    const imageFirst = index % 2 === 1;
    inner = (
      <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
        <div className={imageFirst ? "lg:order-2" : ""}>
          {heading}
          <Paragraphs items={block.body} />
          {list && <div className="my-6">{list}</div>}
          <Paragraphs items={block.after} />
          <Links links={block.links} />
        </div>
        <Photo image={block.image} className={imageFirst ? "lg:order-1" : ""} />
      </div>
    );
  } else if (longList) {
    inner = (
      <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-10 lg:gap-14 items-start">
        <div>
          {heading}
          <Paragraphs items={block.body} />
          {block.after?.length ? <div className="mt-4"><Paragraphs items={block.after} /></div> : null}
          <Links links={block.links} />
        </div>
        <div className="bg-white border border-border rounded-[12px] p-6 sm:p-8">{list}</div>
      </div>
    );
  } else {
    inner = (
      <div className="max-w-[760px]">
        {heading}
        <Paragraphs items={block.body} />
        {list && <div className="my-6">{list}</div>}
        <Paragraphs items={block.after} />
        <Links links={block.links} />
      </div>
    );
  }

  return (
    <section className={tinted ? "bg-white border-y border-border" : ""}>
      <div className={`${wrap} py-14 sm:py-16`}>{inner}</div>
    </section>
  );
}

/** `startIndex` shifts the tint/image-side alternation when other sections precede these. */
export function ContentSections({ blocks, startIndex = 0 }: { blocks: Block[]; startIndex?: number }) {
  return (
    <>
      {blocks.map((b, i) => (
        <ContentSection key={b.heading} block={b} index={i + startIndex} />
      ))}
    </>
  );
}

/** Closing call-to-action band using the page's own CTA copy. */
export function ClosingCtaBand({ cta, image = "/movera.jpeg" }: { cta: ClosingCta; image?: string }) {
  return (
    <div className={`${wrap} py-16`}>
      <div className="relative text-center py-14 px-6 sm:px-10 rounded-md overflow-hidden">
        <Image src={image} alt="" fill className="object-cover" sizes="1180px" />
        <div className="absolute inset-0 bg-blue-900/75" />
        <div className="relative max-w-[640px] mx-auto">
          <h2 className="font-display font-bold text-[28px] sm:text-[32px] leading-[1.25] text-white m-0 mb-4">
            {cta.heading}
          </h2>
          {cta.body.map((p) => (
            <p key={p} className="text-[16px] leading-[1.65] text-white/90 m-0 mb-3">
              {p}
            </p>
          ))}
          <div className="flex justify-center gap-4 flex-wrap mt-6">
            <ButtonLink variant="primary" href={cta.href ?? "/quote#quote-form"}>
              {cta.label} ›
            </ButtonLink>
            <a
              href={`tel:${PHONE_E164}`}
              className="inline-flex items-center font-display font-semibold text-[15px] text-white no-underline border-2 border-white/70 hover:bg-white/10 rounded-sm px-[24px] py-3"
            >
              Call {PHONE_DISPLAY}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
