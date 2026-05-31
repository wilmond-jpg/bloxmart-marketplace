import { createFileRoute } from "@tanstack/react-router";
import { AdminOnlyGuard } from "@/components/RouteGuards";
import { Users, Shield, ShieldOff, Ban, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockUsers, formatDate, getStatusColor } from "@/lib/admin/mockData";

export const Route = createFileRoute("/admin/users")({
  component: AdminUsers,
});

function AdminUsers() {
  return (
    <AdminOnlyGuard>
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

        <div className="bg-surface rounded-2xl ring-1 ring-white/5 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-zinc-800">
                <TableHead className="w-12">Avatar</TableHead>
                <TableHead>Username</TableHead>
                <TableHead className="hidden md:table-cell">Email</TableHead>
                <TableHead>Roles</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockUsers.map((user) => (
                <TableRow key={user.id} className="border-zinc-800">
                  <TableCell>
                    <Avatar className="size-8 ring-1 ring-zinc-800">
                      <AvatarFallback className="bg-brand-red text-xs font-bold text-white">
                        {user.username.slice(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell className="font-medium">{user.username}</TableCell>
                  <TableCell className="hidden md:table-cell text-zinc-400">{user.email}</TableCell>
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
                    {formatDate(user.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="size-8 text-zinc-400 hover:text-green-400">
                        {user.roles.includes("seller") ? <Shield className="size-4" /> : <ShieldOff className="size-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" className="size-8 text-zinc-400 hover:text-red-400">
                        {user.account_status === "active" ? <Ban className="size-4" /> : <CheckCircle className="size-4" />}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminOnlyGuard>
  );
}
