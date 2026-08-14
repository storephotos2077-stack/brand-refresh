import { Leaf, Snowflake, Sparkles, Timer, Truck, Weight } from "lucide-react";

const items = [
  { icon: Leaf, label: "Cut after you order" },
  { icon: Snowflake, label: "0–4 °C cold chain" },
  { icon: Weight, label: "Honest net weight" },
  { icon: Truck, label: "Slot you choose" },
  { icon: Timer, label: "Same-day delivery" },
  { icon: Sparkles, label: "FSSAI-licensed unit" },
];

/** Seamless ticker of trust cues — pauses on hover, static under reduced motion. */
export function TrustMarquee() {
  const row = [...items, ...items];

  return (
    <section aria-label="Why customers trust us" className="border-y border-border bg-card py-4">
      <div className="marquee-mask">
        <ul className="marquee gap-10 pr-10">
          {row.map((item, i) => (
            <li
              key={i}
              aria-hidden={i >= items.length}
              className="flex shrink-0 items-center gap-2.5 text-sm font-semibold tracking-wide text-muted-foreground uppercase"
            >
              <item.icon className="size-4 text-primary" />
              {item.label}
              <span className="ml-6 size-1.5 rounded-full bg-accent" aria-hidden />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
