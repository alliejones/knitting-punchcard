import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.CI ? "knitting-punchcard" : "/",
  css: {
    modules: {
      localsConvention: "camelCaseOnly",
    },
  },
  plugins: [react()],
});
