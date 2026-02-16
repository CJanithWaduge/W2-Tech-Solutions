import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  // basePath: '/W2-Tech-Solutions', // Set basePath only for production deployment
  images: {
    unoptimized: true,
  },
  /* config options here */
};

export default nextConfig;
