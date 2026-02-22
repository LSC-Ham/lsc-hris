import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // Increase this to 5MB, 10MB, or whatever you prefer!
    },
  },
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
