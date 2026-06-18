/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true
  },
  webpack(config) {
    config.cache = false;
    return config;
  }
};

export default nextConfig;
