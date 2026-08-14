import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  brand,
  coupons,
  orderStages,
  products,
  riders,
  subscriptionPlans,
  type PlanId,
  type StageKey,
} from "./shop-data";

export type CartItem = { productId: string; qty: number };

export type Address = {
  id: string;
  label: string;
  name: string;
  phone: string;
  line1: string;
  city: string;
  pincode: string;
  zone: string;
};

export type NotificationLog = {
  id: string;
  channel: "WhatsApp" | "SMS" | "Email";
  title: string;
  body: string;
  at: number;
  orderId?: string;
};

export type Order = {
  id: string;
  createdAt: number;
  items: { productId: string; name: string; qty: number; price: number }[];
  subtotal: number;
  discount: number;
  couponCode?: string | undefined;
  deliveryFee: number;
  total: number;
  payment: string;
  paymentStatus: "Paid" | "Pending (COD)";
  slot: string;
  date: string;
  notes: string;
  address: Address;
  adminStatus: "new" | "accepted" | "rejected";
  stage: StageKey;
  stageTimes: Partial<Record<StageKey, number>>;
  riderId?: string | undefined;
  delayNote?: string | undefined;
  otp: string;
  etaMinutes: number;
  pointsEarned: number;
  rated?: number | undefined;
};

export type Subscription = {
  id: string;
  planId: PlanId;
  status: "active" | "paused";
  nextDelivery: string;
  autoRenew: boolean;
  skips: string[];
};

type State = {
  cart: CartItem[];
  orders: Order[];
  addresses: Address[];
  favorites: string[];
  subscriptions: Subscription[];
  notifications: NotificationLog[];
  points: number;
  demoSpeed: boolean;
};

const defaultAddresses: Address[] = [
  {
    id: "addr-home",
    label: "Home",
    name: "Customer Name (placeholder)",
    phone: "+91 90000 00000",
    line1: "Flat 000, Placeholder Residency, Main Road",
    city: "Your City",
    pincode: "000000",
    zone: "Zone A — Central (placeholder)",
  },
  {
    id: "addr-office",
    label: "Office",
    name: "Customer Name (placeholder)",
    phone: "+91 90000 00000",
    line1: "3rd Floor, Placeholder Tower, Business Park",
    city: "Your City",
    pincode: "000001",
    zone: "Zone B — North & East (placeholder)",
  },
];

const initialState: State = {
  cart: [],
  orders: [],
  addresses: defaultAddresses,
  favorites: ["curry-cut"],
  subscriptions: [
    {
      id: "sub-1",
      planId: "weekly-sun",
      status: "active",
      nextDelivery: "Next Sunday, 8:00 AM – 11:00 AM",
      autoRenew: true,
      skips: [],
    },
  ],
  notifications: [],
  points: 240,
  demoSpeed: true,
};

const KEY = "anish-fresh-demo-v1";

type Ctx = State & {
  addToCart: (productId: string, qty?: number) => void;
  setQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  toggleFavorite: (productId: string) => void;
  addAddress: (a: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;
  placeOrder: (input: {
    address: Address;
    payment: string;
    slot: string;
    date: string;
    notes: string;
    couponCode?: string | undefined;
    discount: number;
  }) => Order;
  setAdminStatus: (id: string, status: "accepted" | "rejected") => void;
  advanceStage: (id: string) => void;
  setStage: (id: string, stage: StageKey) => void;
  assignRider: (id: string, riderId: string) => void;
  reportDelay: (id: string, reason: string) => void;
  reorder: (id: string) => void;
  rateOrder: (id: string, stars: number) => void;
  toggleSubscription: (id: string) => void;
  toggleAutoRenew: (id: string) => void;
  skipNext: (id: string) => void;
  subscribe: (planId: PlanId) => void;
  setDemoSpeed: (v: boolean) => void;
  applyCoupon: (code: string, subtotal: number) => { ok: boolean; discount: number; message: string };
};

const ShopContext = createContext<Ctx | null>(null);

function uid(prefix: string) {
  return prefix + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export function ShopProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...initialState, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state, hydrated]);

  const notify = useCallback((n: Omit<NotificationLog, "id" | "at">[]) => {
    setState((s) => ({
      ...s,
      notifications: [
        ...n.map((x) => ({ ...x, id: uid("N-"), at: Date.now() })),
        ...s.notifications,
      ].slice(0, 60),
    }));
  }, []);

  const addToCart = useCallback((productId: string, qty = 1) => {
    setState((s) => {
      const existing = s.cart.find((c) => c.productId === productId);
      return {
        ...s,
        cart: existing
          ? s.cart.map((c) => (c.productId === productId ? { ...c, qty: c.qty + qty } : c))
          : [...s.cart, { productId, qty }],
      };
    });
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    setState((s) => ({
      ...s,
      cart: qty <= 0 ? s.cart.filter((c) => c.productId !== productId) : s.cart.map((c) => (c.productId === productId ? { ...c, qty } : c)),
    }));
  }, []);

  const clearCart = useCallback(() => setState((s) => ({ ...s, cart: [] })), []);

  const toggleFavorite = useCallback((productId: string) => {
    setState((s) => ({
      ...s,
      favorites: s.favorites.includes(productId)
        ? s.favorites.filter((f) => f !== productId)
        : [...s.favorites, productId],
    }));
  }, []);

  const addAddress = useCallback((a: Omit<Address, "id">) => {
    setState((s) => ({ ...s, addresses: [...s.addresses, { ...a, id: uid("addr-") }] }));
  }, []);

  const removeAddress = useCallback((id: string) => {
    setState((s) => ({ ...s, addresses: s.addresses.filter((a) => a.id !== id) }));
  }, []);

  const cartSubtotal = useMemo(
    () =>
      state.cart.reduce((sum, c) => {
        const p = products.find((x) => x.id === c.productId);
        return sum + (p ? p.price * c.qty : 0);
      }, 0),
    [state.cart],
  );

  const cartCount = useMemo(() => state.cart.reduce((n, c) => n + c.qty, 0), [state.cart]);

  const applyCoupon = useCallback((code: string, subtotal: number) => {
    const c = coupons[code.trim().toUpperCase()];
    if (!c) return { ok: false, discount: 0, message: "Invalid coupon code." };
    if (subtotal < c.min)
      return { ok: false, discount: 0, message: `Requires a minimum cart of ₹${c.min}.` };
    const discount = c.type === "flat" ? c.value : Math.round((subtotal * c.value) / 100);
    return { ok: true, discount, message: `${c.label} applied.` };
  }, []);

  const placeOrder: Ctx["placeOrder"] = useCallback(
    (input) => {
      const items = state.cart.map((c) => {
        const p = products.find((x) => x.id === c.productId)!;
        return { productId: p.id, name: p.name, qty: c.qty, price: p.price };
      });
      const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
      const deliveryFee = subtotal - input.discount >= brand.freeDeliveryAbove ? 0 : brand.deliveryFee;
      const total = Math.max(0, subtotal - input.discount + deliveryFee);
      const order: Order = {
        id: uid("AC-"),
        createdAt: Date.now(),
        items,
        subtotal,
        discount: input.discount,
        couponCode: input.couponCode,
        deliveryFee,
        total,
        payment: input.payment,
        paymentStatus: input.payment === "cod" ? "Pending (COD)" : "Paid",
        slot: input.slot,
        date: input.date,
        notes: input.notes,
        address: input.address,
        adminStatus: "new",
        stage: "confirmed",
        stageTimes: { confirmed: Date.now() },
        otp: String(Math.floor(1000 + Math.random() * 9000)),
        etaMinutes: 55,
        pointsEarned: Math.floor(total / 10),
      };
      setState((s) => ({ ...s, orders: [order, ...s.orders], cart: [], points: s.points + order.pointsEarned }));
      notify([
        {
          channel: "WhatsApp",
          title: `Order ${order.id} confirmed`,
          body: `Thanks! Your order of ₹${order.total} is confirmed for ${order.date}, ${order.slot}. Invoice attached.`,
          orderId: order.id,
        },
        {
          channel: "Email",
          title: `Invoice INV-${order.id}`,
          body: `Tax invoice for order ${order.id} has been generated and emailed to you.`,
          orderId: order.id,
        },
        {
          channel: "SMS",
          title: `Payment ${order.paymentStatus}`,
          body: `${order.paymentStatus === "Paid" ? "Payment received" : "Cash on delivery"} · ₹${order.total}.`,
          orderId: order.id,
        },
      ]);
      return order;
    },
    [state.cart, notify],
  );

  const setStage = useCallback(
    (id: string, stage: StageKey) => {
      setState((s) => ({
        ...s,
        orders: s.orders.map((o) =>
          o.id === id
            ? {
                ...o,
                stage,
                stageTimes: { ...o.stageTimes, [stage]: Date.now() },
                etaMinutes: Math.max(
                  0,
                  55 - orderStages.findIndex((x) => x.key === stage) * 11,
                ),
                paymentStatus: stage === "delivered" ? "Paid" : o.paymentStatus,
              }
            : o,
        ),
      }));
      const info = orderStages.find((x) => x.key === stage)!;
      notify([
        {
          channel: stage === "delivered" ? "WhatsApp" : "SMS",
          title: `${id}: ${info.label}`,
          body: info.note,
          orderId: id,
        },
      ]);
      if (stage === "delivered") {
        notify([
          {
            channel: "Email",
            title: "How did we do?",
            body: `Rate your order ${id} and earn 20 bonus loyalty points.`,
            orderId: id,
          },
        ]);
      }
    },
    [notify],
  );

  const advanceStage = useCallback(
    (id: string) => {
      const order = state.orders.find((o) => o.id === id);
      if (!order) return;
      const idx = orderStages.findIndex((s) => s.key === order.stage);
      if (idx >= orderStages.length - 1) return;
      setStage(id, orderStages[idx + 1]!.key);
    },
    [state.orders, setStage],
  );

  const setAdminStatus = useCallback(
    (id: string, status: "accepted" | "rejected") => {
      setState((s) => ({ ...s, orders: s.orders.map((o) => (o.id === id ? { ...o, adminStatus: status } : o)) }));
      notify([
        {
          channel: "WhatsApp",
          title: `${id} ${status === "accepted" ? "accepted" : "rejected"}`,
          body:
            status === "accepted"
              ? "Your order has been accepted and sent to the cutting counter."
              : "Sorry — we could not accept this order. Any online payment is refunded to source within 5–7 business days.",
          orderId: id,
        },
      ]);
    },
    [notify],
  );

  const assignRider = useCallback(
    (id: string, riderId: string) => {
      setState((s) => ({ ...s, orders: s.orders.map((o) => (o.id === id ? { ...o, riderId } : o)) }));
      const rider = riders.find((r) => r.id === riderId);
      notify([
        {
          channel: "SMS",
          title: `${id}: delivery partner assigned`,
          body: `${rider?.name} (${rider?.vehicle}) will deliver your order. Delivery OTP required.`,
          orderId: id,
        },
      ]);
    },
    [notify],
  );

  const reportDelay = useCallback(
    (id: string, reason: string) => {
      setState((s) => ({
        ...s,
        orders: s.orders.map((o) => (o.id === id ? { ...o, delayNote: reason, etaMinutes: o.etaMinutes + 15 } : o)),
      }));
      notify([
        {
          channel: "WhatsApp",
          title: `${id}: slight delay`,
          body: `${reason} Your revised arrival window has been updated on the tracking page. Sorry for the wait.`,
          orderId: id,
        },
      ]);
    },
    [notify],
  );

  const reorder = useCallback((id: string) => {
    setState((s) => {
      const o = s.orders.find((x) => x.id === id);
      if (!o) return s;
      return { ...s, cart: o.items.map((i) => ({ productId: i.productId, qty: i.qty })) };
    });
  }, []);

  const rateOrder = useCallback((id: string, stars: number) => {
    setState((s) => ({
      ...s,
      points: s.points + 20,
      orders: s.orders.map((o) => (o.id === id ? { ...o, rated: stars } : o)),
    }));
  }, []);

  const toggleSubscription = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      subscriptions: s.subscriptions.map((x) =>
        x.id === id ? { ...x, status: x.status === "active" ? "paused" : "active" } : x,
      ),
    }));
  }, []);

  const toggleAutoRenew = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      subscriptions: s.subscriptions.map((x) => (x.id === id ? { ...x, autoRenew: !x.autoRenew } : x)),
    }));
  }, []);

  const skipNext = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      subscriptions: s.subscriptions.map((x) =>
        x.id === id ? { ...x, skips: [...x.skips, x.nextDelivery] } : x,
      ),
    }));
  }, []);

  const subscribe = useCallback((planId: PlanId) => {
    const plan = subscriptionPlans.find((p) => p.id === planId)!;
    setState((s) => ({
      ...s,
      subscriptions: [
        ...s.subscriptions,
        {
          id: uid("sub-"),
          planId,
          status: "active",
          nextDelivery: `${plan.cadence} (next cycle)`,
          autoRenew: true,
          skips: [],
        },
      ],
    }));
  }, []);

  const setDemoSpeed = useCallback((v: boolean) => setState((s) => ({ ...s, demoSpeed: v })), []);

  // Demo auto-progression so live tracking can be filmed without manual clicks.
  useEffect(() => {
    if (!state.demoSpeed) return;
    const t = setInterval(() => {
      setState((s) => {
        const target = s.orders.find((o) => o.adminStatus === "accepted" && o.stage !== "delivered");
        if (!target) return s;
        const idx = orderStages.findIndex((x) => x.key === target.stage);
        const next = orderStages[idx + 1];
        if (!next) return s;
        return {
          ...s,
          orders: s.orders.map((o) =>
            o.id === target.id
              ? {
                  ...o,
                  stage: next.key,
                  stageTimes: { ...o.stageTimes, [next.key]: Date.now() },
                  etaMinutes: Math.max(0, 55 - (idx + 1) * 11),
                  paymentStatus: next.key === "delivered" ? "Paid" : o.paymentStatus,
                }
              : o,
          ),
          notifications: [
            {
              id: uid("N-"),
              at: Date.now(),
              channel: next.key === "delivered" ? ("WhatsApp" as const) : ("SMS" as const),
              title: `${target.id}: ${next.label}`,
              body: next.note,
              orderId: target.id,
            },
            ...s.notifications,
          ].slice(0, 60),
        };
      });
    }, 9000);
    return () => clearInterval(t);
  }, [state.demoSpeed]);

  const value: Ctx = {
    ...state,
    addToCart,
    setQty,
    clearCart,
    cartCount,
    cartSubtotal,
    toggleFavorite,
    addAddress,
    removeAddress,
    placeOrder,
    setAdminStatus,
    advanceStage,
    setStage,
    assignRider,
    reportDelay,
    reorder,
    rateOrder,
    toggleSubscription,
    toggleAutoRenew,
    skipNext,
    subscribe,
    setDemoSpeed,
    applyCoupon,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside ShopProvider");
  return ctx;
}
