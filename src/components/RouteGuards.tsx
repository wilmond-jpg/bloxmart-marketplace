import type { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { NotAuthorized } from "@/components/NotAuthorized";
import { Loader2 } from "lucide-react";

function LoadingSpinner() {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <Loader2 className="size-8 animate-spin text-brand-red" />
    </div>
  );
}

export function AuthGuard({ children }: { children: ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!isLoggedIn) {
    return (
      <NotAuthorized
        message="You need to log in to access this page."
        backTo="/login"
        backLabel="Log in"
      />
    );
  }
  return <>{children}</>;
}

export function AdminGuard({ children }: { children: ReactNode }) {
  const { isLoggedIn, isAdmin, isModerator, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!isLoggedIn) {
    return (
      <NotAuthorized
        requiredRole="admin or moderator"
        backTo="/login"
        backLabel="Log in"
      />
    );
  }
  if (!isAdmin && !isModerator) {
    return <NotAuthorized requiredRole="admin or moderator" backTo="/dashboard" backLabel="Go to dashboard" />;
  }
  return <>{children}</>;
}

export function AdminOnlyGuard({ children }: { children: ReactNode }) {
  const { isLoggedIn, isAdmin, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!isLoggedIn) {
    return (
      <NotAuthorized
        requiredRole="admin"
        backTo="/login"
        backLabel="Log in"
      />
    );
  }
  if (!isAdmin) {
    return <NotAuthorized requiredRole="admin" backTo="/dashboard" backLabel="Go to dashboard" />;
  }
  return <>{children}</>;
}

export function getLoginRedirect(user: { roles: string[] } | null): string {
  if (!user) return "/";
  if (user.roles.includes("admin") || user.roles.includes("moderator")) {
    return "/admin/dashboard";
  }
  if (user.roles.includes("seller") || user.roles.includes("verified_trader")) {
    return "/dashboard";
  }
  return "/dashboard";
}
