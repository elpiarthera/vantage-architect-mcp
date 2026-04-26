# Changelog — `@vantage/mcp-architect`

All notable changes documented here. SemVer strict (Critical Rule #8 mcp-app-standard).

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
