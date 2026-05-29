import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AuthGuard } from "@/components/RouteGuards";
import { createClient } from "@/lib/supabase/browserClient";
import { toast } from "sonner";
import { Loader2, FileText } from "lucide-react";

export const Route = createFileRoute("/seller/apply")({
  head: () => ({ meta: [{ title: "Apply as Seller — BloxMart" }] }),
  component: SellerApply,
});

function SellerApply() {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !reason) return;
    setSubmitting(true);

    const supabase = createClient();
    const { error } = await supabase.from("seller_applications").upsert({
      user_id: user!.id,
      full_name: fullName,
      contact_email: contactEmail || user!.email,
      reason,
      status: "pending",
    }, { onConflict: "user_id" });

    if (error) {
      toast.error(error.message);
    } else {
      setSubmitted(true);
      toast.success("Your seller application has been submitted!");
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <AuthGuard>
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <div className="size-16 rounded-2xl bg-brand-red/10 grid place-items-center mx-auto mb-4"><FileText className="size-8 text-brand-red" /></div>
        <h1 className="text-2xl font-semibold mb-3">Application Submitted</h1>
        <p className="text-zinc-500 mb-6">Your application is being reviewed. You'll be notified once a decision is made.</p>
        <Link to="/dashboard" className="inline-block bg-brand-red hover:bg-brand-red-hover text-white font-medium py-2.5 px-6 rounded-lg ring-1 ring-brand-red">Back to Dashboard</Link>
      </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="bg-surface rounded-2xl ring-1 ring-white/5 p-6 sm:p-8">
        <h1 className="text-2xl font-semibold mb-2">Become a Seller</h1>
        <p className="text-sm text-zinc-500 mb-8">Apply to start selling Roblox limited items on BloxMart.</p>

        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              className="w-full bg-background ring-1 ring-zinc-800 text-sm rounded-lg py-2.5 px-3 focus:outline-none focus:ring-brand-red/50"
              required
            />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Contact Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder={user?.email ?? "you@example.com"}
              className="w-full bg-background ring-1 ring-zinc-800 text-sm rounded-lg py-2.5 px-3 focus:outline-none focus:ring-brand-red/50"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Why do you want to sell on BloxMart?</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Tell us about your trading experience and what you plan to sell..."
              rows={4}
              className="w-full bg-background ring-1 ring-zinc-800 text-sm rounded-lg py-2.5 px-3 focus:outline-none focus:ring-brand-red/50 resize-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-brand-red hover:bg-brand-red-hover text-white font-semibold py-3 px-6 rounded-lg ring-1 ring-brand-red transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
            Submit Application
          </button>
        </form>
      </div>
    </div>
    </AuthGuard>
  );
}
