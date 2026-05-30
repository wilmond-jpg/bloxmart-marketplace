import { Link, useNavigate } from "@tanstack/react-router";
import { Search, MessageCircle, LogOut, User as UserIcon, ExternalLink, Menu } from "lucide-react";
import { useState } from "react";
import { useCurrency } from "@/context/CurrencyContext";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navbar() {
  const { currency, setCurrency } = useCurrency();
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({ to: "/marketplace", search: { q: search } as never });
  };

  const navLinks = (
    <>
      <Link to="/marketplace" className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">
        Marketplace
      </Link>
      <Link to="/payments" className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">
        Payments
      </Link>
      {isLoggedIn && (
        <Link to="/messages" className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors">
          Messages
        </Link>
      )}
    </>
  );

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-zinc-800/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 sm:gap-8">
        <div className="flex items-center gap-6 shrink-0">
          <Link to="/" className="text-xl font-semibold tracking-tight">
            Blox<span className="text-brand-red">Mart</span>
          </Link>
          <div className="hidden lg:flex items-center gap-6">{navLinks}</div>
        </div>

        <form onSubmit={submitSearch} className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 size-4 text-zinc-500 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search limiteds..."
              className="w-full bg-surface ring-1 ring-zinc-800 text-sm rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-brand-red/50 transition-shadow"
            />
          </div>
        </form>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center bg-surface ring-1 ring-zinc-800 rounded-full px-1 py-1 text-xs font-medium">
            <button
              onClick={() => setCurrency("PHP")}
              className={`px-2.5 py-1 rounded-full transition-colors ${currency === "PHP" ? "bg-brand-red text-white" : "text-zinc-500 hover:text-zinc-200"}`}
            >
              PHP
            </button>
            <button
              onClick={() => setCurrency("USD")}
              className={`px-2.5 py-1 rounded-full transition-colors ${currency === "USD" ? "bg-brand-red text-white" : "text-zinc-500 hover:text-zinc-200"}`}
            >
              USD
            </button>
          </div>

          {isLoggedIn ? (
            <>
              <Link
                to="/messages"
                className="hidden sm:grid size-9 place-items-center rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-surface transition-colors"
                aria-label="Messages"
              >
                <MessageCircle className="size-4" />
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full bg-surface ring-1 ring-zinc-800 pl-1 pr-3 py-1 hover:ring-zinc-700 transition">
                    <Avatar className="size-7 ring-1 ring-zinc-800">
                      {user?.avatar_url ? (
                        <AvatarImage src={user.avatar_url} alt={user.username} />
                      ) : null}
                      <AvatarFallback className="bg-brand-red text-[10px] font-bold text-white">
                        {user?.username.slice(0, 1).toUpperCase()}
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
                  <DropdownMenuItem asChild>
                    <Link to="/user/$username" params={{ username: user!.username }} className="cursor-pointer">
                      <ExternalLink className="size-4 mr-2" />
                      View Public Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/messages" className="cursor-pointer">
                      <MessageCircle className="size-4 mr-2" />
                      Messages
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-brand-red focus:text-brand-red">
                    <LogOut className="size-4 mr-2" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-zinc-400 hover:text-zinc-100 px-3 py-2 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="bg-brand-red hover:bg-brand-red-hover text-white text-sm font-medium py-2 px-4 sm:px-5 rounded-lg ring-1 ring-brand-red transition-all active:scale-95"
              >
                Sign Up
              </Link>
            </>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <button className="lg:hidden size-9 grid place-items-center rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-surface" aria-label="Menu">
                <Menu className="size-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-background border-zinc-800">
              <div className="flex flex-col gap-6 pt-6">
                {navLinks}
                <form onSubmit={submitSearch}>
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 size-4 text-zinc-500" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search limiteds..."
                      className="w-full bg-surface ring-1 ring-zinc-800 text-sm rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-brand-red/50"
                    />
                  </div>
                </form>
                <div className="flex items-center bg-surface ring-1 ring-zinc-800 rounded-full p-1 text-xs font-medium w-fit">
                  <button
                    onClick={() => setCurrency("PHP")}
                    className={`px-3 py-1 rounded-full ${currency === "PHP" ? "bg-brand-red text-white" : "text-zinc-500"}`}
                  >
                    PHP
                  </button>
                  <button
                    onClick={() => setCurrency("USD")}
                    className={`px-3 py-1 rounded-full ${currency === "USD" ? "bg-brand-red text-white" : "text-zinc-500"}`}
                  >
                    USD
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
