import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — BloxMart" },
      { name: "description", content: "Log in to your BloxMart account to buy and sell Roblox limited items." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    login(email);
    toast.success("Welcome back!");
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-2xl ring-1 ring-white/5 p-8">
          <h1 className="text-2xl font-semibold mb-2">Welcome back</h1>
          <p className="text-sm text-zinc-500 mb-8">Log in to continue trading on BloxMart.</p>

          <div className="space-y-3 mb-6">
            <OAuthButton provider="Discord" color="#5865F2" />
            <OAuthButton provider="Facebook" color="#1877F2" />
          </div>

          <div className="flex items-center gap-3 my-6">
            <div className="h-px flex-1 bg-zinc-800" />
            <span className="text-[10px] uppercase tracking-widest text-zinc-600">or with email</span>
            <div className="h-px flex-1 bg-zinc-800" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
            <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
            <button
              type="submit"
              className="w-full bg-brand-red hover:bg-brand-red-hover text-white font-semibold py-3 px-6 rounded-lg ring-1 ring-brand-red transition-all active:scale-[0.98]"
            >
              Log In
            </button>
          </form>

          <p className="text-sm text-zinc-500 text-center mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-brand-red hover:underline font-medium">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function Field({ label, type, value, onChange, placeholder }: { label: string; type: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs font-medium text-zinc-400 mb-1.5 block">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-background ring-1 ring-zinc-800 text-sm rounded-lg py-2.5 px-3 focus:outline-none focus:ring-brand-red/50"
      />
    </div>
  );
}

export function OAuthButton({ provider, color }: { provider: string; color: string }) {
  return (
    <button
      type="button"
      onClick={() => toast.info(`${provider} login is UI only in this demo.`)}
      className="w-full flex items-center justify-center gap-3 bg-background hover:bg-zinc-900 ring-1 ring-zinc-800 text-sm font-medium py-2.5 px-4 rounded-lg transition-colors"
    >
      <span className="size-5 rounded-md" style={{ backgroundColor: color }} />
      Continue with {provider}
    </button>
  );
}
