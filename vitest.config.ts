import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { compilerOptions } from "./tsconfig.json";
import { resolve } from "path";

const alias = Object.entries(compilerOptions.paths).reduce(
  (acc, [key, [value]]) => {
    const aliasKey = key.substring(0, key.length - 2);
    const path = value.substring(0, value.length - 2);

    return {
      ...acc,
      [aliasKey]: resolve(__dirname, path),
    };
  },
  {}
);

export default defineConfig({
  plugins: [react()],
  resolve: { alias },
  test: {
    coverage: {
      all: true,
      exclude: [
        ".next/",
        "coverage/",
        "**/*.config.{js,ts}",
        ".*.{js,ts}",
        "**/*.test.{js,jsx,ts,tsx}",
      ],
    },
    environment: "jsdom",
    setupFiles: ["vitest.setup.ts"],
  },
});
