import { Link } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShieldCheck } from "lucide-react";

export function BuyModal({ open, onOpenChange, itemName }: { open: boolean; onOpenChange: (o: boolean) => void; itemName: string }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface border-zinc-800 sm:max-w-md">
        <DialogHeader>
          <div className="size-12 rounded-xl bg-brand-red/10 ring-1 ring-brand-red/20 grid place-items-center mb-4">
            <ShieldCheck className="size-6 text-brand-red" />
          </div>
          <DialogTitle className="text-xl">Create an account to purchase</DialogTitle>
          <DialogDescription className="text-zinc-400 pt-2">
            To buy <span className="text-zinc-200 font-medium">{itemName}</span>, you need a free BloxMart account. It only takes 30 seconds.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-2">
          <Link
            to="/login"
            onClick={() => onOpenChange(false)}
            className="flex-1 text-center bg-surface-2 hover:bg-zinc-700 ring-1 ring-zinc-700 text-zinc-100 text-sm font-medium py-2.5 px-5 rounded-lg transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            onClick={() => onOpenChange(false)}
            className="flex-1 text-center bg-brand-red hover:bg-brand-red-hover text-white text-sm font-medium py-2.5 px-5 rounded-lg ring-1 ring-brand-red transition-colors"
          >
            Sign Up Free
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
