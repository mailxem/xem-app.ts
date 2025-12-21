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
  transpilePackages: ["bcryptjs"],
  serverExternalPackages: ["@maily-to/core", "@maily-to/render"],
};

module.exports = nextConfig;
