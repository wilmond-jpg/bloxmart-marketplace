import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/context/AuthContext";
import { NotAuthorized } from "@/components/NotAuthorized";
import { FileText, CheckCircle, XCircle, ExternalLink, Search, Loader2 } from "lucide-react";
import { useEffect, useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  mockSellerApplications,
  formatDate,
  getStatusColor,
  type MockSellerApplication,
} from "@/lib/admin/mockData";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

const PAGE_SIZE = 10;

export const Route = createFileRoute("/admin/seller-applications")({
  component: SellerApplications,
});

function SellerApplications() {
  const { isAdmin, isLoading: isAuthLoading } = useAuth();
  const isMobile = useIsMobile();

  const [applications, setApplications] = useState<MockSellerApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<MockSellerApplication | null>(null);
  const [confirmAction, setConfirmAction] = useState<"approve" | "reject">("approve");
  const [rejectionReason, setRejectionReason] = useState("");

  const [viewApp, setViewApp] = useState<MockSellerApplication | null>(null);

  const loadApplications = useCallback(() => {
    setIsLoading(true);
    setApplications([...mockSellerApplications]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!isAdmin) return;
    loadApplications();
  }, [isAuthLoading, isAdmin, loadApplications]);

  const filtered = useMemo(() => {
    let result = applications;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.username.toLowerCase().includes(q) ||
          a.full_name.toLowerCase().includes(q) ||
          a.contact_email.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((a) => a.status === statusFilter);
    }
    return result;
  }, [applications, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageApplications = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  const openConfirmation = (app: MockSellerApplication, action: "approve" | "reject") => {
    setSelectedApp(app);
    setConfirmAction(action);
    setRejectionReason("");
    setConfirmationOpen(true);
  };

  const handleConfirm = () => {
    if (!selectedApp) return;
    setApplications((prev) =>
      prev.map((a) =>
        a.id === selectedApp.id
          ? { ...a, status: confirmAction === "approve" ? "approved" : "rejected" }
          : a,
      ),
    );
    toast.success(
      confirmAction === "approve"
        ? `Approved ${selectedApp.username}'s seller application`
        : `Rejected ${selectedApp.username}'s seller application`,
    );
    setConfirmationOpen(false);
    setSelectedApp(null);
  };

  const openView = (app: MockSellerApplication) => {
    setViewApp(app);
  };

  const handleViewAction = (app: MockSellerApplication, action: "approve" | "reject") => {
    setViewApp(null);
    setTimeout(() => openConfirmation(app, action), 150);
  };

  if (isAuthLoading) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-brand-red" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <NotAuthorized requiredRole="admin" backTo="/admin/dashboard" backLabel="Go to dashboard" />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="size-10 rounded-xl bg-brand-red/10 grid place-items-center">
          <FileText className="size-5 text-brand-red" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">Seller Applications</h1>
          <p className="text-sm text-zinc-500">
            {applications.filter((a) => a.status === "pending").length} pending application
            {applications.filter((a) => a.status === "pending").length !== 1 ? "s" : ""} awaiting
            review.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 size-4 text-zinc-500 pointer-events-none" />
          <Input
            placeholder="Search by username, name, or email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full bg-surface ring-1 ring-zinc-800 text-sm rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-brand-red/50"
          />
        </div>
        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-3">
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-44 bg-surface ring-1 ring-zinc-800 text-sm">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent className="bg-surface border-zinc-800">
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-surface rounded-2xl ring-1 ring-white/5 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="size-8 animate-spin text-brand-red" />
          </div>
        ) : pageApplications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <FileText className="size-12 text-zinc-700 mb-4" />
            <p className="text-zinc-500 text-sm font-medium">
              {search || statusFilter !== "all"
                ? "No applications match your filters"
                : "No applications found"}
            </p>
            <p className="text-xs text-zinc-600 mt-1">
              {search || statusFilter !== "all"
                ? "Try adjusting your search or filter criteria."
                : "Seller applications will appear here once users apply."}
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-zinc-800 md:hidden">
              {pageApplications.map((app) => (
                <div key={app.id} className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-10 ring-1 ring-zinc-800 shrink-0">
                      <AvatarFallback className="bg-brand-red text-sm font-bold text-white">
                        {app.username.slice(0, 1).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{app.username}</p>
                      <Badge
                        variant="secondary"
                        className={`text-[10px] capitalize ${getStatusColor(app.status)}`}
                      >
                        {app.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {app.status === "pending" && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-zinc-400 hover:text-green-400"
                            onClick={() => openConfirmation(app, "approve")}
                            title="Approve"
                          >
                            <CheckCircle className="size-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-zinc-400 hover:text-red-400"
                            onClick={() => openConfirmation(app, "reject")}
                            title="Reject"
                          >
                            <XCircle className="size-4" />
                          </Button>
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-zinc-400 hover:text-zinc-300"
                        onClick={() => openView(app)}
                        title="View details"
                      >
                        <ExternalLink className="size-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-zinc-500">
                    <span>{app.contact_email}</span>
                    <span>{formatDate(app.created_at)}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800">
                    <TableHead className="w-12">Avatar</TableHead>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden md:table-cell">Contact Email</TableHead>
                    <TableHead className="hidden lg:table-cell">Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pageApplications.map((app) => (
                    <TableRow key={app.id} className="border-zinc-800">
                      <TableCell>
                        <Avatar className="size-8 ring-1 ring-zinc-800">
                          <AvatarFallback className="bg-brand-red text-xs font-bold text-white">
                            {app.username.slice(0, 1).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">{app.username}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={`text-[10px] capitalize ${getStatusColor(app.status)}`}
                        >
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-zinc-400 text-sm">
                        {app.contact_email}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-zinc-400 text-sm">
                        {formatDate(app.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {app.status === "pending" && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 text-zinc-400 hover:text-green-400"
                                onClick={() => openConfirmation(app, "approve")}
                                title="Approve"
                              >
                                <CheckCircle className="size-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 text-zinc-400 hover:text-red-400"
                                onClick={() => openConfirmation(app, "reject")}
                                title="Reject"
                              >
                                <XCircle className="size-4" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-zinc-400 hover:text-zinc-300"
                            onClick={() => openView(app)}
                            title="View details"
                          >
                            <ExternalLink className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
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
                  className={
                    safePage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <Drawer open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>
              {confirmAction === "approve" ? "Approve Application" : "Reject Application"}
            </DrawerTitle>
            <DrawerDescription>
              {confirmAction === "approve"
                ? `Are you sure you want to approve ${selectedApp?.username}'s seller application?`
                : `Are you sure you want to reject ${selectedApp?.username}'s seller application?`}
            </DrawerDescription>
          </DrawerHeader>
          {confirmAction === "reject" && (
            <div className="px-4 space-y-2 pb-2">
              <label className="text-sm text-zinc-400">Rejection Reason (optional)</label>
              <Textarea
                placeholder="Provide a reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="bg-zinc-900 border-zinc-700 focus:ring-brand-red/50 text-sm"
                rows={3}
              />
            </div>
          )}
          <DrawerFooter>
            <Button variant="outline" onClick={() => setConfirmationOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              variant={confirmAction === "approve" ? "default" : "destructive"}
              className={confirmAction === "approve" ? "bg-green-600 hover:bg-green-700" : ""}
            >
              {confirmAction === "approve" ? "Approve" : "Reject"}
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {viewApp &&
        (isMobile ? (
          <Drawer
            open={!!viewApp}
            onOpenChange={(open) => {
              if (!open) setViewApp(null);
            }}
          >
            <DrawerContent>
              <ApplicationDetailContent
                app={viewApp}
                onAction={handleViewAction}
                context="drawer"
              />
            </DrawerContent>
          </Drawer>
        ) : (
          <Dialog
            open={!!viewApp}
            onOpenChange={(open) => {
              if (!open) setViewApp(null);
            }}
          >
            <DialogContent className="bg-surface border-zinc-800 sm:max-w-md">
              <ApplicationDetailContent
                app={viewApp}
                onAction={handleViewAction}
                context="dialog"
              />
            </DialogContent>
          </Dialog>
        ))}
    </div>
  );
}

function ApplicationDetailContent({
  app,
  onAction,
  context,
}: {
  app: MockSellerApplication;
  onAction: (app: MockSellerApplication, action: "approve" | "reject") => void;
  context: "dialog" | "drawer";
}) {
  const Header = context === "dialog" ? DialogHeader : DrawerHeader;
  const Title = context === "dialog" ? DialogTitle : DrawerTitle;
  const Description = context === "dialog" ? DialogDescription : DrawerDescription;
  const Footer = context === "dialog" ? DialogFooter : DrawerFooter;

  return (
    <>
      <Header>
        <Title className="flex items-center gap-2">
          <Avatar className="size-7 ring-1 ring-zinc-800 shrink-0">
            <AvatarFallback className="bg-brand-red text-[10px] font-bold text-white">
              {app.username.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {app.username}
        </Title>
        <Description>Full applicant details</Description>
      </Header>
      <div className="px-4 sm:px-6 space-y-4 pb-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-zinc-500 text-xs">Full Name</p>
            <p className="text-zinc-200">{app.full_name}</p>
          </div>
          <div>
            <p className="text-zinc-500 text-xs">Contact Email</p>
            <p className="text-zinc-200 break-all">{app.contact_email}</p>
          </div>
          <div>
            <p className="text-zinc-500 text-xs">Submitted</p>
            <p className="text-zinc-200">{formatDate(app.created_at)}</p>
          </div>
          <div>
            <p className="text-zinc-500 text-xs">Status</p>
            <Badge
              variant="secondary"
              className={`text-[10px] capitalize ${getStatusColor(app.status)}`}
            >
              {app.status}
            </Badge>
          </div>
        </div>
        <div>
          <p className="text-zinc-500 text-xs mb-1.5">Application Note</p>
          <p className="text-zinc-200 text-sm bg-zinc-900 rounded-lg p-3 ring-1 ring-zinc-800 leading-relaxed">
            {app.reason}
          </p>
        </div>
      </div>
      {app.status === "pending" && (
        <Footer className="sm:justify-start">
          <div className="grid grid-cols-2 gap-3 w-full">
            <Button
              variant="outline"
              className="border-green-600/30 text-green-400 hover:bg-green-400/10 hover:text-green-300"
              onClick={() => onAction(app, "approve")}
            >
              <CheckCircle className="size-4 mr-2" /> Approve
            </Button>
            <Button
              variant="outline"
              className="border-red-600/30 text-red-400 hover:bg-red-400/10 hover:text-red-300"
              onClick={() => onAction(app, "reject")}
            >
              <XCircle className="size-4 mr-2" /> Reject
            </Button>
          </div>
        </Footer>
      )}
    </>
  );
}
