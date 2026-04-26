#!/usr/bin/env node
/**
 * Bundle size guard — Critical Rule #6 mcp-app-standard : <250 KB gzipped.
 */
import { readFileSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { resolve } from "node:path";

const MAX = 250 * 1024;
const path = resolve(process.cwd(), "dist/ui/architect.html");

try {
  const stat = statSync(path);
  const raw = readFileSync(path);
  const gz = gzipSync(raw).length;
  console.log(
    `bundle: raw=${(stat.size / 1024).toFixed(1)} KB, gzipped=${(gz / 1024).toFixed(1)} KB`,
  );
  if (gz > MAX) {
    console.error(`FAIL: bundle exceeds ${MAX / 1024} KB gzipped`);
    process.exit(1);
  }
  console.log(`PASS: bundle within budget (<${MAX / 1024} KB)`);
} catch (err) {
  console.error(`size-limit: cannot read ${path} — run \`npm run build:ui\` first.`);
  console.error(err?.message ?? err);
  process.exit(1);
}
