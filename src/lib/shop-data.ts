import heroImg from "@/assets/hero-chicken.jpg";
import pWhole from "@/assets/p-whole.jpg";
import pCurry from "@/assets/p-curry.jpg";
import pBreast from "@/assets/p-breast.jpg";

export const heroImage = heroImg;

/** All business details are PLACEHOLDERS — replace before going live. */
export const brand = {
  name: "FarmFreshNow",
  legalName: "FarmFreshNow Foods Pvt. Ltd.",
  tagline: "Farm to Fresh. Always Fresh.",
  phone: "+91 90000 00000",
  whatsapp: "919000000000",
  email: "orders@anishclient-placeholder.in",
  address: "Shop No. 00, Placeholder Market Road, Your City, Your State 000000",
  gstin: "00AAAAA0000A1Z0 (placeholder)",
  fssai: "10000000000000 (placeholder)",
  cin: "U00000XX0000PTC000000 (placeholder)",
  hours: "Mon–Sun, 6:00 AM – 9:00 PM",
  mapQuery: "Placeholder+Market+Road+Your+City",
  minOrder: 299,
  deliveryFee: 39,
  freeDeliveryAbove: 799,
  gstRate: 0, // Fresh (non-frozen, unbranded-cut) poultry is nil-rated; packaged items may attract GST.
} as const;

export const deliveryZones = [
  {
    id: "A",
    area: "Zone A — Central (placeholder)",
    slots: "7:00 AM – 11:00 AM",
    eta: "Same day",
    pincodes: ["000001", "000002", "000003"],
    note: "Closest to the cutting unit — earliest morning slot.",
  },
  {
    id: "B",
    area: "Zone B — North & East (placeholder)",
    slots: "11:00 AM – 3:00 PM",
    eta: "Same day",
    pincodes: ["000011", "000012", "000013"],
    note: "Midday run, two-hour window confirmed on WhatsApp.",
  },
  {
    id: "C",
    area: "Zone C — South & West (placeholder)",
    slots: "4:00 PM – 8:00 PM",
    eta: "Same day",
    pincodes: ["000021", "000022", "000023"],
    note: "Evening run for orders placed before 5:00 PM.",
  },
  {
    id: "D",
    area: "Zone D — Outskirts (placeholder)",
    slots: "8:00 AM – 12:00 PM",
    eta: "Next day",
    pincodes: ["000031", "000032"],
    note: "Dispatched next morning with extra gel packs.",
  },
];

/** Returns the serviceable zone for a pincode, or null. Placeholder data. */
export function findZoneByPincode(pincode: string) {
  const p = pincode.trim();
  return deliveryZones.find((z) => z.pincodes.includes(p)) ?? null;
}


export type Product = {
  id: string;
  name: string;
  category: "Cuts" | "Eggs" | "Combos";
  unit: string;
  weightGrams: number;
  price: number;
  mrp?: number;
  image: string;
  short: string;
  description: string;
  stock: number;
  rating: number;
  reviews: number;
  tags?: string[];
};

export const products: Product[] = [
  {
    id: "whole-chicken",
    name: "Fresh Whole Chicken",
    category: "Cuts",
    unit: "1 kg (skinless, dressed)",
    weightGrams: 1000,
    price: 249,
    mrp: 289,
    image: pWhole,
    short: "Whole dressed bird, cleaned and skin removed.",
    description:
      "Farm-sourced broiler, dressed the same morning. Net weight after cleaning is approximately 1000 g (±30 g). Can be delivered whole or cut to your preference — add a note at checkout.",
    stock: 40,
    rating: 4.8,
    reviews: 214,
    tags: ["Bestseller"],
  },
  {
    id: "curry-cut",
    name: "Curry Cut (with bone)",
    category: "Cuts",
    unit: "500 g / 1 kg",
    weightGrams: 500,
    price: 149,
    mrp: 175,
    image: pCurry,
    short: "Classic 12–14 piece bone-in cut for gravies.",
    description:
      "Medium bone-in pieces, ideal for curry, biryani and korma. Trimmed of excess fat, washed in chilled potable water and packed at 0–4 °C.",
    stock: 65,
    rating: 4.9,
    reviews: 388,
    tags: ["Most loved"],
  },
  {
    id: "boneless-breast",
    name: "Boneless Breast",
    category: "Cuts",
    unit: "500 g",
    weightGrams: 500,
    price: 219,
    image: pBreast,
    short: "Lean, high-protein fillets. Zero bone, zero skin.",
    description:
      "Hand-trimmed breast fillets — approximately 26 g protein per 100 g. Perfect for grills, tikka and salads.",
    stock: 30,
    rating: 4.7,
    reviews: 162,
    tags: ["High protein"],
  },
  {
    id: "boneless-leg",
    name: "Boneless Leg",
    category: "Cuts",
    unit: "500 g",
    weightGrams: 500,
    price: 199,
    image: pCurry,
    short: "Juicier dark meat, deboned and cubed.",
    description:
      "Deboned thigh and drumstick meat cut into 25–30 mm cubes. Holds up beautifully in curries and skewers.",
    stock: 26,
    rating: 4.8,
    reviews: 121,
  },
  {
    id: "mince-keema",
    name: "Mince (Keema)",
    category: "Cuts",
    unit: "500 g",
    weightGrams: 500,
    price: 189,
    image: pBreast,
    short: "Freshly ground, coarse grind, no fillers.",
    description:
      "Ground fresh on order from lean cuts. No added fat, no binders, no preservatives. Use within 24 hours of delivery.",
    stock: 22,
    rating: 4.6,
    reviews: 96,
  },
  {
    id: "farm-eggs",
    name: "Farm Eggs",
    category: "Eggs",
    unit: "Tray of 30",
    weightGrams: 1800,
    price: 219,
    mrp: 240,
    image: pWhole,
    short: "Antibiotic-residue-free table eggs.",
    description: "Collected within 24 hours, candled and graded. Tray of 30 in a shock-safe carton.",
    stock: 54,
    rating: 4.7,
    reviews: 73,
  },
  {
    id: "combo-family",
    name: "Family Combo Pack",
    category: "Combos",
    unit: "1 kg curry cut + 500 g boneless + 6 eggs",
    weightGrams: 1900,
    price: 599,
    mrp: 707,
    image: pCurry,
    short: "A week of protein for a family of four.",
    description:
      "Our most popular bundle: 1 kg curry cut, 500 g boneless leg and half a dozen farm eggs, packed in separate food-grade pouches.",
    stock: 18,
    rating: 4.9,
    reviews: 143,
    tags: ["Save ₹108"],
  },
  {
    id: "combo-grill",
    name: "Grill & Tikka Combo",
    category: "Combos",
    unit: "500 g breast + 500 g leg + masala",
    weightGrams: 1050,
    price: 449,
    mrp: 498,
    image: pBreast,
    short: "Weekend barbecue, sorted.",
    description: "Boneless breast and leg cubes with a 50 g house tikka masala sachet.",
    stock: 14,
    rating: 4.8,
    reviews: 58,
  },
];

export type PlanId = "weekly-sun" | "weekly-wed" | "alternate";

export const subscriptionPlans = [
  {
    id: "weekly-sun" as PlanId,
    name: "Every Sunday",
    cadence: "Weekly · Sunday morning",
    price: 549,
    perDelivery: "1 kg curry cut + 6 eggs",
    savings: "8% off every delivery",
  },
  {
    id: "weekly-wed" as PlanId,
    name: "Every Wednesday",
    cadence: "Weekly · Wednesday evening",
    price: 499,
    perDelivery: "500 g boneless + 500 g curry cut",
    savings: "8% off every delivery",
  },
  {
    id: "alternate" as PlanId,
    name: "Alternate Days",
    cadence: "Every 2 days",
    price: 1899,
    perDelivery: "500 g of your chosen cut",
    savings: "12% off + free delivery",
  },
];

export const coupons: Record<string, { type: "percent" | "flat"; value: number; label: string; min: number }> = {
  FIRST100: { type: "flat", value: 100, label: "₹100 off your first order", min: 399 },
  FRESH10: { type: "percent", value: 10, label: "10% off", min: 299 },
  SUNDAY15: { type: "percent", value: 15, label: "15% off Sunday orders", min: 599 },
};

export const paymentMethods = [
  { id: "upi", label: "UPI", hint: "GPay · PhonePe · Paytm (demo)" },
  { id: "card", label: "Credit / Debit Card", hint: "Visa · Mastercard · RuPay (demo)" },
  { id: "netbanking", label: "Net Banking", hint: "All major Indian banks (demo)" },
  { id: "cod", label: "Cash on Delivery", hint: "Pay the rider on arrival" },
] as const;

export const timeSlots = [
  "6:00 AM – 8:00 AM",
  "8:00 AM – 11:00 AM",
  "11:00 AM – 2:00 PM",
  "2:00 PM – 5:00 PM",
  "5:00 PM – 8:00 PM",
];

export const orderStages = [
  { key: "confirmed", label: "Order Confirmed", note: "We have received your order." },
  { key: "preparing", label: "Chicken Being Freshly Cut", note: "Your cut is being prepared to order." },
  { key: "packed", label: "Order Packed", note: "Sealed, chilled and weighed." },
  { key: "picked", label: "Picked Up by Delivery Partner", note: "Your rider has collected the order." },
  { key: "ontheway", label: "Out for Delivery", note: "Your order is on the way." },
  { key: "delivered", label: "Delivered", note: "Delivered with OTP verification." },
] as const;

export type StageKey = (typeof orderStages)[number]["key"];

export const riders = [
  { id: "R-01", name: "Rider One (placeholder)", phone: "+91 90000 00001", vehicle: "MH 00 AA 0001" },
  { id: "R-02", name: "Rider Two (placeholder)", phone: "+91 90000 00002", vehicle: "MH 00 AA 0002" },
  { id: "R-03", name: "Rider Three (placeholder)", phone: "+91 90000 00003", vehicle: "MH 00 AA 0003" },
];

export const faqs = [
  {
    q: "Is the chicken fresh or frozen?",
    a: "Always fresh, never frozen. Birds are dressed the same morning and delivered within hours at 0–4 °C. We do not use any frozen or thawed stock.",
  },
  {
    q: "What are your delivery timings?",
    a: `${brand.hours}. You choose a slot at checkout; same-day delivery is available for orders placed before 5:00 PM in most zones.`,
  },
  {
    q: "What is your return and refund policy?",
    a: "Because this is a perishable food product, we do not accept returns once delivered. If you are unhappy with quality, refuse the parcel at the door or report it with a photo within 2 hours of delivery — we will replace it or refund to source within 5–7 business days.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "UPI, credit and debit cards, net banking, and cash on delivery. Online payments are processed by a PCI-DSS compliant Indian payment gateway; we never store your card details.",
  },
  {
    q: "How is the chicken packed?",
    a: "Food-grade, leak-proof pouches, vacuum-sealed where applicable, inside an insulated box with gel ice packs. Every parcel carries a tamper-evident seal with pack date and time.",
  },
  {
    q: "What hygiene practices do you follow?",
    a: "FSSAI-licensed processing, daily temperature logs, potable-water washing, sanitised stainless steel surfaces, gloves and hairnets for all handlers, and monthly third-party microbiological testing.",
  },
  {
    q: "Do you charge GST?",
    a: "Fresh, chilled poultry sold unbranded is nil-rated under GST. Packaged and branded items, if any, are taxed at the applicable rate and shown separately on your tax invoice.",
  },
];

export const testimonials = [
  {
    name: "Customer A (placeholder)",
    area: "Zone A",
    rating: 5,
    text: "Cut exactly as requested and delivered inside the slot. The tracking page told me when the rider left.",
  },
  {
    name: "Customer B (placeholder)",
    area: "Zone B",
    rating: 5,
    text: "Genuinely fresh — no smell, no water weight. The keema is the best I've had at home.",
  },
  {
    name: "Customer C (placeholder)",
    area: "Zone C",
    rating: 4,
    text: "Subscription for Sundays is very convenient. Skipped one week in two taps.",
  },
];

export const blogPosts = [
  {
    slug: "how-to-store-fresh-chicken",
    title: "How to Store Fresh Chicken Safely at Home",
    excerpt: "The 0–4 °C rule, the 24-hour window, and how to freeze without wrecking texture.",
    readTime: "5 min read",
    date: "2026-07-28",
    body: [
      "Fresh chicken is safe in the coldest part of your refrigerator (0–4 °C) for up to 24 hours. Keep it in the original sealed pouch, placed on the lowest shelf so nothing drips onto other food.",
      "If you cannot cook it within a day, freeze it immediately at -18 °C. Portion it first: freezing in meal-sized packs means you never thaw more than you need, and thawed poultry must never be refrozen.",
      "Thaw in the refrigerator overnight, never on the counter. In a hurry, use a sealed bag submerged in cold water, changed every 30 minutes.",
      "Wash your hands, board and knife with soap after handling raw poultry, and keep a separate board for raw meat. Cook to an internal temperature of 74 °C.",
    ],
  },
  {
    slug: "fresh-vs-frozen-chicken",
    title: "Fresh vs Frozen Chicken: What Actually Changes",
    excerpt: "Texture, moisture loss, nutrition and price — an honest comparison.",
    readTime: "6 min read",
    date: "2026-07-14",
    body: [
      "Nutritionally, fresh and properly frozen chicken are close to identical. The real differences show up in texture and moisture.",
      "Ice crystals rupture muscle fibres during slow freezing, so thawed chicken releases more water in the pan — that is why frozen pieces steam instead of searing.",
      "Fresh chicken also carries a shorter, more transparent supply chain: you can ask when the bird was dressed. With frozen stock, that date is often months old.",
      "Frozen wins on convenience and price stability. Fresh wins on taste, texture and traceability — which is what we optimise for.",
    ],
  },
  {
    slug: "high-protein-chicken-guide",
    title: "A Simple Protein Guide for Indian Households",
    excerpt: "How much protein you need, and how chicken cuts compare gram for gram.",
    readTime: "4 min read",
    date: "2026-06-30",
    body: [
      "The ICMR recommends roughly 0.8–1 g of protein per kg of body weight per day for adults, higher if you train.",
      "Per 100 g raw: breast delivers about 26 g protein with very little fat; leg meat about 20 g with more fat and flavour; keema sits in between depending on the cut.",
      "A 500 g pack of boneless breast therefore covers most of an adult's daily protein for two days when split across meals.",
      "Pair with dal, curd or eggs across the day rather than loading everything into dinner — spread intake absorbs better.",
    ],
  },
  {
    slug: "weeknight-chicken-recipes",
    title: "Five Weeknight Chicken Recipes Under 30 Minutes",
    excerpt: "Pepper fry, dhaba-style curry, tawa tikka, keema pav and a lemon-coriander grill.",
    readTime: "7 min read",
    date: "2026-06-12",
    body: [
      "Pepper fry: sear curry cut in hot oil, add crushed pepper, curry leaves and a splash of water. Twenty minutes, one pan.",
      "Dhaba-style curry: onion-tomato masala, whole spices bloomed in ghee, curry cut simmered covered for 18 minutes.",
      "Tawa tikka: cube boneless breast, marinate in curd, ginger-garlic and chilli for 15 minutes, then blister on a hot tawa.",
      "Keema pav: brown keema hard before adding masala — that crust is the whole dish.",
      "Lemon-coriander grill: boneless leg, lemon juice, coriander paste, 12 minutes over high heat, rest 5 minutes.",
    ],
  },
];

export function formatINR(value: number) {
  return "₹" + value.toLocaleString("en-IN", { maximumFractionDigits: 2 });
}
