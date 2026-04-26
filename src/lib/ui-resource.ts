/**
 * UI resource builder for io.modelcontextprotocol/ui (stable 2026-01-26).
 *
 * Returns an MCP-compliant `EmbeddedResource` (uri + mimeType + text), with
 * the io.modelcontextprotocol/ui extension payload exposed via `_meta` per
 * MCP spec 2024-11-05. Top-level `text` field carries the JSON-stringified
 * extension payload as a transport-safe fallback for MCP clients that don't
 * recognise the io.modelcontextprotocol/ui extension.
 *
 * v1.0.6 fix : v1.0.5 returned non-MCP-compliant resource shape (custom
 * `bundle`, `props`, `extension` fields, no `text` or `blob`) → MCP SDK
 * client rejects with `-32602 "Invalid tools/call result"`. Fix restores
 * spec compliance while preserving extension payload via `_meta`.
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
  text: string;
  _meta: {
    "io.modelcontextprotocol/ui": {
      bundle: string;
      props: UiResourceProps;
    };
  };
}

export function buildUiResource(props: UiResourceProps): UiResource {
  const bundle = "dist/ui/architect.html";
  return {
    uri: `ui://vantage-architect/${props.tree_id}?view=${props.view}&locale=${props.locale}`,
    mimeType: "text/html",
    text: JSON.stringify({ bundle, props }),
    _meta: {
      "io.modelcontextprotocol/ui": {
        bundle,
        props,
      },
    },
  };
}
