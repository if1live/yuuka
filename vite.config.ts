import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { defineConfig } from "vite";

const baseUrl_ghpage = "/yuuka/";
const baseUrl_vercel = undefined;
const baseUrl = process.env.VERCEL ? baseUrl_vercel : baseUrl_ghpage;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), visualizer()],
  base: baseUrl,
  build: {
    outDir: "dist/frontend",
  },
});
