import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
},
  /* config options here */
  "compilerOptions": {
    "skipLibCheck": true,
    "noEmit": false
  }
};

export default nextConfig;
