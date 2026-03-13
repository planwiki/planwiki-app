"use client";

import { useEffect } from "react";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/db";
import { toast } from "sonner";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const hash = window.location.hash;

        if (!hash) {
          router.push("/login?error=no_hash");
          return;
        }

        const params = new URLSearchParams(hash.substring(1));
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");

        if (!accessToken) {
          toast.error("No access token found. Please try again.");
          router.push("/login?error=no_token");
          return;
        }

        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || "",
        });

        if (error) {
          toast.error("Failed to authenticate. Please try again.");
          router.push("/login?error=session_failed");
          return;
        }

        const user = data.user;

        if (!user) {
          toast.error("No user data found. Please try again.");
          router.push("/login?error=no_user");
          return;
        }

        const result = await signIn("credentials", {
          userId: user.id,
          accessToken,
          redirect: false,
        });

        if (result?.error) {
          toast.error("Failed to authenticate. Please try again.");
          router.push("/login?error=nextauth_failed");
          return;
        }

        router.push("/workspaces");
      } catch {
        toast.error("An unexpected error occurred. Please try again.");
        router.push("/login?error=auth_callback_failed");
      }
    };

    handleCallback();
  }, [router]);

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
