import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
    ],
  },
  async rewrites() {
    console.log(`http://${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}/api/:path*`)
    return [
      {
        // Main API endpoints
        source: '/api/:path*',
        destination: `http://${process.env.NEXT_PUBLIC_API_HOST}:${process.env.NEXT_PUBLIC_API_PORT}/api/:path*`,
      },
      {
        // Chat API endpoints
        source: '/llm/:path*',
        destination: `http://${process.env.NEXT_PUBLIC_CHAT_API_HOST}:${process.env.NEXT_PUBLIC_CHAT_API_PORT}/llm/:path*`,
      }
    ]
  },
};

export default nextConfig;
