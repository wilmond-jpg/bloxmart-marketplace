import { createFileRoute } from "@tanstack/react-router";
import { AdminGuard } from "@/components/RouteGuards";
import { FileText } from "lucide-react";

export const Route = createFileRoute("/admin/seller-applications")({
  head: () => ({ meta: [{ title: "Seller Applications — BloxMart Admin" }] }),
  component: SellerApplications,
});

function SellerApplications() {
  return (
    <AdminGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="size-10 rounded-xl bg-brand-red/10 grid place-items-center"><FileText className="size-5 text-brand-red" /></div>
          <div>
            <h1 className="text-2xl font-semibold">Seller Applications</h1>
            <p className="text-sm text-zinc-500">Review and manage seller applications.</p>
          </div>
        </div>
        <div className="bg-surface rounded-2xl ring-1 ring-white/5 p-12 text-center">
          <FileText className="size-12 mx-auto mb-4 text-zinc-700" />
          <p className="text-zinc-500 text-sm">No seller applications yet.</p>
          <p className="text-xs text-zinc-600 mt-1">Applications will appear here once users apply to become sellers.</p>
        </div>
      </div>
    </AdminGuard>
  );
}
