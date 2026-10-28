import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // 포트폴리오 원본 이미지(기존 사이트와 같은 Supabase 저장소)를 자동으로 줄여서 보여줌
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pnhkkgkogfgdwecqaptj.supabase.co",
        pathname: "/storage/v1/object/public/portfolio-images/**",
      },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
