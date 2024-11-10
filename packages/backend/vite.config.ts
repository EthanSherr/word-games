import { defineConfig } from "vite";
import { node } from "./vitejunk.ts";

export default defineConfig({
  plugins: [node()],
});
