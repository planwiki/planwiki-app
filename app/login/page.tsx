"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/client";
import { toast } from "sonner";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleOAuthSignIn = async () => {
    setIsLoading(true);
    const callbackURL = `${window.location.origin}/auth/callback`;

    try {
      const { error } = await authClient.signIn.social({
        provider: "google",
        callbackURL,
        newUserCallbackURL: callbackURL,
        errorCallbackURL: callbackURL,
        fetchOptions: {
          onError() {
            setIsLoading(false);
          },
        },
      });

      if (error) {
        toast.error("Failed to sign in with Google");
        setIsLoading(false);
      }
    } catch {
      toast.error("Failed to sign in with Google");
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-[#f6f1e8]">
      <section className="flex flex-1 items-center justify-center px-4 py-10 md:px-6">
        <div className="w-full max-w-2xl text-center">
          <Link href="/" className="inline-flex items-center gap-3">
            <Image src="/logo.png" alt="PlanWiki" width={32} height={32} />
            <span className="text-lg font-semibold text-zinc-950">
              PlanWiki
            </span>
          </Link>

          <h1 className="mt-8 text-3xl font-semibold tracking-[-0.04em] text-zinc-950 md:text-5xl">
            Welcome back
          </h1>
          <p className="mt-3 text-sm text-zinc-600">
            Sign in with Google to continue working on your plans.
          </p>

          <div className="mt-10 flex justify-center">
            <Button
              type="button"
              onClick={handleOAuthSignIn}
              disabled={isLoading}
              className="rounded-none border border-zinc-950 bg-zinc-950 px-6 text-[#f6f1e8] hover:bg-zinc-800"
            >
              <svg className="size-4" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              {isLoading ? "Redirecting..." : "Continue with Google"}
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
