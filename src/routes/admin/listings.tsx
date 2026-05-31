import { createFileRoute } from "@tanstack/react-router";
import { Package, EyeOff, Eye } from "lucide-react";
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
import { mockListings, formatDate, getStatusColor } from "@/lib/admin/mockData";

export const Route = createFileRoute("/admin/listings")({
  component: AdminListings,
});

function AdminListings() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="size-10 rounded-xl bg-brand-red/10 grid place-items-center">
          <Package className="size-5 text-brand-red" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Listings</h1>
          <p className="text-sm text-zinc-500">View and manage all marketplace listings.</p>
        </div>
      </div>

      <div className="bg-surface rounded-2xl ring-1 ring-white/5 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800">
              <TableHead>Title</TableHead>
              <TableHead className="hidden sm:table-cell">Seller</TableHead>
              <TableHead className="hidden md:table-cell">Type</TableHead>
              <TableHead className="text-right">Price (₱)</TableHead>
              <TableHead className="text-right hidden lg:table-cell">RAP</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden lg:table-cell">Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockListings.map((listing) => (
              <TableRow key={listing.id} className="border-zinc-800">
                <TableCell className="font-medium">{listing.title}</TableCell>
                <TableCell className="hidden sm:table-cell text-zinc-400">{listing.seller_name}</TableCell>
                <TableCell className="hidden md:table-cell text-zinc-400 text-sm">
                  <Badge variant="outline" className="text-[10px] border-zinc-700">
                    {listing.item_type}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-mono text-sm">{listing.price_php.toLocaleString()}</TableCell>
                <TableCell className="text-right font-mono text-sm hidden lg:table-cell text-zinc-400">
                  {listing.rap.toLocaleString()}
                </TableCell>
                <TableCell>
                  <span className={`text-xs font-medium ${getStatusColor(listing.status)}`}>
                    {listing.status}
                  </span>
                </TableCell>
                <TableCell className="hidden lg:table-cell text-zinc-400 text-sm">
                  {formatDate(listing.created_at)}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" className="size-8 text-zinc-400 hover:text-yellow-400">
                    {listing.status === "published" ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
