import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { visualizer } from "rollup-plugin-visualizer";

const baseUrl_ghpage = "/yuuka/";
const baseUrl_vercel = undefined;
const baseUrl = process.env.VERCEL ? baseUrl_vercel : baseUrl_ghpage;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), visualizer()],
  base: baseUrl,
});
