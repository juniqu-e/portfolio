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
};

export default nextConfig;
