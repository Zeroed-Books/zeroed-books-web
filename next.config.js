/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  output: "standalone",
  productionBrowserSourceMaps: true,
  publicRuntimeConfig: {
    apiRoot: process.env.API_ROOT,
  },
};

module.exports = nextConfig;
