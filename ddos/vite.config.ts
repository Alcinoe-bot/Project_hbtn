import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy WebSocket Socket.IO
      "/socket.io": {
        target: "http://localhost:3000",
        changeOrigin: true,
        ws: true
      },
      // (optionnel) si tu utilises /configuration côté client
      "/configuration": {
        target: "http://localhost:3000",
        changeOrigin: true
      }
    }
  }
});
