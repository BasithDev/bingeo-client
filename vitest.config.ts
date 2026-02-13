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
      include: [
        "src/utils/**",
        "src/features/admin/utils/**",
        "src/features/admin/schemas/**",
        "src/features/admin/stores/**",
        "src/features/admin/config/**",
        "src/features/admin/data/**",
      ],
      exclude: [
        "src/**/index.ts",
        "src/**/*.d.ts",
      ],
    },
  },
});
