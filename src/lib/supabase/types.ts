export type Profile = {
  id: string;
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  account_status: string;
  created_at: string;
};

export type UserRole = {
  role_key: string;
  label: string;
};

export type AuthUser = {
  id: string;
  username: string;
  email: string | undefined;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  account_status: string;
  created_at: string | null;
  roles: string[];
};

export type RoleKey = "buyer" | "seller" | "verified_trader" | "moderator" | "admin";
