import matchers from "@testing-library/jest-dom/matchers";
import { cleanup } from "@testing-library/react";
import axios from "axios";
import { afterEach, expect } from "vitest";

// In a `jsdom` environment, `axios` defaults to making XHR requests which can't
// be intercepted by `nock`. Configuring `axios` to use the Node adapter solves
// this problem.
axios.defaults.adapter = require("axios/lib/adapters/http");

// Extend `expect` from `vitest` with the matchers from
// `@testing-library/react`.
expect.extend(matchers);

// Make sure the DOM gets cleaned up after every test.
afterEach(() => {
  cleanup();
});
