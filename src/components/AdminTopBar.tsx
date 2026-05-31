import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, User as UserIcon, ExternalLink, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AdminTopBar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between gap-4 border-b border-zinc-800/60 bg-background/80 backdrop-blur-md px-4 sm:px-6 py-3">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="md:hidden" />
        <span className="text-sm font-medium text-zinc-400 hidden sm:inline">Admin Panel</span>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="relative text-zinc-400 hover:text-zinc-100">
          <Bell className="size-4" />
          <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-brand-red" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full bg-surface ring-1 ring-zinc-800 pl-1 pr-3 py-1 hover:ring-zinc-700 transition">
              <Avatar className="size-7 ring-1 ring-zinc-800">
                {user?.avatar_url ? (
                  <AvatarImage src={user.avatar_url} alt={user?.username} />
                ) : null}
                <AvatarFallback className="bg-brand-red text-[10px] font-bold text-white">
                  {user?.username?.slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium hidden sm:inline">{user?.username}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link to="/profile" className="cursor-pointer">
                <UserIcon className="size-4 mr-2" />
                Profile
              </Link>
            </DropdownMenuItem>
            {user && (
              <DropdownMenuItem asChild>
                <Link to="/user/$username" params={{ username: user!.username }} className="cursor-pointer">
                  <ExternalLink className="size-4 mr-2" />
                  View Public Profile
                </Link>
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => { logout(); navigate({ to: "/" }); }}
              className="cursor-pointer text-brand-red focus:text-brand-red"
            >
              <LogOut className="size-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
