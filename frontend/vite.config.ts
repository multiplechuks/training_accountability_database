import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "https://localhost:7093",
        // target: "http://localhost:5118",
        changeOrigin: true,
        secure: false
      }
    },
    allowedHosts: ["4c4b-129-205-226-8.ngrok-free.app"]
  }
});
