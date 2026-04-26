import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ExportPanel } from "../../src/ui/components/ExportPanel.js";
import { registerBridgeProvider } from "../../src/ui/lib/bridge.js";

describe("<ExportPanel>", () => {
  it("triggers export_spec via bridge (EN)", async () => {
    const callTool = vi.fn(async () => ({ payload: "**root**" }));
    registerBridgeProvider(() => ({ callTool }));
    render(<ExportPanel tree_id="tree_x" locale="en" />);
    fireEvent.click(screen.getByRole("button", { name: "Export" }));
    expect(callTool).toHaveBeenCalledWith(
      "export_spec",
      expect.objectContaining({ tree_id: "tree_x", format: "markdown", locale: "en" }),
    );
  });

  it("renders FR labels", () => {
    registerBridgeProvider(() => ({ callTool: async () => ({}) }));
    render(<ExportPanel tree_id="tree_x" locale="fr" />);
    expect(screen.getByRole("button", { name: "Exporter" })).toBeInTheDocument();
  });
});
