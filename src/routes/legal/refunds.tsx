import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/legal/refunds")({
  head: () => ({
    meta: [
      { property: "og:url", content: "/legal/refunds" },
      { title: "Cancellation & Refund Policy — FarmFreshNow" },
      { name: "description", content: "Because chicken is a perishable food product cut to order, orders can be cancelled free of charge until the order status moves to 'Chicken Being Fresh" },
      { property: "og:title", content: "Cancellation & Refund Policy" },
      { property: "og:description", content: "Because chicken is a perishable food product cut to order, orders can be cancelled free of charge until the order status moves to 'Chicken Being Fresh" },
    ],
    links: [{ rel: "canonical", href: "/legal/refunds" }],
  }),
  component: Page,
});

const paragraphs = [
  "Because chicken is a perishable food product cut to order, orders can be cancelled free of charge until the order status moves to 'Chicken Being Freshly Cut'. After that point cancellation is not possible and the order value is not refundable.",
  "Returns are not accepted once a delivery has been accepted at the door. You may refuse the parcel at the door if the seal is broken, the parcel is not cold, or the item is visibly not as described — a full refund is issued in that case.",
  "Quality complaints must be raised within 2 hours of delivery with photographs, via WhatsApp or email. Verified complaints are resolved by free replacement on the next delivery slot, or a full refund, at your choice.",
  "Approved refunds are credited to the original payment method within 5 to 7 business days. For cash-on-delivery orders, refunds are issued by UPI transfer to a number you confirm.",
  "Where an order is cancelled by us (stock, weather, serviceability or pricing error), the entire amount collected, including delivery charges, is refunded to source.",
  "Subscription plans can be paused, skipped or cancelled at any time from your account. Charges apply only to cycles that are actually delivered."
];

function Page() {
  return (
    <div className="container-page section-y">
      <div className="mx-auto max-w-2xl">
      <p className="eyebrow">Legal</p>
      <h1 className="mt-2 text-4xl">Cancellation & Refund Policy</h1>
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
