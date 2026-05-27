import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-zinc-900 mt-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-[35ch]">
          <Link to="/" className="text-lg font-semibold tracking-tight text-zinc-100">
            Blox<span className="text-brand-red">Mart</span>
          </Link>
          <p className="mt-4 text-xs text-zinc-500 leading-relaxed">
            The premier secondary marketplace for Roblox limiteds. Built by Filipino traders, trusted worldwide.
          </p>
        </div>
        <div className="flex gap-12 sm:gap-16">
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Market</span>
            <Link to="/marketplace" className="text-xs text-zinc-500 hover:text-zinc-300">Browse All</Link>
            <Link to="/marketplace" className="text-xs text-zinc-500 hover:text-zinc-300">New Arrivals</Link>
            <Link to="/payments" className="text-xs text-zinc-500 hover:text-zinc-300">Payments</Link>
          </div>
          <div className="flex flex-col gap-3">
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Support</span>
            <a href="#" className="text-xs text-zinc-500 hover:text-zinc-300">Help Center</a>
            <a href="#" className="text-xs text-zinc-500 hover:text-zinc-300">Safe Trading</a>
            <a href="#" className="text-xs text-zinc-500 hover:text-zinc-300">Terms</a>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-zinc-900">
        <p className="text-[10px] text-zinc-600 text-center leading-relaxed">
          BloxMart is an independent marketplace and is not affiliated with, authorized, or endorsed by Roblox Corporation.
          Roblox and all its trademarks belong to their respective owners.
        </p>
      </div>
    </footer>
  );
}
