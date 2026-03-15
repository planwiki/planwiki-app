"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { supabase } from "@/lib/db";
import { authClient } from "@/lib/auth-client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = authClient.useSession();
  const hasHandledRef = useRef(false);

  useEffect(() => {
    if (isPending || hasHandledRef.current) {
      return;
    }

    const authError = searchParams.get("error");
    if (authError) {
      hasHandledRef.current = true;
      toast.error("Failed to authenticate. Please try again.");
      router.push(`/login?error=${encodeURIComponent(authError)}`);
      return;
    }

    const user = session?.user;
    if (!user) {
      hasHandledRef.current = true;
      toast.error("No active session found. Please sign in again.");
      router.push("/login?error=no_session");
      return;
    }

    hasHandledRef.current = true;

    const finishSignIn = async () => {
      const { data: onboarding, error } = await supabase
        .from("onboarding")
        .select("has_seen_onboarding")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        toast.error("Failed to load onboarding state. Please try again.");
        router.push("/login?error=onboarding_check_failed");
        return;
      }

      router.push(onboarding?.has_seen_onboarding ? "/new" : "/welcome");
    };

    void finishSignIn();
  }, [isPending, router, searchParams, session]);

  return (
    <main className="flex min-h-screen flex-col bg-[#f6f1e8]">
      <section className="flex flex-1 items-center justify-center px-4 py-10 md:px-6">
        <div className="w-full max-w-2xl text-center">
          <h1 className="text-3xl font-semibold tracking-[-0.04em] text-zinc-950 md:text-5xl">
            Authorizing...
          </h1>
          <p className="mt-3 text-sm text-zinc-600">
            Finishing your sign in.
          </p>
        </div>
      </section>
    </main>
  );
}
