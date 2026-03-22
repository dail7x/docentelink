import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for self-hosting in Coolify
  output: 'standalone',
  
  // Turbopack config (replaces webpack)
  turbopack: {
    resolveAlias: {
      // Exclude @react-pdf/renderer from client-side bundling
      // It's only used in server-side API routes
      '@react-pdf/renderer': 'next/dist/compiled/node-module-polyfill/empty.js',
    },
  },
  
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
