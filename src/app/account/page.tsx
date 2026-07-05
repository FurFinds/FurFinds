"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Container } from "@/components/Container";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/lib/useUser";

export default function AccountPage() {
  const router = useRouter();
  const { user, loading } = useUser();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="bg-white py-24 text-center text-black/50">Loading your account...</div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white py-24">
        <Container className="max-w-md text-center">
          <h1 className="font-display text-2xl font-medium text-black">
            Log in to view your account
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

  const name = (user.user_metadata?.full_name as string) || user.email || "Pet Parent";
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-white py-14 lg:py-20">
      <Container className="max-w-3xl">
        <div className="flex items-center gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-dark-blue text-2xl font-medium text-white">
            {initials}
          </div>
          <div>
            <h1 className="font-display text-2xl font-medium text-black">{name}</h1>
            <p className="text-sm text-black/60">{user.email}</p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-2xl bg-bg-blue/40 p-6">
            <h2 className="font-display text-lg font-medium text-black">My Reviews</h2>
            <p className="mt-2 text-sm text-black/70">
              You haven&apos;t written any reviews yet. Once you visit a verified business, come back
              and share how it went.
            </p>
            <Link href="/search" className="mt-4 inline-block text-sm font-medium text-dark-blue hover:underline">
              Find a business to review →
            </Link>
          </div>

          <div className="rounded-2xl bg-bg-blue/40 p-6">
            <h2 className="font-display text-lg font-medium text-black">Settings</h2>
            <p className="mt-2 text-sm text-black/70">
              Manage your account details and sign-in preferences.
            </p>
            <button
              onClick={handleSignOut}
              className="mt-4 rounded-full border-2 border-light-blue px-5 py-2 text-sm font-medium text-dark-blue hover:bg-bg-blue"
            >
              Sign Out
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
}
