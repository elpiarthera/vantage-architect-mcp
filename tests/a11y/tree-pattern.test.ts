/**
 * a11y — axe-core scan of the rendered tree.
 *
 * Critical Rule #5 mcp-app-standard : 0 blocking violation in CI.
 */
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import axe from "axe-core";
import { TreeView } from "../../src/ui/components/TreeView.js";
import type { UiNode } from "../../src/ui/lib/types.js";
import React from "react";

const root: UiNode = {
  id: "node_root",
  name: "Root",
  type: "component",
  description: "root",
  metadata: {},
  children: [
    {
      id: "node_a",
      name: "Backend",
      type: "module",
      description: "backend",
      metadata: {},
      children: [
        { id: "node_a1", name: "Auth", type: "task", description: "auth", metadata: {} },
      ],
    },
  ],
};

describe("a11y — TreeView axe-core", () => {
  it("has 0 blocking violations (WCAG AA)", async () => {
    const { container } = render(
      React.createElement(TreeView, { root, locale: "en", tree_id: "tree_x" }),
    );
    const results = await axe.run(container, {
      runOnly: { type: "tag", values: ["wcag2a", "wcag2aa"] },
    });
    const blocking = results.violations.filter((v) =>
      ["serious", "critical"].includes(v.impact ?? ""),
    );
    if (blocking.length > 0) {
      // eslint-disable-next-line no-console
      console.error(JSON.stringify(blocking, null, 2));
    }
    expect(blocking).toHaveLength(0);
  });
});
