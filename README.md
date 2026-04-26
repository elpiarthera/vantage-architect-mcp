# `@vantageos/mcp-architect`

> Turn any high-level requirement into a structured visual spec/plan with hierarchical drill-down. First ElPi Corp MCP App, built on the `io.modelcontextprotocol/ui` standard (stable 2026-01-26). Bilingual FR + EN.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) ![MCP App](https://img.shields.io/badge/mcp--app-1.0.0-purple) ![Bilingual](https://img.shields.io/badge/i18n-FR%20%2B%20EN-green) ![WCAG AA](https://img.shields.io/badge/a11y-WCAG%20AA-success)

**SELLABLE AS** : `vantage-architect-mcp` plugin (claudemarketplaces.com) + npm `@vantageos/mcp-architect`.

## About

Specs written as text walls are read once and abandoned. This MCP App makes them navigable.

`@vantageos/mcp-architect` is the first MCP App built on the `io.modelcontextprotocol/ui` standard (stable 2026-01-26). It decomposes any high-level requirement — a software system, a product plan, a process redesign — into a structured component tree your MCP client renders inline as an interactive drill-down. Clients without UI extension support receive the same data as clean, nested Markdown. No degradation either way.

### What it does

Four tools with one shared mental model: decompose, visualize, drill deeper, export.

| Tool | What you get |
|---|---|
| `decompose_spec` | A requirement string in, a full hierarchical component tree out. Domains: `software`, `product`, `process`, `research`. Depth 1-4. Bilingual via `locale` param. |
| `render_architecture` | Render an existing tree in `tree`, `graph`, or `matrix` view. Called after `decompose_spec` or on demand. |
| `expand_node` | Drill down further on any node. Triggered by clicking a node in the UI — calls the server via the bridge protocol. No page reload, no new prompt. |
| `export_spec` | Export the current tree as `markdown`, `json`, or a `mermaid` diagram. One click from the UI ExportPanel, or call directly. |

Every tool returns dual content: a `ui://` resource for UI-capable clients and a fallback Markdown block for all others. This is non-negotiable — mandated by Critical Rule #1 of the MCP App standard.

### Who it is for

- Software architects and lead developers decomposing complex requirements before sprint planning
- Product managers who need structured specs their teams can navigate, not documents they have to search
- Technical teams running MCP-capable clients (Claude Desktop, VS Code Insiders, MCPJam, ChatGPT MCP) who want visual output instead of prose

### Why this is different

No other MCP server returns an interactive UI component alongside its text output. This is the first implementation of `io.modelcontextprotocol/ui` (stable since 2026-01-26) as a shipped, tested product — not a demo. The UI bundle is 68 KB gzipped, WCAG AA compliant, and contains zero external runtime calls.

### Quick Start

```bash
npx -y @vantageos/mcp-architect
```

Add to `mcp.json`:

```json
{
  "mcpServers": {
    "vantage-architect": {
      "command": "npx",
      "args": ["-y", "@vantageos/mcp-architect"]
    }
  }
}
```

No API key. No account. Then ask: "Decompose the architecture of a multi-tenant SaaS with real-time collaboration."

### Examples

**Software architecture:** Call `decompose_spec` with a microservices requirement at `depth: 3`. Get a tree with components, modules, and tasks. Click any node to expand it via `expand_node`.

**Product planning:** Use `domain: "product"` to break a product brief into features, dependencies, and open decisions — each node typed (`feature`, `task`, `decision`).

**Export to Mermaid:** Call `export_spec` with `format: "mermaid"` to get a diagram you paste directly into your technical spec document.

### Doctrine Flexibilité — Phase 1 / Phase 2

Phase 1 (current): stdio transport, local install, single-file UI bundle (68 KB gzipped), no remote server, no auth required.
Phase 2 (planned): Remote MCP App demo via Railway, Pro tier, auth via Polar.sh. `railway.json` committed in repo for future activation. Timeline: Q4 2026.

---

MIT License — Author: ElPi Corp / Laurent Perello — Source: [github.com/elpiarthera/vantage-architect-mcp](https://github.com/elpiarthera/vantage-architect-mcp)

## Why

Specs and plans are usually returned as a wall of text. This MCP App returns them as an interactive component tree your client renders inline (Claude desktop, ChatGPT MCP, VS Code Insiders, MCPJam, …) with drill-down on every node. Clients without UI extension support fall back to a meaningful Markdown rendering — same data, no degradation.

## Install

```bash
npx -y @vantageos/mcp-architect
```

Or in your `mcp.json` :

```json
{
  "mcpServers": {
    "vantage-architect": {
      "command": "npx",
      "args": ["-y", "@vantageos/mcp-architect"]
    }
  }
}
```

## Tools

| Tool | What it does |
|---|---|
| `decompose_spec` | Decomposes a requirement into a hierarchical tree (`software` / `product` / `process` / `research`). |
| `render_architecture` | Renders an existing tree as `tree` / `graph` / `matrix`. |
| `expand_node` | Drill-down on a node (called by the UI via the bridge). |
| `export_spec` | Exports as `markdown` / `json` / `mermaid`. |

Every tool returns dual content : a fallback markdown block + a `ui://` resource (Critical Rule #1, no exception).

## Quick example

```ts
await client.callTool("decompose_spec", {
  requirement: "Build a multi-tenant document collaboration SaaS with real-time editing, comments, history.",
  domain: "software",
  depth: 3,
  locale: "en"
});
```

In a UI-capable client, you get an interactive tree. In a plain text client, you get :

```markdown
- **Build a multi-tenant document collaboration SaaS …** _(component)_ — Build …
  - **Frontend** _(module)_ — Frontend — auto-decomposition (heuristic v1.0).
    - …
```

## Bilingual

Pass `locale: "fr"` to receive French node names + descriptions ; the UI also exposes a runtime EN/FR toggle (no localStorage, sandbox-safe).

## Development

```bash
npm install
npm test          # 26 tests across 10 files (16 server + 8 component + 1 integration + 1 a11y)
npm run build     # server bundle (tsup)
npm run build:ui  # UI single-file bundle (vite + vite-plugin-singlefile)
npm run evals     # run evals/evals.json (16 cases)
```

### Build & evals order

Run `npm run build` before `npm run evals` (or rely on the `tsx` fallback in `scripts/run-evals.js`). The evals harness imports built artifacts when present and falls back to live TS execution via `tsx` otherwise.

## Standards & doctrine

- MCP server standard : ElPi Corp `mcp-standard.md` v1.
- MCP App standard : ElPi Corp `mcp-app-standard.md` v1 (10 Critical Rules).
- UI extension : `io.modelcontextprotocol/ui` stable 2026-01-26.
- Doctrine Flexibilité 5/5 : two alternatives documented in `docs/architecture.md` (Next.js web app ; Markdown export).

## License

MIT © 2026 ElPi Corp / Laurent Perello

Built by: mcp-server-builder + mcp-apps-ui-builder (via gamma) | bu-mcp BU | 2026-04-26
