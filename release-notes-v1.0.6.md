# vantage-architect v1.0.6 — content-block schema hotfix

**CRITICAL fix** — v1.0.5 was live but unusable end-to-end. The `decompose_spec` (and all 4 tools) returned a malformed MCP `resource` content-block with non-standard fields (`bundle`, `props`, `extension`) and no required `text`/`blob` field. MCP clients (Claude Code and others) rejected with `-32602 "Invalid tools/call result"`.

See full feature set in [v1.0.0 release notes](release-notes.md).

## What's fixed

- **MCP content-block schema compliance** — `buildUiResource` now returns `{ uri, mimeType: "text/html", text, _meta }` where `text` is the JSON-stringified extension payload. All 4 tools audited and fixed via the shared `ui-resource.ts` builder.
- **Tool invocation smoke gate** — `scripts/smoke-test-boot.sh` now chains 3 steps: initialize → tools/list → tools/call decompose_spec. Catches broken handlers that survive clean boot (lesson #13, Day 51 PM Eta HARD-GATE). Gate blocks `npm publish` via `prepublishOnly`.

## Upgrade

```bash
npx -y @vantageos/mcp-architect@1.0.6
```

or in Claude Code `claude_desktop_config.json`:
```json
{ "mcpServers": { "vantage-architect": { "command": "npx", "args": ["-y", "@vantageos/mcp-architect@1.0.6"] } } }
```

---
Orchestrator: Gamma — VantageOS Team | 2026-04-26
