# `@vantage/mcp-architect`

> Turn any high-level requirement into a structured visual spec/plan with hierarchical drill-down. First ElPi Corp MCP App, built on the `io.modelcontextprotocol/ui` standard (stable 2026-01-26). Bilingual FR + EN.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) ![MCP App](https://img.shields.io/badge/mcp--app-1.0.0-purple) ![Bilingual](https://img.shields.io/badge/i18n-FR%20%2B%20EN-green) ![WCAG AA](https://img.shields.io/badge/a11y-WCAG%20AA-success)

**SELLABLE AS** : `vantage-architect-mcp` plugin (claudemarketplaces.com) + npm `@vantage/mcp-architect`.

## Why

Specs and plans are usually returned as a wall of text. This MCP App returns them as an interactive component tree your client renders inline (Claude desktop, ChatGPT MCP, VS Code Insiders, MCPJam, …) with drill-down on every node. Clients without UI extension support fall back to a meaningful Markdown rendering — same data, no degradation.

## Install

```bash
npx -y @vantage/mcp-architect
```

Or in your `mcp.json` :

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
