import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { execSync } from "node:child_process";

function git(cmd, fallback) {
  try {
    return execSync(cmd).toString().trim();
  } catch {
    return fallback;
  }
}

// Umgebungsvariablen aus der Action haben Vorrang, lokal wird git befragt
const commitHash =
  process.env.GIT_COMMIT_HASH || git("git rev-parse --short HEAD", "unknown");
const version =
  process.env.APP_VERSION || git("git describe --tags --always", "dev");

// https://vite.dev/config/
export default defineConfig({
  base: process.env.BASE_PATH ?? "/",
  define: {
    __APP_VERSION__: JSON.stringify(version),
    __COMMIT_HASH__: JSON.stringify(commitHash),
  },
  plugins: [vue(), vueDevTools()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
