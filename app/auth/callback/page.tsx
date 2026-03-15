"use client";

import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { authClient } from "@/lib/auth/client";
import { trpc } from "@/lib/trpc";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = authClient.useSession();
  const hasHandledRef = useRef(false);
  const onboardingStatusQuery = trpc.auth.getOnboardingStatus.useQuery(
    undefined,
    {
      enabled: false,
      retry: false,
    },
  );

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
      try {
        const { data: onboarding } = await onboardingStatusQuery.refetch();

        if (!onboarding) {
          throw new Error("Missing onboarding state");
        }

        router.push(onboarding.hasSeenOnboarding ? "/new" : "/welcome");
      } catch {
        toast.error("Failed to load onboarding state. Please try again.");
        router.push("/login?error=onboarding_check_failed");
      }
    };

    void finishSignIn();
  }, [isPending, onboardingStatusQuery, router, searchParams, session]);

  return <AuthCallbackShell />;
}

function AuthCallbackShell() {
  return (
    <main className="flex min-h-screen flex-col bg-[#f6f1e8]">
      <section className="flex flex-1 items-center justify-center px-4 py-8 sm:py-10 md:px-6">
        <div className="w-full max-w-3xl">
          <div className="border border-zinc-950/10 bg-white/70 p-5 text-center shadow-none backdrop-blur-sm sm:p-8 md:p-10">
            <p className="text-[11px] uppercase tracking-[0.28em] text-zinc-500">
              Authentication
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-zinc-950 sm:text-4xl md:text-5xl">
              Authorizing...
            </h1>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-zinc-600">
              Finishing your sign in and loading the right starting page.
            </p>
            <div className="mx-auto mt-8 h-1.5 w-full max-w-xs overflow-hidden rounded-none bg-zinc-950/8">
              <div className="h-full w-1/2 animate-pulse bg-zinc-950/70" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<AuthCallbackShell />}>
      <AuthCallbackContent />
    </Suspense>
  );
}
