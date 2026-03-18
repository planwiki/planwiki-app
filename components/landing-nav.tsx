"use client";

import { GridViewIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authClient } from "@/lib/auth/client";
import { cn } from "@/lib/utils";
import logo from "@/public/logo.png";
import Image from "next/image";
import Link from "next/link";

interface LandingNavProps {
  showLogo?: boolean;
}

const avatarColors = [
  "bg-rose-500",
  "bg-sky-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-fuchsia-500",
  "bg-cyan-500",
];

function getAvatarColor(name: string) {
  return (
    avatarColors[name.charCodeAt(0) % avatarColors.length] ?? avatarColors[0]
  );
}

export function LandingNav({ showLogo = true }: LandingNavProps) {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user ?? null;
  const userName =
    (user?.name || user?.email?.split("@")[0] || "User")?.trim() || "User";
  const avatarImage = user?.image ?? null;
  const avatarInitial = (userName[0] || "U").toUpperCase();
  const avatarColor = getAvatarColor(userName);

  return (
    <nav className="flex w-full flex-wrap items-center gap-3 sm:gap-4">
      {showLogo ? (
        <Link href="/" className="group flex items-center gap-2">
          <div className="rounded-none p-1.5 transition-colors">
            <Image src={logo} alt="Logo" width={32} height={32} className="" />
          </div>
          <span className="font-bold text-xl tracking-tight font-serif text-zinc-900 dark:text-zinc-100">
            PlanWiki
          </span>
        </Link>
      ) : null}

      <div className="ml-auto flex items-center gap-2 md:gap-3">
        <div className="hidden items-center gap-3 md:flex">
          <Link href="#features">
            <Button
              variant="ghost"
              className="rounded-none text-zinc-600 hover:text-zinc-950"
            >
              Features
            </Button>
          </Link>
          <Link href="#demo">
            <Button
              variant="ghost"
              className="rounded-none text-zinc-600 hover:text-zinc-950"
            >
              How it Works
            </Button>
          </Link>
          <Link href="#pricing">
            <Button
              variant="ghost"
              className="rounded-none text-zinc-600 hover:text-zinc-950"
            >
              Pricing
            </Button>
          </Link>
          <Link
            href="https://github.com/planwiki/planwiki-app"
            target="_blank"
            rel="noreferrer"
          >
            <Button
              variant="ghost"
              className="rounded-none text-zinc-600 hover:text-zinc-950"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7\
                -2" />
              </svg>
              GitHub
            </Button>
          </Link>
        </div>

        {user ? (
          <Link
            href="/workspaces"
            aria-label="Open workspaces"
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-zinc-950/10 bg-white/80 transition-colors hover:border-zinc-950 hover:bg-white"
          >
            <div className="relative">
              <Avatar className="size-7 rounded-sm">
                {avatarImage ? (
                  <AvatarImage src={avatarImage} alt={userName} />
                ) : null}
                <AvatarFallback
                  className={cn("rounded-sm text-xs font-semibold text-white", avatarColor)}
                >
                  {avatarInitial}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-sm border border-white bg-zinc-950 text-white">
                <HugeiconsIcon icon={GridViewIcon} className="size-2.5" />
              </span>
            </div>
          </Link>
        ) : (
          <Link href="/login">
            <Button className="h-10 rounded-sm border border-zinc-950 bg-zinc-950 px-4 text-sm font-medium text-[#f6f1e8] transition-colors hover:bg-zinc-800 sm:px-6">
              {isPending ? "Loading..." : "Log in"}
            </Button>
          </Link>
        )}
      </div>

      <div className="flex w-full gap-2 overflow-x-auto pb-1 md:hidden">
        <Link href="#features" className="shrink-0">
          <Button
            variant="ghost"
            className="h-9 rounded-none border border-zinc-950/10 bg-white/60 px-3 text-xs uppercase tracking-[0.2em] text-zinc-700 hover:bg-white hover:text-zinc-950"
          >
            Features
          </Button>
        </Link>
        <Link href="#demo" className="shrink-0">
          <Button
            variant="ghost"
            className="h-9 rounded-none border border-zinc-950/10 bg-white/60 px-3 text-xs uppercase tracking-[0.2em] text-zinc-700 hover:bg-white hover:text-zinc-950"
          >
            How It Works
          </Button>
        </Link>
        <Link href="#pricing" className="shrink-0">
          <Button
            variant="ghost"
            className="h-9 rounded-none border border-zinc-950/10 bg-white/60 px-3 text-xs uppercase tracking-[0.2em] text-zinc-700 hover:bg-white hover:text-zinc-950"
          >
            Pricing
          </Button>
        </Link>
      </div>
    </nav>
  );
}
