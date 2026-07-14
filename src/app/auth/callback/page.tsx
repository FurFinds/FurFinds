"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

function AuthCallbackInner() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const type = params.get("type") === "business" ? "business" : "pet_owner";
    let handled = false;

    async function finishSignIn(user: User) {
      if (handled) return;
      handled = true;

      // A plain insert, not .upsert(...ignoreDuplicates) — see the matching
      // comment in signup/page.tsx: Postgres needs SELECT-policy visibility
      // to evaluate ON CONFLICT DO NOTHING, which this table doesn't grant.
      // A duplicate-key conflict here just means this account already has
      // a profile row (returning OAuth user), which is expected and safe
      // to ignore rather than overwrite.
      const { error: profileError } = await supabase.from("users").insert({
        id: user.id,
        email: user.email,
        name: (user.user_metadata?.full_name as string) ?? user.email,
        avatar_url: (user.user_metadata?.avatar_url as string) ?? null,
        role: type,
      });
      if (profileError && profileError.code !== "23505") {
        console.warn("Failed to create profile row:", profileError.message);
      }

      router.replace(type === "business" ? "/business-dashboard" : "/dashboard");
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) finishSignIn(data.session.user);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) finishSignIn(session.user);
    });

    return () => listener.subscription.unsubscribe();
  }, [params, router]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center text-black/60">
      Signing you in...
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <AuthCallbackInner />
    </Suspense>
  );
}
