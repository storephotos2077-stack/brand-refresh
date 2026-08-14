import { Link, createFileRoute } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { brand, formatINR, products } from "@/lib/shop-data";
import { useShop } from "@/lib/shop-store";
import { Reveal } from "@/lib/motion";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, follow" },
      { title: "Your Cart — FarmFreshNow" },
      { name: "description", content: "Review your fresh chicken order before checkout." },
      { property: "og:title", content: "Your Cart" },
      { property: "og:description", content: "Review your fresh chicken order before checkout." },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { cart, setQty, cartSubtotal } = useShop();
  const below = cartSubtotal < brand.minOrder;

  return (
    <Reveal variant="fade" className="container-page py-14">
      <h1 className="text-4xl">Your cart</h1>

      {cart.length === 0 ? (
        <div className="surface-card mt-8 p-12 text-center">
          <p className="text-muted-foreground">Your cart is empty.</p>
          <Button asChild className="mt-5">
            <Link to="/products">Browse fresh cuts</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="surface-card divide-y divide-border overflow-hidden">
            {cart.map((c) => {
              const p = products.find((x) => x.id === c.productId);
              if (!p) return null;
              return (
                <div key={c.productId} className="flex items-center gap-4 p-5">
                  <img src={p.image} alt={p.name} loading="lazy" width={80} height={80} className="size-20 rounded-xl object-cover" />
                  <div className="flex-1">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.unit}</p>
                    <p className="mt-1 text-sm font-semibold">{formatINR(p.price)}</p>
                  </div>
                  <div className="flex items-center gap-1 rounded-full border border-border p-1">
                    <Button size="icon" variant="ghost" className="size-7 rounded-full" onClick={() => setQty(c.productId, c.qty - 1)}>
                      <Minus className="size-3.5" />
                    </Button>
                    <span className="w-6 text-center text-sm font-semibold">{c.qty}</span>
                    <Button size="icon" variant="ghost" className="size-7 rounded-full" onClick={() => setQty(c.productId, c.qty + 1)}>
                      <Plus className="size-3.5" />
                    </Button>
                  </div>
                  <Button size="icon" variant="ghost" onClick={() => setQty(c.productId, 0)} aria-label="Remove">
                    <Trash2 className="size-4 text-muted-foreground" />
                  </Button>
                </div>
              );
            })}
          </div>

          <aside className="surface-card h-fit p-6">
            <p className="eyebrow">Summary</p>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold">{formatINR(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span>{cartSubtotal >= brand.freeDeliveryAbove ? "Free" : formatINR(brand.deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>GST on fresh poultry</span>
                <span>Nil-rated</span>
              </div>
            </div>
            {below && (
              <p className="mt-4 rounded-lg bg-destructive/10 p-3 text-xs text-destructive">
                Minimum order value is ₹{brand.minOrder}. Add {formatINR(brand.minOrder - cartSubtotal)} more to
                continue.
              </p>
            )}
            <Button asChild className="mt-5 w-full" disabled={below} size="lg">
              <Link to="/checkout">Proceed to checkout</Link>
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Coupons can be applied on the checkout page.
            </p>
          </aside>
        </div>
      )}
    </Reveal>
  );
}
