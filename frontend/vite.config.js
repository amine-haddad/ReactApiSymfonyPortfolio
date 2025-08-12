import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import Pages from "vite-plugin-pages";

const apiProxyTarget =
  process.env.VITE_API_PROXY_TARGET || "http://localhost:8000";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  build: {
    sourcemap: true, // Assurez-vous que cette option est activée
  },
  plugins: [
    react(),
    Pages({
      dirs: "src/pages",
    }),
  ],
  server: {
    host: "0.0.0.0",
    port: 5173,
    hmr: {
      host: "localhost", // WebSocket host
      port: 5173, // WebSocket port
    },
    proxy: {
      "/api": {
        target: apiProxyTarget,
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
