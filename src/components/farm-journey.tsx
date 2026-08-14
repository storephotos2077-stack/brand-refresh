import { Boxes, Home, Scissors, Snowflake, Sprout, Truck, Wheat } from "lucide-react";
import { useSectionProgress } from "@/lib/motion";
import { cn } from "@/lib/utils";

const stages = [
  { icon: Sprout, title: "Farm", body: "Birds raised at partner farms within a few hours of the city." },
  { icon: Wheat, title: "Harvest", body: "Collected the same morning your order window opens." },
  { icon: Scissors, title: "Cut to order", body: "Nothing pre-cut. Your bird is dressed after you order." },
  { icon: Boxes, title: "Pack", body: "Weighed after cleaning on a stamped scale, then sealed." },
  { icon: Snowflake, title: "Cold chain", body: "Held and moved at 0–4 °C with gel packs." },
  { icon: Truck, title: "Delivery", body: "Live tracking from the cutting counter to your street." },
  { icon: Home, title: "Home", body: "Handed over in your slot with an instant invoice." },
];

export function FarmJourney() {
  const { ref, progress } = useSectionProgress<HTMLDivElement>();
  const active = Math.round(progress * (stages.length - 0.2));

  return (
    <section className="relative overflow-hidden border-y border-border bg-secondary/40 section-y">
      <div aria-hidden className="grain-layer" />
      <div className="container-page relative">
        <div className="head-center">
          <p className="eyebrow">The journey</p>
          <h2 className="mt-3 text-[clamp(1.6rem,3.6vw,2.15rem)] leading-tight text-balance">
            From farm to your home, in one unbroken line
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-pretty text-muted-foreground">
            Every order follows the same seven steps. Scroll to follow the route your chicken takes.
          </p>
        </div>

        <div ref={ref} className="relative mx-auto mt-12 w-full max-w-xl pl-14">
          <div aria-hidden className="absolute top-2 bottom-2 left-[1.375rem] w-[2px] bg-border">
            <div
              className="w-full origin-top bg-gradient-to-b from-primary to-accent"
              style={{ height: "100%", transform: `scaleY(${progress})`, transition: "transform 140ms linear" }}
            />
          </div>

          <ol className="space-y-8">
            {stages.map((s, i) => {
              const on = i <= active;
              return (
                <li key={s.title} className="relative">
                  <span
                    className={cn(
                      "absolute top-1 -left-14 grid size-11 place-items-center rounded-full border transition-all duration-500",
                      on
                        ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                        : "border-border bg-card text-muted-foreground",
                    )}
                  >
                    <s.icon className={cn("size-5 transition-transform duration-500", on ? "scale-100" : "scale-90")} />
                  </span>
                  <div
                    className={cn(
                      "transition-all duration-500",
                      on ? "translate-y-0 opacity-100" : "translate-y-2 opacity-45",
                    )}
                  >
                    <p className="font-display text-xl">{s.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-pretty text-muted-foreground">{s.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
