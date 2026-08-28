"use client";

import { useId, useMemo, useState } from "react";
import { melbourneSuburbs } from "@/app/data/suburbs";

/**
 * Location field with suburb autocomplete, used for the pickup and drop-off
 * inputs on the landing-page quote form.
 *
 * Suggestions come from the local Melbourne suburb list. To switch to Google
 * Place Autocomplete later, replace `matches` with predictions from the Places
 * service — the rest of the component (value, blur, keyboard, styling) is
 * source-agnostic.
 */
export function SuburbInput({
  name,
  value,
  onChange,
  placeholder,
  label,
  required = true,
}: {
  name: string;
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
  label: string;
  required?: boolean;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);

  const matches = useMemo(() => {
    const query = value.trim().toLowerCase();
    if (!query) return [];
    const starts = melbourneSuburbs.filter((s) => s.toLowerCase().startsWith(query));
    const contains = melbourneSuburbs.filter(
      (s) => !s.toLowerCase().startsWith(query) && s.toLowerCase().includes(query),
    );
    return [...starts, ...contains].slice(0, 6);
  }, [value]);

  const showList = open && matches.length > 0 && matches[0].toLowerCase() !== value.trim().toLowerCase();

  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <input
        id={id}
        name={name}
        value={value}
        required={required}
        autoComplete="off"
        spellCheck={false}
        placeholder={placeholder}
        aria-label={label}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="w-full min-w-0 rounded-sm border-[1.5px] border-border bg-white px-4 py-3 font-sans text-[15px] text-ink-800 outline-none transition-shadow placeholder:text-ink-400 focus:border-teal-500 focus:shadow-[0_0_0_4px_rgba(44,95,138,0.15)]"
      />
      {showList && (
        <ul className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-sm border border-border bg-white py-1 shadow-floating">
          {matches.map((suburb) => (
            <li key={suburb}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(suburb);
                  setOpen(false);
                }}
                className="w-full cursor-pointer bg-transparent px-4 py-2 text-left text-sm text-ink-800 transition-colors hover:bg-gray-50"
              >
                {suburb}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
