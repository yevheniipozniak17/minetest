import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // The React Compiler runs client components through a Babel loader, and Turbopack
  // panics in that stage while reporting HMR issues, killing the dev server.
  reactCompiler: isProduction,
  experimental: {
    inlineCss: true,
  },
  async headers() {
    return [
      {
        source: '/favicon/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
