import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.logo.dev",
      },
      {
        protocol: "https",
        hostname: "planwiki.com",
      },
      {
        protocol: "https",
        hostname: "www.planwiki.com",
      },
    ],
  },
};

export default nextConfig;
