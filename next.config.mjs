/** @type {import('next').NextConfig} */
const siteBasePath = process.env.NEXT_PUBLIC_SITE_BASE_PATH || "";

const nextConfig = {
  ...(siteBasePath ? { basePath: siteBasePath } : {}),
  experimental: {
    typedRoutes: true
  },
  webpack(config) {
    config.cache = false;
    return config;
  }
};

export default nextConfig;
