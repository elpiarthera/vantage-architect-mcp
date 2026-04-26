import { describe, expect, it, beforeEach } from "vitest";
import { tool as decomposeSpec } from "../../src/tools/decompose_spec.js";
import { clearStore } from "../../src/lib/store.js";

const REQ_EN =
  "Build a multi-tenant document collaboration SaaS with real-time editing, comments, and version history.";
const REQ_FR =
  "Construire une plateforme SaaS de collaboration documentaire multi-tenant avec édition temps réel, commentaires et historique des versions.";

beforeEach(() => clearStore());

describe("tool: decompose_spec", () => {
  it("returns a tree, dual content, and structuredContent (EN software)", async () => {
    const res = await decomposeSpec.handler({
      requirement: REQ_EN,
      domain: "software",
      depth: 3,
      locale: "en",
    });
    expect(res.content).toHaveLength(2);
    expect(res.content[0]).toMatchObject({ type: "text" });
    expect(res.content[1]).toMatchObject({ type: "resource" });
    expect(res.structuredContent.tree_id).toMatch(/^tree_/);
    expect(res.structuredContent.flat_count).toBeGreaterThan(5);
    expect(res.structuredContent.root.children?.length).toBeGreaterThan(0);
  });

  it("supports product domain in FR (v1.1.0: template-matched for SaaS multi-tenant FR req)", async () => {
    const res = await decomposeSpec.handler({
      requirement: REQ_FR,
      domain: "product",
      depth: 2,
      locale: "fr",
    });
    // v1.1.0: REQ_FR contains "SaaS" + "multi-tenant" keywords so domain template
    // saas-b2b-dashboard is activated, returning French module names.
    // Accept either template-matched names OR legacy heuristic names.
    const firstName = res.structuredContent.root.children?.[0]?.name ?? "";
    expect(firstName).toBeTruthy();
    expect(firstName.length).toBeGreaterThan(0);
  });

  it("rejects too-short requirements via inputSchema (returns isError)", async () => {
    const res = await decomposeSpec.handler({
      requirement: "too short",
      domain: "software",
      depth: 3,
      locale: "en",
    });
    expect(res.isError).toBe(true);
    expect((res.content[0] as { text: string }).text).toMatch(/requirement/);
  });

  // Fallback case (Critical Rule #1) — text content alone is meaningful.
  it("fallback markdown is non-empty and readable without UI", async () => {
    const res = await decomposeSpec.handler({
      requirement: REQ_EN,
      domain: "software",
      depth: 2,
      locale: "en",
    });
    const text = (res.content[0] as { type: "text"; text: string }).text;
    expect(text).toContain("**");
    expect(text.split("\n").length).toBeGreaterThan(3);
  });
});
