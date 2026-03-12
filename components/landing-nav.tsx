"use client";

import { Button } from "@/components/ui/button";
import logo from "@/public/logo.png";
import Image from "next/image";
import Link from "next/link";

interface LandingNavProps {
  showLogo?: boolean;
}

export function LandingNav({ showLogo = true }: LandingNavProps) {
  return (
    <nav className="flex items-center justify-between w-full">
      {showLogo && (
        <Link href="/" className="flex items-center gap-2 group">
          <div className="rounded-lg p-1.5 transition-colors">
            <Image src={logo} alt="Logo" width={32} height={32} className="" />
          </div>
          <span className="font-bold text-xl tracking-tight font-serif text-zinc-900 dark:text-zinc-100">
            PlanWiki
          </span>
        </Link>
      )}

      <div className="flex items-center gap-2 md:gap-3 ml-auto">
        <div className="hidden md:flex items-center gap-3">
          <Link href="#demo">
            <Button
              variant="ghost"
              className="text-zinc-600 hover:text-zinc-950 rounded-sm"
            >
              How it Works
            </Button>
          </Link>
          <Link href="#pricing">
            <Button
              variant="ghost"
              className="text-zinc-600 hover:text-zinc-950 rounded-sm"
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
              className="text-zinc-600 hover:text-zinc-950 rounded-sm"
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
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
              GitHub
            </Button>
          </Link>
        </div>

        <Link href="/login">
          <Button className="border border-zinc-950 bg-zinc-950 text-[#f6f1e8] hover:bg-zinc-800 rounded-sm px-6 text-sm font-medium transition-colors">
            Log in
          </Button>
        </Link>
      </div>
    </nav>
  );
}
