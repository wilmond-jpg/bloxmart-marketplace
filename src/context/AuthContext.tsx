import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import { createClient } from "@/lib/supabase/browserClient";
import type { AuthUser } from "@/lib/supabase/types";
import type { Session } from "@supabase/supabase-js";

type Ctx = {
  user: AuthUser | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isModerator: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  const fetchProfile = useCallback(
    async (session: Session | null) => {
      if (!session?.user) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      const authUser = session.user;

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

      setUser({
        id: authUser.id,
        username: profile?.username ?? authUser.email?.split("@")[0] ?? "user",
        email: authUser.email,
        display_name: profile?.display_name ?? null,
        avatar_url: profile?.avatar_url ?? null,
        bio: profile?.bio ?? null,
        account_status: profile?.account_status ?? "active",
        created_at: profile?.created_at ?? null,
        roles: roleKeys,
      });
      setIsLoading(false);
    },
    [supabase]
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchProfile(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchProfile(session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile, supabase]);

  const login = useCallback(
    async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    },
    [supabase]
  );

  const signup = useCallback(
    async (username: string, email: string, password: string) => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username } },
      });
      if (error) throw error;
    },
    [supabase]
  );

  const signInWithGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) throw error;
  }, [supabase]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    await fetchProfile(session);
  }, [fetchProfile, supabase]);

  const isAdmin = user?.roles.includes("admin") ?? false;
  const isModerator = user?.roles.includes("moderator") ?? false;

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, isLoading, isAdmin, isModerator, login, signup, signInWithGoogle, logout, refreshProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
