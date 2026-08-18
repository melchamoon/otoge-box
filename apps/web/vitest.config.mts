import path from "node:path";
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(import.meta.dirname, "src") },
  },
  test: {
    environment: "node",
    globals: true,
    include: ["src/**/*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/lib/utils/**/*.ts"],
      exclude: ["src/lib/utils/**/__tests__/**"],
      thresholds: {
        statements: 76.27,
        branches: 67.56,
        functions: 73.21,
        lines: 78.43,
      },
    },
  },
});
