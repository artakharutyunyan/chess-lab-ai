/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    // jsdom's default origin is about:blank, where localStorage throws;
    // ThemeContext relies on localStorage, so give it a real origin.
    environmentOptions: {
      jsdom: { url: "http://localhost/" },
    },
    setupFiles: "./src/setupTests.ts",
    globals: true,
  },
});
