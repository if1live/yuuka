import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";

const baseUrl_ghpage = "/yuuka/";
const baseUrl_vercel = undefined;
const baseUrl = process.env.VERCEL ? baseUrl_vercel : baseUrl_ghpage;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer(),
    VitePWA({
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "mask-icon.svg"],
      manifest: {
        name: "yuuka · financial ledger",
        short_name: "yuuka",
        description: "financial ledger",
        display: "standalone",
        theme_color: "#6276BF",
        background_color: "#6276BF",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  base: baseUrl,
});
