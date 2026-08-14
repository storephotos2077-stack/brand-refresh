import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { testimonials } from "@/lib/shop-data";
import { cn } from "@/lib/utils";

export function TestimonialCarousel() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const drag = useRef<{ x: number } | null>(null);
  const count = testimonials.length;

  const go = (n: number) => setI((n + count) % count);

  useEffect(() => {
    if (paused) return undefined;
    const t = setInterval(() => setI((v) => (v + 1) % count), 7000);
    return () => clearInterval(t);
  }, [paused, count]);

  return (
    <div
      className="relative"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onPointerDown={(e) => {
        drag.current = { x: e.clientX };
        setPaused(true);
      }}
      onPointerUp={(e) => {
        const start = drag.current?.x;
        drag.current = null;
        if (start === undefined) return;
        const dx = e.clientX - start;
        if (Math.abs(dx) > 45) go(i + (dx < 0 ? 1 : -1));
      }}
    >
      <div className="overflow-hidden">
        <div
          className="flex touch-pan-y"
          style={{ transform: `translate3d(-${i * 100}%, 0, 0)`, transition: "transform 620ms cubic-bezier(.22,.75,.25,1)" }}
        >
          {testimonials.map((t, idx) => (
            <figure
              key={t.name}
              className={cn(
                "w-full shrink-0 rounded-2xl bg-primary-foreground/10 p-7 transition-[opacity,transform] duration-500 sm:p-9",
                idx === i ? "scale-100 opacity-100" : "scale-[0.97] opacity-55",
              )}
            >
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, s) => (
                  <Star key={s} className="size-4 fill-current text-accent" />
                ))}
              </div>
              <blockquote className="mt-5 font-display text-xl leading-snug sm:text-2xl">"{t.text}"</blockquote>
              <figcaption className="mt-5 text-xs opacity-75">
                {t.name} · {t.area} · <span className="font-semibold">Verified purchase</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => go(i - 1)}
          aria-label="Previous review"
          className="press-fx grid size-9 place-items-center rounded-full bg-primary-foreground/15 transition-colors hover:bg-primary-foreground/25"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => go(i + 1)}
          aria-label="Next review"
          className="press-fx grid size-9 place-items-center rounded-full bg-primary-foreground/15 transition-colors hover:bg-primary-foreground/25"
        >
          <ChevronRight className="size-4" />
        </button>
        <div className="ml-2 flex gap-1.5">
          {testimonials.map((t, idx) => (
            <button
              key={t.name}
              type="button"
              onClick={() => setI(idx)}
              aria-label={`Go to review ${idx + 1}`}
              aria-current={idx === i}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                idx === i ? "w-6 bg-primary-foreground" : "w-2.5 bg-primary-foreground/40",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
