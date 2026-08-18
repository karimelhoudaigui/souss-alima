import type { NextConfig } from "next";

const isGithubPages = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubPages ? "/souss-alima" : ""
  },
  ...(isGithubPages
    ? {
        output: "export" as const,
        basePath: "/souss-alima",
        assetPrefix: "/souss-alima/",
        trailingSlash: true,
        images: {
          unoptimized: true
        }
      }
    : {}),
  experimental: {
    serverActions: {
      bodySizeLimit: "8mb"
    }
  }
};

export default nextConfig;
