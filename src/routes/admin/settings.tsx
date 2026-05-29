import { createFileRoute } from "@tanstack/react-router";
import { AdminOnlyGuard } from "@/components/RouteGuards";
import { Settings } from "lucide-react";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({ meta: [{ title: "Platform Settings — BloxMart Admin" }] }),
  component: AdminSettings,
});

function AdminSettings() {
  return (
    <AdminOnlyGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="size-10 rounded-xl bg-brand-red/10 grid place-items-center"><Settings className="size-5 text-brand-red" /></div>
          <div>
            <h1 className="text-2xl font-semibold">Platform Settings</h1>
            <p className="text-sm text-zinc-500">Configure platform thresholds and options.</p>
          </div>
        </div>
        <div className="bg-surface rounded-2xl ring-1 ring-white/5 p-12 text-center">
          <Settings className="size-12 mx-auto mb-4 text-zinc-700" />
          <p className="text-zinc-500 text-sm">Settings dashboard coming soon.</p>
          <p className="text-xs text-zinc-600 mt-1">Configure trade thresholds, fees, and platform options here.</p>
        </div>
      </div>
    </AdminOnlyGuard>
  );
}
