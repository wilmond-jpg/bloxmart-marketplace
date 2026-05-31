import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminGuard } from "@/components/RouteGuards";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/AdminSidebar";
import { AdminTopBar } from "@/components/AdminTopBar";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Panel — BloxMart" },
      { name: "description", content: "BloxMart admin and moderation panel." },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AdminGuard>
      <SidebarProvider defaultOpen={true}>
        <AdminSidebar />
        <SidebarInset>
          <AdminTopBar />
          <div className="flex-1">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AdminGuard>
  );
}
