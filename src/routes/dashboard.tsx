import { createFileRoute, Link } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { AuthGuard } from "@/components/RouteGuards";
import { ShieldCheck, Package, Star, ShoppingBag, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — BloxMart" },
      { name: "description", content: "Your BloxMart trading dashboard." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { user, isAdmin, isModerator } = useAuth();
  const isSeller = user?.roles.includes("seller") ?? false;

  return (
    <AuthGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">Welcome back, {user?.username}</h1>
          <p className="text-sm text-zinc-500 mt-1">Here's an overview of your BloxMart activity.</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {user?.roles.map((role) => (
            <span key={role} className="text-xs font-medium px-3 py-1 bg-brand-red/10 ring-1 ring-brand-red/20 text-brand-red rounded-full capitalize">
              {role.replace(/_/g, " ")}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard icon={<ShoppingBag className="size-5" />} label="Active Purchases" value="0" />
          <StatCard icon={<Package className="size-5" />} label="Active Listings" value={isSeller ? "0" : "—"} />
          <StatCard icon={<Star className="size-5" />} label="Rating" value="—" />
          <StatCard icon={<TrendingUp className="size-5" />} label="Completed Trades" value="0" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          <QuickCard
            to="/marketplace"
            icon={<ShoppingBag className="size-5" />}
            title="Browse Marketplace"
            desc="Discover Roblox limiteds from trusted sellers."
          />
          {isSeller && (
            <QuickCard
              to="/seller/listings/new"
              icon={<Package className="size-5" />}
              title="Create Listing"
              desc="Sell your Roblox limited items."
            />
          )}
          <QuickCard
            to="/messages"
            icon={<ShieldCheck className="size-5" />}
            title="Messages"
            desc="Chat with buyers and sellers."
          />
          {!isSeller && (
            <QuickCard
              to="/seller/apply"
              icon={<Star className="size-5" />}
              title="Become a Seller"
              desc="Apply to sell on BloxMart."
            />
          )}
          {(isAdmin || isModerator) && (
            <QuickCard
              to="/admin/dashboard"
              icon={<ShieldCheck className="size-5" />}
              title="Admin Panel"
              desc="Manage users, roles, and moderation."
            />
          )}
        </div>

        <div className="bg-surface rounded-2xl ring-1 ring-white/5 p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="text-center py-12 text-zinc-500 text-sm">
            <Package className="size-10 mx-auto mb-3 text-zinc-700" />
            <p>No recent activity yet.</p>
            <p className="mt-1">Start exploring the marketplace to see your activity here.</p>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-surface rounded-2xl ring-1 ring-white/5 p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-brand-red">{icon}</div>
        <span className="text-[10px] uppercase tracking-widest text-zinc-500">{label}</span>
      </div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}

function QuickCard({ to, icon, title, desc }: { to: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Link
      to={to as never}
      className="bg-surface rounded-2xl ring-1 ring-white/5 p-5 hover:ring-brand-red/30 transition-all group"
    >
      <div className="text-brand-red mb-3">{icon}</div>
      <h3 className="font-semibold text-sm mb-1 group-hover:text-brand-red transition-colors">{title}</h3>
      <p className="text-xs text-zinc-500">{desc}</p>
    </Link>
  );
}
