import { Bike, Check } from "lucide-react";
import { useInView } from "@/lib/motion";
import { cn } from "@/lib/utils";

const stages = [
  { label: "Order confirmed", done: true },
  { label: "Chicken cut", done: true },
  { label: "Packed", done: true },
  { label: "Out for delivery", done: false, current: true },
  { label: "Delivered", done: false },
];

/** Illustrative delivery journey. Real order tracking lives on /track/$orderId. */
export function DeliveryJourney() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const currentIndex = stages.findIndex((s) => s.current);
  const pct = (currentIndex / (stages.length - 1)) * 100;

  return (
    <div ref={ref} className="surface-card p-6 sm:p-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">How a delivery unfolds</p>
        <h3 className="mt-3 font-display text-2xl text-balance">Every stage, visible</h3>
        <p className="mt-2 text-xs text-muted-foreground">
          Illustration — your live order updates on the tracking page.
        </p>
      </div>

      <div className="relative mx-auto mt-12 w-full max-w-3xl">
        <div className="absolute top-4 right-4 left-4 h-[2px] bg-border">
          <div
            className="h-full bg-gradient-to-r from-primary to-accent"
            style={{ width: inView ? `${pct}%` : "0%", transition: "width 1500ms cubic-bezier(.22,.75,.25,1)" }}
          />
          <span
            aria-hidden
            className="absolute -top-4 grid size-8 -translate-x-1/2 place-items-center rounded-full bg-card text-primary shadow-[var(--shadow-soft)]"
            style={{ left: inView ? `${pct}%` : "0%", transition: "left 1500ms cubic-bezier(.22,.75,.25,1)" }}
          >
            <Bike className="size-4" />
          </span>
        </div>

        <ol className="grid grid-cols-5 gap-1">
          {stages.map((s, i) => (
            <li key={s.label} className="flex flex-col items-center text-center">
              <span
                className={cn(
                  "relative grid size-8 place-items-center rounded-full border text-[0.7rem] font-bold transition-all duration-500",
                  s.done
                    ? "border-success bg-success text-success-foreground"
                    : s.current
                      ? "border-primary bg-card text-primary"
                      : "border-border bg-card text-muted-foreground",
                )}
                style={{ transitionDelay: `${i * 180}ms` }}
              >
                {s.done ? <Check className="size-4" /> : s.current ? <span className="size-2 rounded-full bg-primary" /> : <span className="size-2 rounded-full bg-border" />}
                {s.current && (
                  <span aria-hidden className="absolute inset-0 rounded-full bg-primary/40 [animation:ffn-ping-soft_2.2s_ease-out_infinite]" />
                )}
              </span>
              <span
                className={cn(
                  "mt-3 text-[0.7rem] leading-tight font-semibold transition-all duration-500 sm:text-xs",
                  s.done || s.current ? "text-foreground opacity-100" : "text-muted-foreground opacity-70",
                  inView ? "translate-y-0" : "translate-y-2 opacity-0",
                )}
                style={{ transitionDelay: `${200 + i * 180}ms` }}
              >
                {s.label}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
