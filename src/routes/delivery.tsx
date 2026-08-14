import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatINR, orderStages, riders } from "@/lib/shop-data";
import { useShop } from "@/lib/shop-store";
import { PageHeader } from "@/components/page-header";

export const Route = createFileRoute("/delivery")({
  head: () => ({
    meta: [
      { property: "og:url", content: "/delivery" },
      { title: "Delivery Partner Panel — Routes, GPS & OTP Verification" },
      { name: "description", content: "Rider panel: assigned orders, optimised route, live status updates and OTP-verified delivery." },
      { property: "og:title", content: "Delivery Partner Panel" },
      { property: "og:description", content: "Assigned orders, route order and OTP-verified handover." },
    ],
    links: [{ rel: "canonical", href: "/delivery" }],
  }),
  component: Delivery,
});

function Delivery() {
  const { orders, setStage } = useShop();
  const [riderId, setRiderId] = useState(riders[0]!.id);
  const [otp, setOtp] = useState<Record<string, string>>({});
  const mine = orders.filter((o) => o.riderId === riderId && o.adminStatus === "accepted");

  return (
    <div className="container-page section-y">
      <PageHeader
        eyebrow="Delivery management"
        title="Partner panel"
        description="Pick a rider to see their assigned stops, optimised route and OTP-verified handovers."
      />

      <div className="mt-10 flex flex-wrap justify-center gap-2">
        {riders.map((r) => (
          <Button key={r.id} size="sm" variant={riderId === r.id ? "default" : "outline"} onClick={() => setRiderId(r.id)}>
            {r.name}
          </Button>
        ))}
      </div>

      <div className="mt-8 grid items-stretch gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Assigned today", value: mine.length },
          { label: "Delivered", value: mine.filter((o) => o.stage === "delivered").length },
          { label: "On-time rate", value: "96%" },
          { label: "Avg. delivery time", value: "28 min" },
        ].map((s) => (
          <div key={s.label} className="surface-card card-lift h-full p-5 text-center">
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="mt-1 font-display text-2xl">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-4">
          {mine.length === 0 && (
            <div className="surface-card flex min-h-64 flex-col items-center justify-center p-10 text-center">
              <p className="font-display text-lg">No stops assigned yet</p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                This rider has no accepted orders on the route right now. Assign one from the Admin
                dashboard and it will appear here instantly.
              </p>
            </div>
          )}
          {mine.map((o, i) => (
            <div key={o.id} className="surface-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg">Stop {i + 1} · {o.id}</p>
                  <p className="text-sm text-muted-foreground">
                    {o.address.name} · {o.address.phone}
                    <br />
                    {o.address.line1}, {o.address.city} — {o.address.pincode}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {o.slot} · {formatINR(o.total)} · {o.paymentStatus}
                  </p>
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
                  {orderStages.find((s) => s.key === o.stage)?.label}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                <Button size="sm" variant="outline" onClick={() => setStage(o.id, "picked")}>Mark picked up</Button>
                <Button size="sm" variant="outline" onClick={() => setStage(o.id, "ontheway")}>Start delivery</Button>
                <Input
                  className="w-32"
                  placeholder="Delivery OTP"
                  value={otp[o.id] ?? ""}
                  onChange={(e) => setOtp({ ...otp, [o.id]: e.target.value })}
                />
                <Button
                  size="sm"
                  onClick={() => {
                    if ((otp[o.id] ?? "") !== o.otp) {
                      toast.error("Incorrect OTP. Ask the customer for the 4-digit code.");
                      return;
                    }
                    setStage(o.id, "delivered");
                    toast.success("Delivered and verified");
                  }}
                >
                  Verify & complete
                </Button>
                <a
                  className="text-sm text-muted-foreground underline"
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.address.line1 + " " + o.address.city)}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Navigate
                </a>
              </div>
            </div>
          ))}
        </div>

        <aside className="surface-card h-fit p-6 lg:sticky lg:top-28">
          <p className="eyebrow">Optimised route</p>
          <ol className="mt-4 space-y-3 text-sm">
            {mine.map((o, i) => (
              <li key={o.id} className="flex gap-3">
                <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary text-xs text-primary-foreground">{i + 1}</span>
                <span className="text-muted-foreground">{o.address.line1}, {o.address.pincode}</span>
              </li>
            ))}
            {mine.length === 0 && <li className="text-muted-foreground">Route empty.</li>}
          </ol>
          <p className="mt-4 text-xs text-muted-foreground">
            Stops are sequenced by pincode cluster and slot window. Live GPS is shared with the
            customer while the order is out for delivery.
          </p>
        </aside>
      </div>
    </div>
  );
}
