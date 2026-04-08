import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'hdrkyutqtcncxtmsuurf.supabase.co', // <-- Replace with your Supabase hostname
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '5mb', // Increase this to 5MB, 10MB, or whatever you prefer!
    },
  },
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
