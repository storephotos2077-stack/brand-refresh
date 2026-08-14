import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// Deploy target: Vercel sets `VERCEL=1` during its builds, so the production
// build emits the Vercel Build Output API bundle there and keeps the default
// target everywhere else. Force locally with `NITRO_PRESET=vercel npm run build`.
const preset = process.env["NITRO_PRESET"] ?? (process.env["VERCEL"] ? "vercel" : undefined);

export default defineConfig({
  ...(preset ? { nitro: { preset } } : {}),
  tanstackStart: {
    // Redirect the bundled server entry to src/server.ts (our SSR error wrapper).
    server: { entry: "server" },
  },
  vite: {
    build: {
      cssMinify: "lightningcss",
      // Long-term cacheable, well-split chunks.
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (!id.includes("node_modules")) return undefined;
            if (id.includes("react-dom") || id.includes("/react/")) return "react";
            if (id.includes("@tanstack")) return "tanstack";
            if (id.includes("lucide-react")) return "icons";
            return undefined;
          },
        },
      },
    },
  },
});
