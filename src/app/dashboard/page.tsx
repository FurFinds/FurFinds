"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, MousePointerClick, Users } from "lucide-react";
import { Container } from "@/components/Container";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/lib/useUser";

const stats = [
  { label: "Profile Views", value: "1,204", Icon: Eye },
  { label: "Website Clicks", value: "86", Icon: MousePointerClick },
  { label: "Leads Generated", value: "23", Icon: Users },
];

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useUser();

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return <div className="bg-white py-24 text-center text-black/50">Loading your dashboard...</div>;
  }

  if (!user) {
    return (
      <div className="bg-white py-24">
        <Container className="max-w-md text-center">
          <h1 className="font-display text-2xl font-medium text-black">
            Log in to view your business dashboard
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

  return (
    <div className="bg-white py-14 lg:py-20">
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="font-display text-3xl font-light text-black">
            Business <span className="text-dark-blue">Dashboard</span>
          </h1>
          <button
            onClick={handleSignOut}
            className="rounded-full border-2 border-light-blue px-5 py-2 text-sm font-medium text-dark-blue hover:bg-bg-blue"
          >
            Sign Out
          </button>
        </div>

        <div className="mt-8 rounded-2xl bg-bg-blue/40 p-6">
          <p className="text-sm text-black/70">
            Signed in as <span className="font-medium text-black">{user.email}</span>
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-dark-blue">
              Subscription: Not yet verified
            </span>
            <Link href="/apply" className="text-sm font-medium text-dark-blue hover:underline">
              Apply for verification →
            </Link>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {stats.map(({ label, value, Icon }) => (
            <div key={label} className="rounded-2xl border border-black/5 p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-bg-blue text-dark-blue">
                <Icon size={20} />
              </div>
              <p className="mt-4 text-2xl font-semibold text-black">{value}</p>
              <p className="text-sm text-black/60">{label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-black/5 p-6">
          <h2 className="font-display text-lg font-medium text-black">Business Profile</h2>
          <p className="mt-2 text-sm text-black/70">
            Once your business is verified, you&apos;ll be able to edit your profile, photos, and pet
            policy details here.
          </p>
        </div>
      </Container>
    </div>
  );
}
