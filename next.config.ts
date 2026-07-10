import type { NextConfig } from "next";

import { securityHeaders } from "./lib/security/headers";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/research",
        destination: "/writing",
        permanent: true,
      },
      {
        source: "/research/rss.xml",
        destination: "/writing/rss.xml",
        permanent: true,
      },
      {
        source: "/research/:slug",
        destination: "/writing/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
