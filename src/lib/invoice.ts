import { brand, formatINR } from "@/lib/shop-data";
import type { Order } from "@/lib/shop-store";

/** Builds a printable tax-invoice HTML document and opens the print dialog. */
export function printInvoice(order: Order, kind: "invoice" | "packing" = "invoice") {
  const date = new Date(order.createdAt).toLocaleString("en-IN");
  const rows = order.items
    .map(
      (i, n) => `<tr>
        <td>${n + 1}</td>
        <td>${i.name}</td>
        <td class="r">${i.qty}</td>
        <td class="r">${formatINR(i.price)}</td>
        <td class="r">${formatINR(i.price * i.qty)}</td>
      </tr>`,
    )
    .join("");

  const money = `
    <tr><td colspan="4" class="r">Subtotal</td><td class="r">${formatINR(order.subtotal)}</td></tr>
    ${order.discount ? `<tr><td colspan="4" class="r">Discount ${order.couponCode ? `(${order.couponCode})` : ""}</td><td class="r">− ${formatINR(order.discount)}</td></tr>` : ""}
    <tr><td colspan="4" class="r">Delivery</td><td class="r">${order.deliveryFee ? formatINR(order.deliveryFee) : "Free"}</td></tr>
    <tr><td colspan="4" class="r">GST on fresh poultry (nil-rated)</td><td class="r">${formatINR(0)}</td></tr>
    <tr class="tot"><td colspan="4" class="r">Total payable</td><td class="r">${formatINR(order.total)}</td></tr>`;

  const html = `<!doctype html><html><head><meta charset="utf-8" />
  <title>${kind === "invoice" ? "Tax Invoice" : "Packing Slip"} ${order.id}</title>
  <style>
    *{box-sizing:border-box} body{font-family:ui-sans-serif,system-ui,Arial;margin:0;padding:32px;color:#1e1b16}
    h1{font-size:20px;margin:0 0 2px} .muted{color:#6b6459;font-size:12px;line-height:1.6}
    .head{display:flex;justify-content:space-between;gap:24px;border-bottom:2px solid #1e1b16;padding-bottom:16px}
    .grid{display:flex;gap:32px;margin:20px 0}
    table{width:100%;border-collapse:collapse;margin-top:12px;font-size:13px}
    th,td{border-bottom:1px solid #e6e1d8;padding:8px 6px;text-align:left}
    th{background:#f6f3ec;font-size:11px;text-transform:uppercase;letter-spacing:.08em}
    .r{text-align:right} .tot td{font-weight:700;border-top:2px solid #1e1b16}
    .note{margin-top:24px;font-size:11px;color:#6b6459;line-height:1.7;border-top:1px dashed #cfc8bb;padding-top:12px}
    .big{font-size:28px;font-weight:800;letter-spacing:.04em}
  </style></head><body>
  <div class="head">
    <div>
      <h1>${brand.legalName}</h1>
      <p class="muted">${brand.address}<br/>FSSAI: ${brand.fssai} · GSTIN: ${brand.gstin}<br/>${brand.phone} · ${brand.email}</p>
    </div>
    <div style="text-align:right">
      <h1>${kind === "invoice" ? "TAX INVOICE" : "PACKING SLIP"}</h1>
      <p class="muted">Invoice No: INV-${order.id}<br/>Order ID: ${order.id}<br/>Date: ${date}<br/>Place of supply: ${order.address.city}</p>
    </div>
  </div>
  <div class="grid">
    <div style="flex:1"><p class="muted"><strong>Billed &amp; shipped to</strong><br/>${order.address.name}<br/>${order.address.line1}<br/>${order.address.city} — ${order.address.pincode}<br/>${order.address.phone}</p></div>
    <div style="flex:1"><p class="muted"><strong>Delivery</strong><br/>${order.date} · ${order.slot}<br/>Payment: ${order.payment.toUpperCase()} (${order.paymentStatus})<br/>Delivery OTP: <span class="big">${order.otp}</span></p></div>
  </div>
  ${order.notes ? `<p class="muted"><strong>Customer note:</strong> ${order.notes}</p>` : ""}
  <table><thead><tr><th>#</th><th>Item</th><th class="r">Qty</th><th class="r">Rate</th><th class="r">Amount</th></tr></thead>
  <tbody>${rows}${kind === "invoice" ? money : ""}</tbody></table>
  <p class="note">
    ${kind === "invoice" ? "This is a computer-generated invoice and does not require a signature. Fresh, chilled, unbranded poultry and eggs are nil-rated under GST; any taxable item is shown separately above." : "Verify item count and weight against this slip before sealing. Cold-chain check required at dispatch."}<br/>
    Perishable goods — no returns after acceptance. Quality complaints must be raised within 2 hours of delivery with photographs. Governed by the laws of India; disputes subject to the jurisdiction of the courts at Your City. Grievance Officer: Placeholder Name, ${brand.email}.
  </p>
  <script>window.onload=function(){window.print()}<\/script>
  </body></html>`;

  const w = window.open("", "_blank", "width=900,height=1000");
  if (!w) return false;
  w.document.write(html);
  w.document.close();
  return true;
}
