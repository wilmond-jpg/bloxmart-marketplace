import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Users, FileText, TrendingUp, AlertTriangle, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/admin/dashboard")({
  component: AdminDashboard,
});

function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="size-10 rounded-xl bg-brand-red/10 grid place-items-center">
          <ShieldCheck className="size-5 text-brand-red" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm text-zinc-500">Manage users, roles, and platform activity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon={<Users className="size-5" />} label="Total Users" value="10" />
        <StatCard icon={<FileText className="size-5" />} label="Seller Applications" value="3" />
        <StatCard icon={<TrendingUp className="size-5" />} label="Active Listings" value="6" />
        <StatCard icon={<AlertTriangle className="size-5" />} label="Open Flags" value="3" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <QuickActionCard
          to="/admin/seller-applications"
          icon={<FileText className="size-5" />}
          title="Review Pending Approvals"
          desc="3 seller applications awaiting review"
        />
        <QuickActionCard
          to="/admin/moderation"
          icon={<AlertTriangle className="size-5" />}
          title="Review Open Reports"
          desc="2 open flags and 1 active dispute"
        />
        <QuickActionCard
          to="/admin/listings"
          icon={<TrendingUp className="size-5" />}
          title="View All Listings"
          desc="8 total listings across the platform"
        />
      </div>

      <div className="bg-surface rounded-2xl ring-1 ring-white/5 p-6 mb-10">
        <h2 className="text-lg font-semibold mb-4">Role Reference</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            { role: "buyer", label: "Buyer", desc: "Default role for all users. Can browse and purchase items." },
            { role: "seller", label: "Seller", desc: "Can create listings and sell items." },
            { role: "verified_trader", label: "Verified Trader", desc: "Trusted seller with proven track record." },
            { role: "moderator", label: "Moderator", desc: "Can review flags, disputes, and seller apps." },
            { role: "admin", label: "Admin", desc: "Full platform control. Manage users and settings." },
          ].map((r) => (
            <div key={r.role} className="bg-background rounded-xl ring-1 ring-zinc-800 p-4">
              <span className="text-xs font-bold text-brand-red uppercase tracking-wide">{r.label}</span>
              <p className="text-xs text-zinc-500 mt-2">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-brand-red/5 rounded-2xl ring-1 ring-brand-red/20 p-6">
        <h2 className="text-lg font-semibold mb-2">Setup: Grant Admin Role</h2>
        <p className="text-sm text-zinc-400 mb-4">
          After creating your user account and running the SQL migration, grant yourself the admin role by running this in the{" "}
          <a href="https://supabase.com/dashboard/project/gexelqwsxwsfsllvryrb/sql" target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline">
            Supabase SQL Editor
          </a>:
        </p>
        <pre className="bg-background ring-1 ring-zinc-800 rounded-lg p-4 text-sm text-zinc-300 overflow-x-auto">
{`INSERT INTO public.user_role_history (user_id, role_key, status, reason)
VALUES ('<your-user-uuid>', 'admin', 'granted', 'Manual admin setup');`}
        </pre>
        <p className="text-xs text-zinc-500 mt-3">
          Find your user UUID in the Supabase Auth dashboard or run{" "}
          <code className="text-zinc-300">SELECT id, email FROM auth.users;</code>
        </p>
      </div>
    </div>
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

function QuickActionCard({ to, icon, title, desc }: { to: string; icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Link
      to={to as never}
      className="bg-surface rounded-2xl ring-1 ring-white/5 p-5 transition-all group hover:ring-brand-red/30"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="text-brand-red">{icon}</div>
        <ArrowRight className="size-4 text-zinc-600 group-hover:text-brand-red transition-colors" />
      </div>
      <h3 className="font-semibold text-sm mb-1 group-hover:text-brand-red transition-colors">{title}</h3>
      <p className="text-xs text-zinc-500">{desc}</p>
    </Link>
  );
}
