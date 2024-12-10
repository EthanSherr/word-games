// vite.config.ts
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import styleX from "vite-plugin-stylex"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), styleX()],
  root: "./",
  publicDir: "packages/frontend/public", // Specify the location of `index.html`
  server: {
    host: true,
    port: 3000,
    proxy: {
      "/trpc": {
        target: "http://localhost:4000",
        changeOrigin: true,
      },
    },
  },
})
