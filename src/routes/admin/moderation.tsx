import { createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, Flag, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockFlags, mockDisputes, formatDate, getStatusColor } from "@/lib/admin/mockData";

export const Route = createFileRoute("/admin/moderation")({
  component: Moderation,
});

function Moderation() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="size-10 rounded-xl bg-brand-red/10 grid place-items-center">
          <ShieldCheck className="size-5 text-brand-red" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Moderation</h1>
          <p className="text-sm text-zinc-500">Review flags, disputes, and reported content.</p>
        </div>
      </div>

      <Tabs defaultValue="flags" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="flags" className="flex items-center gap-2">
            <Flag className="size-4" /> Flags
          </TabsTrigger>
          <TabsTrigger value="disputes" className="flex items-center gap-2">
            <Scale className="size-4" /> Disputes
          </TabsTrigger>
        </TabsList>

        <TabsContent value="flags">
          <div className="bg-surface rounded-2xl ring-1 ring-white/5 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800">
                  <TableHead>Reported By</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead className="hidden md:table-cell">Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockFlags.map((flag) => (
                  <TableRow key={flag.id} className="border-zinc-800">
                    <TableCell className="font-medium">{flag.reported_by}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Badge variant="outline" className="text-[10px] border-zinc-700 capitalize">
                          {flag.target_type}
                        </Badge>
                        <span className="text-sm text-zinc-300">{flag.target_label}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-zinc-400 text-sm max-w-xs truncate">
                      {flag.reason}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`text-[10px] capitalize ${getStatusColor(flag.status)}`}>
                        {flag.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-zinc-400 text-sm">
                      {formatDate(flag.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-300">
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="disputes">
          <div className="bg-surface rounded-2xl ring-1 ring-white/5 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-zinc-800">
                  <TableHead>Trade ID</TableHead>
                  <TableHead>Initiator</TableHead>
                  <TableHead>Moderator</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Resolution</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDisputes.map((dispute) => (
                  <TableRow key={dispute.id} className="border-zinc-800">
                    <TableCell className="font-mono text-xs text-zinc-400">{dispute.trade_id}</TableCell>
                    <TableCell className="font-medium">{dispute.initiator}</TableCell>
                    <TableCell className="text-zinc-400">
                      {dispute.moderator ?? <span className="text-zinc-600">Unassigned</span>}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={`text-[10px] capitalize ${getStatusColor(dispute.status)}`}>
                        {dispute.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-zinc-400 text-sm max-w-xs truncate">
                      {dispute.resolution ?? <span className="text-zinc-600">—</span>}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-zinc-400 text-sm">
                      {formatDate(dispute.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-300">
                        Review
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
