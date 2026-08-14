import { useNavigate } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatINR, products } from "@/lib/shop-data";
import { cn } from "@/lib/utils";

export function ProductSearch({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);
  const navigate = useNavigate();
  const boxRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return products
      .filter((p) => `${p.name} ${p.category} ${p.short}`.toLowerCase().includes(term))
      .slice(0, 5);
  }, [q]);

  useEffect(() => setCursor(0), [q]);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  function goTo(id: string) {
    setOpen(false);
    setQ("");
    navigate({ to: "/products", hash: id });
  }

  return (
    <div ref={boxRef} className={cn("relative", className)}>
      <div
        className={cn(
          "flex items-center gap-2 rounded-full border border-border bg-card px-3 transition-[width,box-shadow] duration-300 ease-out",
          open ? "w-64 shadow-[var(--shadow-soft)] xl:w-80" : "w-36 xl:w-44",
        )}
      >
        <Search className="size-4 shrink-0 text-muted-foreground" />
        <input
          ref={inputRef}
          value={q}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setCursor((c) => Math.min(results.length - 1, c + 1));
            } else if (e.key === "ArrowUp") {
              e.preventDefault();
              setCursor((c) => Math.max(0, c - 1));
            } else if (e.key === "Enter") {
              if (results[cursor]) goTo(results[cursor]!.id);
              else navigate({ to: "/products" });
            } else if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          placeholder="Search cuts…"
          aria-label="Search products"
          className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        {q && (
          <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="press-fx text-muted-foreground">
            <X className="size-4" />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <ul className="surface-card absolute top-12 right-0 z-50 w-72 overflow-hidden p-1.5 xl:w-80">
          {results.map((p, i) => (
            <li key={p.id}>
              <button
                type="button"
                onMouseEnter={() => setCursor(i)}
                onClick={() => goTo(p.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl p-2 text-left transition-[transform,opacity,background-color] duration-300",
                  i === cursor && "bg-secondary",
                )}
                style={{ animation: `ffn-rise 320ms cubic-bezier(.22,.75,.25,1) ${i * 45}ms both` }}
              >
                <img src={p.image} alt="" width={80} height={80} loading="lazy" className="size-10 rounded-lg object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">{p.name}</span>
                  <span className="block text-xs text-muted-foreground">{p.unit}</span>
                </span>
                <span className="text-sm font-semibold tabular-nums">{formatINR(p.price)}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
