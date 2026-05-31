import { createFileRoute } from "@tanstack/react-router";
import { ShoppingBag, XCircle, AlertTriangle } from "lucide-react";
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
import { mockTrades, formatDate, getStatusColor } from "@/lib/admin/mockData";

export const Route = createFileRoute("/admin/trades")({
  component: AdminTrades,
});

function AdminTrades() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="size-10 rounded-xl bg-brand-red/10 grid place-items-center">
          <ShoppingBag className="size-5 text-brand-red" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Trades</h1>
          <p className="text-sm text-zinc-500">Monitor and manage all platform trades.</p>
        </div>
      </div>

      <div className="bg-surface rounded-2xl ring-1 ring-white/5 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800">
              <TableHead>Trade ID</TableHead>
              <TableHead>Listing</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead className="hidden sm:table-cell">Seller</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockTrades.map((trade) => (
              <TableRow key={trade.id} className="border-zinc-800">
                <TableCell className="font-mono text-xs text-zinc-400">{trade.id}</TableCell>
                <TableCell className="font-medium">{trade.listing_title}</TableCell>
                <TableCell>{trade.buyer_name}</TableCell>
                <TableCell className="hidden sm:table-cell text-zinc-400">{trade.seller_name}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={`text-[10px] capitalize ${getStatusColor(trade.status)}`}>
                    {trade.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell text-zinc-400 text-sm">
                  {formatDate(trade.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {trade.status === "pending" && (
                      <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-400/10">
                        <XCircle className="size-4 mr-1" /> Cancel
                      </Button>
                    )}
                    {trade.status === "disputed" && (
                      <Button variant="ghost" size="sm" className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10">
                        <AlertTriangle className="size-4 mr-1" /> Review
                      </Button>
                    )}
                    {!["pending", "disputed"].includes(trade.status) && (
                      <span className="text-xs text-zinc-600">—</span>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
