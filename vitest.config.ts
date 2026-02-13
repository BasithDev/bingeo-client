/// <reference types="vitest/config" />
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary", "lcov"],
      include: ["src/**"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/**/*.spec.{ts,tsx}",
        "src/**/*.d.ts",
        "src/**/index.ts",
        "src/**/*.css",
        "src/**/*.svg",
        "src/assets/**",
        "src/test/**",
        "src/app/**",
        "src/main.tsx",
        "src/vite-env.d.ts",
        // React components/pages (need integration tests)
        "src/components/**",
        "src/features/**/components/**",
        "src/features/**/pages/**",
        "src/features/**/layouts/**",
        // Pure type definitions (no runtime code)
        "src/features/**/types/**",
      ],
      thresholds: {
        statements: 85,
        branches: 85,
        functions: 85,
        lines: 85,
      },
    },
  },
});
