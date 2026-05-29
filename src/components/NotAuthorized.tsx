import { Link } from "@tanstack/react-router";
import { ShieldX } from "lucide-react";

type RoleLabel = "admin" | "moderator" | "admin or moderator" | "seller" | string;

const roleMessages: Record<string, string> = {
  admin: "This area is restricted to administrators only.",
  moderator: "This area is restricted to moderators and administrators.",
  "admin or moderator": "This area is restricted to moderators and administrators.",
  seller: "This area is restricted to approved sellers only.",
};

export function NotAuthorized({
  requiredRole,
  message,
  backTo = "/",
  backLabel = "Go home",
}: {
  requiredRole?: RoleLabel;
  message?: string;
  backTo?: string;
  backLabel?: string;
}) {
  const desc =
    message ?? roleMessages[requiredRole ?? ""] ?? "You don't have permission to access this page.";

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-6 py-12">
      <div className="max-w-md text-center">
        <div className="size-16 rounded-2xl bg-brand-red/10 grid place-items-center mx-auto mb-4">
          <ShieldX className="size-8 text-brand-red" />
        </div>
        <h1 className="text-2xl font-semibold mb-3">Not Authorized</h1>
        <p className="text-zinc-500 mb-2">{desc}</p>
        {requiredRole && (
          <p className="text-sm text-zinc-600 mb-6">
            Required role: <span className="text-brand-red font-medium capitalize">{requiredRole}</span>
          </p>
        )}
        {!requiredRole && <div className="mb-6" />}
        <Link
          to={backTo as never}
          className="inline-block bg-brand-red hover:bg-brand-red-hover text-white font-medium py-2.5 px-6 rounded-lg ring-1 ring-brand-red transition-colors"
        >
          {backLabel}
        </Link>
      </div>
    </div>
  );
}
