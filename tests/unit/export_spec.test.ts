import { describe, expect, it, beforeEach } from "vitest";
import { tool as decomposeSpec } from "../../src/tools/decompose_spec.js";
import { tool as exportSpec } from "../../src/tools/export_spec.js";
import { clearStore } from "../../src/lib/store.js";

let tree_id: string;

beforeEach(async () => {
  clearStore();
  const res = await decomposeSpec.handler({
    requirement:
      "Build a multi-tenant document collaboration SaaS with real-time editing.",
    domain: "software",
    depth: 2,
    locale: "en",
  });
  tree_id = res.structuredContent.tree_id;
});

describe("tool: export_spec", () => {
  it("exports markdown", async () => {
    const res = await exportSpec.handler({ tree_id, format: "markdown", locale: "en" });
    expect(res.structuredContent.format).toBe("markdown");
    expect(res.structuredContent.payload).toMatch(/\*\*/);
  });

  it("exports mermaid", async () => {
    const res = await exportSpec.handler({ tree_id, format: "mermaid", locale: "en" });
    expect(res.structuredContent.payload).toMatch(/^graph TD/);
  });

  it("rejects invalid format", async () => {
    await expect(
      // @ts-expect-error invalid format on purpose
      exportSpec.handler({ tree_id, format: "pdf", locale: "en" }),
    ).rejects.toThrow();
  });

  it("fallback : payload is the text content (works without UI extension)", async () => {
    const res = await exportSpec.handler({ tree_id, format: "json", locale: "en" });
    const text = (res.content[0] as { type: "text"; text: string }).text;
    expect(text).toBe(res.structuredContent.payload);
    expect(() => JSON.parse(text)).not.toThrow();
  });
});
