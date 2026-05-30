import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { AuthGuard } from "@/components/RouteGuards";
import { createClient } from "@/lib/supabase/browserClient";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Pencil,
  Save,
  X,
  Upload,
  TrendingUp,
  Star,
  ShieldCheck,
  ExternalLink,
  ShoppingBag,
  Loader2,
} from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — BloxMart" },
      { name: "description", content: "Your BloxMart profile." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { user, refreshProfile } = useAuth();
  const supabase = createClient();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.display_name ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const currentAvatarUrl = avatarPreview ?? user?.avatar_url ?? null;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const save = async () => {
    if (!user) return;
    setSaving(true);

    try {
      let avatar_url = user.avatar_url;

      if (avatarFile) {
        const ext = avatarFile.name.split(".").pop() ?? "png";
        const filePath = `${user.id}/avatar.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("user-avatars")
          .upload(filePath, avatarFile, { upsert: true });

        if (uploadError) {
          toast.error(uploadError.message);
          setSaving(false);
          return;
        }

        const { data: urlData } = supabase.storage
          .from("user-avatars")
          .getPublicUrl(filePath);

        avatar_url = urlData.publicUrl;
      }

      const { error: updateError } = await supabase
        .from("user_profiles")
        .update({
          display_name: displayName || null,
          bio: bio || null,
          avatar_url,
        })
        .eq("id", user.id);

      if (updateError) {
        toast.error(updateError.message);
        setSaving(false);
        return;
      }

      toast.success("Profile updated!");
      setEditing(false);
      setAvatarFile(null);

      refreshProfile();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => {
    setDisplayName(user?.display_name ?? "");
    setBio(user?.bio ?? "");
    setAvatarFile(null);
    setAvatarPreview(null);
    setEditing(false);
  };

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : null;

  if (!user) return null;

  return (
    <AuthGuard>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-200 transition-colors mb-6"
        >
          <ShoppingBag className="size-4" />
          Back to Dashboard
        </Link>

        {/* Profile Card */}
        <div className="bg-surface rounded-2xl ring-1 ring-white/5 p-6 sm:p-8 mb-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-5">
              {/* Avatar */}
              <div className="relative shrink-0">
                <Avatar className="size-20 sm:size-24 ring-2 ring-zinc-800">
                  {currentAvatarUrl ? (
                    <AvatarImage src={currentAvatarUrl} alt={user?.username} />
                  ) : null}
                  <AvatarFallback className="bg-brand-red text-white text-2xl sm:text-3xl font-bold">
                    {user?.username?.slice(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {editing && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 size-8 rounded-full bg-brand-red text-white grid place-items-center ring-2 ring-surface hover:bg-brand-red-hover transition-colors"
                  >
                    <Upload className="size-3.5" />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              {/* Identity */}
              <div className="min-w-0">
                {editing ? (
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Display name"
                    className="w-full bg-background ring-1 ring-zinc-800 text-lg font-semibold rounded-lg py-1.5 px-3 focus:outline-none focus:ring-brand-red/50 mb-1"
                  />
                ) : (
                  <h1 className="text-xl sm:text-2xl font-semibold truncate">
                    {user?.display_name || user?.username}
                  </h1>
                )}
                <p className="text-sm text-zinc-500">@{user?.username}</p>
              </div>
            </div>

            {/* Edit / Save-Cancel buttons */}
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-100 bg-background ring-1 ring-zinc-800 rounded-lg py-2 px-3 transition-colors shrink-0"
              >
                <Pencil className="size-3.5" />
                Edit Profile
              </button>
            ) : (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={save}
                  disabled={saving}
                  className="flex items-center gap-1.5 text-xs font-medium bg-brand-red text-white rounded-lg py-2 px-3 hover:bg-brand-red-hover transition-colors disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Save className="size-3.5" />
                  )}
                  Save
                </button>
                <button
                  onClick={cancel}
                  disabled={saving}
                  className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-zinc-100 bg-background ring-1 ring-zinc-800 rounded-lg py-2 px-3 transition-colors disabled:opacity-50"
                >
                  <X className="size-3.5" />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Bio */}
          {editing ? (
            <div className="mb-5">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell other traders about yourself..."
                rows={3}
                maxLength={200}
                className="w-full bg-background ring-1 ring-zinc-800 text-sm rounded-lg py-2 px-3 focus:outline-none focus:ring-brand-red/50 resize-none"
              />
              <p className="text-[10px] text-zinc-600 mt-1 text-right">{bio.length}/200</p>
            </div>
          ) : (
            <p className="text-sm text-zinc-400 mb-5 leading-relaxed">
              {user?.bio || (
                <span className="text-zinc-600 italic">No bio yet.</span>
              )}
            </p>
          )}

          {/* Roles */}
          <div className="flex flex-wrap gap-2 mb-4">
            {user?.roles.map((role) => (
              <span
                key={role}
                className="text-xs font-medium px-3 py-1 bg-brand-red/10 ring-1 ring-brand-red/20 text-brand-red rounded-full capitalize"
              >
                {role.replace(/_/g, " ")}
              </span>
            ))}
          </div>

          {/* Member since */}
          {memberSince && (
            <p className="text-xs text-zinc-600">
              Member since {memberSince}
            </p>
          )}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <StatCard
            icon={<TrendingUp className="size-5" />}
            label="Completed Trades"
            value="0"
          />
          <StatCard
            icon={<Star className="size-5" />}
            label="Rating"
            value="—"
          />
          <StatCard
            icon={<ShieldCheck className="size-5" />}
            label="Account Status"
            value={
              <span
                className={
                  user?.account_status === "active"
                    ? "text-green-400"
                    : "text-brand-red"
                }
              >
                {user?.account_status
                  ? user.account_status.charAt(0).toUpperCase() +
                    user.account_status.slice(1)
                  : "Active"}
              </span>
            }
          />
        </div>

        {/* View Public Profile */}
        <Link
          to="/user/$username"
          params={{ username: user!.username }}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-blue hover:underline"
        >
          <ExternalLink className="size-4" />
          View Public Profile
        </Link>
      </div>
    </AuthGuard>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="bg-surface rounded-2xl ring-1 ring-white/5 p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="text-brand-red">{icon}</div>
        <span className="text-[10px] uppercase tracking-widest text-zinc-500">
          {label}
        </span>
      </div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
}
