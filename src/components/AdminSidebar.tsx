import { Link, useLocation } from "@tanstack/react-router";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  FileText,
  Package,
  ShoppingBag,
  ShieldCheck,
  Settings,
  ArrowLeft,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard, adminOnly: false },
  { label: "User Management", path: "/admin/users", icon: Users, adminOnly: true },
  { label: "Seller Applications", path: "/admin/seller-applications", icon: FileText, adminOnly: false },
  { label: "Listings", path: "/admin/listings", icon: Package, adminOnly: false },
  { label: "Trades", path: "/admin/trades", icon: ShoppingBag, adminOnly: false },
  { label: "Moderation", path: "/admin/moderation", icon: ShieldCheck, adminOnly: false },
  { label: "Settings", path: "/admin/settings", icon: Settings, adminOnly: true },
];

export function AdminSidebar() {
  const location = useLocation();
  const { isAdmin } = useAuth();

  const visibleItems = navItems.filter((item) => !item.adminOnly || isAdmin);

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <Link to="/admin/dashboard" className="flex items-center gap-2 px-2 py-1">
          <span className="text-lg font-semibold tracking-tight">
            Blox<span className="text-brand-red">Mart</span>
          </span>
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">Admin</span>
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                      <Link to={item.path as never}>
                        <item.icon className="size-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Back to Site">
              <Link to="/">
                <ArrowLeft className="size-4" />
                <span>Back to Site</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
