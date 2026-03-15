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
    default: "PlanWiki - Turn AI Plans into Interactive Workspaces",
    template: "%s | PlanWiki",
  },
  description:
    "PlanWiki helps you turn AI plans into something clear, organized, and easy to use.",
  keywords: [
    "PlanWiki",
    "AI plans",
    "interactive workspaces",
    "AI planning",
    "ChatGPT plans",
    "Claude plans",
    "Gemini plans",
    "plan parser",
    "task cards",
    "checklists",
    "table widgets",
    "plan tables",
    "progress tracking",
    "AI chat workspaces",
    "workspace messages",
    "chat plans",
    "project planning",
    "startup launch plans",
    "study schedules",
    "personal budgeting",
    "shareable plans",
    "public workspaces",
    "published plans",
    "workspace widgets",
    "AI workflow tools",
    "plan execution",
    "Notion Alternative",
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
    title: "PlanWiki - Turn AI Plans into Interactive Workspaces",
    description:
      "PlanWiki helps you turn AI plans into something clear, organized, and easy to use.",
    url: "https://planwiki.com",
    siteName: "PlanWiki",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "PlanWiki - Turn AI Plans into Interactive Workspaces",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PlanWiki - Turn AI Plans into Interactive Workspaces",
    description:
      "PlanWiki helps you turn AI plans into something clear, organized, and easy to use.",
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
