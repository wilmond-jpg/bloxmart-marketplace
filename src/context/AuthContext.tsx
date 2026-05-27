import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type FakeUser = { username: string; email: string };

type Ctx = {
  user: FakeUser | null;
  isLoggedIn: boolean;
  login: (email: string) => void;
  signup: (username: string, email: string) => void;
  logout: () => void;
};

const AuthContext = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FakeUser | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("bloxmart-user");
    if (raw) {
      try {
        setUser(JSON.parse(raw));
      } catch {
        /* ignore */
      }
    }
  }, []);

  const persist = (u: FakeUser | null) => {
    setUser(u);
    if (typeof window !== "undefined") {
      if (u) localStorage.setItem("bloxmart-user", JSON.stringify(u));
      else localStorage.removeItem("bloxmart-user");
    }
  };

  const login = (email: string) => {
    const username = email.split("@")[0] || "player";
    persist({ username, email });
  };
  const signup = (username: string, email: string) => persist({ username, email });
  const logout = () => persist(null);

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
