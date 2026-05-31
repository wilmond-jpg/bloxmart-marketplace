import { createClient } from "@/lib/supabase/browserClient";
import type { Profile } from "@/lib/supabase/types";

export type AdminUser = Profile & {
  roles: string[];
};

export type RoleAction = "grant" | "revoke";

function getSupabase() {
  return createClient();
}

export async function fetchUsers(): Promise<AdminUser[]> {
  const supabase = getSupabase();

  const { data: profiles, error: profileError } = await supabase
    .from("user_profiles")
    .select("id, username, display_name, avatar_url, bio, account_status, created_at")
    .order("created_at", { ascending: false });

  if (profileError) {
    console.error("Error fetching users:", profileError);
    throw profileError;
  }

  const { data: roleRows, error: roleError } = await supabase
    .from("user_roles_current")
    .select("user_id, role_key");

  if (roleError) {
    console.error("Error fetching roles:", roleError);
    throw roleError;
  }

  const rolesByUser: Record<string, string[]> = {};
  for (const row of roleRows ?? []) {
    if (!rolesByUser[row.user_id]) rolesByUser[row.user_id] = [];
    rolesByUser[row.user_id].push(row.role_key);
  }

  return (profiles ?? []).map((profile) => {
    const _profile = profile as Profile;
    return {
      ..._profile,
      roles: rolesByUser[_profile.id] ?? ["buyer"],
    };
  });
}

export async function grantUserRole(
  userId: string,
  roleKey: string,
  reason?: string
): Promise<void> {
  const supabase = getSupabase();

  const { error } = await supabase.rpc("grant_role", {
    target_user_id: userId,
    target_role_key: roleKey,
    reason_val: reason ?? null,
  });

  if (error) {
    console.error("Error granting role:", error);
    throw error;
  }
}

export async function revokeUserRole(
  userId: string,
  roleKey: string,
  reason?: string
): Promise<void> {
  const supabase = getSupabase();

  const { error } = await supabase.rpc("revoke_role", {
    target_user_id: userId,
    target_role_key: roleKey,
    reason_val: reason ?? null,
  });

  if (error) {
    console.error("Error revoking role:", error);
    throw error;
  }
}

export async function updateUserAccountStatus(
  userId: string,
  newStatus: "active" | "suspended" | "banned",
  reason?: string
): Promise<void> {
  const supabase = getSupabase();

  const { error } = await supabase.rpc("update_account_status", {
    target_user_id: userId,
    new_status: newStatus,
    reason_val: reason ?? null,
  });

  if (error) {
    console.error("Error updating account status:", error);
    throw error;
  }
}
