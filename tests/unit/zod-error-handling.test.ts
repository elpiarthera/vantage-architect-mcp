/**
 * T8.C.functional-fix v1.0.4 — Zod validation error handling.
 *
 * Mirror of `@vantageos/mcp-frameworks` T8.A.functional-fix:
 * Zod enum errors must surface as readable MCP `isError: true` responses
 * with the offending field name in the message — never swallowed as a
 * generic "Internal error".
 */
import { describe, expect, it, beforeEach } from "vitest";
import { tool as decomposeSpec } from "../../src/tools/decompose_spec.js";
import { tool as renderArchitecture } from "../../src/tools/render_architecture.js";
import { tool as exportSpec } from "../../src/tools/export_spec.js";
import { tool as expandNode } from "../../src/tools/expand_node.js";
import { clearStore } from "../../src/lib/store.js";

type AnyTool = {
  handler: (args: unknown) => Promise<{
    content: Array<{ type: string; text?: string }>;
    isError?: boolean;
    structuredContent?: unknown;
  }>;
};

async function callTool(t: AnyTool, args: unknown) {
  return t.handler(args);
}

beforeEach(() => clearStore());

describe("zod error handling — isError contract", () => {
  it("decompose_spec returns isError on invalid domain", async () => {
    const result = await callTool(decomposeSpec as AnyTool, {
      requirement:
        "A 50+ char requirement string here for valid input length test now",
      domain: "invalid-domain",
      depth: 2,
    });
    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toMatch(/domain/);
  });

  it("render_architecture returns isError on invalid view", async () => {
    const result = await callTool(renderArchitecture as AnyTool, {
      tree_id: "tree_abcdef",
      view: "3d-cube",
    });
    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toMatch(/view/);
  });

  it("export_spec returns isError on invalid format", async () => {
    const result = await callTool(exportSpec as AnyTool, {
      tree_id: "tree_abcdef",
      format: "pdf",
    });
    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toMatch(/format/);
  });

  it("expand_node returns isError on invalid node_id pattern", async () => {
    const result = await callTool(expandNode as AnyTool, {
      node_id: "INVALID-NODE-ID",
      expansion_depth: 1,
    });
    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toMatch(/node_id/);
  });

  it("export_spec succeeds on valid format (markdown)", async () => {
    // Seed a real tree so export_spec can resolve it.
    const seed = await callTool(decomposeSpec as AnyTool, {
      requirement:
        "Build a multi-tenant document collaboration SaaS with real-time editing.",
      domain: "software",
      depth: 2,
      locale: "en",
    });
    const tree_id = (seed.structuredContent as { tree_id: string }).tree_id;
    const result = await callTool(exportSpec as AnyTool, {
      tree_id,
      format: "markdown",
    });
    expect(result.isError).toBeFalsy();
    expect(result.content[0]?.type).toBe("text");
  });
});
