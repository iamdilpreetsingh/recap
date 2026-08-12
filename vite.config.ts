import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { crx } from "@crxjs/vite-plugin";
import { resolve } from "path";
import manifest from "./manifest.json" with { type: "json" };

export default defineConfig({
  plugins: [react(), tailwindcss(), crx({ manifest })],

  build: {
    rollupOptions: {
      input: {
        app: resolve(__dirname, "src/app/index.html"),
        popup: resolve(__dirname, "src/popup/index.html"),
      },
    },
  },
});
