import { useEffect, useRef, useState } from "react";
import { BadgeCheck, Lock, ShieldCheck, Smartphone, CreditCard, Landmark, Wallet } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatINR } from "@/lib/shop-data";
import { cn } from "@/lib/utils";

type Step = "review" | "processing" | "success";

const flow: Record<string, { icon: typeof Smartphone; title: string; steps: string[] }> = {
  upi: {
    icon: Smartphone,
    title: "UPI · Scan & pay",
    steps: ["Opening secure UPI session…", "Waiting for approval in your UPI app…", "Payment authorised by bank"],
  },
  card: {
    icon: CreditCard,
    title: "Card · Secure checkout",
    steps: ["Tokenising card details…", "Redirecting for 3-D Secure OTP…", "Payment authorised by issuer"],
  },
  netbanking: {
    icon: Landmark,
    title: "Net banking",
    steps: ["Connecting to your bank…", "Confirming debit…", "Payment authorised by bank"],
  },
  cod: {
    icon: Wallet,
    title: "Cash on delivery",
    steps: ["Verifying delivery pincode…", "Reserving your slot…", "Order confirmed — pay the rider"],
  },
};

export function PaymentDialog({
  open,
  onOpenChange,
  method,
  amount,
  onPaid,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  method: string;
  amount: number;
  onPaid: () => void;
}) {
  const [step, setStep] = useState<Step>("review");
  const [progress, setProgress] = useState(0);
  const [line, setLine] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const config = flow[method] ?? flow["upi"]!;
  const Icon = config.icon;
  const isCod = method === "cod";

  useEffect(() => {
    if (open) {
      setStep("review");
      setProgress(0);
      setLine(0);
    }
    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [open]);

  const run = () => {
    setStep("processing");
    const at = (ms: number, fn: () => void) => timers.current.push(setTimeout(fn, ms));
    at(50, () => setProgress(28));
    at(900, () => { setLine(1); setProgress(62); });
    at(1900, () => { setLine(2); setProgress(92); });
    at(2600, () => { setProgress(100); setStep("success"); });
    at(3600, () => onPaid());
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (step === "processing" ? null : onOpenChange(v))}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display text-xl">
            <Icon className="size-5 text-primary" /> {config.title}
          </DialogTitle>
        </DialogHeader>

        <div className="rounded-2xl bg-gradient-to-br from-primary to-accent p-5 text-primary-foreground shadow-[var(--shadow-lift)]">
          <p className="text-xs tracking-[0.18em] uppercase opacity-80">Amount payable</p>
          <p className="font-display text-3xl">{formatINR(amount)}</p>
          <p className="mt-1 flex items-center gap-1.5 text-xs opacity-90">
            <Lock className="size-3.5" /> Demo gateway · no real money moves
          </p>
        </div>

        {step === "review" && (
          <div className="space-y-4">
            {method === "upi" && (
              <div className="flex items-center gap-4 rounded-xl border border-border p-4">
                <div className="grid size-24 shrink-0 grid-cols-7 gap-[2px] rounded-lg bg-background p-1.5">
                  {Array.from({ length: 49 }).map((_, i) => (
                    <span
                      key={i}
                      className={cn("rounded-[1px]", (i * 7 + (i % 5)) % 3 === 0 ? "bg-foreground" : "bg-transparent")}
                    />
                  ))}
                </div>
                <div className="text-sm">
                  <p className="font-semibold">Scan with any UPI app</p>
                  <p className="text-muted-foreground">anishclient@demoupi</p>
                  <p className="mt-1 text-xs text-muted-foreground">GPay · PhonePe · Paytm · BHIM</p>
                </div>
              </div>
            )}
            {method === "card" && (
              <div className="space-y-2 rounded-xl border border-border p-4 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Card</span><span>•••• •••• •••• 4242</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Expiry</span><span>08 / 29</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">CVV</span><span>•••</span></div>
              </div>
            )}
            {method === "netbanking" && (
              <div className="rounded-xl border border-border p-4 text-sm">
                <p className="font-semibold">Demo Bank of India</p>
                <p className="text-muted-foreground">You will be taken to your bank to confirm the debit.</p>
              </div>
            )}
            {isCod && (
              <div className="rounded-xl border border-border p-4 text-sm">
                <p className="font-semibold">Pay the rider on delivery</p>
                <p className="text-muted-foreground">Exact change or UPI at the door both work.</p>
              </div>
            )}
            <Button size="lg" className="w-full" onClick={run}>
              {isCod ? "Confirm order" : `Pay ${formatINR(amount)}`}
            </Button>
            <p className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5" /> PCI-DSS style flow · card data never stored
            </p>
          </div>
        )}

        {step === "processing" && (
          <div className="space-y-4 py-2">
            <Progress value={progress} />
            <ul className="space-y-2 text-sm">
              {config.steps.map((s, i) => (
                <li key={s} className={cn("flex items-center gap-2", i > line && "text-muted-foreground/50")}>
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      i < line ? "bg-success" : i === line ? "animate-pulse bg-primary" : "bg-border",
                    )}
                  />
                  {s}
                </li>
              ))}
            </ul>
            <p className="text-xs text-muted-foreground">Do not close this window.</p>
          </div>
        )}

        {step === "success" && (
          <div className="flex flex-col items-center gap-2 py-4 text-center">
            <BadgeCheck className="size-14 text-success" />
            <p className="font-display text-xl">{isCod ? "Order confirmed" : "Payment successful"}</p>
            <p className="text-sm text-muted-foreground">
              Sending your order to the shop counter and generating the GST invoice…
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
