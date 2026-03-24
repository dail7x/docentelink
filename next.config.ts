import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for self-hosting in Coolify
  output: 'standalone',
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io', // Uploadthing CDN
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.clerk.com', // Clerk Avatars
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Google OAuth images
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;
