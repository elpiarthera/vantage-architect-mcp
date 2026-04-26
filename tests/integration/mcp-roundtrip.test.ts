/**
 * Integration : full MCP roundtrip via the in-process server factory.
 *
 * Real Playwright + spawned stdio server is gated behind RUN_PLAYWRIGHT=1
 * (heavy, opt-in). This test exercises the same tool surface used by the
 * stdio handler so the roundtrip contract is still verified in CI.
 */
import { describe, expect, it, beforeEach } from "vitest";
import { createServer, getTool } from "../../src/server.js";
import { clearStore } from "../../src/lib/store.js";

beforeEach(() => clearStore());

describe("integration — MCP tool roundtrip", () => {
  it("decompose → render → expand → export, dual content always", async () => {
    const server = createServer();
    expect(server.tools).toHaveLength(4);

    const decompose = getTool("decompose_spec")!;
    const render = getTool("render_architecture")!;
    const expand = getTool("expand_node")!;
    const exp = getTool("export_spec")!;

    const d = await decompose.handler({
      requirement:
        "Build a multi-tenant document collaboration SaaS with real-time editing, comments, history.",
      domain: "software",
      depth: 2,
      locale: "en",
    });
    expect(d.content).toHaveLength(2);

    const r = await render.handler({
      tree_id: d.structuredContent.tree_id,
      view: "tree",
      locale: "en",
    });
    expect(r.content).toHaveLength(2);

    const intermediateId = d.structuredContent.root.children![0]!.id;
    const e = await expand.handler({
      node_id: intermediateId,
      expansion_depth: 1,
      tree_id: d.structuredContent.tree_id,
      locale: "en",
    });
    expect(e.content).toHaveLength(2);

    const x = await exp.handler({
      tree_id: d.structuredContent.tree_id,
      format: "mermaid",
      locale: "en",
    });
    expect(x.structuredContent.payload).toMatch(/^graph TD/);
  });
});
