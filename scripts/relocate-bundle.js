#!/usr/bin/env node
/**
 * Vite preserves the input file path inside outDir. Move the produced HTML
 * to the canonical `dist/ui/architect.html` location consumed by the server
 * (see src/lib/ui-resource.ts).
 */
import { renameSync, existsSync, rmSync } from "node:fs";
import { resolve } from "node:path";

const cwd = process.cwd();
const src = resolve(cwd, "dist/ui/src/ui/index.html");
const dest = resolve(cwd, "dist/ui/architect.html");

if (existsSync(src)) {
  renameSync(src, dest);
  rmSync(resolve(cwd, "dist/ui/src"), { recursive: true, force: true });
  console.log(`relocated → dist/ui/architect.html`);
} else if (existsSync(dest)) {
  console.log(`already at dist/ui/architect.html`);
} else {
  console.error(`expected ${src} or ${dest}`);
  process.exit(1);
}
