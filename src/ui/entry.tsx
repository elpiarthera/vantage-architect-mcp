/**
 * UI entry — mounted by the MCP Apps host runtime.
 *
 * Reads props from `window.__MCP_PROPS__` (injected by the host before script
 * execution). NEVER reads from window.parent / localStorage / cookie.
 */
import { createRoot } from "react-dom/client";
import { App } from "./components/App.js";
import type { UiProps } from "./lib/types.js";
import "./styles/tailwind.css";

declare global {
  interface Window {
    __MCP_PROPS__?: UiProps;
  }
}

const props: UiProps =
  (typeof window !== "undefined" && window.__MCP_PROPS__) ||
  ({
    view: "tree",
    locale: "en",
    tree_id: "tree_demo",
    root: {
      id: "node_root",
      name: "Vantage Architect",
      type: "component",
      description: "Demo placeholder.",
      metadata: {},
    },
  } as UiProps);

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(<App {...props} />);
}
