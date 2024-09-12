/** @type {import('next').NextConfig} */
const nextConfig = {
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
};

export default nextConfig;
