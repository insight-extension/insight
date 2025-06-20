import { sentryVitePlugin } from "@sentry/vite-plugin";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react-swc";
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
      nodePolyfills({
        globals: {
          process: false,
          Buffer: true
        }
      }),
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
        "@": path.resolve(__dirname, "./src"),
        "@shared": path.resolve(__dirname, "../../packages/shared/src")
      }
    },

    build: {
      sourcemap: true
    },

    test: {
      // see: https://vitest.dev/guide/browser/
      // browser: {
      //   provider: "playwright",
      //   enabled: true,
      //   instances: [{ browser: "chromium" }]
      // }
    }
  };
});
