import { createFileRoute, Link } from "@tanstack/react-router";
import { ItemCard } from "@/components/ItemCard";
import { items } from "@/data/items";
import { ShieldCheck, Zap, Package } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BloxMart — Buy & Sell Roblox Limiteds Safely" },
      { name: "description", content: "Direct P2P marketplace for Roblox limited items. Secured by BloxMart Escrow with GCash, Maya, and PayPal support." },
      { property: "og:title", content: "BloxMart — Buy & Sell Roblox Limiteds Safely" },
      { property: "og:description", content: "Direct P2P marketplace for Roblox limited items. Secured by BloxMart Escrow." },
    ],
  }),
  component: Index,
});

function Index() {
  const trending = items.filter((i) => i.trending).slice(0, 4);

  return (
    <>
      {/* Hero */}
      <section className="py-20 sm:py-28 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/3 w-[600px] h-[400px] bg-brand-red/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="max-w-7xl mx-auto relative">
          <div className="max-w-[40ch]">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-red/10 ring-1 ring-brand-red/20 text-brand-red text-[10px] font-bold uppercase tracking-widest mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-red opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-red" />
              </span>
              Marketplace is Live
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl leading-[1.05] font-semibold text-zinc-100 text-balance mb-6">
              The safest way to trade Roblox limiteds in the Philippines.
            </h1>
            <p className="text-base sm:text-lg text-zinc-400 text-pretty mb-8 max-w-[56ch]">
              Direct P2P marketplace for high-tier items. Secured by BloxMart Escrow with local payment support through GCash and Maya.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/marketplace" className="bg-zinc-100 text-zinc-950 text-sm font-medium py-3 px-6 rounded-lg transition-transform hover:-translate-y-0.5">
                Browse Shop
              </Link>
              <a href="#how-it-works" className="bg-surface ring-1 ring-zinc-800 text-zinc-100 text-sm font-medium py-3 px-6 rounded-lg transition-transform hover:-translate-y-0.5">
                How it works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="py-16 sm:py-20 px-6 bg-zinc-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-100 mb-2">Trending Now</h2>
              <p className="text-sm text-zinc-500">Most active listings in the last 24 hours.</p>
            </div>
            <Link to="/marketplace" className="text-sm font-medium text-brand-blue hover:underline">View all →</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {trending.map((item) => <ItemCard key={item.id} item={item} />)}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 sm:py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-100 mb-4">Start Trading in Minutes</h2>
            <p className="text-zinc-500 max-w-[56ch] mx-auto">Join thousands of Filipino traders using BloxMart to expand their collection with zero friction.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              { n: "01", title: "Post Your Listing", desc: "Sellers list their Roblox limited items with clear pricing and automated item verification.", icon: Package },
              { n: "02", title: "Secure Payment", desc: "Pay easily via GCash or Maya. Funds are held securely in escrow until the item is received.", icon: ShieldCheck },
              { n: "03", title: "Receive Your Item", desc: "Once confirmed, the item is transferred via Roblox trade. No more middleman scams.", icon: Zap },
            ].map((s) => (
              <div key={s.n} className="group">
                <div className="size-12 rounded-xl bg-surface ring-1 ring-white/10 flex items-center justify-center mb-6">
                  <s.icon className="size-5 text-brand-red" />
                </div>
                <div className="text-xs font-mono text-zinc-600 mb-2">{s.n}</div>
                <h3 className="text-zinc-100 font-medium text-lg mb-3">{s.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-y border-zinc-800/50 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3 block">Payment Partners</span>
            <div className="flex flex-wrap items-center gap-6">
              <span className="text-lg font-semibold text-zinc-300">GCash</span>
              <span className="text-lg font-semibold text-zinc-300">Maya</span>
              <span className="text-lg font-semibold text-zinc-300">PayPal</span>
              <span className="text-[10px] text-zinc-600 uppercase tracking-widest">Coming Soon</span>
            </div>
          </div>
          <Link to="/payments" className="text-sm font-medium text-brand-blue hover:underline">
            Learn about payments →
          </Link>
        </div>
      </section>
    </>
  );
}
