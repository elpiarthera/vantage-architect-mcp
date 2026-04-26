import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { TreeView } from "../../src/ui/components/TreeView.js";
import type { UiNode } from "../../src/ui/lib/types.js";

const root: UiNode = {
  id: "node_root",
  name: "Root",
  type: "component",
  description: "root",
  metadata: {},
  children: [
    { id: "node_a", name: "Alpha", type: "module", description: "a", metadata: {} },
  ],
};

describe("<TreeView>", () => {
  it("renders a WCAG AA tree (EN)", () => {
    render(<TreeView root={root} locale="en" tree_id="tree_x" />);
    const tree = screen.getByRole("tree");
    expect(tree).toHaveAttribute("aria-label", "Architecture tree");
    expect(screen.getAllByRole("treeitem").length).toBeGreaterThanOrEqual(1);
  });

  it("renders a WCAG AA tree (FR)", () => {
    render(<TreeView root={root} locale="fr" tree_id="tree_x" />);
    expect(screen.getByRole("tree")).toHaveAttribute(
      "aria-label",
      "Arbre d'architecture",
    );
  });
});
