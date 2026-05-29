import { createFileRoute } from "@tanstack/react-router";
import { AdminOnlyGuard } from "@/components/RouteGuards";
import { Users } from "lucide-react";

export const Route = createFileRoute("/admin/users")({
  head: () => ({ meta: [{ title: "User Management — BloxMart Admin" }] }),
  component: AdminUsers,
});

function AdminUsers() {
  return (
    <AdminOnlyGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="size-10 rounded-xl bg-brand-red/10 grid place-items-center"><Users className="size-5 text-brand-red" /></div>
          <div>
            <h1 className="text-2xl font-semibold">User Management</h1>
            <p className="text-sm text-zinc-500">View and manage all registered users.</p>
          </div>
        </div>
        <div className="bg-surface rounded-2xl ring-1 ring-white/5 p-12 text-center">
          <Users className="size-12 mx-auto mb-4 text-zinc-700" />
          <p className="text-zinc-500 text-sm">User management dashboard coming soon.</p>
          <p className="text-xs text-zinc-600 mt-1">This page will list all users with role management controls.</p>
        </div>
      </div>
    </AdminOnlyGuard>
  );
}
