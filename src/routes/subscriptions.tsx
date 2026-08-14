import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatINR, subscriptionPlans } from "@/lib/shop-data";
import { useShop } from "@/lib/shop-store";
import { Reveal } from "@/lib/motion";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/subscriptions")({
  head: () => ({
    meta: [
      { property: "og:url", content: "/subscriptions" },
      { title: "Chicken Subscription Plans — Weekly & Alternate Day Delivery" },
      { name: "description", content: "Weekly Sunday, weekly Wednesday or alternate-day fresh chicken deliveries. Pause, skip or auto-renew anytime." },
      { property: "og:title", content: "Chicken Subscription Plans" },
      { property: "og:description", content: "Fresh chicken on a schedule. Pause or skip anytime." },
    ],
    links: [{ rel: "canonical", href: "/subscriptions" }],
  }),
  component: Subscriptions,
});

function Subscriptions() {
  const { subscribe } = useShop();
  return (
    <div className="container-page section-y">
      <PageHeader
        eyebrow="Subscriptions"
        title="Fresh chicken, on a schedule"
        description="Set it once and stop thinking about it. Pause, skip a delivery or cancel at any time — no lock-in, no cancellation fee. Charges are raised only for cycles that are actually delivered."
      />

      <div className="mt-12 grid items-stretch gap-5 md:grid-cols-3">
        {subscriptionPlans.map((p, i) => (
          <Reveal key={p.id} delay={i * 90} className="surface-card card-lift flex h-full flex-col p-6 text-center">
            <p className="eyebrow">{p.cadence}</p>
            <h2 className="mt-2 font-display text-2xl">{p.name}</h2>
            <p className="mt-3 font-display text-3xl">{formatINR(p.price)}</p>
            <p className="text-xs text-muted-foreground">per billing cycle</p>
            <ul className="mx-auto mt-5 flex-1 space-y-2 text-left text-sm text-muted-foreground">
              {[p.perDelivery, p.savings, "Pause or skip any delivery", "Auto-renew, cancel anytime"].map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary" /> {f}
                </li>
              ))}
            </ul>
            <Button className="mt-6 press-fx sheen" onClick={() => { subscribe(p.id); toast.success(`Subscribed to ${p.name}`); }}>
              Start this plan
            </Button>
          </Reveal>
        ))}
      </div>

      <p className="mx-auto mt-10 max-w-2xl text-center text-xs text-muted-foreground">
        Recurring payments use an RBI-compliant e-mandate; you will be notified 24 hours before each
        debit and may cancel the mandate at any time.
      </p>
    </div>
  );
}
