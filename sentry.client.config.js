// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

// Dynamically load the sentry config so that we can alter the config at
// runtime without having to rebuild the entire application.
fetch("/api/sentry-config")
  .then((response) => response.json())
  .then((config) => Sentry.init(config));
