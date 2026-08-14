import { Check, Heart, Loader2, Plus, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { flyToCart } from "@/lib/cart-fx";
import { useCountUp, useInView } from "@/lib/motion";
import { formatINR, type Product } from "@/lib/shop-data";
import { useShop } from "@/lib/shop-store";
import { cn } from "@/lib/utils";

type AddState = "idle" | "adding" | "added";

export function ProductCard({ product, delay = 0 }: { product: Product; delay?: number }) {
  const { addToCart, favorites, toggleFavorite } = useShop();
  const fav = favorites.includes(product.id);
  const { ref, inView } = useInView<HTMLElement>();
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [state, setState] = useState<AddState>("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const rating = useCountUp(product.rating, inView, 900, 1);
  const discount = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  function handleAdd() {
    // Cart update happens first — animation is purely cosmetic.
    addToCart(product.id);
    flyToCart(imgRef.current);
    setState("adding");
    timers.current.push(setTimeout(() => setState("added"), 420));
    timers.current.push(setTimeout(() => setState("idle"), 1600));
    toast.success(`${product.name} added to cart`);
  }

  return (
    <article
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "surface-card card-lift group reveal reveal-up relative flex h-full flex-col overflow-hidden",
        "hover:border-primary/40 hover:shadow-[var(--shadow-lift)]",
        inView && "is-visible",
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          ref={imgRef}
          src={product.image}
          alt={`${product.name} — ${product.unit}, packed fresh`}
          loading="lazy"
          width={900}
          height={900}
          className="zoom-media size-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-95" />

        <div className="absolute top-3 left-3 z-10 flex flex-col items-start gap-1.5">
          {product.tags?.[0] && (
            <span className="rounded-full bg-accent px-2.5 py-1 text-[0.68rem] font-bold text-accent-foreground shadow-sm transition-transform duration-300 group-hover:-translate-y-0.5">
              {product.tags[0]}
            </span>
          )}
          {discount > 0 && (
            <span
              className={cn(
                "rounded-full bg-primary px-2.5 py-1 text-[0.68rem] font-bold text-primary-foreground shadow-sm",
                inView && "pop-in",
              )}
              style={{ animationDelay: `${delay + 260}ms` }}
            >
              {discount}% off
            </span>
          )}
        </div>

        <button
          onClick={() => toggleFavorite(product.id)}
          aria-label={fav ? "Remove from favourites" : "Save to favourites"}
          aria-pressed={fav}
          className="press-fx absolute top-3 right-3 grid size-9 place-items-center rounded-full bg-card/90 text-muted-foreground backdrop-blur-sm transition-[transform,color] duration-200 hover:scale-110 hover:text-destructive focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <Heart className={cn("size-4 transition-transform duration-300", fav && "scale-110 fill-destructive text-destructive")} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span className="flex">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "size-3.5 transition-[transform,opacity] duration-500",
                  i < Math.round(product.rating) ? "fill-accent text-accent" : "text-border",
                  inView ? "scale-100 opacity-100" : "scale-50 opacity-0",
                )}
                style={{ transitionDelay: `${delay + i * 70}ms` }}
              />
            ))}
          </span>
          <span className="ml-1 tabular-nums">{rating.toFixed(1)}</span>
          <span>· {product.reviews} reviews</span>
        </div>
        <h3 className="mt-1.5 line-clamp-1 font-display text-lg leading-tight">{product.name}</h3>
        <p className="text-xs text-muted-foreground">{product.unit}</p>
        <p className="mt-2 line-clamp-2 min-h-[2.6rem] text-sm leading-relaxed text-muted-foreground">
          {product.short}
        </p>

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div>
            <span className="font-display text-xl tabular-nums">{formatINR(product.price)}</span>
            {product.mrp && (
              <span className="ml-2 text-sm text-muted-foreground line-through tabular-nums">
                {formatINR(product.mrp)}
              </span>
            )}
          </div>
          <Button
            size="sm"
            onClick={handleAdd}
            aria-live="polite"
            className={cn(
              "press-fx lift-fx sheen min-w-[96px] shrink-0 transition-all duration-300",
              state === "added" && "bg-success text-success-foreground hover:bg-success",
            )}
          >
            {state === "idle" && (
              <>
                <Plus className="size-4" /> Add
              </>
            )}
            {state === "adding" && (
              <>
                <Loader2 className="size-4 animate-spin" /> Adding
              </>
            )}
            {state === "added" && (
              <>
                <Check className="size-4" /> Added
              </>
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}
