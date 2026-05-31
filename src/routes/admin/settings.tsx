import { createFileRoute } from "@tanstack/react-router";
import { AdminOnlyGuard } from "@/components/RouteGuards";
import { Settings, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

function AdminSettings() {
  const [minTrades, setMinTrades] = useState("25");
  const [minRating, setMinRating] = useState("4.6");
  const [commission, setCommission] = useState("5.0");

  const handleSave = () => {
    toast.success("Settings saved (in-memory mock)");
  };

  return (
    <AdminOnlyGuard>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="size-10 rounded-xl bg-brand-red/10 grid place-items-center">
            <Settings className="size-5 text-brand-red" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">Platform Settings</h1>
            <p className="text-sm text-zinc-500">Configure platform thresholds and options.</p>
          </div>
        </div>

        <div className="bg-surface rounded-2xl ring-1 ring-white/5 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1.5">Verified Trader — Minimum Trades</label>
            <input
              type="number"
              value={minTrades}
              onChange={(e) => setMinTrades(e.target.value)}
              className="w-full bg-background ring-1 ring-zinc-800 text-sm rounded-lg py-2 px-4 focus:outline-none focus:ring-brand-red/50"
            />
            <p className="text-xs text-zinc-500 mt-1">Minimum completed trades required for Verified Trader status.</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Verified Trader — Minimum Rating</label>
            <input
              type="number"
              step="0.1"
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="w-full bg-background ring-1 ring-zinc-800 text-sm rounded-lg py-2 px-4 focus:outline-none focus:ring-brand-red/50"
            />
            <p className="text-xs text-zinc-500 mt-1">Minimum average review rating for Verified Trader status.</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Seller Commission (%)</label>
            <input
              type="number"
              step="0.1"
              value={commission}
              onChange={(e) => setCommission(e.target.value)}
              className="w-full bg-background ring-1 ring-zinc-800 text-sm rounded-lg py-2 px-4 focus:outline-none focus:ring-brand-red/50"
            />
            <p className="text-xs text-zinc-500 mt-1">Platform commission percentage charged on each sale.</p>
          </div>

          <div className="pt-2">
            <Button onClick={handleSave} className="bg-brand-red hover:bg-brand-red-hover text-white">
              <Save className="size-4 mr-2" /> Save Settings
            </Button>
          </div>
        </div>
      </div>
    </AdminOnlyGuard>
  );
}
