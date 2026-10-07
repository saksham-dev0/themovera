import { IconBed, IconTeam, IconTruck } from "@/components/landing/Icons";
import { truckRates } from "@/lib/pricing";

/**
 * Hourly rate cards, one per truck size. `quoteHref` points the card buttons
 * at the quote form — an in-page anchor on landing pages, /quote elsewhere.
 */
export function TruckRates({ quoteHref = "/quote" }: { quoteHref?: string }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {truckRates.map((truck) => {
        const specs = [
          { label: "Best Suited For", value: `${truck.bedrooms} Bedrooms`, Icon: IconBed },
          { label: "Removalists", value: `x${truck.removalists}`, Icon: IconTeam },
          { label: "Type of Truck", value: truck.size, Icon: IconTruck },
        ];
        return (
          <div
            key={truck.name}
            className={`relative flex flex-col rounded-md border bg-white p-6 transition-shadow hover:shadow-raised ${
              truck.popular ? "border-teal-500 bg-teal-50 shadow-raised" : "border-border"
            }`}
          >
            {truck.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-pill bg-clay-500 px-3 py-1 font-display text-[10px] font-bold uppercase tracking-[1.5px] text-white">
                Most Popular
              </div>
            )}
            <div className="mb-3 font-display text-[15px] font-bold uppercase tracking-wide text-ink-800">
              {truck.name}
            </div>
            <div className="mb-5 flex items-baseline gap-1">
              <span className="font-display text-[34px] font-bold leading-none text-teal-500">{truck.rate}</span>
              <span className="font-display text-sm font-semibold text-ink-400">{truck.unit}</span>
            </div>
            <div className="mb-5 grid gap-3 border-t border-border pt-4">
              {specs.map(({ label, value, Icon }) => (
                <div key={label} className="flex items-center justify-between gap-3 text-[13px]">
                  <span className="flex items-center gap-2 text-ink-600">
                    <Icon className="h-4 w-4 text-teal-500" />
                    {label}
                  </span>
                  <span className="font-display font-semibold text-ink-800">{value}</span>
                </div>
              ))}
            </div>
            <a
              href={quoteHref}
              className={`mt-auto block rounded-sm px-4 py-3 text-center font-display text-sm font-semibold no-underline transition-colors ${
                truck.popular
                  ? "bg-clay-500 text-white hover:bg-clay-600"
                  : "border-2 border-teal-500 text-teal-500 hover:bg-teal-50"
              }`}
            >
              REQUEST A FREE QUOTE →
            </a>
          </div>
        );
      })}
    </div>
  );
}
