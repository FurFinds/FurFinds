"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { Container } from "@/components/Container";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/lib/useUser";
import { cropToSquareJpeg } from "@/lib/image";

type Pet = { name: string; species: string; breed?: string };

type SiteProfile = {
  full_name: string | null;
  avatar_url: string | null;
  pets: Pet[];
  notification_prefs: { email_updates: boolean; review_replies: boolean };
};

type MyReview = {
  id: string;
  business_name: string;
  business_slug: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

const emptyProfile: SiteProfile = {
  full_name: "",
  avatar_url: null,
  pets: [],
  notification_prefs: { email_updates: true, review_replies: true },
};

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useUser();
  const [profile, setProfile] = useState<SiteProfile>(emptyProfile);
  const [reviews, setReviews] = useState<MyReview[]>([]);
  const [newPet, setNewPet] = useState({ name: "", species: "", breed: "" });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("site_profiles")
      .select("full_name, avatar_url, pets, notification_prefs")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setProfile({
            full_name: data.full_name ?? "",
            avatar_url: data.avatar_url,
            pets: data.pets ?? [],
            notification_prefs: data.notification_prefs ?? emptyProfile.notification_prefs,
          });
        }
      });

    supabase
      .from("site_reviews")
      .select("id, business_name, business_slug, rating, comment, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setReviews(data ?? []));
  }, [user]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  async function saveProfile(next: Partial<SiteProfile>) {
    if (!user) return;
    setSaving(true);
    setSaved(false);
    const merged = { ...profile, ...next };
    setProfile(merged);
    const { error } = await supabase
      .from("site_profiles")
      .update({
        full_name: merged.full_name,
        pets: merged.pets,
        notification_prefs: merged.notification_prefs,
      })
      .eq("id", user.id);
    setSaving(false);
    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }

  function addPet(e: React.FormEvent) {
    e.preventDefault();
    if (!newPet.name || !newPet.species) return;
    saveProfile({ pets: [...profile.pets, newPet] });
    setNewPet({ name: "", species: "", breed: "" });
  }

  function removePet(index: number) {
    saveProfile({ pets: profile.pets.filter((_, i) => i !== index) });
  }

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploadingAvatar(true);
    setAvatarError("");
    try {
      const cropped = await cropToSquareJpeg(file);
      const path = `${user.id}/avatar-${Date.now()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(path, cropped, { upsert: true, contentType: "image/jpeg" });
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(path);

      const { error: updateError } = await supabase
        .from("site_profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", user.id);
      if (updateError) throw updateError;

      setProfile((p) => ({ ...p, avatar_url: publicUrl }));
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
  }

  if (loading) {
    return (
      <div className="bg-white py-24 text-center text-black/50">Loading your dashboard...</div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white py-24">
        <Container className="max-w-md text-center">
          <h1 className="font-display text-2xl font-medium text-black">
            Log in to view your dashboard
          </h1>
          <Link
            href="/login"
            className="mt-6 inline-block rounded-full bg-light-blue px-6 py-3 text-sm font-medium text-white hover:bg-dark-blue"
          >
            Log In
          </Link>
        </Container>
      </div>
    );
  }

  const name = profile.full_name || user.email || "Pet Parent";
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-white py-14 lg:py-20">
      <Container className="max-w-3xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-5">
            <div className="relative">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-dark-blue text-2xl font-medium text-white">
                {profile.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatar_url} alt={name} className="h-full w-full object-cover" />
                ) : (
                  initials
                )}
              </div>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                id="avatar-input"
                onChange={handleAvatarChange}
              />
              <button
                type="button"
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-light-blue text-xs text-white shadow hover:bg-dark-blue disabled:opacity-60"
                aria-label="Change profile picture"
              >
                {uploadingAvatar ? "…" : "✎"}
              </button>
            </div>
            <div>
              <h1 className="font-display text-2xl font-medium text-black">{name}</h1>
              <p className="text-sm text-black/60">{user.email}</p>
              {avatarError && <p className="mt-1 text-xs text-red-600">{avatarError}</p>}
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="rounded-full border-2 border-light-blue px-5 py-2 text-sm font-medium text-dark-blue hover:bg-bg-blue"
          >
            Sign Out
          </button>
        </div>

        {/* Edit profile */}
        <div className="mt-10 rounded-2xl border border-black/5 p-6">
          <h2 className="font-display text-lg font-medium text-black">Profile</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              saveProfile({});
            }}
            className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end"
          >
            <div className="flex-1">
              <label htmlFor="full_name" className="mb-1.5 block text-sm font-medium text-black">
                Full name
              </label>
              <input
                id="full_name"
                value={profile.full_name ?? ""}
                onChange={(e) => setProfile((p) => ({ ...p, full_name: e.target.value }))}
                className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-dark-blue"
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-light-blue px-6 py-2.5 text-sm font-medium text-white hover:bg-dark-blue disabled:opacity-60"
            >
              {saving ? "Saving..." : saved ? "Saved!" : "Save"}
            </button>
          </form>
        </div>

        {/* Pets */}
        <div className="mt-6 rounded-2xl border border-black/5 p-6">
          <h2 className="font-display text-lg font-medium text-black">My Pets</h2>
          {profile.pets.length > 0 ? (
            <ul className="mt-4 space-y-2">
              {profile.pets.map((pet, i) => (
                <li
                  key={`${pet.name}-${i}`}
                  className="flex items-center justify-between rounded-xl bg-bg-blue/30 px-4 py-2.5 text-sm"
                >
                  <span>
                    <span className="font-medium text-black">{pet.name}</span>{" "}
                    <span className="text-black/60">
                      · {pet.species}
                      {pet.breed ? ` · ${pet.breed}` : ""}
                    </span>
                  </span>
                  <button onClick={() => removePet(i)} className="text-black/50 hover:text-red-600">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-black/60">Add your pets to personalize recommendations.</p>
          )}
          <form onSubmit={addPet} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-4">
            <input
              placeholder="Name"
              value={newPet.name}
              onChange={(e) => setNewPet((p) => ({ ...p, name: e.target.value }))}
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-dark-blue"
            />
            <input
              placeholder="Species (dog, cat...)"
              value={newPet.species}
              onChange={(e) => setNewPet((p) => ({ ...p, species: e.target.value }))}
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-dark-blue"
            />
            <input
              placeholder="Breed (optional)"
              value={newPet.breed}
              onChange={(e) => setNewPet((p) => ({ ...p, breed: e.target.value }))}
              className="rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-dark-blue"
            />
            <button
              type="submit"
              className="rounded-full border-2 border-light-blue px-4 py-2 text-sm font-medium text-dark-blue hover:bg-bg-blue"
            >
              Add pet
            </button>
          </form>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* My reviews */}
          <div className="rounded-2xl bg-bg-blue/40 p-6">
            <h2 className="font-display text-lg font-medium text-black">My Reviews</h2>
            {reviews.length === 0 ? (
              <>
                <p className="mt-2 text-sm text-black/70">
                  You haven&apos;t written any reviews yet. Once you visit a verified business,
                  come back and share how it went.
                </p>
                <Link
                  href="/search"
                  className="mt-4 inline-block text-sm font-medium text-dark-blue hover:underline"
                >
                  Find a business to review →
                </Link>
              </>
            ) : (
              <ul className="mt-3 space-y-3">
                {reviews.map((r) => (
                  <li key={r.id} className="rounded-xl bg-white p-4 text-sm">
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/business/${r.business_slug}`}
                        className="font-medium text-dark-blue hover:underline"
                      >
                        {r.business_name}
                      </Link>
                      <span className="flex items-center gap-0.5 text-star">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} size={12} fill="#FFC107" stroke="#FFC107" />
                        ))}
                      </span>
                    </div>
                    {r.comment && <p className="mt-1 text-black/70">{r.comment}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Settings */}
          <div className="rounded-2xl bg-bg-blue/40 p-6">
            <h2 className="font-display text-lg font-medium text-black">Settings</h2>
            <div className="mt-3 space-y-2.5">
              <label className="flex items-center gap-2.5 text-sm text-black/80">
                <input
                  type="checkbox"
                  checked={profile.notification_prefs.email_updates}
                  onChange={(e) =>
                    saveProfile({
                      notification_prefs: {
                        ...profile.notification_prefs,
                        email_updates: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4 rounded border-black/20 accent-[#395EA1]"
                />
                Email me new pet-friendly spots
              </label>
              <label className="flex items-center gap-2.5 text-sm text-black/80">
                <input
                  type="checkbox"
                  checked={profile.notification_prefs.review_replies}
                  onChange={(e) =>
                    saveProfile({
                      notification_prefs: {
                        ...profile.notification_prefs,
                        review_replies: e.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4 rounded border-black/20 accent-[#395EA1]"
                />
                Notify me when a business replies to my review
              </label>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
