# Changelog — `@vantageos/mcp-architect`

All notable changes documented here. SemVer strict (Critical Rule #8 mcp-app-standard).

## [1.0.4] - 2026-04-26
### Fixed
- Functional fix: Zod enum validation errors are now surfaced as readable MCP `isError: true` responses (with offending field name + message) instead of being swallowed as a generic "Internal error". Affected tools: `decompose_spec`, `render_architecture`, `expand_node`, `export_spec`.
- Documentation: every `z.enum(...)` field across the 4 tools now carries a `.describe()` listing explicit accepted values (`domain`, `view`, `format`, `locale`, `type`). MCP clients can now display valid enum values to users and LLMs.
- Tests: 5 new cases (`tests/unit/zod-error-handling.test.ts`) lock the `isError` contract per tool. Existing "rejects with throw" cases updated to assert the new readable-error contract. Eval runner accepts both throw and `isError` for `expect.throws` cases.
- No API change beyond improved error shape. Drop-in replacement for v1.0.3.

## [1.0.3] - 2026-04-26
### Changed
- Cleanup: removed internal "SELLABLE AS" markers and forward-looking timeline references from public surfaces (README EN/FR, release notes).
- No behavioral or API change. Drop-in replacement for v1.0.2.

## [1.0.2] - 2026-04-26
### Changed
- Vitrine descriptions across 4 surfaces per ElPi Corp standard.
- No behavioral or API change.

## [1.0.1] - 2026-04-26
### Changed
- Renamed npm scope `@vantage` → `@vantageos` for ElPi Corp brand unification.
- No behavioral change. Install: `npx -y @vantageos/mcp-architect`.

## [1.0.0] — 2026-04-26

### Added

- Initial release. First ElPi Corp MCP App built on the `io.modelcontextprotocol/ui` standard (stable 2026-01-26).
- 4 tools : `decompose_spec`, `render_architecture`, `expand_node`, `export_spec`.
- Bilingual descriptions and i18n bundle (EN + FR), idiomatic French (no auto-translation).
- UI components composed from the `lit-ui` catalog : `TreeView`, `NodeCard`, `MatrixView`, `GraphView`, `ExportPanel`, `LocaleToggle`.
- Single-file UI bundle via `vite-plugin-singlefile` (target <250 KB gzipped).
- Mandatory dual `content[]` response on every tool (fallback markdown + `ui://` resource — Critical Rule #1).
- WCAG AA tree pattern (role=tree/treeitem, aria-expanded/level/setsize/posinset, full keyboard nav).
- 16 eval cases (3 per tool + 1 fallback per UI-returning tool).
- `axe-core` a11y CI gate (0 blocking violation).
- Multi-channel distribution scaffolding : npm + GitHub release + claudemarketplaces.com + VantageRegistry (T8 Publish track).
- Doctrine Flexibilité 5/5 alternatives documented in `docs/architecture.md`.
- Railway deployment manifest (RAILPACK builder) for optional remote demo.

### Notes

- `GraphView` is implemented as a minimal custom SVG (~3 KB) — justified deviation from `lit-ui` (no force-directed graph in the catalog yet). Phase 2 candidate for upstream `lit-ui/graph` skill.

Built by: mcp-server-builder + mcp-apps-ui-builder (via gamma) | bu-mcp BU | 2026-04-26
