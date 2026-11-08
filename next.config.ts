import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  ...(process.env.IMPONIX_BUILD_TARGET === "static"
    ? { output: "export" as const, images: { unoptimized: true } }
    : {}),
};

export default nextConfig;
