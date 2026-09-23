import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api-proxy/:path*",
        destination: "http://ngocbichkiot.runasp.net/api/:path*",
      },
    ];
  },
};

export default nextConfig;
