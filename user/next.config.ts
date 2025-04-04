import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "photos.bandsintown.com",
      },
      {
        protocol: "https",
        hostname: "assets.prod.bandsintown.com",
      },
    ],
  },
};

export default nextConfig;
