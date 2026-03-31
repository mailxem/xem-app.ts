/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  redirects: async () => {
    return [
      {
        source: "/login",
        destination: "/auth/login",
        permanent: true,
      },
      {
        source: "/signup",
        destination: "/auth/signup",
        permanent: true,
      },
      {
        source: "/billing",
        destination: "/billing/overview",
        permanent: true,
      },
      {
        source: "/api/billing/:path*",
        destination: `${process.env.NEXT_PUBLIC_PAYWALL_URL}/:path*`,
        permanent: false,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        hostname: "**",
      },
    ],
  },
  output: "standalone",
  experimental: {
    turbo: {
      rules: {
        "*.json": {
          loaders: ["@vercel/webpack-asset-relocator-loader"],
          as: "*.js",
        },
      },
    },
  },
  transpilePackages: ["bcryptjs", "@maily-to/core", "@maily-to/render"],
};

module.exports = nextConfig;
