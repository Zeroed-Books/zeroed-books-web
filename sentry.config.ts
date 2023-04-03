/**
 * Base Sentry configuration. This is intended to be loaded by the server
 * process with access to environment variables rather than loaded directly by
 * the browser.
 */
export default function sentryConfig() {
  const env = global.process.env;
  const environment = env.NODE_ENV ?? "development";
  const isProduction = environment === "production";

  return {
    dsn: env.SENTRY_DSN ?? "",
    environment,
    tracesSampleRate: isProduction ? 0.05 : 1.0,
  };
}
