import { Clock, Loader2, MapPin, Search, XCircle, CheckCircle2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { brand, deliveryZones, findZoneByPincode } from "@/lib/shop-data";
import { cn } from "@/lib/utils";

type CheckState =
  | { status: "idle" }
  | { status: "checking" }
  | { status: "ok"; zone: (typeof deliveryZones)[number] }
  | { status: "none" };

export function DeliveryZonesPanel() {
  const [activeId, setActiveId] = useState(deliveryZones[0]!.id);
  const [pincode, setPincode] = useState("");
  const [check, setCheck] = useState<CheckState>({ status: "idle" });
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const active = deliveryZones.find((z) => z.id === activeId)!;

  function runCheck(e: React.FormEvent) {
    e.preventDefault();
    const p = pincode.trim();
    if (p.length < 6) return;
    setCheck({ status: "checking" });
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const zone = findZoneByPincode(p);
      if (zone) {
        setActiveId(zone.id);
        setCheck({ status: "ok", zone });
      } else {
        setCheck({ status: "none" });
      }
    }, 700);
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.15fr]">
      <div>
        <p className="eyebrow">Delivery areas &amp; timings</p>
        <h2 className="mt-3 text-[clamp(1.5rem,3vw,2rem)] leading-tight text-balance">We deliver across four zones</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Minimum order ₹{brand.minOrder}. Delivery ₹{brand.deliveryFee}, free above ₹
          {brand.freeDeliveryAbove}. Orders placed before 5:00 PM are eligible for same-day delivery
          in Zones A–C.
        </p>

        <form onSubmit={runCheck} className="mt-7 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)]">
          <label htmlFor="zone-pincode" className="text-xs font-bold tracking-[0.14em] uppercase">
            Enter pincode
          </label>
          <div className="mt-3 flex gap-2">
            <Input
              id="zone-pincode"
              value={pincode}
              inputMode="numeric"
              maxLength={6}
              placeholder="6-digit pincode"
              onChange={(e) => {
                setPincode(e.target.value.replace(/\D/g, ""));
                setCheck({ status: "idle" });
              }}
            />
            <Button type="submit" className="press-fx" disabled={pincode.trim().length < 6 || check.status === "checking"}>
              {check.status === "checking" ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
              Check
            </Button>
          </div>

          <div className="mt-3 min-h-10 text-sm" aria-live="polite">
            {check.status === "checking" && (
              <p className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Checking availability…
              </p>
            )}
            {check.status === "ok" && (
              <div className="pop-in">
                <p className="flex items-center gap-2 font-semibold text-success">
                  <CheckCircle2 className="size-4" /> Delivery available
                </p>
                <p className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="size-3.5" /> {check.zone.area} · {check.zone.slots} · {check.zone.eta}
                </p>
              </div>
            )}
            {check.status === "none" && (
              <p className="pop-in flex items-center gap-2 font-semibold text-destructive">
                <XCircle className="size-4" /> Not serviceable yet — message us to request your area.
              </p>
            )}
          </div>
        </form>
      </div>

      <div>
        <div className="grid gap-3 sm:grid-cols-2">
          {deliveryZones.map((z) => {
            const on = z.id === activeId;
            return (
              <button
                key={z.id}
                type="button"
                onClick={() => setActiveId(z.id)}
                aria-pressed={on}
                className={cn(
                  "press-fx card-lift h-full rounded-2xl border p-4 text-left",
                  on ? "border-primary/40 bg-card shadow-[var(--shadow-lift)]" : "border-border bg-card/70",
                )}
              >
                <span className="relative inline-grid size-9 place-items-center rounded-full bg-primary/10 text-primary">
                  <MapPin className="size-4" />
                  {on && (
                    <span aria-hidden className="absolute inset-0 rounded-full bg-primary/35 [animation:ffn-ping-soft_2.2s_ease-out_infinite]" />
                  )}
                </span>
                <p className="mt-3 text-sm font-semibold">Zone {z.id}</p>
                <p className="text-xs text-muted-foreground">{z.slots}</p>
              </button>
            );
          })}
        </div>

        <div key={active.id} className="surface-card mt-4 p-6 route-fade">
          <p className="font-display text-xl">{active.area}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
            <span className="rounded-full bg-secondary px-3 py-1">{active.slots}</span>
            <span className="rounded-full bg-primary px-3 py-1 text-primary-foreground">{active.eta}</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{active.note}</p>
          <p className="mt-3 text-xs text-muted-foreground">Pincodes: {active.pincodes.join(", ")}</p>
        </div>
      </div>
    </div>
  );
}
