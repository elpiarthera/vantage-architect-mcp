/**
 * UI resource builder for io.modelcontextprotocol/ui (stable 2026-01-26).
 *
 * Returns a `ui://` resource pointing at the single-file bundle produced by
 * `npm run build:ui`. Props are injected by the host runtime as `window.__MCP_PROPS__`.
 *
 * Sandbox compliance reminder (Critical Rule #4 mcp-app-standard) :
 *   - Bundle MUST NOT touch window.parent / localStorage / cookie / fetch externe.
 *   - Tests in tests/a11y + tests/integration verify this contract at runtime.
 */
import type { ArchitectNode, Locale } from "../schemas/node.js";

export interface UiResourceProps {
  view: "tree" | "graph" | "matrix";
  root: ArchitectNode;
  tree_id: string;
  locale: Locale;
}

export interface UiResource {
  uri: string;
  mimeType: "text/html";
  bundle: string; // path resolved at host runtime
  props: UiResourceProps;
  extension: "io.modelcontextprotocol/ui";
}

export function buildUiResource(props: UiResourceProps): UiResource {
  return {
    uri: `ui://vantage-architect/${props.tree_id}?view=${props.view}&locale=${props.locale}`,
    mimeType: "text/html",
    bundle: "dist/ui/architect.html",
    props,
    extension: "io.modelcontextprotocol/ui",
  };
}
