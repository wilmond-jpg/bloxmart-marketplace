import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { NotAuthorized } from "@/components/NotAuthorized";
import { Users, Shield, ShieldOff, Ban, CheckCircle, Loader2, Search } from "lucide-react";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { formatDate, getStatusColor } from "@/lib/admin/mockData";
import { fetchUsers, grantUserRole, revokeUserRole, updateUserAccountStatus, type AdminUser } from "@/lib/admin/users";
import { toast } from "sonner";

const PAGE_SIZE = 10;

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

function AdminUsers() {
  const { user: currentUser, isAdmin, isLoading: isAuthLoading } = useAuth();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const loadUsers = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load users");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAdmin) return;
    loadUsers();
  }, [isAuthLoading, isAdmin, loadUsers]);

  const filtered = useMemo(() => {
    let result = users;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((u) => u.username.toLowerCase().includes(q));
    }

    if (roleFilter !== "all") {
      result = result.filter((u) => u.roles.includes(roleFilter));
    }

    if (statusFilter !== "all") {
      result = result.filter((u) => u.account_status === statusFilter);
    }

    return result;
  }, [users, search, roleFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageUsers = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const handleGrantRole = async (userId: string, roleKey: string) => {
    try {
      await grantUserRole(userId, roleKey);
      toast.success(`Granted ${roleKey.replace("_", " ")} role`);
      loadUsers();
    } catch {
      toast.error("Failed to grant role");
    }
  };

  const handleRevokeRole = async (userId: string, roleKey: string) => {
    try {
      await revokeUserRole(userId, roleKey);
      toast.success(`Revoked ${roleKey.replace("_", " ")} role`);
      loadUsers();
    } catch {
      toast.error("Failed to revoke role");
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    try {
      await updateUserAccountStatus(userId, newStatus as "active" | "suspended");
      toast.success(`User ${newStatus === "suspended" ? "suspended" : "reactivated"}`);
      loadUsers();
    } catch {
      toast.error("Failed to update account status");
    }
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-brand-red" />
      </div>
    );
  }

  if (!isAdmin) {
    return <NotAuthorized requiredRole="admin" backTo="/admin/dashboard" backLabel="Go to dashboard" />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="size-10 rounded-xl bg-brand-red/10 grid place-items-center">
          <Users className="size-5 text-brand-red" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">User Management</h1>
          <p className="text-sm text-zinc-500">View and manage all registered users.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 size-4 text-zinc-500 pointer-events-none" />
          <Input
            placeholder="Search by username..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-surface ring-1 ring-zinc-800 text-sm rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-brand-red/50"
          />
        </div>
        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-3">
          <Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-44 bg-surface ring-1 ring-zinc-800 text-sm">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent className="bg-surface border-zinc-800">
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="buyer">Buyer</SelectItem>
              <SelectItem value="seller">Seller</SelectItem>
              <SelectItem value="verified_trader">Verified Trader</SelectItem>
              <SelectItem value="moderator">Moderator</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1); }}>
            <SelectTrigger className="w-full sm:w-44 bg-surface ring-1 ring-zinc-800 text-sm">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent className="bg-surface border-zinc-800">
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
              <SelectItem value="banned">Banned</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-surface rounded-2xl ring-1 ring-white/5 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-8 animate-spin text-brand-red" />
          </div>
        ) : pageUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Users className="size-12 text-zinc-700 mb-4" />
            <p className="text-zinc-500 text-sm font-medium">
              {search || roleFilter !== "all" || statusFilter !== "all"
                ? "No users match your filters"
                : "No users found"}
            </p>
            <p className="text-xs text-zinc-600 mt-1">
              {search || roleFilter !== "all" || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Users will appear here once they sign up."}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile card layout */}
            <div className="divide-y divide-zinc-800 md:hidden">
              {pageUsers.map((user) => {
                const isSelf = currentUser?.id === user.id;
                return (
                <div key={user.id} className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 ring-1 ring-zinc-800 shrink-0">
                      <AvatarFallback className="bg-brand-red text-sm font-bold text-white">
                        {user.username.slice(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate flex items-center gap-2">
                        {user.username}
                        {isSelf && <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-400">You</Badge>}
                      </p>
                      <span className={`text-xs font-medium ${getStatusColor(user.account_status)}`}>
                        {user.account_status}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {user.roles.includes("seller") ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-zinc-400 hover:text-red-400 disabled:opacity-20 disabled:pointer-events-none"
                          onClick={() => handleRevokeRole(user.id, "seller")}
                          title="Revoke seller role"
                          disabled={isSelf}
                        >
                          <ShieldOff className="size-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-zinc-400 hover:text-green-400 disabled:opacity-20 disabled:pointer-events-none"
                          onClick={() => handleGrantRole(user.id, "seller")}
                          title="Grant seller role"
                          disabled={isSelf}
                        >
                          <Shield className="size-4" />
                        </Button>
                      )}
                      {user.account_status === "active" ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-zinc-400 hover:text-yellow-400 disabled:opacity-20 disabled:pointer-events-none"
                          onClick={() => handleToggleStatus(user.id, user.account_status)}
                          title="Suspend user"
                          disabled={isSelf}
                        >
                          <Ban className="size-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-zinc-400 hover:text-green-400 disabled:opacity-20 disabled:pointer-events-none"
                          onClick={() => handleToggleStatus(user.id, user.account_status)}
                          title="Reactivate user"
                          disabled={isSelf}
                        >
                          <CheckCircle className="size-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {user.roles.map((role) => (
                      <Badge key={role} variant="secondary" className="text-[10px] capitalize">
                        {role.replace("_", " ")}
                      </Badge>
                    ))}
                  </div>
                </div>
                );
              })}
            </div>
            {/* Desktop table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800">
                    <TableHead className="w-12">Avatar</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Roles</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden lg:table-cell">Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageUsers.map((user) => {
                    const isSelf = currentUser?.id === user.id;
                    return (
                    <TableRow key={user.id} className="border-zinc-800">
                      <TableCell>
                        <Avatar className="size-8 ring-1 ring-zinc-800">
                          <AvatarFallback className="bg-brand-red text-xs font-bold text-white">
                            {user.username.slice(0, 1).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        <span className="flex items-center gap-2">
                          {user.username}
                          {isSelf && <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-400">You</Badge>}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.roles.map((role) => (
                            <Badge key={role} variant="secondary" className="text-[10px] capitalize">
                              {role.replace("_", " ")}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`text-xs font-medium ${getStatusColor(user.account_status)}`}>
                          {user.account_status}
                        </span>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-zinc-400 text-sm">
                        {user.created_at ? formatDate(user.created_at) : <span className="text-zinc-600">—</span>}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {user.roles.includes("seller") ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-zinc-400 hover:text-red-400 disabled:opacity-20 disabled:pointer-events-none"
                              onClick={() => handleRevokeRole(user.id, "seller")}
                              title="Revoke seller role"
                              disabled={isSelf}
                            >
                              <ShieldOff className="size-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-zinc-400 hover:text-green-400 disabled:opacity-20 disabled:pointer-events-none"
                              onClick={() => handleGrantRole(user.id, "seller")}
                              title="Grant seller role"
                              disabled={isSelf}
                            >
                              <Shield className="size-4" />
                            </Button>
                          )}
                          {user.account_status === "active" ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-zinc-400 hover:text-yellow-400 disabled:opacity-20 disabled:pointer-events-none"
                              onClick={() => handleToggleStatus(user.id, user.account_status)}
                              title="Suspend user"
                              disabled={isSelf}
                            >
                              <Ban className="size-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-8 text-zinc-400 hover:text-green-400 disabled:opacity-20 disabled:pointer-events-none"
                              onClick={() => handleToggleStatus(user.id, user.account_status)}
                              title="Reactivate user"
                              disabled={isSelf}
                            >
                              <CheckCircle className="size-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </div>

      {!isLoading && totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage(Math.max(1, safePage - 1))}
                  className={safePage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={p === safePage}
                    onClick={() => setPage(p)}
                    className="cursor-pointer"
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage(Math.min(totalPages, safePage + 1))}
                  className={safePage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
