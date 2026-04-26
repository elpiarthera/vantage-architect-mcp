# vantage-architect v1.0.0 — Visual spec composer for AI agents

## Highlights

- First-mover MCP App from ElPi Corp built on the **`io.modelcontextprotocol/ui` UI extension** (stable 2026-01-26).
- Returns hierarchical, drill-down component trees instead of walls of text — interactive in UI-capable clients (Claude Desktop, ChatGPT MCP, VS Code Insiders, MCPJam) with a clean Markdown fallback elsewhere.
- 26 tests across 10 files (16 server + 8 component + 1 integration + 1 a11y), 16/16 evals passing, 0 a11y violations, 68 KB gzipped UI bundle.
- Fully bilingual FR + EN by design (tools, manifest, UI toggle, errors).

## First-mover MCP App

This is the first ElPi Corp MCP server to implement the `mcp-app-standard.md` v1 (10 Critical Rules) end-to-end:

- Dual content on every tool (markdown fallback + `ui://` resource — Critical Rule #1, no exception).
- Single-file UI bundle via `vite-plugin-singlefile` (lit-ui + Tailwind v4 inline) — sandbox-safe, no network calls, no `localStorage`.
- Recursive `NodeSchema` via `z.lazy(...)` for arbitrarily deep hierarchies.
- Bridge protocol for `expand_node` drill-down inside the sandbox.

## 4 Tools

| Tool | What it does |
|---|---|
| `decompose_spec` | Decomposes a requirement into a hierarchical tree (`software` / `product` / `process` / `research`). |
| `render_architecture` | Renders an existing tree as `tree` / `graph` / `matrix`. |
| `expand_node` | Drill-down on a node (called by the UI via the bridge). |
| `export_spec` | Exports as `markdown` / `json` / `mermaid`. |

## UI stack

- `lit-ui` web components + Tailwind v4 utilities baked in.
- Vite + `vite-plugin-singlefile` → single self-contained HTML resource served as `ui://`.
- Runtime EN/FR locale toggle (no persistence — sandbox-safe).
- Recharts-ready data shape for graph/matrix renderers in client viewers.

## Bundle 68 KB gzipped

Single-file UI artifact: 68 KB gzipped, no external runtime fetches, no third-party CDN.

## Sandbox compliance

- No `localStorage`, no `sessionStorage`, no `indexedDB`, no cookies.
- No outbound network (`fetch` / `XHR` / `WebSocket`) from the UI.
- Bridge messages only via the standard `io.modelcontextprotocol/ui` postMessage envelope.

## WCAG AA

- 0 a11y violations (axe-core), Lighthouse-style audit baked into the test suite.
- Keyboard navigable tree, semantic landmarks, ARIA roles on every interactive element.

## Bilingual

Pass `locale: "fr"` (or `"en"`) to any tool. Manifest descriptions, error messages, node labels, and the UI itself toggle FR/EN at runtime.

## Install

```bash
npx -y @vantage/mcp-architect
```

Or in your `mcp.json`:

```json
{
  "mcpServers": {
    "vantage-architect": {
      "command": "npx",
      "args": ["-y", "@vantage/mcp-architect"]
    }
  }
}
```

## Standards compliance

- ElPi Corp `mcp-standard.md` v1 — 10 Critical Rules.
- ElPi Corp `mcp-app-standard.md` v1 — 10 Critical Rules.
- MCP spec 2025-06-18 + UI extension `io.modelcontextprotocol/ui` stable 2026-01-26.
- Doctrine Flexibilité 5/5 — alternatives documented in `docs/architecture.md` (Next.js web app ; Markdown export).

## Phase 1 / Phase 2

Phase 1 ships **stdio-only** — remote MCP App demo via Railway is **deferred to Phase 2 (Q4 2026)**. `railway.json` (RAILPACK) is committed in the repo for future activation.

---

Built by: mcp-server-builder + mcp-apps-ui-builder + mcp-spec-reviewer + mcp-publisher (via gamma) | bu-mcp BU | 2026-04-26

Orchestrator: Gamma — VantageOS Team | 2026-04-26
