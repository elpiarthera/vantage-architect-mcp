# Architecture — `@vantageos/mcp-architect`

Version : 1.0.0 · Date : 2026-04-26

---

## 1. Overview

MCP App = MCP server (4 tools) + UI bundle served as a `ui://` resource (extension `io.modelcontextprotocol/ui`, stable 2026-01-26). The server is the source of truth for spec trees ; the UI is a stateless rendering layer composed from the `lit-ui` catalog.

```
┌────────────┐   stdio    ┌───────────────────────┐   ui://    ┌──────────────────┐
│ MCP client │ ◀────────▶ │ vantage-architect MCP │ ────────▶ │ Sandboxed iframe │
└────────────┘            │  server (4 tools)     │           │  React + Tailwind │
                          └───────────────────────┘           └──────────────────┘
                                  ▲                                   │
                                  └────── bridge.callTool ◀───────────┘
```

## 2. Tools

| Tool | Returns | Bridge re-entry |
|---|---|---|
| `decompose_spec` | tree + ui resource (tree view) | yes (`expand_node`) |
| `render_architecture` | tree/graph/matrix + ui resource | yes (`expand_node`) |
| `expand_node` | expanded subtree + ui resource | yes (recursive) |
| `export_spec` | markdown / json / mermaid + ui preview | no |

Every tool returns the dual `content[]` shape : `[{type:"text", text: fallbackMarkdown}, {type:"resource", resource: ui}]`. Critical Rule #1 — no exception.

## 3. State management

- **Server** : in-memory `Map<tree_id, StoredTree>` + `Map<node_id, Node>` (single source of truth).
- **UI local state** : view selection, popover open/close, expanded set, format choice. Never duplicates server data.
- **Bridge cache** : delegated to `@modelcontextprotocol/ext-apps` (request dedup).

v1.0 ships in-memory only — Phase 2 candidate : SQLite (single-node) or Convex (multi-node).

## 4. Sandbox compliance (Critical Rule #4)

The UI bundle :

- ❌ NEVER reads `window.parent.*`.
- ❌ NEVER touches `localStorage` / `sessionStorage`.
- ❌ NEVER reads `document.cookie`.
- ❌ NEVER calls `fetch()` / `XMLHttpRequest` / `WebSocket` outside the bridge.
- ✅ ALL data IN comes from `window.__MCP_PROPS__` (injected by the host runtime).
- ✅ ALL side effects OUT go through `bridge.callTool()` JSON-RPC.

`navigator.clipboard.writeText` (used by `<ExportPanel>`) is a sandboxed iframe API explicitly allowed by MCP Apps spec.

## 5. Performance budgets

| Metric | Budget | Verified by |
|---|---|---|
| Bundle gzipped | <250 KB | `scripts/size-limit.js` |
| Initial render LAN | <1 s | Playwright trace (Phase 2 CI) |
| Bridge roundtrip p95 | <500 ms | tracing harness (Phase 2) |
| Memory steady | <50 MB | DevTools profiler (manual) |

## 6. Doctrine Flexibilité 5/5 — alternatives documentées

The MCP App format is a strategic choice. If for any reason a customer / channel cannot host an MCP App, two alternatives ship same-data without rebuild :

1. **Web app standalone (Next.js)** — coût migration ~3-5 jours-homme. Wrap the same `decompose` + `expand` libs behind a Next.js API route ; render the same React components in a normal page. State persisted in Postgres.
2. **Screenshot markdown** — coût 0 jour. `export_spec` already produces a Markdown rendering of the tree readable in any markdown viewer (Notion, Obsidian, GitHub). Mermaid export adds a diagram for free.

These alternatives are intentional — they de-risk the MCP App bet without locking ourselves to the standard.

## 7. Justified deviation : `<GraphView>`

`lit-ui` does not currently ship a force-directed graph component. We implement a custom minimal SVG layout (~3 KB additionnels, no JS dependency). Phase 2 candidate : upstream a `lit-ui/graph` skill once usage validates the abstraction.

## 8. Build & deploy

- `npm run build` — server bundle (tsup, Node 20, ESM).
- `npm run build:ui` — UI single-file (`dist/ui/architect.html` via `vite-plugin-singlefile`).
- `npm test` — unit + component + integration + a11y (Vitest).
- `npm run evals` — runs `evals/evals.json` (16 cases, 4 fallback).
- Optional remote demo : `railway.json` ships `RAILPACK` builder ; deployment is opt-in (Track C T6.C.9).

## 9. Distribution multi-canal (Critical Rule #9)

Targeted at v1.0 publish (handled by `mcp-publisher` agent in T8) :

- npm : `@vantageos/mcp-architect@1.0.0`.
- GitHub release : `v1.0.0` on `elpiarthera/vantage-architect-mcp`.
- claudemarketplaces.com : listing via `generate-marketplace`.
- VantageRegistry : `mcp__vantage-registry__upsert_plugin` (category `mcp-app`, bilingual `true`).
