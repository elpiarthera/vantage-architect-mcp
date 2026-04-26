import { describe, expect, it, beforeEach } from "vitest";
import { tool as decomposeSpec } from "../../src/tools/decompose_spec.js";
import { tool as expandNode } from "../../src/tools/expand_node.js";
import { clearStore } from "../../src/lib/store.js";

let leafId: string;
let intermediateId: string;
let tree_id: string;

beforeEach(async () => {
  clearStore();
  const res = await decomposeSpec.handler({
    requirement:
      "Build a multi-tenant document collaboration SaaS with real-time editing, comments, history.",
    domain: "software",
    depth: 2,
    locale: "en",
  });
  tree_id = res.structuredContent.tree_id;
  intermediateId = res.structuredContent.root.children![0]!.id;
  leafId = res.structuredContent.root.children![0]!.children![0]!.id;
});

describe("tool: expand_node", () => {
  it("expands an intermediate node by 1 depth", async () => {
    const res = await expandNode.handler({
      node_id: intermediateId,
      expansion_depth: 1,
      tree_id,
      locale: "en",
    });
    expect(res.structuredContent.expanded.children?.length).toBeGreaterThan(0);
  });

  it("expands a leaf by synthesizing children", async () => {
    const res = await expandNode.handler({
      node_id: leafId,
      expansion_depth: 1,
      tree_id,
      locale: "en",
    });
    expect(res.structuredContent.expanded.children?.length).toBeGreaterThan(0);
  });

  it("throws on unknown node_id", async () => {
    await expect(
      expandNode.handler({
        node_id: "node_does_not_exist",
        expansion_depth: 1,
        tree_id,
        locale: "en",
      }),
    ).rejects.toThrow(/not found/);
  });

  it("fallback markdown of expanded subtree readable without UI", async () => {
    const res = await expandNode.handler({
      node_id: intermediateId,
      expansion_depth: 1,
      tree_id,
      locale: "en",
    });
    const text = (res.content[0] as { type: "text"; text: string }).text;
    expect(text).toMatch(/###/);
  });
});
