import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/browserClient";
import { getLoginRedirect } from "@/components/RouteGuards";
import type { AuthUser } from "@/lib/supabase/types";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth/callback")({
  component: AuthCallback,
});

function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (cancelled) return;
      if (event === "SIGNED_IN" || (event === "INITIAL_SESSION" && session)) {
        const authUser = session.user;
        if (!authUser) {
          navigate({ to: "/login" });
          return;
        }

        const { data: profile } = await supabase
          .from("user_profiles")
          .select("id, username, display_name, avatar_url, bio, account_status, created_at")
          .eq("id", authUser.id)
          .single();

        const { data: roleRows } = await supabase
          .from("user_roles_current")
          .select("role_key, label")
          .eq("user_id", authUser.id);

        const roleKeys = roleRows?.map((r) => r.role_key) ?? [];
        const user: AuthUser = {
          id: authUser.id,
          username: profile?.username ?? authUser.email?.split("@")[0] ?? "user",
          email: authUser.email,
          display_name: profile?.display_name ?? null,
          avatar_url: profile?.avatar_url ?? null,
          bio: profile?.bio ?? null,
          account_status: profile?.account_status ?? "active",
          roles: roleKeys,
        };

        const path = getLoginRedirect(user);
        navigate({ to: path });
      }
    });

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-6 py-12">
      <div className="text-center">
        <Loader2 className="size-8 animate-spin mx-auto mb-4 text-brand-red" />
        <p className="text-sm text-zinc-500">Signing you in...</p>
      </div>
    </div>
  );
}
