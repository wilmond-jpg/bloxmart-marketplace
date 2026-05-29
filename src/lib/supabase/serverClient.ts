import { createServerClient } from "@supabase/ssr";

export function createClient(request: Request) {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

  const cookies = request.headers.get("cookie") ?? "";

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookies.split("; ").map((cookie) => {
          const [name, ...rest] = cookie.split("=");
          return { name, value: decodeURIComponent(rest.join("=")) };
        });
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.headers.set(
            "set-cookie",
            `${name}=${encodeURIComponent(value)}; Path=${options?.path ?? "/"}; Max-Age=${options?.maxAge ?? 0}${options?.httpOnly ? "; HttpOnly" : ""}${options?.secure ? "; Secure" : ""}${options?.sameSite ? `; SameSite=${options.sameSite}` : ""}`
          );
        });
      },
    },
  });
}
