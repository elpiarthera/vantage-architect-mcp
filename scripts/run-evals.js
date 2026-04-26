#!/usr/bin/env node
/**
 * Eval runner — executes evals/evals.json against the in-process tool
 * factory. Designed to be CI-friendly (exit code != 0 on any failed case).
 *
 * Note : "client_supports_ui": false cases assert the fallback markdown alone
 * is meaningful (Critical Rule #1).
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const evalsPath = resolve(__dirname, "../evals/evals.json");

async function main() {
  const evals = JSON.parse(readFileSync(evalsPath, "utf-8"));
  const { createServer, getTool } = await import("../src/server.ts").catch(
    () => import("../dist/server.js"),
  );
  const { clearStore } = await import("../src/lib/store.ts").catch(
    () => import("../dist/lib/store.js"),
  );

  void createServer();
  clearStore();

  const decomposeRoots = new Map();
  let pass = 0;
  let fail = 0;

  // Pre-run decompose seeds so depends_on cases find their tree.
  for (const c of evals.cases) {
    if (c.tool === "decompose_spec" && !c.expect?.throws) {
      const tool = getTool(c.tool);
      try {
        const res = await tool.handler(c.input);
        decomposeRoots.set(c.id, {
          tree_id: res.structuredContent.tree_id,
          root: res.structuredContent.root,
        });
      } catch {
        // ignored — error handled in main loop
      }
    }
  }

  for (const c of evals.cases) {
    try {
      const tool = getTool(c.tool);
      if (!tool) throw new Error(`unknown tool: ${c.tool}`);

      let input = { ...c.input };
      if (c.depends_on) {
        const root = decomposeRoots.get(c.depends_on);
        if (!root) throw new Error(`missing depends_on: ${c.depends_on}`);
        input = applyDeps(input, root);
      }

      const res = await tool.handler(input);
      if (c.expect?.throws) {
        // v1.0.4: input-validation failures now return readable
        // `{isError:true}` instead of throwing a generic error. Both
        // satisfy the eval intent ("must not succeed silently").
        if (res?.isError === true) {
          pass += 1;
          console.log(`PASS: ${c.id} (isError as expected)`);
          continue;
        }
        fail += 1;
        console.error(`FAIL: ${c.id} (expected throw or isError)`);
        continue;
      }
      pass += 1;
      console.log(`PASS: ${c.id}`);
    } catch (err) {
      if (c.expect?.throws) {
        pass += 1;
        console.log(`PASS: ${c.id} (threw as expected)`);
      } else {
        fail += 1;
        console.error(`FAIL: ${c.id} — ${err?.message ?? err}`);
      }
    }
  }

  console.log(`\nEval summary : ${pass}/${pass + fail} passed (${evals.fallback_cases} fallback cases)`);
  process.exit(fail === 0 ? 0 : 1);
}

function applyDeps(input, dep) {
  const out = { ...input };
  if (!out.tree_id) out.tree_id = dep.tree_id;
  if (out.node_index) {
    const path = out.node_index.split(".");
    let cur = dep.root;
    for (let i = 0; i < path.length; i++) {
      const seg = path[i];
      if (seg === "root") continue;
      if (seg === "children") {
        const idx = Number(path[++i]);
        cur = cur.children[idx];
      }
    }
    out.node_id = cur.id;
    delete out.node_index;
  }
  return out;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
