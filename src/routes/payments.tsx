import { createFileRoute } from "@tanstack/react-router";
import { Smartphone, Wallet, Globe } from "lucide-react";

export const Route = createFileRoute("/payments")({
  head: () => ({
    meta: [
      { title: "Payment Methods — BloxMart" },
      { name: "description", content: "GCash, Maya, and PayPal support coming soon to BloxMart. Learn how each payment method works." },
      { property: "og:title", content: "Payment Methods — BloxMart" },
      { property: "og:description", content: "GCash, Maya, and PayPal support coming soon to BloxMart." },
    ],
  }),
  component: PaymentsPage,
});

const methods = [
  {
    name: "GCash",
    color: "#0070E0",
    icon: Smartphone,
    desc: "The Philippines' most-used mobile wallet. Pay instantly from your GCash balance, link cards, or top up via 7-Eleven and any partner outlet.",
    flow: ["Choose GCash at checkout", "Approve the payment in your GCash app", "Item delivered to your Roblox inventory"],
  },
  {
    name: "Maya",
    color: "#00C66B",
    icon: Wallet,
    desc: "Maya wallet payments with instant confirmation. Earn Maya Rewards on every BloxMart purchase. Bills, savings, and crypto all in one app.",
    flow: ["Select Maya at checkout", "Confirm payment via QR or in-app", "Receive your item instantly"],
  },
  {
    name: "PayPal",
    color: "#003087",
    icon: Globe,
    desc: "For international buyers and sellers. Pay in USD or any supported currency with full buyer protection. Available worldwide.",
    flow: ["Choose PayPal at checkout", "Log in to your PayPal account", "Item transferred after confirmation"],
  },
];

function PaymentsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 ring-1 ring-brand-blue/20 text-brand-blue text-[10px] font-bold uppercase tracking-widest mb-6">
          Coming Soon
        </div>
        <h1 className="text-3xl sm:text-4xl font-semibold mb-4 text-balance">Payment methods built for Filipino traders.</h1>
        <p className="text-zinc-400 leading-relaxed">
          BloxMart will support local and international payment options so you can trade Roblox limiteds with whichever wallet you already use.
          All payment features are currently in development — no transactions are processed yet.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {methods.map((m) => (
          <div key={m.name} className="bg-surface rounded-2xl ring-1 ring-white/5 p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <div className="size-12 rounded-xl grid place-items-center text-white" style={{ backgroundColor: m.color }}>
                <m.icon className="size-5" />
              </div>
              <div>
                <div className="font-semibold text-lg">{m.name}</div>
                <div className="text-[10px] uppercase tracking-widest text-zinc-500">Coming Soon</div>
              </div>
            </div>
            <p className="text-sm text-zinc-400 leading-relaxed mb-6 flex-1">{m.desc}</p>
            <div className="pt-4 border-t border-zinc-800">
              <div className="text-[10px] uppercase tracking-widest text-zinc-500 mb-3">How it will work</div>
              <ol className="space-y-2">
                {m.flow.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                    <span className="size-5 rounded-full bg-zinc-800 grid place-items-center text-[10px] font-bold text-zinc-400 shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-brand-red/5 ring-1 ring-brand-red/20 rounded-2xl p-6 text-center">
        <p className="text-sm text-zinc-300">
          <span className="font-semibold text-brand-red">Heads up:</span> Payment processing is not yet live on BloxMart. All checkout flows on this site are simulated for demo purposes.
        </p>
      </div>
    </div>
  );
}
