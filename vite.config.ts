import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import { resolve } from "node:path";

// Single-file UI bundle (Critical Rule #3 — bundle single-file via vite-plugin-singlefile).
// Output : dist/ui/architect.html (HTML + JS + CSS inlined). Target <250 KB gzipped.
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: "dist/ui",
    emptyOutDir: true,
    cssCodeSplit: false,
    assetsInlineLimit: 100_000_000,
    rollupOptions: {
      input: resolve(__dirname, "src/ui/index.html"),
      output: {
        inlineDynamicImports: true,
        manualChunks: undefined,
        entryFileNames: "architect.js",
        assetFileNames: "architect.[ext]",
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
