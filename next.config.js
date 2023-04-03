// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

// The config file is not an ES Module like the rest of our project.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withSentryConfig } = require("@sentry/nextjs");

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

module.exports = withSentryConfig(
  module.exports,
  { silent: true },
  { hideSourcemaps: true }
);
