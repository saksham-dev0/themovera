/**
 * Inline SVG icon set for the landing page.
 *
 * Inline rather than an icon library so the page ships no extra JS and the
 * icons inherit `currentColor` from whatever they sit in.
 */
type IconProps = { className?: string };

const base = "shrink-0";

export function IconTag({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`${base} ${className}`}>
      <path d="M20.6 13.4 12 22l-9-9V3h10l7.6 7.6a2 2 0 0 1 0 2.8Z" />
      <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconShield({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`${base} ${className}`}>
      <path d="M12 2.5 4 5.6v5.7c0 4.6 3.3 8.6 8 10.2 4.7-1.6 8-5.6 8-10.2V5.6Z" />
      <path d="m8.8 12 2.2 2.2 4.2-4.4" />
    </svg>
  );
}

export function IconClock({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`${base} ${className}`}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 6.8V12l3.4 2" />
    </svg>
  );
}

export function IconTeam({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`${base} ${className}`}>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.8 20a6.2 6.2 0 0 1 12.4 0" />
      <path d="M16.4 5.2a3.2 3.2 0 0 1 0 6" />
      <path d="M18 14.4a6.2 6.2 0 0 1 3.2 5.6" />
    </svg>
  );
}

export function IconInsurance({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`${base} ${className}`}>
      <path d="M12 2.5 4 5.6v5.7c0 4.6 3.3 8.6 8 10.2 4.7-1.6 8-5.6 8-10.2V5.6Z" />
      <path d="M12 8.4v6.4M8.8 11.6h6.4" />
    </svg>
  );
}

export function IconStar({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={`${base} ${className}`}>
      <path d="m12 2.6 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.4l6.5-.9Z" />
    </svg>
  );
}

export function IconTruck({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`${base} ${className}`}>
      <path d="M2.8 6.4h10.4v9.2H2.8Z" />
      <path d="M13.2 9.6h3.6L20.8 13v2.6h-7.6Z" />
      <circle cx="7" cy="18" r="1.9" />
      <circle cx="17" cy="18" r="1.9" />
    </svg>
  );
}

export function IconMapPin({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`${base} ${className}`}>
      <path d="M12 21.5s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10.4" r="2.6" />
    </svg>
  );
}

export function IconCalendar({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`${base} ${className}`}>
      <rect x="3.2" y="5" width="17.6" height="16" rx="2.4" />
      <path d="M3.2 9.8h17.6M8 3v4M16 3v4" />
    </svg>
  );
}

export function IconPhone({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={`${base} ${className}`}>
      <path d="M6.6 2.8a1.7 1.7 0 0 1 2.3.6l1.5 2.6a1.7 1.7 0 0 1-.3 2.1l-1.3 1.2a12 12 0 0 0 5.9 5.9l1.2-1.3a1.7 1.7 0 0 1 2.1-.3l2.6 1.5a1.7 1.7 0 0 1 .6 2.3l-1 1.7a2.6 2.6 0 0 1-2.9 1.2C11.4 20.4 3.6 12.6 2 6.7A2.6 2.6 0 0 1 3.2 3.8Z" />
    </svg>
  );
}

/** Google "G" — used beside the review rating. */
export function IconGoogle({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`${base} ${className}`}>
      <path fill="#4285F4" d="M23 12.3c0-.8-.1-1.6-.2-2.3H12v4.500h6.2a5.3 5.3 0 0 1-2.3 3.5v2.9h3.7c2.2-2 3.4-5 3.4-8.6Z" />
      <path fill="#34A853" d="M12 23.5c3.1 0 5.7-1 7.6-2.8l-3.7-2.9a7 7 0 0 1-10.4-3.6H1.7v3A11.5 11.5 0 0 0 12 23.5Z" />
      <path fill="#FBBC05" d="M5.5 14.2a6.9 6.9 0 0 1 0-4.4v-3H1.7a11.5 11.5 0 0 0 0 10.4Z" />
      <path fill="#EA4335" d="M12 5.1c1.7 0 3.2.6 4.4 1.7l3.3-3.3A11.5 11.5 0 0 0 1.7 6.8l3.8 3a6.9 6.9 0 0 1 6.5-4.7Z" />
    </svg>
  );
}
