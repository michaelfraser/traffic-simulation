/// <reference types="vitest/config" />
import { defineConfig } from "vite";

export default defineConfig(({ command }) => ({
  server: {
    port: 3000,
    open: true,
  },
  base: command === "serve" ? "/" : "https://michaelfraser.github.io/traffic-simulation/",
  build: {
    target: "esnext",
    outDir: "dist",
  },
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", "tests/"],
    },
  },
}));
