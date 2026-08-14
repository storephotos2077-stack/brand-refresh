import { Link, useRouterState } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { formatINR } from "@/lib/shop-data";
import { useShop } from "@/lib/shop-store";
import { cn } from "@/lib/utils";

const HIDE_ON = ["/cart", "/checkout"];

export function MobileCartBar() {
  const { cartCount, cartSubtotal } = useShop();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [pulse, setPulse] = useState(false);
  const prev = useRef(cartCount);

  useEffect(() => {
    const grew = cartCount > prev.current;
    prev.current = cartCount;
    if (!grew) return undefined;
    setPulse(true);
    const t = setTimeout(() => setPulse(false), 520);
    return () => clearTimeout(t);
  }, [cartCount]);

  const visible = cartCount > 0 && !HIDE_ON.includes(path);

  return (
    <div
      className={cn(
        "fixed inset-x-3 bottom-3 z-50 lg:hidden",
        "transition-[transform,opacity] duration-300 ease-out",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0",
      )}
    >
      <Link
        to="/cart"
        className="flex items-center gap-3 rounded-2xl bg-primary px-4 py-3 text-primary-foreground shadow-[var(--shadow-lift)] press-fx"
      >
        <span className={cn("grid size-9 place-items-center rounded-xl bg-primary-foreground/15", pulse && "cart-bounce")}>
          <ShoppingCart className="size-4" />
        </span>
        <span className="flex-1 text-sm font-semibold">
          {cartCount} {cartCount === 1 ? "item" : "items"} · {formatINR(cartSubtotal)}
        </span>
        <span className="rounded-full bg-primary-foreground/15 px-3 py-1.5 text-xs font-bold tracking-wide uppercase">
          View cart
        </span>
      </Link>
    </div>
  );
}
