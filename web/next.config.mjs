/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pqbm09mqytv7kaoz.public.blob.vercel-storage.com",
      },
    ],
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: `/gokou/login`,
          destination: `/gokou-login`,
        },
      ],
    };
  },
  async headers() {
    return [
      {
        source: "/api/actions/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "Content-Type, Authorization, Content-Encoding, Accept-Encoding",
          },
        ],
      },
    ];
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

export default nextConfig;
