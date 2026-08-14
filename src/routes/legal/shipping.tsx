import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/legal/shipping")({
  head: () => ({
    meta: [
      { property: "og:url", content: "/legal/shipping" },
      { title: "Shipping & Delivery Policy — FarmFreshNow" },
      { name: "description", content: "We deliver only within our listed serviceable zones. Enter your pincode at checkout to confirm serviceability." },
      { property: "og:title", content: "Shipping & Delivery Policy" },
      { property: "og:description", content: "We deliver only within our listed serviceable zones. Enter your pincode at checkout to confirm serviceability." },
    ],
    links: [{ rel: "canonical", href: "/legal/shipping" }],
  }),
  component: Page,
});

const paragraphs = [
  "We deliver only within our listed serviceable zones. Enter your pincode at checkout to confirm serviceability.",
  "Same-day delivery is available in Zones A to C for orders placed before 5:00 PM. Zone D and later orders are delivered on the next available slot.",
  "Delivery charges are ₹39 per order and are waived on orders above ₹799. Minimum order value is ₹299.",
  "You choose a delivery date and a two-hour time window at checkout. Slot windows are best-effort; adverse weather, traffic and civic restrictions may cause delays, and you will receive a notification with a revised arrival window if that happens.",
  "All parcels travel in insulated boxes with gel packs to maintain 0-4 degrees Celsius, carry a tamper-evident seal, and are handed over only after OTP verification.",
  "If nobody is available to receive the parcel and the rider cannot reach you for 10 minutes, the order is returned to the shop. Perishable goods cannot be re-attempted and no refund is payable in that case."
];

function Page() {
  return (
    <div className="container-page section-y">
      <div className="mx-auto max-w-2xl">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-2 text-4xl">Shipping & Delivery Policy</h1>
      <p className="mt-2 text-xs text-muted-foreground">
        Last updated: 10 August 2026. Placeholder text prepared for an India-based food business —
        have it reviewed by a lawyer before you go live.
      </p>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-pretty text-muted-foreground">
        {paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      </div>
    </div>
  );
}
