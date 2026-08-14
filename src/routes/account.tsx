import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { Download, Gift, Heart, MapPin, Repeat, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { brand, formatINR, products, subscriptionPlans } from "@/lib/shop-data";
import { printInvoice } from "@/lib/invoice";
import { useShop } from "@/lib/shop-store";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, follow" },
      { title: "My Account — Orders, Invoices, Loyalty & Subscriptions" },
      {
        name: "description",
        content: "View past orders, reorder in one click, download invoices, manage addresses, loyalty points and subscriptions.",
      },
      { property: "og:title", content: "My Account" },
      { property: "og:description", content: "Orders, invoices, loyalty points and subscriptions in one place." },
    ],
  }),
  component: Account,
});

function Account() {
  const navigate = useNavigate();
  const {
    orders, addresses, removeAddress, favorites, toggleFavorite, points, reorder, rateOrder,
    subscriptions, toggleSubscription, toggleAutoRenew, skipNext, notifications,
  } = useShop();

  const tier = points >= 1000 ? "Gold" : points >= 500 ? "Silver" : "Bronze";

  return (
    <div className="container-page py-14">
      <p className="eyebrow">Customer dashboard</p>
      <h1 className="mt-2 text-4xl">Welcome back</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-4">
        {[
          { label: "Orders placed", value: orders.length },
          { label: "Loyalty points", value: points },
          { label: "Tier", value: tier },
          { label: "Active subscriptions", value: subscriptions.filter((s) => s.status === "active").length },
        ].map((s) => (
          <div key={s.label} className="surface-card p-5">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="mt-1 font-display text-2xl">{s.value}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="orders" className="mt-10">
        <TabsList className="flex-wrap">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="favorites">Favourites</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
          <TabsTrigger value="loyalty">Loyalty</TabsTrigger>
          <TabsTrigger value="subs">Subscriptions</TabsTrigger>
          <TabsTrigger value="alerts">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-6 space-y-4">
          {orders.length === 0 && <p className="text-sm text-muted-foreground">No orders yet.</p>}
          {orders.map((o) => (
            <div key={o.id} className="surface-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-display text-lg">{o.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(o.createdAt).toLocaleString("en-IN")} · {o.items.length} items ·{" "}
                    {formatINR(o.total)} · {o.paymentStatus}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {o.items.map((i) => `${i.name} × ${i.qty}`).join(", ")}
                  </p>
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold capitalize">
                  {o.stage}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button size="sm" variant="outline" onClick={() => navigate({ to: "/track/$orderId", params: { orderId: o.id } })}>
                  Track
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    reorder(o.id);
                    toast.success("Items added to your cart");
                    navigate({ to: "/cart" });
                  }}
                >
                  <Repeat className="size-4" /> Reorder
                </Button>
                <Button size="sm" variant="outline" onClick={() => printInvoice(o)}>
                  <Download className="size-4" /> Invoice
                </Button>
                {o.stage === "delivered" && !o.rated && (
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        aria-label={`Rate ${n} stars`}
                        onClick={() => {
                          rateOrder(o.id, n);
                          toast.success("Thanks! 20 bonus points added.");
                        }}
                      >
                        <Star className="size-5 text-accent" />
                      </button>
                    ))}
                  </div>
                )}
                {o.rated && (
                  <span className="flex items-center gap-1 text-sm text-muted-foreground">
                    Rated {o.rated}
                    <Star className="size-4 fill-accent text-accent" />
                  </span>
                )}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="favorites" className="mt-6 grid gap-4 sm:grid-cols-2">
          {favorites.length === 0 && <p className="text-sm text-muted-foreground">No saved products yet.</p>}
          {favorites.map((f) => {
            const p = products.find((x) => x.id === f);
            if (!p) return null;
            return (
              <div key={f} className="surface-card flex items-center gap-4 p-4">
                <img src={p.image} alt={p.name} loading="lazy" width={64} height={64} className="size-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-sm text-muted-foreground">{formatINR(p.price)} · {p.unit}</p>
                </div>
                <Button size="icon" variant="ghost" onClick={() => toggleFavorite(f)} aria-label="Remove favourite">
                  <Heart className="size-4 fill-destructive text-destructive" />
                </Button>
              </div>
            );
          })}
        </TabsContent>

        <TabsContent value="addresses" className="mt-6 grid gap-4 sm:grid-cols-2">
          {addresses.map((a) => (
            <div key={a.id} className="surface-card p-5">
              <div className="flex items-start justify-between">
                <p className="flex items-center gap-2 font-semibold">
                  <MapPin className="size-4 text-accent" /> {a.label}
                </p>
                <Button size="icon" variant="ghost" onClick={() => removeAddress(a.id)} aria-label="Delete address">
                  <Trash2 className="size-4 text-muted-foreground" />
                </Button>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {a.name}
                <br />
                {a.line1}, {a.city} — {a.pincode}
                <br />
                {a.phone} · {a.zone}
              </p>
            </div>
          ))}
          <div className="surface-card grid place-items-center border-dashed p-5 text-sm text-muted-foreground">
            Add new addresses during checkout.
          </div>
        </TabsContent>

        <TabsContent value="loyalty" className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="surface-card p-6">
            <Gift className="size-6 text-accent" />
            <p className="mt-4 font-display text-2xl">{points} points · {tier}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Earn 1 point per ₹10 spent. 100 points = ₹50 off. Points are valid for 12 months.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>• Referral code <strong className="text-foreground">FRESH-PLACEHOLDER</strong> — you and your friend each get ₹100.</li>
              <li>• Birthday month: automatic 15% off one order.</li>
              <li>• Gold tier (1,000+ points): free delivery, always.</li>
            </ul>
          </div>
          <div className="surface-card p-6">
            <p className="eyebrow">Exclusive offers</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="rounded-lg bg-secondary p-3"><strong>FIRST100</strong> — ₹100 off your first order above ₹399.</li>
              <li className="rounded-lg bg-secondary p-3"><strong>FRESH10</strong> — 10% off any order above ₹299.</li>
              <li className="rounded-lg bg-secondary p-3"><strong>SUNDAY15</strong> — 15% off Sunday orders above ₹599.</li>
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="subs" className="mt-6 space-y-4">
          {subscriptions.map((s) => {
            const plan = subscriptionPlans.find((p) => p.id === s.planId)!;
            return (
              <div key={s.id} className="surface-card p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="font-display text-lg">{plan.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {plan.perDelivery} · {formatINR(plan.price)} per cycle
                    </p>
                    <p className="text-xs text-muted-foreground">Next: {s.nextDelivery}</p>
                    {s.skips.length > 0 && (
                      <p className="text-xs text-accent-foreground">{s.skips.length} delivery skipped</p>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="flex items-center gap-2 text-xs">
                      Auto-renew
                      <Switch checked={s.autoRenew} onCheckedChange={() => toggleAutoRenew(s.id)} />
                    </label>
                    <Button size="sm" variant="outline" onClick={() => skipNext(s.id)}>Skip next</Button>
                    <Button size="sm" variant={s.status === "active" ? "outline" : "default"} onClick={() => toggleSubscription(s.id)}>
                      {s.status === "active" ? "Pause" : "Resume"}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
          <Button asChild variant="outline"><Link to="/subscriptions">Browse plans</Link></Button>
        </TabsContent>

        <TabsContent value="alerts" className="mt-6 space-y-3">
          <p className="text-sm text-muted-foreground">
            Every message below is sent automatically to {brand.phone} and {brand.email}.
          </p>
          {notifications.length === 0 && <p className="text-sm text-muted-foreground">No notifications yet.</p>}
          {notifications.map((n) => (
            <div key={n.id} className="surface-card flex items-start gap-4 p-4">
              <span className="rounded-full bg-secondary px-2.5 py-1 text-[0.68rem] font-bold">{n.channel}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold">{n.title}</p>
                <p className="text-sm text-muted-foreground">{n.body}</p>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(n.at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
