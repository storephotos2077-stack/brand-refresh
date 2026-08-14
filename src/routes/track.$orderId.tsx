import { Link, createFileRoute } from "@tanstack/react-router";
import {
  AlertTriangle,
  Bike,
  Check,
  ChefHat,
  Download,
  MapPin,
  Package,
  PhoneCall,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { brand, formatINR, orderStages, riders } from "@/lib/shop-data";
import { printInvoice } from "@/lib/invoice";
import { useShop } from "@/lib/shop-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/track/$orderId")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, follow" },
      { title: "Live Order Tracking — FarmFreshNow" },
      { name: "description", content: "Follow your order from the cutting counter to your doorstep in real time." },
      { property: "og:title", content: "Live Order Tracking" },
      { property: "og:description", content: "Follow your order from the cutting counter to your doorstep." },
    ],
  }),
  component: Track,
});

const icons = [Check, ChefHat, Package, Bike, Truck, MapPin];

function Track() {
  const { orderId } = Route.useParams();
  const { orders } = useShop();
  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="text-3xl">Order not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">This demo stores orders in your browser.</p>
        <Button asChild className="mt-6"><Link to="/products">Place an order</Link></Button>
      </div>
    );
  }

  const currentIdx = orderStages.findIndex((s) => s.key === order.stage);
  const rider = riders.find((r) => r.id === order.riderId);
  const progress = ((currentIdx + 1) / orderStages.length) * 100;

  return (
    <div className="container-page py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Order {order.id}</p>
          <h1 className="mt-2 text-4xl">
            {order.stage === "delivered" ? "Delivered" : `Arriving in ~${order.etaMinutes} min`}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {order.date} · {order.slot} · {order.address.zone}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => printInvoice(order)}>
            <Download className="size-4" /> Invoice
          </Button>
          <Button asChild variant="outline">
            <a href={`tel:${brand.phone.replace(/\s/g, "")}`}>
              <PhoneCall className="size-4" /> Call shop
            </a>
          </Button>
        </div>
      </div>

      {order.adminStatus === "new" && (
        <p className="mt-6 rounded-xl bg-accent/15 p-4 text-sm">
          Waiting for the shop to accept your order. The admin dashboard receives it instantly.
        </p>
      )}
      {order.adminStatus === "rejected" && (
        <p className="mt-6 rounded-xl bg-destructive/10 p-4 text-sm text-destructive">
          This order was rejected by the shop. Any online payment is refunded to source in 5–7
          business days.
        </p>
      )}
      {order.delayNote && (
        <p className="mt-6 flex items-start gap-3 rounded-xl bg-destructive/10 p-4 text-sm text-destructive">
          <AlertTriangle className="mt-0.5 size-4 shrink-0" />
          <span>
            <strong>Delay notice:</strong> {order.delayNote} Your revised arrival window is about{" "}
            {order.etaMinutes} minutes. Sorry for the wait.
          </span>
        </p>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <section className="surface-card p-6">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
            <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${progress}%` }} />
          </div>

          <ol className="mt-8 space-y-0">
            {orderStages.map((s, i) => {
              const Icon = icons[i]!;
              const done = i <= currentIdx;
              const active = i === currentIdx;
              const at = order.stageTimes[s.key];
              return (
                <li key={s.key} className="relative flex gap-4 pb-8 last:pb-0">
                  {i < orderStages.length - 1 && (
                    <span
                      className={cn(
                        "absolute top-10 left-[19px] h-[calc(100%-2.5rem)] w-0.5",
                        done ? "bg-primary" : "bg-border",
                      )}
                    />
                  )}
                  <span
                    className={cn(
                      "z-10 grid size-10 shrink-0 place-items-center rounded-full border-2 transition-colors",
                      done
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground",
                      active && "ring-4 ring-primary/20",
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <div className="pt-1.5">
                    <p className={cn("font-medium", !done && "text-muted-foreground")}>{s.label}</p>
                    <p className="text-sm text-muted-foreground">{s.note}</p>
                    {at && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {new Date(at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        <aside className="space-y-6">
          <div className="surface-card overflow-hidden">
            <div className="relative h-44 bg-[radial-gradient(circle_at_30%_30%,var(--color-secondary),var(--color-muted))]">
              <svg viewBox="0 0 300 160" className="absolute inset-0 size-full opacity-40">
                <path d="M10 140 L80 100 L150 120 L220 60 L290 30" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="6 6" className="text-primary" />
              </svg>
              <span
                className="absolute grid size-9 place-items-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-lift)] transition-all duration-1000"
                style={{ left: `${10 + progress * 0.72}%`, top: `${72 - progress * 0.35}%` }}
              >
                <Bike className="size-4" />
              </span>
              <span className="absolute right-4 bottom-3 rounded-full bg-card/90 px-3 py-1 text-[0.7rem] font-semibold">
                Live partner location (demo)
              </span>
            </div>
            <div className="p-5">
              <p className="eyebrow">Delivery partner</p>
              {rider ? (
                <>
                  <p className="mt-2 font-medium">{rider.name}</p>
                  <p className="text-sm text-muted-foreground">{rider.vehicle} · {rider.phone}</p>
                </>
              ) : (
                <p className="mt-2 text-sm text-muted-foreground">Not yet assigned.</p>
              )}
              <p className="mt-3 rounded-lg bg-secondary p-3 text-sm">
                Delivery OTP: <strong className="font-display text-lg tracking-widest">{order.otp}</strong>
                <span className="block text-xs text-muted-foreground">Share only when you receive the parcel.</span>
              </p>
            </div>
          </div>

          <div className="surface-card p-5">
            <p className="eyebrow">Order details</p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {order.items.map((i) => (
                <li key={i.productId} className="flex justify-between">
                  <span className="text-muted-foreground">{i.name} × {i.qty}</span>
                  <span>{formatINR(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
            {order.notes && (
              <p className="mt-3 rounded-lg bg-accent/10 p-3 text-xs">
                <strong>Your note:</strong> {order.notes}
              </p>
            )}
            <div className="mt-3 flex justify-between border-t border-border pt-3 font-semibold">
              <span>Total ({order.paymentStatus})</span>
              <span>{formatINR(order.total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
