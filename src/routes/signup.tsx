import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Field, OAuthButton } from "./login";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Sign Up — BloxMart" },
      { name: "description", content: "Create your free BloxMart account in 30 seconds and start trading Roblox limiteds." },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !username) return;
    signup(username, email);
    toast.success("Account created! Welcome to BloxMart.");
    navigate({ to: "/" });
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-2xl ring-1 ring-white/5 p-8">
          <h1 className="text-2xl font-semibold mb-2">Create your account</h1>
          <p className="text-sm text-zinc-500 mb-8">Join thousands of Filipino traders on BloxMart.</p>

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
            <Field label="Username" type="text" value={username} onChange={setUsername} placeholder="yourname" />
            <Field label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" />
            <Field label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" />
            <button
              type="submit"
              className="w-full bg-brand-red hover:bg-brand-red-hover text-white font-semibold py-3 px-6 rounded-lg ring-1 ring-brand-red transition-all active:scale-[0.98]"
            >
              Create Account
            </button>
          </form>

          <p className="text-[11px] text-zinc-600 text-center mt-6 leading-relaxed">
            By signing up, you agree to BloxMart's Terms of Service and Privacy Policy.
          </p>

          <p className="text-sm text-zinc-500 text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-brand-red hover:underline font-medium">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
