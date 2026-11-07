import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Dev only: let phones/other computers on the same Wi-Fi load the dev server by IP.
  // Without this Next blocks its client scripts, so the page never hydrates and
  // stays on "Loading…". Not needed for `npm start` or Vercel.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.*.*.*"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
