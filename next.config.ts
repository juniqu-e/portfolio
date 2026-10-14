import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname),
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react", "motion"],
  },
  // 구 /story 링크 — 메인으로 (2026-10-14)
  async redirects() {
    return [{ source: "/story", destination: "/", permanent: true }];
  },
};

export default nextConfig;
