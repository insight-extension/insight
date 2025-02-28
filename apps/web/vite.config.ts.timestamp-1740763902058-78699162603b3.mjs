// vite.config.ts
import { sentryVitePlugin } from "file:///D:/Bohdan/Projects/Insight/NEW/node_modules/.pnpm/@sentry+vite-plugin@2.23.0/node_modules/@sentry/vite-plugin/dist/esm/index.mjs";
import { TanStackRouterVite } from "file:///D:/Bohdan/Projects/Insight/NEW/node_modules/.pnpm/@tanstack+router-plugin@1.97.14_@tanstack+react-router@1.97.14_react-dom@18.3.1_react@18.3.1__3ivggpiackb2nk6cpyubusn77m/node_modules/@tanstack/router-plugin/dist/esm/vite.js";
import viteReact from "file:///D:/Bohdan/Projects/Insight/NEW/node_modules/.pnpm/@vitejs+plugin-react-swc@3.7.2_@swc+helpers@0.5.15_vite@5.4.11_@types+node@22.7.4_less@4.2.1__e7gujhkjibedje3vaoqqckxuva/node_modules/@vitejs/plugin-react-swc/index.mjs";
import dotenv from "file:///D:/Bohdan/Projects/Insight/NEW/node_modules/.pnpm/dotenv@16.4.7/node_modules/dotenv/lib/main.js";
import path from "path";
import { defineConfig, loadEnv } from "file:///D:/Bohdan/Projects/Insight/NEW/node_modules/.pnpm/vite@5.4.11_@types+node@22.7.4_less@4.2.1_lightningcss@1.28.2_sass@1.83.1_terser@5.37.0/node_modules/vite/dist/node/index.js";
import { nodePolyfills } from "file:///D:/Bohdan/Projects/Insight/NEW/node_modules/.pnpm/vite-plugin-node-polyfills@0.17.0_rollup@4.29.1_vite@5.4.11_@types+node@22.7.4_less@4.2.1_lig_zsnhvr2e6foy4nhscww3oo2e6a/node_modules/vite-plugin-node-polyfills/dist/index.js";
var __vite_injected_original_dirname = "D:\\Bohdan\\Projects\\Insight\\NEW\\apps\\web";
dotenv.config();
var vite_config_default = defineConfig(({ mode }) => {
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
        "@": path.resolve(__vite_injected_original_dirname, "./src")
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
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxCb2hkYW5cXFxcUHJvamVjdHNcXFxcSW5zaWdodFxcXFxORVdcXFxcYXBwc1xcXFx3ZWJcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXEJvaGRhblxcXFxQcm9qZWN0c1xcXFxJbnNpZ2h0XFxcXE5FV1xcXFxhcHBzXFxcXHdlYlxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovQm9oZGFuL1Byb2plY3RzL0luc2lnaHQvTkVXL2FwcHMvd2ViL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgc2VudHJ5Vml0ZVBsdWdpbiB9IGZyb20gXCJAc2VudHJ5L3ZpdGUtcGx1Z2luXCI7XHJcbmltcG9ydCB7IFRhblN0YWNrUm91dGVyVml0ZSB9IGZyb20gXCJAdGFuc3RhY2svcm91dGVyLXBsdWdpbi92aXRlXCI7XHJcbmltcG9ydCB2aXRlUmVhY3QgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXJlYWN0LXN3Y1wiO1xyXG5pbXBvcnQgZG90ZW52IGZyb20gXCJkb3RlbnZcIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHsgbm9kZVBvbHlmaWxscyB9IGZyb20gXCJ2aXRlLXBsdWdpbi1ub2RlLXBvbHlmaWxsc1wiO1xyXG5cclxuZG90ZW52LmNvbmZpZygpO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH0pID0+IHtcclxuICBwcm9jZXNzLmVudiA9IHsgLi4ucHJvY2Vzcy5lbnYsIC4uLmxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSkgfTtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHBsdWdpbnM6IFtcclxuICAgICAgbm9kZVBvbHlmaWxscyh7XHJcbiAgICAgICAgZ2xvYmFsczoge1xyXG4gICAgICAgICAgcHJvY2VzczogZmFsc2UsXHJcbiAgICAgICAgICBCdWZmZXI6IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgIH0pLFxyXG4gICAgICBUYW5TdGFja1JvdXRlclZpdGUoKSxcclxuICAgICAgdml0ZVJlYWN0KCksXHJcbiAgICAgIHNlbnRyeVZpdGVQbHVnaW4oe1xyXG4gICAgICAgIG9yZzogXCJpbnNpZ2h0LXdyXCIsXHJcbiAgICAgICAgcHJvamVjdDogXCJ3ZWJcIixcclxuICAgICAgICBhdXRoVG9rZW46IHByb2Nlc3MuZW52LlZJVEVfU0VOVFJZX0FVVEhfVE9LRU5cclxuICAgICAgfSlcclxuICAgIF0sXHJcblxyXG4gICAgLy8gYWJzb2x1dGUgcGF0aHNcclxuICAgIHJlc29sdmU6IHtcclxuICAgICAgYWxpYXM6IHtcclxuICAgICAgICBcIkBcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyY1wiKVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIGJ1aWxkOiB7XHJcbiAgICAgIHNvdXJjZW1hcDogdHJ1ZVxyXG4gICAgfSxcclxuXHJcbiAgICB0ZXN0OiB7XHJcbiAgICAgIC8vIHNlZTogaHR0cHM6Ly92aXRlc3QuZGV2L2d1aWRlL2Jyb3dzZXIvXHJcbiAgICAgIC8vIGJyb3dzZXI6IHtcclxuICAgICAgLy8gICBwcm92aWRlcjogXCJwbGF5d3JpZ2h0XCIsXHJcbiAgICAgIC8vICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgICAgLy8gICBpbnN0YW5jZXM6IFt7IGJyb3dzZXI6IFwiY2hyb21pdW1cIiB9XVxyXG4gICAgICAvLyB9XHJcbiAgICB9XHJcbiAgfTtcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBcVQsU0FBUyx3QkFBd0I7QUFDdFYsU0FBUywwQkFBMEI7QUFDbkMsT0FBTyxlQUFlO0FBQ3RCLE9BQU8sWUFBWTtBQUNuQixPQUFPLFVBQVU7QUFDakIsU0FBUyxjQUFjLGVBQWU7QUFDdEMsU0FBUyxxQkFBcUI7QUFOOUIsSUFBTSxtQ0FBbUM7QUFRekMsT0FBTyxPQUFPO0FBR2QsSUFBTyxzQkFBUSxhQUFhLENBQUMsRUFBRSxLQUFLLE1BQU07QUFDeEMsVUFBUSxNQUFNLEVBQUUsR0FBRyxRQUFRLEtBQUssR0FBRyxRQUFRLE1BQU0sUUFBUSxJQUFJLENBQUMsRUFBRTtBQUVoRSxTQUFPO0FBQUEsSUFDTCxTQUFTO0FBQUEsTUFDUCxjQUFjO0FBQUEsUUFDWixTQUFTO0FBQUEsVUFDUCxTQUFTO0FBQUEsVUFDVCxRQUFRO0FBQUEsUUFDVjtBQUFBLE1BQ0YsQ0FBQztBQUFBLE1BQ0QsbUJBQW1CO0FBQUEsTUFDbkIsVUFBVTtBQUFBLE1BQ1YsaUJBQWlCO0FBQUEsUUFDZixLQUFLO0FBQUEsUUFDTCxTQUFTO0FBQUEsUUFDVCxXQUFXLFFBQVEsSUFBSTtBQUFBLE1BQ3pCLENBQUM7QUFBQSxJQUNIO0FBQUE7QUFBQSxJQUdBLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxNQUN0QztBQUFBLElBQ0Y7QUFBQSxJQUVBLE9BQU87QUFBQSxNQUNMLFdBQVc7QUFBQSxJQUNiO0FBQUEsSUFFQSxNQUFNO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUEsSUFPTjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
