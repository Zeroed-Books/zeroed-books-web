const environment = process.env.NODE_ENV ?? "development";
const isProduction = environment === "production";

/**
 * Base Sentry configuration. This is intended to be loaded by the server
 * process with access to environment variables rather than loaded directly by
 * the browser.
 */
const sentryConfig = {
  dsn: process.env.SENTRY_DSN ?? "",
  environment,
  tracesSampleRate: isProduction ? 0.05 : 1.0,
};

export default sentryConfig;
