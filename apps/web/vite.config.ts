import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react-swc";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), nodePolyfills()],
    // absolute paths
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
});
