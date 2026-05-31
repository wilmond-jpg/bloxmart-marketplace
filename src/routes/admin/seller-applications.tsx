import { createFileRoute } from "@tanstack/react-router";
import { FileText, CheckCircle, XCircle, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockSellerApplications, formatDate, getStatusColor } from "@/lib/admin/mockData";

export const Route = createFileRoute("/admin/seller-applications")({
  component: SellerApplications,
});

function SellerApplications() {
  const pendingCount = mockSellerApplications.filter((a) => a.status === "pending").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="size-10 rounded-xl bg-brand-red/10 grid place-items-center">
          <FileText className="size-5 text-brand-red" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Seller Applications</h1>
          <p className="text-sm text-zinc-500">
            {pendingCount} pending application{pendingCount !== 1 ? "s" : ""} awaiting review.
          </p>
        </div>
      </div>

      <div className="bg-surface rounded-2xl ring-1 ring-white/5 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800">
              <TableHead>Applicant</TableHead>
              <TableHead className="hidden sm:table-cell">Full Name</TableHead>
              <TableHead className="hidden md:table-cell">Contact Email</TableHead>
              <TableHead className="hidden lg:table-cell">Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockSellerApplications.map((app) => (
              <TableRow key={app.id} className="border-zinc-800">
                <TableCell className="font-medium">{app.username}</TableCell>
                <TableCell className="hidden sm:table-cell text-zinc-400">{app.full_name}</TableCell>
                <TableCell className="hidden md:table-cell text-zinc-400">{app.contact_email}</TableCell>
                <TableCell className="hidden lg:table-cell text-zinc-400 text-sm max-w-xs truncate">
                  {app.reason}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={`text-[10px] capitalize ${getStatusColor(app.status)}`}>
                    {app.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-zinc-400 text-sm">
                  {formatDate(app.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  {app.status === "pending" ? (
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300 hover:bg-green-400/10">
                        <CheckCircle className="size-4 mr-1" /> Approve
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                        <XCircle className="size-4 mr-1" /> Reject
                      </Button>
                    </div>
                  ) : (
                    <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-300">
                      <ExternalLink className="size-4 mr-1" /> View
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
