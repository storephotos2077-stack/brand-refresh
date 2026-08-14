import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

type Props<T extends string> = {
  categories: readonly T[];
  active: T;
  onSelect: (c: T) => void;
};

export function CategoryCarousel<T extends string>({ categories, active, onSelect }: Props<T>) {
  const track = useRef<HTMLDivElement | null>(null);
  const drag = useRef<{ x: number; left: number } | null>(null);

  const nudge = (dir: number) => track.current?.scrollBy({ left: dir * 220, behavior: "smooth" });

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => nudge(-1)}
        aria-label="Scroll categories left"
        className="press-fx hidden size-9 shrink-0 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground sm:grid"
      >
        <ChevronLeft className="size-4" />
      </button>

      <div
        ref={track}
        className="no-scrollbar flex flex-1 snap-x snap-mandatory gap-2 overflow-x-auto scroll-smooth py-1"
        onPointerDown={(e) => {
          drag.current = { x: e.clientX, left: track.current?.scrollLeft ?? 0 };
        }}
        onPointerMove={(e) => {
          if (!drag.current || !track.current) return;
          track.current.scrollLeft = drag.current.left - (e.clientX - drag.current.x);
        }}
        onPointerUp={() => {
          drag.current = null;
        }}
        onPointerLeave={() => {
          drag.current = null;
        }}
      >
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => onSelect(c)}
            aria-pressed={c === active}
            className={cn(
              "press-fx shrink-0 snap-start rounded-full border px-4 py-2 text-sm font-semibold transition-colors duration-200",
              c === active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:text-foreground",
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => nudge(1)}
        aria-label="Scroll categories right"
        className="press-fx hidden size-9 shrink-0 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:text-foreground sm:grid"
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
