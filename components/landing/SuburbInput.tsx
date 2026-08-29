"use client";

import { useEffect, useId, useRef, useState } from "react";
import { OTHER_SUBURB, suburbRegions } from "@/app/data/suburbs";

const MAPS_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

const fieldClass =
  "w-full min-w-0 rounded-sm border-[1.5px] border-border bg-white px-3.5 py-2.5 font-sans text-[15px] outline-none transition-shadow focus:border-teal-500 focus:shadow-[0_0_0_4px_rgba(44,95,138,0.15)]";

type Prediction = { id: string; label: string };

type PlacesAutocompleteService = {
  getPlacePredictions: (
    request: {
      input: string;
      componentRestrictions?: { country: string | string[] };
      types?: string[];
      sessionToken?: unknown;
    },
    callback: (
      predictions: { place_id: string; description: string }[] | null,
      status: string,
    ) => void,
  ) => void;
};

declare global {
  interface Window {
    google?: {
      maps?: {
        places?: {
          AutocompleteService: new () => PlacesAutocompleteService;
          AutocompleteSessionToken: new () => unknown;
        };
      };
    };
    __moveraMapsPromise?: Promise<void>;
  }
}

/**
 * Loads the Google Maps Places library once, on demand.
 *
 * Deliberately not loaded with the page: pulling in the Maps SDK up front costs
 * ~100 KB and a third-party connection on every visit, which would undo the
 * landing page's performance budget. It is fetched the first time someone
 * focuses a location field instead, so it never touches initial page load.
 */
function loadPlaces(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.google?.maps?.places) return Promise.resolve();
  if (window.__moveraMapsPromise) return window.__moveraMapsPromise;
  if (!MAPS_KEY) return Promise.reject(new Error("No Maps API key"));

  window.__moveraMapsPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&libraries=places&loading=async`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Google Maps"));
    document.head.appendChild(script);
  });
  return window.__moveraMapsPromise;
}

/**
 * Location field for the pickup and drop-off inputs.
 *
 * Without a Maps API key it renders a grouped dropdown of the suburbs we
 * service, so every submitted value is one we recognise. Set
 * NEXT_PUBLIC_GOOGLE_MAPS_API_KEY and it becomes a Google Place Autocomplete
 * field instead — no other code changes.
 */
export function SuburbInput(props: {
  name: string;
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
  label: string;
  required?: boolean;
}) {
  return MAPS_KEY ? <PlacesField {...props} /> : <SuburbSelect {...props} />;
}

/** Grouped native dropdown — the default until a Maps key is configured. */
function SuburbSelect({
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

  return (
    <div className="relative">
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        required={required}
        aria-label={label}
        onChange={(e) => onChange(e.target.value)}
        className={`${fieldClass} cursor-pointer appearance-none bg-[length:11px] bg-[right_0.9rem_center] bg-no-repeat pr-10 ${
          value ? "text-ink-800" : "text-ink-400"
        }`}
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath fill='%237c8790' d='M1.4 0 6 4.6 10.6 0 12 1.4 6 7.4 0 1.4z'/%3E%3C/svg%3E\")",
        }}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {suburbRegions.map((group) => (
          <optgroup key={group.region} label={group.region}>
            {group.suburbs.map((suburb) => (
              <option key={suburb} value={suburb}>
                {suburb}
              </option>
            ))}
          </optgroup>
        ))}
        <optgroup label="Somewhere else">
          <option value={OTHER_SUBURB}>{OTHER_SUBURB}</option>
        </optgroup>
      </select>
    </div>
  );
}

/** Google Place Autocomplete — used once NEXT_PUBLIC_GOOGLE_MAPS_API_KEY is set. */
function PlacesField({
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
  const [matches, setMatches] = useState<Prediction[]>([]);

  const serviceRef = useRef<PlacesAutocompleteService | null>(null);
  const sessionRef = useRef<unknown>(null);
  // Guards against out-of-order responses overwriting newer predictions.
  const requestId = useRef(0);

  function ensurePlaces() {
    if (serviceRef.current) return;
    loadPlaces()
      .then(() => {
        const places = window.google?.maps?.places;
        if (!places) return;
        serviceRef.current = new places.AutocompleteService();
        sessionRef.current = new places.AutocompleteSessionToken();
      })
      .catch(() => {});
  }

  useEffect(() => {
    const query = value.trim();
    const service = serviceRef.current;
    if (!service || query.length < 2) {
      setMatches([]);
      return;
    }

    const current = ++requestId.current;
    const timer = setTimeout(() => {
      service.getPlacePredictions(
        {
          input: query,
          componentRestrictions: { country: "au" },
          types: ["geocode"],
          sessionToken: sessionRef.current,
        },
        (predictions, status) => {
          if (current !== requestId.current) return;
          if (status !== "OK" || !predictions) {
            setMatches([]);
            return;
          }
          setMatches(
            predictions
              .slice(0, 6)
              .map((p) => ({ id: p.place_id, label: p.description.replace(/, Australia$/, "") })),
          );
        },
      );
    }, 180);

    return () => clearTimeout(timer);
  }, [value]);

  const showList =
    open && matches.length > 0 && matches[0].label.toLowerCase() !== value.trim().toLowerCase();

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
        onFocus={() => {
          ensurePlaces();
          setOpen(true);
        }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className={`${fieldClass} text-ink-800 placeholder:text-ink-400`}
      />
      {showList && (
        <ul className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-sm border border-border bg-white py-1 shadow-floating">
          {matches.map((match) => (
            <li key={match.id}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(match.label);
                  setMatches([]);
                  setOpen(false);
                }}
                className="w-full cursor-pointer bg-transparent px-4 py-2 text-left text-sm text-ink-800 transition-colors hover:bg-gray-50"
              >
                {match.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
