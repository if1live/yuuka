import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

const vitePWA = VitePWA({
  registerType: "autoUpdate",
  includeAssets: ["icons/icon-512.png"],
  manifest: {
    name: "Finance Calculator",
    short_name: "yuuka",
    theme_color: "#493e46",
    background_color: "#493e46",
    display: "standalone",
    orientation: "portrait",
    scope: "/",
    start_url: "/",
    icons: [
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
});

// https://vitejs.dev/config/
export default defineConfig({
  // github pages 쓸때는 base url 붙어야한다.
  // base: "/yuuka/",
  plugins: [react()],
});
