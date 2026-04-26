import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NodeCard } from "../../src/ui/components/NodeCard.js";
import { registerBridgeProvider } from "../../src/ui/lib/bridge.js";
import type { UiNode } from "../../src/ui/lib/types.js";

const node: UiNode = {
  id: "node_x",
  name: "Backend",
  type: "module",
  description: "Backend module.",
  metadata: { owner: "team-a" },
};

describe("<NodeCard>", () => {
  it("calls bridge.callTool('expand_node') on Expand click (EN)", async () => {
    const callTool = vi.fn(async () => ({}));
    registerBridgeProvider(() => ({ callTool }));
    render(<NodeCard node={node} locale="en" tree_id="tree_x" />);
    fireEvent.click(screen.getByText("Expand"));
    expect(callTool).toHaveBeenCalledWith(
      "expand_node",
      expect.objectContaining({ node_id: "node_x", tree_id: "tree_x" }),
    );
  });

  it("renders FR labels", () => {
    registerBridgeProvider(() => ({ callTool: async () => ({}) }));
    render(<NodeCard node={node} locale="fr" tree_id="tree_x" />);
    expect(screen.getByText("Développer")).toBeInTheDocument();
  });
});
