import { describe, expect, it, beforeEach } from "vitest";
import { tool as decomposeSpec } from "../../src/tools/decompose_spec.js";
import { tool as renderArchitecture } from "../../src/tools/render_architecture.js";
import { clearStore } from "../../src/lib/store.js";

const REQ =
  "Build a multi-tenant document collaboration SaaS with real-time editing, comments, and version history.";

let tree_id: string;

beforeEach(async () => {
  clearStore();
  const res = await decomposeSpec.handler({
    requirement: REQ,
    domain: "software",
    depth: 2,
    locale: "en",
  });
  tree_id = res.structuredContent.tree_id;
});

describe("tool: render_architecture", () => {
  it("renders tree view (EN) with dual content", async () => {
    const res = await renderArchitecture.handler({
      tree_id,
      view: "tree",
      locale: "en",
    });
    expect(res.content).toHaveLength(2);
    expect(res.structuredContent.view).toBe("tree");
  });

  it("renders matrix view (FR)", async () => {
    const res = await renderArchitecture.handler({
      tree_id,
      view: "matrix",
      locale: "fr",
    });
    expect(res.structuredContent.view).toBe("matrix");
  });

  it("throws on unknown tree_id", async () => {
    await expect(
      renderArchitecture.handler({
        tree_id: "tree_doesnotexist",
        view: "tree",
        locale: "en",
      }),
    ).rejects.toThrow(/not found/);
  });

  it("fallback markdown remains meaningful when client lacks UI extension", async () => {
    const res = await renderArchitecture.handler({
      tree_id,
      view: "tree",
      locale: "en",
    });
    const text = (res.content[0] as { type: "text"; text: string }).text;
    expect(text.length).toBeGreaterThan(20);
  });
});
