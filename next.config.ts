import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Allow production builds to complete even with ESLint warnings/errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Keep TypeScript strict - we want to catch real type errors
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
