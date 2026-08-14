import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentDialog } from "@/components/payment-dialog";
import { brand, deliveryZones, formatINR, paymentMethods, products, timeSlots } from "@/lib/shop-data";
import { useShop } from "@/lib/shop-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, follow" },
      { title: "Checkout — Schedule Your Fresh Chicken Delivery" },
      {
        name: "description",
        content: "Pay by UPI, card, net banking or cash on delivery. Choose your delivery date and time slot.",
      },
      { property: "og:title", content: "Checkout" },
      { property: "og:description", content: "Schedule your delivery slot and pay your way." },
    ],
  }),
  component: Checkout,
});

function todayISO(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

function Checkout() {
  const navigate = useNavigate();
  const { cart, cartSubtotal, addresses, addAddress, placeOrder, applyCoupon } = useShop();

  const [addressId, setAddressId] = useState(addresses[0]?.id ?? "");
  const [payment, setPayment] = useState<string>("upi");
  const [date, setDate] = useState(todayISO());
  const [slot, setSlot] = useState(timeSlots[1]!);
  const [notes, setNotes] = useState("");
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [applied, setApplied] = useState<string | undefined>(undefined);
  const [agree, setAgree] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [payOpen, setPayOpen] = useState(false);
  const [draft, setDraft] = useState({
    label: "Home",
    name: "",
    phone: "",
    line1: "",
    city: "Your City",
    pincode: "",
    zone: deliveryZones[0]!.area,
  });

  const deliveryFee = cartSubtotal - discount >= brand.freeDeliveryAbove ? 0 : brand.deliveryFee;
  const total = Math.max(0, cartSubtotal - discount + deliveryFee);
  const address = addresses.find((a) => a.id === addressId);
  const belowMin = cartSubtotal < brand.minOrder;

  if (cart.length === 0) {
    return (
      <div className="container-page py-24 text-center">
        <h1 className="text-3xl">Nothing to check out</h1>
        <Button className="mt-6" onClick={() => navigate({ to: "/products" })}>
          Browse products
        </Button>
      </div>
    );
  }

  return (
    <div className="container-page py-14">
      <h1 className="text-4xl">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-6">
          <section className="surface-card p-6">
            <p className="eyebrow">1 · Delivery address</p>
            <div className="mt-4 space-y-3">
              {addresses.map((a) => (
                <label
                  key={a.id}
                  className={cn(
                    "flex cursor-pointer gap-3 rounded-xl border border-border p-4 transition-colors",
                    addressId === a.id && "border-primary bg-primary/5",
                  )}
                >
                  <input
                    type="radio"
                    className="mt-1 accent-[var(--color-primary)]"
                    checked={addressId === a.id}
                    onChange={() => setAddressId(a.id)}
                  />
                  <div className="text-sm">
                    <p className="font-semibold">
                      {a.label} · {a.name}
                    </p>
                    <p className="text-muted-foreground">
                      {a.line1}, {a.city} — {a.pincode}
                    </p>
                    <p className="text-muted-foreground">
                      {a.phone} · {a.zone}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            {showNew ? (
              <div className="mt-4 grid gap-3 rounded-xl border border-dashed border-border p-4 sm:grid-cols-2">
                <div>
                  <Label>Label</Label>
                  <Input value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} />
                </div>
                <div>
                  <Label>Full name</Label>
                  <Input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
                </div>
                <div>
                  <Label>Phone</Label>
                  <Input value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} />
                </div>
                <div>
                  <Label>Pincode</Label>
                  <Input value={draft.pincode} onChange={(e) => setDraft({ ...draft, pincode: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Address</Label>
                  <Input value={draft.line1} onChange={(e) => setDraft({ ...draft, line1: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <Label>Zone</Label>
                  <Select value={draft.zone} onValueChange={(v) => setDraft({ ...draft, zone: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {deliveryZones.map((z) => (
                        <SelectItem key={z.area} value={z.area}>{z.area}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 sm:col-span-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      if (!draft.name || !draft.phone || !draft.line1) {
                        toast.error("Name, phone and address are required.");
                        return;
                      }
                      addAddress(draft);
                      setShowNew(false);
                      toast.success("Address saved");
                    }}
                  >
                    Save address
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => setShowNew(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button variant="outline" size="sm" className="mt-4" onClick={() => setShowNew(true)}>
                + Add a new address
              </Button>
            )}
          </section>

          <section className="surface-card p-6">
            <p className="eyebrow">2 · Schedule delivery</p>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Delivery date</Label>
                <Input type="date" min={todayISO()} max={todayISO(6)} value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div>
                <Label>Preferred time slot</Label>
                <Select value={slot} onValueChange={setSlot}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4">
              <Label>Order notes</Label>
              <Textarea
                placeholder='e.g. "Cut into small pieces", "Remove skin", "Ring the bell twice"'
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={300}
              />
            </div>
          </section>

          <section className="surface-card p-6">
            <p className="eyebrow">3 · Payment method</p>
            <RadioGroup value={payment} onValueChange={setPayment} className="mt-4 grid gap-3 sm:grid-cols-2">
              {paymentMethods.map((m) => (
                <label
                  key={m.id}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border border-border p-4 text-sm transition-colors",
                    payment === m.id && "border-primary bg-primary/5",
                  )}
                >
                  <RadioGroupItem value={m.id} />
                  <div>
                    <p className="font-semibold">{m.label}</p>
                    <p className="text-xs text-muted-foreground">{m.hint}</p>
                  </div>
                </label>
              ))}
            </RadioGroup>
            <p className="mt-4 text-xs text-muted-foreground">
              Demo mode: no real money moves. In production, online payments are processed by a
              PCI-DSS compliant Indian gateway and card details never touch our servers.
            </p>
          </section>
        </div>

        <aside className="surface-card h-fit p-6">
          <p className="eyebrow">Order summary</p>
          <div className="mt-4 space-y-2 text-sm">
            {cart.map((c) => {
              const p = products.find((x) => x.id === c.productId)!;
              return (
                <div key={c.productId} className="flex justify-between gap-3">
                  <span className="text-muted-foreground">
                    {p.name} × {c.qty}
                  </span>
                  <span>{formatINR(p.price * c.qty)}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex gap-2">
            <Input placeholder="Coupon code" value={code} onChange={(e) => setCode(e.target.value)} />
            <Button
              variant="outline"
              onClick={() => {
                const res = applyCoupon(code, cartSubtotal);
                if (res.ok) {
                  setDiscount(res.discount);
                  setApplied(code.trim().toUpperCase());
                  toast.success(res.message);
                } else {
                  setDiscount(0);
                  setApplied(undefined);
                  toast.error(res.message);
                }
              }}
            >
              Apply
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Try FIRST100, FRESH10 or SUNDAY15.</p>

          <div className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatINR(cartSubtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-success">
                <span>Discount {applied}</span>
                <span>− {formatINR(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery</span>
              <span>{deliveryFee ? formatINR(deliveryFee) : "Free"}</span>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>GST (fresh poultry, nil-rated)</span>
              <span>{formatINR(0)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-3 font-display text-lg">
              <span>Total</span>
              <span>{formatINR(total)}</span>
            </div>
          </div>

          <label className="mt-5 flex items-start gap-2 text-xs text-muted-foreground">
            <Checkbox checked={agree} onCheckedChange={(v) => setAgree(Boolean(v))} className="mt-0.5" />
            <span>
              I agree to the Terms &amp; Conditions, Privacy Policy and the Cancellation &amp; Refund
              Policy, and confirm that perishable food items cannot be returned once accepted.
            </span>
          </label>

          <Button
            size="lg"
            className="mt-4 w-full"
            disabled={belowMin || !agree || !address}
            onClick={() => setPayOpen(true)}
          >
            {payment === "cod" ? "Place order (COD)" : `Pay ${formatINR(total)}`}
          </Button>
          {belowMin && (
            <p className="mt-2 text-center text-xs text-destructive">
              Minimum order value ₹{brand.minOrder}.
            </p>
          )}

          <PaymentDialog
            open={payOpen}
            onOpenChange={setPayOpen}
            method={payment}
            amount={total}
            onPaid={() => {
              if (!address) return;
              const order = placeOrder({
                address,
                payment,
                slot,
                date,
                notes,
                couponCode: applied,
                discount,
              });
              setPayOpen(false);
              toast.success(`Order ${order.id} placed — invoice sent on WhatsApp & email`);
              navigate({ to: "/track/$orderId", params: { orderId: order.id } });
            }}
          />
        </aside>
      </div>
    </div>
  );
}
