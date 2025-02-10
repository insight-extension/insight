import { sentryVitePlugin } from "@sentry/vite-plugin";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react-swc";
import dotenv from "dotenv";
import path from "path";
import { defineConfig, loadEnv } from "vite";

dotenv.config();

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };

  return {
    plugins: [
      TanStackRouterVite(),
      viteReact(),
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
