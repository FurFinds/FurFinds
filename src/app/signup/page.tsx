"use client";

import { useState } from "react";
import Link from "next/link";
import { Container } from "@/components/Container";
import { GoogleSignInButton } from "@/components/GoogleSignInButton";
import { supabase } from "@/lib/supabase";

const inputClass =
  "w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-dark-blue";

type AccountType = "pet-owner" | "business";

export default function SignupPage() {
  const [accountType, setAccountType] = useState<AccountType>("pet-owner");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const role = accountType === "business" ? "business" : "pet_owner";
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name, account_type: accountType } },
      });
      if (error) {
        setError(error.message);
        return;
      }

      if (data.user) {
        // A plain insert, not .upsert(...ignoreDuplicates), because Postgres
        // requires SELECT-policy visibility to evaluate ON CONFLICT DO
        // NOTHING even when the insert itself would be allowed — and a
        // SELECT policy broad enough for anon to satisfy that (this runs
        // pre-email-confirmation, so there's no session yet) would expose
        // every user's email and name to unauthenticated requests. A
        // duplicate-key conflict here only happens if this effect fires
        // twice for the same brand-new signup, which is safe to ignore.
        const { error: profileError } = await supabase
          .from("users")
          .insert({ id: data.user.id, email, name, role });
        if (profileError && profileError.code !== "23505") throw profileError;
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-white py-16 lg:py-24">
        <Container className="max-w-md text-center">
          <h1 className="font-display text-2xl font-medium text-black">Check your email</h1>
          <p className="mt-3 text-black/70">
            We&apos;ve sent a confirmation link to {email}. Confirm your email to finish setting up
            your FurFinds account.
          </p>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-white py-16 lg:py-24">
      <Container className="max-w-md">
        <h1 className="font-display text-3xl font-light text-black">
          Join <span className="text-dark-blue">FurFinds</span>
        </h1>

        <div className="mt-6 flex rounded-full bg-bg-blue/50 p-1">
          {(["pet-owner", "business"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setAccountType(type)}
              className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                accountType === type ? "bg-white text-dark-blue shadow-sm" : "text-black/60"
              }`}
            >
              {type === "pet-owner" ? "Pet Parent" : "Business"}
            </button>
          ))}
        </div>

        <div className="mt-6">
          <GoogleSignInButton accountType={accountType} />
        </div>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-black/10" />
          <span className="text-xs font-medium uppercase tracking-wide text-black/40">or</span>
          <div className="h-px flex-1 bg-black/10" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-black">
              Full Name
            </label>
            <input
              id="name"
              required
              className={inputClass}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
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
              minLength={6}
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
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        {accountType === "business" && (
          <p className="mt-4 text-center text-sm text-black/60">
            After signing up, you can{" "}
            <Link href="/apply" className="font-medium text-dark-blue hover:underline">
              apply for verification
            </Link>
            .
          </p>
        )}

        <p className="mt-6 text-center text-sm text-black/60">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-dark-blue hover:underline">
            Log in
          </Link>
        </p>
      </Container>
    </div>
  );
}
