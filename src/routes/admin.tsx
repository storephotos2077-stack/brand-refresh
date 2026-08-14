import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatINR, orderStages, products, riders } from "@/lib/shop-data";
import { printInvoice } from "@/lib/invoice";
import { useShop } from "@/lib/shop-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, follow" },
      { title: "Admin Dashboard — Orders, Sales & Inventory" },
      { name: "description", content: "Receive orders instantly, change status, assign riders, print invoices and track sales." },
      { property: "og:title", content: "Admin Dashboard" },
      { property: "og:description", content: "Live order desk, sales reports and inventory for the shop team." },
    ],
  }),
  component: Admin,
});

const delayReasons = [
  "Heavy rain in your area is slowing our rider down.",
  "Unexpected traffic on the delivery route.",
  "High order volume at the cutting counter right now.",
];

function Admin() {
  const { orders, setAdminStatus, setStage, assignRider, reportDelay, demoSpeed, setDemoSpeed, notifications } = useShop();
  const [query, setQuery] = useState("");

  const filtered = orders.filter(
    (o) =>
      o.id.toLowerCase().includes(query.toLowerCase()) ||
      o.address.name.toLowerCase().includes(query.toLowerCase()),
  );

  const revenue = orders.reduce((s, o) => s + (o.adminStatus === "rejected" ? 0 : o.total), 0);
  const delivered = orders.filter((o) => o.stage === "delivered").length;

  const byDay = useMemo(() => {
    const base = [
      { day: "Mon", orders: 18, revenue: 7400 },
      { day: "Tue", orders: 22, revenue: 9100 },
      { day: "Wed", orders: 26, revenue: 11200 },
      { day: "Thu", orders: 19, revenue: 8300 },
      { day: "Fri", orders: 31, revenue: 13800 },
      { day: "Sat", orders: 44, revenue: 19600 },
      { day: "Sun", orders: 52, revenue: 24100 },
    ];
    return base.map((b, i) =>
      i === base.length - 1 ? { ...b, orders: b.orders + orders.length, revenue: b.revenue + revenue } : b,
    );
  }, [orders.length, revenue]);

  const bestSellers = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach((o) => o.items.forEach((i) => (counts[i.name] = (counts[i.name] ?? 0) + i.qty)));
    const seeded = products.slice(0, 5).map((p) => ({ name: p.name, qty: (counts[p.name] ?? 0) + p.reviews / 10 }));
    return seeded.sort((a, b) => b.qty - a.qty).map((s) => ({ ...s, qty: Math.round(s.qty) }));
  }, [orders]);

  const customers = useMemo(() => {
    const map = new Map<string, { name: string; phone: string; orders: number; spend: number }>();
    orders.forEach((o) => {
      const key = o.address.phone;
      const prev = map.get(key) ?? { name: o.address.name, phone: key, orders: 0, spend: 0 };
      map.set(key, { ...prev, orders: prev.orders + 1, spend: prev.spend + o.total });
    });
    return [...map.values()];
  }, [orders]);

  return (
    <div className="container-page py-14">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary to-accent p-8 text-primary-foreground shadow-[var(--shadow-lift)]">
        <div className="absolute -top-16 -right-10 size-56 rounded-full bg-primary-foreground/10" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-primary-foreground/80">Staff only · live order desk</p>
            <h1 className="mt-2 text-4xl text-primary-foreground">Admin dashboard</h1>
            <p className="mt-2 flex items-center gap-2 text-sm text-primary-foreground/85">
              <span className="size-2 animate-pulse rounded-full bg-primary-foreground" />
              Connected — new website orders land here instantly
            </p>
          </div>
          <label className="flex items-center gap-2 rounded-full bg-primary-foreground/15 px-4 py-2 text-sm">
            Auto-advance demo tracking
            <Switch checked={demoSpeed} onCheckedChange={setDemoSpeed} />
          </label>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        {[
          { label: "Orders today", value: orders.length, tone: "bg-primary/10 text-primary" },
          { label: "Revenue today", value: formatINR(revenue), tone: "bg-accent/20 text-accent-foreground" },
          { label: "Delivered", value: delivered, tone: "bg-success/15 text-success" },
          {
            label: "Awaiting action",
            value: orders.filter((o) => o.adminStatus === "new").length,
            tone: "bg-destructive/10 text-destructive",
          },
        ].map((s) => (
          <div key={s.label} className="surface-card p-5 transition-shadow hover:shadow-[var(--shadow-lift)]">
            <span className={cn("inline-block rounded-full px-2.5 py-1 text-[0.68rem] font-bold", s.tone)}>
              {s.label}
            </span>
            <p className="mt-3 font-display text-3xl">{s.value}</p>
          </div>
        ))}
      </div>

      <Tabs defaultValue="orders" className="mt-10">
        <TabsList className="flex-wrap">
          <TabsTrigger value="orders">Incoming orders</TabsTrigger>
          <TabsTrigger value="sales">Sales & analytics</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="customers">Customers</TabsTrigger>
          <TabsTrigger value="log">Notification log</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="mt-6 space-y-4">
          <Input placeholder="Search by order ID or customer" value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-sm" />
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No orders yet. Place one from the storefront — it lands here instantly.
            </p>
          )}
          {filtered.map((o) => (
            <div
              key={o.id}
              className={cn(
                "surface-card border-l-4 p-5 transition-shadow hover:shadow-[var(--shadow-lift)]",
                o.adminStatus === "new" && "border-l-accent",
                o.adminStatus === "accepted" && "border-l-success",
                o.adminStatus === "rejected" && "border-l-destructive",
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="font-display text-lg">
                    {o.id}
                    <span
                      className={cn(
                        "ml-3 rounded-full px-2.5 py-1 align-middle text-[0.68rem] font-bold",
                        o.adminStatus === "new" && "bg-accent text-accent-foreground",
                        o.adminStatus === "accepted" && "bg-success/15 text-success",
                        o.adminStatus === "rejected" && "bg-destructive/10 text-destructive",
                      )}
                    >
                      {o.adminStatus}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {o.address.name} · {o.address.phone} · {o.address.zone}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {o.date} · {o.slot} · {o.payment.toUpperCase()} ({o.paymentStatus})
                  </p>
                  <ul className="mt-2 text-sm">
                    {o.items.map((i) => (
                      <li key={i.productId}>
                        {i.qty} × {i.name} — {formatINR(i.price * i.qty)}
                      </li>
                    ))}
                  </ul>
                  {o.notes && <p className="mt-2 rounded-lg bg-accent/10 p-2 text-xs">Note: {o.notes}</p>}
                </div>
                <div className="text-right">
                  <p className="font-display text-xl">{formatINR(o.total)}</p>
                  <p className="text-xs text-muted-foreground">OTP {o.otp}</p>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-border pt-4">
                {o.adminStatus === "new" ? (
                  <>
                    <Button size="sm" onClick={() => { setAdminStatus(o.id, "accepted"); toast.success(`Accepted ${o.id}`); }}>
                      Accept
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => { setAdminStatus(o.id, "rejected"); toast(`Rejected ${o.id}`); }}>
                      Reject
                    </Button>
                  </>
                ) : (
                  <Select value={o.stage} onValueChange={(v) => setStage(o.id, v as typeof o.stage)}>
                    <SelectTrigger className="w-56"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {orderStages.map((s) => (
                        <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Select value={o.riderId ?? ""} onValueChange={(v) => assignRider(o.id, v)}>
                  <SelectTrigger className="w-52"><SelectValue placeholder="Assign delivery staff" /></SelectTrigger>
                  <SelectContent>
                    {riders.map((r) => (
                      <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select onValueChange={(v) => { reportDelay(o.id, v); toast("Delay notification sent"); }}>
                  <SelectTrigger className="w-56"><SelectValue placeholder="Notify delay" /></SelectTrigger>
                  <SelectContent>
                    {delayReasons.map((r) => (
                      <SelectItem key={r} value={r}>{r.slice(0, 32)}…</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="sm" variant="outline" onClick={() => printInvoice(o, "invoice")}>Print invoice</Button>
                <Button size="sm" variant="outline" onClick={() => printInvoice(o, "packing")}>Packing slip</Button>
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="sales" className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="surface-card p-6">
            <p className="eyebrow">Daily orders</p>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="orders" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="surface-card p-6">
            <p className="eyebrow">Revenue trend</p>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={byDay}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip />
                  <Line type="monotone" dataKey="revenue" stroke="var(--color-accent)" strokeWidth={3} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="surface-card p-6">
            <p className="eyebrow">Best sellers</p>
            <ul className="mt-4 space-y-3">
              {bestSellers.map((b) => (
                <li key={b.name} className="text-sm">
                  <div className="flex justify-between"><span>{b.name}</span><span className="font-semibold">{b.qty} packs</span></div>
                  <div className="mt-1 h-2 rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, b.qty)}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="surface-card p-6">
            <p className="eyebrow">Conversion snapshot</p>
            <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div><dt className="text-muted-foreground">Conversion rate</dt><dd className="font-display text-2xl">4.6%</dd></div>
              <div><dt className="text-muted-foreground">Cart abandonment</dt><dd className="font-display text-2xl">31%</dd></div>
              <div><dt className="text-muted-foreground">Returning customers</dt><dd className="font-display text-2xl">62%</dd></div>
              <div><dt className="text-muted-foreground">Avg. order value</dt><dd className="font-display text-2xl">₹486</dd></div>
            </dl>
            <p className="mt-4 text-xs text-muted-foreground">
              Demo figures. Wire to a real analytics source before launch.
            </p>
          </div>
        </TabsContent>

        <TabsContent value="inventory" className="mt-6 surface-card overflow-x-auto p-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs tracking-wide text-muted-foreground uppercase">
                <th className="p-3">Product</th><th className="p-3">Unit</th><th className="p-3">Price</th>
                <th className="p-3">Packs in stock</th><th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-border">
                  <td className="p-3 font-medium">{p.name}</td>
                  <td className="p-3 text-muted-foreground">{p.unit}</td>
                  <td className="p-3">{formatINR(p.price)}</td>
                  <td className="p-3">{p.stock}</td>
                  <td className="p-3">
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", p.stock > 20 ? "bg-success/15 text-success" : "bg-accent/20 text-accent-foreground")}>
                      {p.stock > 20 ? "Healthy" : "Reorder soon"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabsContent>

        <TabsContent value="customers" className="mt-6 surface-card overflow-x-auto p-2">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs tracking-wide text-muted-foreground uppercase">
                <th className="p-3">Customer</th><th className="p-3">Phone</th><th className="p-3">Orders</th><th className="p-3">Lifetime value</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 && (
                <tr><td className="p-4 text-muted-foreground" colSpan={4}>No customers yet.</td></tr>
              )}
              {customers.map((c) => (
                <tr key={c.phone} className="border-t border-border">
                  <td className="p-3 font-medium">{c.name}</td>
                  <td className="p-3 text-muted-foreground">{c.phone}</td>
                  <td className="p-3">{c.orders}</td>
                  <td className="p-3">{formatINR(c.spend)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TabsContent>

        <TabsContent value="log" className="mt-6 space-y-3">
          {notifications.map((n) => (
            <div key={n.id} className="surface-card flex items-start gap-4 p-4">
              <span className="rounded-full bg-secondary px-2.5 py-1 text-[0.68rem] font-bold">{n.channel}</span>
              <div className="flex-1">
                <p className="text-sm font-semibold">{n.title}</p>
                <p className="text-sm text-muted-foreground">{n.body}</p>
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(n.at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </span>
            </div>
          ))}
          {notifications.length === 0 && <p className="text-sm text-muted-foreground">Nothing sent yet.</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
}
