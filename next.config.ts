import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  allowedDevOrigins: ['192.168.1.12', '192.168.0.101'],
  experimental: {
    turbopackFileSystemCacheForDev: true,
    globalNotFound: true
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" }
    ]
  }
};

export default nextConfig;

