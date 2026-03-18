import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryProvider } from "@/providers/trpc-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const spaceGrotesk = Space_Grotesk({
  variable: "--font-serif",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "PlanWiki - AI-Native Workspace for Agents and Product Teams",
    template: "%s | PlanWiki",
  },
  description:
    "PlanWiki is an open source platform for product teams and AI agents. Paste long AI-generated plans, roadmaps, or ideas to turn them into interactive widgets your team and agents can execute.",
  keywords: [
    "PlanWiki",
    "AI plans",
    "interactive workspaces",
    "AI planning",
    "ChatGPT plans",
    "Claude plans",
    "Gemini plans",
    "product teams",
    "AI agents",
    "roadmaps",
    "interactive widgets",
    "open source workspace",
  ],
  authors: [{ name: "PlanWiki Team" }],
  creator: "PlanWiki",
  publisher: "PlanWiki",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://planwiki.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "PlanWiki - AI-Native Workspace for Agents and Product Teams",
    description:
      "PlanWiki is an open source platform for product teams and AI agents. Paste long AI-generated plans, roadmaps, or ideas to turn them into interactive widgets your team and agents can execute.",
    url: "https://planwiki.com",
    siteName: "PlanWiki",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "PlanWiki - AI-Native Workspace for Agents and Product Teams",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PlanWiki - AI-Native Workspace for Agents and Product Teams",
    description:
      "PlanWiki is an open source platform for product teams and AI agents. Paste long AI-generated plans, roadmaps, or ideas to turn them into interactive widgets your team and agents can execute.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "productivity",
  classification: "AI Planning, Workspace, and Chat Software",
  other: {
    "theme-color": "#000000",
    "msapplication-TileColor": "#000000",
    "apple-mobile-web-app-title": "PlanWiki",
    "application-name": "PlanWiki",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("font-sans", inter.variable, spaceGrotesk.variable)}
    >
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <TooltipProvider>
          <QueryProvider>{children}</QueryProvider>
        </TooltipProvider>

        <Toaster richColors />
      </body>
    </html>
  );
}
