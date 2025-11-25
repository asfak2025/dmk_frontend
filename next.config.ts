import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",  
        pathname: "**",  
      },
    ],
  },
  reactStrictMode: false,
  // async rewrites() {
  //   return [
  //     {a
  //       source: '/operation/callRecordings/:filename',
  //       destination: `${process.env.NEXT_PUBLIC_AUDIO_URL}/callRecordings/:filename`,
  //     },
  //   ];
  // },
};

export default nextConfig;
