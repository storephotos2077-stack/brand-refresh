import { Snowflake } from "lucide-react";
import { Reveal, useInView } from "@/lib/motion";
import { cn } from "@/lib/utils";

const steps = ["Cut to order", "Packed cold", "Delivery", "Your home"];

export function FreshnessMeter() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section className="container-page section-y">
      <div ref={ref} className="surface-card relative overflow-hidden p-7 sm:p-10">
        <div aria-hidden className="pointer-events-none absolute -top-24 -right-16 size-72 rounded-full bg-accent/15 blur-3xl" />
        <div className="relative grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
          <div>
            <p className="eyebrow">Freshness meter</p>
            <h2 className="mt-2 text-3xl">The clock starts when you order — not weeks ago</h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Nothing is frozen and nothing is pre-cut. The cold chain stays between 0 °C and 4 °C
              from the packing bench to your door.
            </p>

            <div className="mt-8">
              <div className="relative h-2 rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-success"
                  style={{
                    width: inView ? "100%" : "0%",
                    transition: "width 1600ms cubic-bezier(.22,.75,.25,1)",
                  }}
                />
              </div>
              <ol className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {steps.map((s, i) => (
                  <li
                    key={s}
                    className={cn(
                      "flex items-center gap-2 text-xs font-semibold transition-all duration-500",
                      inView ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0",
                    )}
                    style={{ transitionDelay: `${300 + i * 260}ms` }}
                  >
                    <span className="size-2 rounded-full bg-primary" />
                    {s}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <Reveal variant="scale" delay={200}>
            <div className="rounded-2xl border border-border bg-secondary/50 p-6">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-full bg-primary/10 text-primary">
                  <Snowflake className="size-5" />
                </span>
                <div>
                  <p className="text-sm font-semibold">Cold chain window</p>
                  <p className="text-xs text-muted-foreground">Temperature-logged at every handover</p>
                </div>
              </div>

              <div className="mt-7">
                <div className="relative h-3 rounded-full bg-gradient-to-r from-[oklch(0.72_0.12_230)] via-[oklch(0.8_0.1_200)] to-[oklch(0.86_0.13_95)]">
                  <span
                    className="absolute -top-1.5 size-6 -translate-x-1/2 rounded-full border-2 border-card bg-primary shadow-[var(--shadow-soft)]"
                    style={{
                      left: inView ? "42%" : "6%",
                      transition: "left 1400ms cubic-bezier(.22,.75,.25,1) 250ms",
                    }}
                  />
                </div>
                <div className="mt-3 flex justify-between text-[0.7rem] font-semibold text-muted-foreground">
                  <span>0 °C</span>
                  <span className="text-foreground">Held 0–4 °C</span>
                  <span>8 °C</span>
                </div>
              </div>

              <p className="mt-6 text-xs leading-relaxed text-muted-foreground">
                If the parcel does not feel cold at the door, refuse it — full refund, no arguments.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
