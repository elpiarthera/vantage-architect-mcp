# Release Notes — `@vantageos/mcp-architect` v1.0.4

**Date**: 2026-04-26

## Summary

Functional fix release. Zod enum validation errors are now surfaced as readable MCP `isError: true` responses with the offending field name and message, instead of being swallowed as a generic "Internal error". Every enum field across the 4 tools now self-documents its accepted values via `.describe()`. Drop-in replacement for v1.0.3 — no API change beyond improved error shape.

## What changed

### Tools impacted (all 4)

- `decompose_spec` — `domain`, `locale`, `depth` describes; ZodError → readable `isError`.
- `render_architecture` — `view`, `locale` describes; ZodError → readable `isError`.
- `expand_node` — `node_id`, `expansion_depth`, `tree_id`, `locale` describes; ZodError → readable `isError`.
- `export_spec` — `tree_id`, `format`, `locale` describes; ZodError → readable `isError`.
- Shared schemas (`src/schemas/node.ts`) — `NodeSchema.type`, `TreeIdSchema`, `NodeIdSchema`, `LocaleSchema` all now `.describe()`'d with explicit value lists.

### Error contract change

Before (v1.0.3): invalid input → handler throws → MCP client surfaces "Internal error".
After (v1.0.4): invalid input → handler returns
```json
{
  "content": [{ "type": "text", "text": "Validation error: domain: Invalid enum value..." }],
  "isError": true
}
```

### Tests

- New file `tests/unit/zod-error-handling.test.ts` (5 cases) — locks `isError` contract on all 4 tools + happy-path success.
- Updated existing `decompose_spec` / `export_spec` "rejects" tests from `.rejects.toThrow()` to the new `isError` assertion.
- Eval runner (`scripts/run-evals.js`) accepts either thrown error or `isError:true` for `expect.throws` cases (preserves intent).
- All 31 unit/component/integration/a11y tests pass; 16/16 eval cases pass (4 fallback cases preserved).

## Compatibility

Drop-in replacement for v1.0.3. Same 4 tools, same protocol (`2025-06-18`), same `io.modelcontextprotocol/ui` extension version (`2026-01-26`), same UI bundle.

## Files in this release

- `src/tools/decompose_spec.ts`, `src/tools/render_architecture.ts`, `src/tools/expand_node.ts`, `src/tools/export_spec.ts`
- `src/schemas/node.ts`
- `tests/unit/zod-error-handling.test.ts` (new)
- `tests/unit/decompose_spec.test.ts`, `tests/unit/export_spec.test.ts`
- `scripts/run-evals.js`
- `package.json`, `mcp.json`, `CHANGELOG.md`

---

Orchestrator: Gamma — VantageOS Team | 2026-04-26
