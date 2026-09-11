import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  // Served from https://<user>.github.io/cosmos/ in production,
  // from / during local development.
  base: process.env.NODE_ENV === "production" ? "/cosmos/" : "/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
