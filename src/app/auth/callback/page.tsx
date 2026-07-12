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

      await supabase.from("site_profiles").upsert(
        {
          id: user.id,
          email: user.email,
          full_name: (user.user_metadata?.full_name as string) ?? null,
          avatar_url: (user.user_metadata?.avatar_url as string) ?? null,
          role: type,
        },
        { onConflict: "id", ignoreDuplicates: true }
      );

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
