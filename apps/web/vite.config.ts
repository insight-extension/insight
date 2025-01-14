import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from "@vitejs/plugin-react-swc";
import dotenv from "dotenv";
import path from "path";
import { defineConfig, loadEnv } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

dotenv.config();

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    plugins: [
      react(),
      nodePolyfills(),
      sentryVitePlugin({
        org: "insight-wr",
        project: "web",
        authToken: process.env.VITE_SENTRY_AUTH_TOKEN
      })
    ],

    // absolute paths
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src")
      }
    },

    build: {
      sourcemap: true
    }
  };
});
