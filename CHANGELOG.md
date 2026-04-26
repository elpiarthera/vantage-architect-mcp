# Changelog — `@vantageos/mcp-architect`

All notable changes documented here. SemVer strict (Critical Rule #8 mcp-app-standard).

## [1.1.0] - 2026-04-26
### Added
- `decompose_spec` domain-specific templates (Closes #3): 12 handcrafted FR+EN templates covering saas-b2b-dashboard / mobile-app-consumer / marketplace-2-sided / api-product / internal-admin-tool / data-pipeline / ml-product / content-platform / ecommerce-storefront / iot-platform / fintech-app / dev-tool-cli. Keyword index (word-boundary-aware, plural-safe) activates conditional modules (billing, multi-tenant, real-time, i18n, push, IAP, social, open-banking, crypto, etc.) based on requirement content. Generates requirement-specific node names instead of generic verbs ("Authentication & RBAC" not "Implement Frontend").
- New optional `augment: "none" | "llm"` parameter on `decompose_spec` (Phase 2 reserved for LLM-augmented mode; "llm" value is accepted but treated as "none" until ANTHROPIC_API_KEY integration in v1.2+).
- 5 new domain-template eval cases in `evals/evals.json`.
- 10 new unit tests in `tests/unit/decompose_spec-domain-templates.test.ts`.

### Changed
- `decompose_spec` default behaviour: domain template matching first (score > 0), fallback to v1.0 generic heuristic + inline caveat suggesting specific keywords when no template matches. 100% backward-compatible — all v1.0.x clients get the same dual content shape.

Built by: Gamma (γ) (via mcp-server-builder specialist) | bu-mcp BU | 2026-04-26

## [1.0.7] - 2026-04-26
### Fixed
- **CRITICAL** tools/list inputSchema returned Zod runtime objects instead of valid JSON Schema. MCP clients (Claude Code) could not parse → 4 tools NON-LOADED in user catalog. v1.0.7 applies `zodToJsonSchema()` conversion at tool registration. Closes #1.

### Added
- Smoke gate Step 4 (lesson #16): pre-publish verifies tools/list response contains no Zod markers (_def, ~standard, _cached) and includes valid JSON Schema (type:object). Prevents Day 51 PM v1.0.6 type incident from recurring.

## [1.0.6] - 2026-04-26
### Fixed
- **CRITICAL** decompose_spec (and audited 4 tools: decompose_spec, expand_node, render_architecture, export_spec) returned malformed MCP content[] — items must conform to `{type:"text"|"image"|"resource"|"resource_link"|"audio", ...}`. The `resource` content-block in v1.0.5 used non-standard fields (`bundle`, `props`) instead of the required `text` (or `blob`) field. This caused client error -32602 "Invalid tools/call result". Fix: `buildUiResource` now reads the HTML bundle from disk, injects props via `<script>window.__MCP_PROPS__ = {...}</script>`, and returns a fully spec-compliant `{ uri, mimeType: "text/html", text: inlinedHtml }` block. Structured data remains in `structuredContent` top-level field (unchanged).

### Added
- Tool invocation smoke test in pre-publish gate: `scripts/smoke-test-boot.sh` now chains initialize → tools/list → tools/call decompose_spec, verifies no -32602 error and valid `content[]`. Lesson #13 capture (Day 51 PM Eta HARD-GATE: broken handler despite clean boot). Gate blocks `npm publish` via `prepublishOnly`.

## [1.0.5] - 2026-04-26
### Fixed
- **CRITICAL** boot crash on v1.0.4: server `setRequestHandler` was using a custom Zod schema that dropped the required `method` literal. Restored MCP SDK-provided `CallToolRequestSchema` / `ListToolsRequestSchema` imports. Server now boots and responds to MCP `initialize` handshake.
- Bug #3 (Pi audit): removed input duplication inside tool sub-sections. Input fields remain intact in `structuredContent` top-level; sub-sections contain pure prompts without verbose duplication.

### Added
- Pre-publish boot smoke test gate (`scripts/smoke-test-boot.sh` + `prepublishOnly`). `node dist/index.js` must respond to `initialize` handshake before publish proceeds. Prevents Day 51 PM type bug (broken package shipped to npm).

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
