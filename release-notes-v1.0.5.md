# vantage-architect v1.0.5 — boot crash hotfix + smoke test gate

**CRITICAL FIX**: v1.0.4 crashed at boot ("Schema is missing a method literal"). v1.0.5 restores boot.

## Changes
- Restore MCP SDK-provided request schemas (CallToolRequestSchema, ListToolsRequestSchema) — they include the required `method` literal.
- Bug #3 audit: input duplication in tool sub-sections — none found in 4 architect tools (audit clean).
- New pre-publish smoke test gate prevents broken-package shipping (`scripts/smoke-test-boot.sh` + `prepublishOnly`).

See [v1.0.0 release notes](https://github.com/elpiarthera/vantage-architect-mcp/releases/tag/v1.0.0) for full feature list.

## Install (v1.0.4 unpublished — use 1.0.5)
```bash
npx -y @vantageos/mcp-architect
```
