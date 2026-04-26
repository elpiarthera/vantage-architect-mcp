# Release Notes — v1.0.7

**Date**: 2026-04-26
**Package**: `@vantageos/mcp-architect`
**Type**: Critical bug fix

## Critical Fix: tools/list JSON Schema compliance (Closes #1)

v1.0.6 exposed raw Zod runtime objects as `inputSchema` in the `tools/list` response. MCP clients (including Claude Code) expect valid JSON Schema (`{type: "object", properties: {...}, required: [...]}`) — not Zod internal representations (`_def`, `~standard`, `_cached` markers).

**Impact**: All 4 tools (`decompose_spec`, `render_architecture`, `expand_node`, `export_spec`) were NON-LOADED in Claude Code tool catalog. Product was unusable for end users.

**Fix**: `zodToJsonSchema()` conversion applied at tool registration in `src/index.ts`. Runtime validation in handlers still uses the original Zod schemas (no regression on validation).

## Smoke Gate Extension (lesson #16)

`scripts/smoke-test-boot.sh` extended from 3 to 4 steps:
- Step 4 verifies `tools/list` response contains no Zod runtime markers and includes valid JSON Schema (`type:object`).
- Prevents recurrence of this class of bug pre-publish.

## Upgrade

```bash
npx @vantageos/mcp-architect@latest
# or update your claude_desktop_config.json / mcp.json
```

---

Orchestrator: Gamma (γ) — VantageOS Team | 2026-04-26
