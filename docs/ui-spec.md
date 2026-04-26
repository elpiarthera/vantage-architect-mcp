# UI Spec — `@vantageos/mcp-architect`

Components and interactions. Stack : React 19 + Tailwind v4 + lit-ui patterns + custom minimal SVG for `<GraphView>`.

| Component | lit-ui source | Responsibility |
|---|---|---|
| `<TreeView>` | accordion + tabs | Hierarchical drill-down (WCAG AA tree pattern). |
| `<NodeCard>` | card + popover | Per-node label + Expand button → `expand_node` via bridge. |
| `<MatrixView>` | data-table | Tabular alternative view. |
| `<GraphView>` | custom minimal SVG | Radial layout (~3 KB, justified deviation). |
| `<ExportPanel>` | dialog + select + button | Format picker + clipboard copy. |
| `<LocaleToggle>` | switch | EN/FR runtime toggle (no persistence). |

## Keyboard navigation (TreeView)

- `ArrowRight` : expand current node.
- `ArrowLeft` : collapse current node.
- `Enter` / `Space` : toggle.
- `Home` : focus first treeitem.
- `End` : focus last treeitem.
- All interactive elements show a visible focus ring (`focus-visible:ring-2 ring-blue-500`).

## i18n

- `src/ui/i18n/en.json` and `fr.json` — same keys, validated by `scripts/i18n-parity.sh` (CI gate).
- French strings written by hand (no auto-translation — Critical Rule, Anti-pattern Elastic).

## Sandbox-safe APIs

- Allowed : `navigator.clipboard.writeText`, `prefers-reduced-motion` media query.
- Forbidden : `window.parent.*`, `localStorage`, `sessionStorage`, `document.cookie`, `fetch`, `XMLHttpRequest`, `WebSocket`.
