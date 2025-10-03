import type { NextConfig } from "next";
// console.log(process.env.NEXT_PUBLIC_API_BASE);

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_API_BASE: process.env.NEXT_PUBLIC_API_BASE,
  }
};

export default nextConfig;
