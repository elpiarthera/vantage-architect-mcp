# `@vantage/mcp-architect`

> Transforme n'importe quelle exigence haut niveau en une spec/plan visuelle structurée, avec drill-down hiérarchique. Première MCP App ElPi Corp, fondée sur le standard `io.modelcontextprotocol/ui` (stable depuis le 2026-01-26). Bilingue FR + EN.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) ![MCP App](https://img.shields.io/badge/mcp--app-1.0.0-purple) ![Bilingue](https://img.shields.io/badge/i18n-FR%20%2B%20EN-green) ![WCAG AA](https://img.shields.io/badge/a11y-WCAG%20AA-success)

**SELLABLE AS** : plugin `vantage-architect-mcp` (claudemarketplaces.com) + npm `@vantage/mcp-architect`.

## Pourquoi

Une spec ou un plan se rendent d'habitude sous forme d'un mur de texte. Cette MCP App les retourne en arbre de composants interactifs, rendu inline par votre client (Claude desktop, ChatGPT MCP, VS Code Insiders, MCPJam, …), avec drill-down sur chaque nœud. Les clients qui ne supportent pas l'extension UI reçoivent un rendu Markdown propre — mêmes données, sans dégradation.

## Installation

```bash
npx -y @vantage/mcp-architect
```

Ou dans votre `mcp.json` :

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

## Outils

| Outil | Rôle |
|---|---|
| `decompose_spec` | Décompose une exigence en arbre hiérarchique (`software` / `product` / `process` / `research`). |
| `render_architecture` | Rend un arbre existant en vue `tree` / `graph` / `matrix`. |
| `expand_node` | Drill-down sur un nœud (appelé depuis l'UI via le bridge). |
| `export_spec` | Exporte en `markdown` / `json` / `mermaid`. |

Chaque outil renvoie un contenu dual : un bloc Markdown de repli + une ressource `ui://` (règle critique n°1, sans exception).

## Exemple rapide

```ts
await client.callTool("decompose_spec", {
  requirement: "Construire une plateforme SaaS de collaboration documentaire multi-tenant avec édition temps réel.",
  domain: "software",
  depth: 3,
  locale: "fr"
});
```

Dans un client compatible UI, vous obtenez un arbre interactif. En texte brut, vous obtenez :

```markdown
- **Construire une plateforme SaaS …** _(component)_ — Construire …
  - **Frontend** _(module)_ — Frontend — auto-decomposition (heuristic v1.0).
    - …
```

## Bilingue

Passez `locale: "fr"` pour recevoir noms et descriptions en français ; l'UI propose aussi un commutateur EN/FR à l'exécution (sans localStorage, conforme à la sandbox).

## Développement

```bash
npm install
npm test          # unit + component + intégration + a11y
npm run build     # bundle serveur (tsup)
npm run build:ui  # bundle UI mono-fichier (vite + vite-plugin-singlefile)
npm run evals     # exécute evals/evals.json (16 cas)
```

## Standards & doctrine

- Standard MCP server : ElPi Corp `mcp-standard.md` v1.
- Standard MCP App : ElPi Corp `mcp-app-standard.md` v1 (10 règles critiques).
- Extension UI : `io.modelcontextprotocol/ui` stable 2026-01-26.
- Doctrine Flexibilité 5/5 : deux alternatives documentées dans `docs/architecture.md` (web app Next.js ; export Markdown).

## Licence

MIT © 2026 ElPi Corp / Laurent Perello

Built by: mcp-server-builder + mcp-apps-ui-builder (via gamma) | bu-mcp BU | 2026-04-26
