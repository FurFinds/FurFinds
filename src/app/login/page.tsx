"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/Container";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { supabase } from "@/lib/supabase";

const inputClass =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-dark-blue";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        return;
      }

      const { data: profile } = await supabase.from("users").select("role").eq("id", data.user.id).single();
      router.push(profile?.role === "business" ? "/business-dashboard" : "/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white py-16 lg:py-24">
      <Container className="max-w-md">
        <h1 className="font-display text-3xl font-light text-black">
          Log in to <span className="text-dark-blue">FurFinds</span>
        </h1>

        <div className="mt-8">
          <GoogleSignInButton />
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-black/10" />
          <span className="text-xs font-medium uppercase tracking-wide text-black/40">or</span>
          <div className="h-px flex-1 bg-black/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-black">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-black">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              className={inputClass}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-light-blue px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-dark-blue disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-black/60">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-dark-blue hover:underline">
            Sign up
          </Link>
        </p>
      </Container>
    </div>
  );
}
