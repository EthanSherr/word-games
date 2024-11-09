// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: "./",
  publicDir: "packages/frontend/public", // Specify the location of `index.html`
  server: {
    host: true,
    port: 3000,
  },
});
