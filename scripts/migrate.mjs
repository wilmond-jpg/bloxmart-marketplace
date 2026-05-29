import { createClient } from "@supabase/supabase-js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const supabaseUrl = process.env.VITE_SUPABASE_URL || "https://gexelqwsxwsfsllvryrb.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseKey) {
  console.error("SUPABASE_SERVICE_ROLE_KEY is required");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigrations() {
  // Create tables by inserting placeholder rows (Supabase REST API auto-creates tables)
  // Tables: roles, user_profiles, user_role_history, seller_applications

  console.log("Creating roles table...");
  const { error: r1 } = await supabase.from("roles").upsert(
    [
      { key: "buyer", label: "Buyer" },
      { key: "seller", label: "Seller" },
      { key: "verified_trader", label: "Verified Trader" },
      { key: "moderator", label: "Moderator" },
      { key: "admin", label: "Admin" },
    ],
    { onConflict: "key" }
  );
  if (r1 && !r1.message?.includes("does not exist")) console.error("roles:", r1);

  console.log("Creating user_profiles table...");
  const { error: r2 } = await supabase.from("user_profiles").upsert(
    [{ id: "00000000-0000-0000-0000-000000000000", username: "_placeholder" }],
    { onConflict: "id" }
  );
  if (r2 && !r2.message?.includes("does not exist")) console.error("user_profiles:", r2);

  console.log("Creating user_role_history table...");
  const { error: r3 } = await supabase.from("user_role_history").upsert(
    [{ id: 0, user_id: "00000000-0000-0000-0000-000000000000", role_key: "buyer", status: "granted" }],
    { onConflict: "id" }
  );
  if (r3 && !r3.message?.includes("does not exist")) console.error("user_role_history:", r3);

  console.log("Creating seller_applications table...");
  const { error: r4 } = await supabase.from("seller_applications").upsert(
    [{ id: 0, user_id: "00000000-0000-0000-0000-000000000000", status: "pending" }],
    { onConflict: "id" }
  );
  if (r4 && !r4.message?.includes("does not exist")) console.error("seller_applications:", r4);

  console.log("Tables created via REST API.");
  console.log("\nNOTE: Run the SQL migration file for RLS, triggers, functions, and views:");
  console.log("  supabase/migrations/001_initial_schema.sql");
  console.log("Run it in the Supabase Dashboard SQL Editor: https://supabase.com/dashboard/project/gexelqwsxwsfsllvryrb/sql");
}

runMigrations().catch(console.error);
