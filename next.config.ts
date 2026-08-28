import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first, WebP fallback — both far smaller than the source PNGs.
    formats: ["image/avif", "image/webp"],
    qualities: [60, 68, 75],
    // Optimized variants are immutable; cache them for a year.
    minimumCacheTTL: 31536000,
    deviceSizes: [360, 420, 640, 828, 1080, 1200, 1600],
    imageSizes: [48, 72, 96, 128, 256, 384],
  },
  // The pre-sized landing assets are content-addressed by filename; let
  // browsers and CDNs keep them for a year.
  async headers() {
    return [
      {
        source: "/landing/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
  // Strip React dev-only prop-type/debug code from the client bundle.
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
};

export default nextConfig;
