import { defineConfig } from "vite";

import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import comlink from "vite-plugin-comlink";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), comlink(), tsconfigPaths()],
  worker: {
    plugins: [comlink()],
  },
});
