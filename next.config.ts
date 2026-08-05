import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root — there's a stray ~/package-lock.json outside this
  // project that Next.js would otherwise misdetect as the monorepo root.
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
