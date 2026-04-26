# `@vantageos/mcp-architect`

> Transforme n'importe quelle exigence haut niveau en une spec/plan visuelle structurée, avec drill-down hiérarchique. Première MCP App ElPi Corp, fondée sur le standard `io.modelcontextprotocol/ui` (stable depuis le 2026-01-26). Bilingue FR + EN.

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE) ![MCP App](https://img.shields.io/badge/mcp--app-1.0.0-purple) ![Bilingue](https://img.shields.io/badge/i18n-FR%20%2B%20EN-green) ![WCAG AA](https://img.shields.io/badge/a11y-WCAG%20AA-success)

## À propos

Les specs écrites en bloc de texte sont lues une fois puis abandonnées. Cette MCP App les rend navigables.

`@vantageos/mcp-architect` est la première MCP App construite sur le standard `io.modelcontextprotocol/ui` (stable depuis le 2026-01-26). Elle décompose n'importe quelle exigence — un système logiciel, un plan produit, une refonte de processus — en un arbre de composants structuré que votre client MCP affiche directement sous forme d'arbre interactif à drill-down. Les clients sans support UI reçoivent les mêmes données sous forme de Markdown hiérarchisé lisible. Aucune dégradation dans les deux cas.

### Ce qu'elle fait

Quatre outils, un seul modèle mental : décomposer, visualiser, approfondir, exporter.

| Outil | Ce que vous obtenez |
|---|---|
| `decompose_spec` | Une exigence en entrée, un arbre de composants hiérarchique en sortie. Domaines : `software`, `product`, `process`, `research`. Profondeur 1-4. Bilingue via le paramètre `locale`. |
| `render_architecture` | Affiche un arbre existant en vue `tree`, `graph` ou `matrix`. Appelé après `decompose_spec` ou de manière autonome. |
| `expand_node` | Approfondissement d'un nœud par clic dans l'UI — appelle le serveur via le protocole bridge. Pas de rechargement, pas de nouveau prompt. |
| `export_spec` | Exporte l'arbre courant en `markdown`, `json` ou diagramme `mermaid`. Depuis le panneau ExportPanel ou directement via l'outil. |

Chaque outil retourne un double contenu : une ressource `ui://` pour les clients compatibles UI et un bloc Markdown pour les autres. Ceci est non-négociable — imposé par la Critical Rule n°1 du standard MCP App.

### Pour qui

- Architectes logiciels et lead developers qui décomposent des exigences complexes avant le sprint planning
- Product managers ayant besoin de specs structurées que leurs équipes peuvent parcourir, pas de documents à fouiller
- Équipes techniques utilisant des clients MCP compatibles UI (Claude Desktop, VS Code Insiders, MCPJam, ChatGPT MCP) qui veulent une sortie visuelle plutôt que de la prose

### Pourquoi c'est différent

Aucun autre serveur MCP ne retourne un composant UI interactif en accompagnement de sa sortie texte. C'est la première implémentation de `io.modelcontextprotocol/ui` (stable depuis le 2026-01-26) en tant que produit livré et testé — pas une démo. Le bundle UI fait 68 Ko gzippé, est conforme WCAG AA et ne contient aucun appel réseau externe.

### Démarrage rapide

```bash
npx -y @vantageos/mcp-architect
```

Ajoutez dans `mcp.json` :

```json
{
  "mcpServers": {
    "vantage-architect": {
      "command": "npx",
      "args": ["-y", "@vantageos/mcp-architect"]
    }
  }
}
```

Pas de clé API. Pas de compte. Puis demandez : "Décompose l'architecture d'un SaaS multi-tenant avec collaboration en temps réel."

### Exemples

**Architecture logicielle :** Appelez `decompose_spec` avec une exigence microservices à `depth: 3`. Obtenez un arbre avec composants, modules et tâches. Cliquez sur n'importe quel nœud pour l'approfondir via `expand_node`.

**Planification produit :** Utilisez `domain: "product"` pour décomposer un brief produit en fonctionnalités, dépendances et décisions ouvertes — chaque nœud typé (`feature`, `task`, `decision`).

**Export Mermaid :** Appelez `export_spec` avec `format: "mermaid"` pour obtenir un diagramme à coller directement dans votre document de spec technique.

### Doctrine Flexibilité — Phase 1 / Phase 2

Phase 1 (actuelle) : transport stdio, installation locale, bundle UI fichier unique (68 Ko gzippé), pas de serveur distant, pas d'authentification.
Phase 2 (prévue) : démo MCP App distante via Railway, tier Pro, auth via Polar.sh. `railway.json` commité dans le repo pour activation future. Activée selon le signal d'adoption.

---

Licence MIT — Auteur : ElPi Corp / Laurent Perello — Source : [github.com/elpiarthera/vantage-architect-mcp](https://github.com/elpiarthera/vantage-architect-mcp)

## Pourquoi

Une spec ou un plan se rendent d'habitude sous forme d'un mur de texte. Cette MCP App les retourne en arbre de composants interactifs, rendu inline par votre client (Claude desktop, ChatGPT MCP, VS Code Insiders, MCPJam, …), avec drill-down sur chaque nœud. Les clients qui ne supportent pas l'extension UI reçoivent un rendu Markdown propre — mêmes données, sans dégradation.

## Installation

```bash
npx -y @vantageos/mcp-architect
```

Ou dans votre `mcp.json` :

```json
{
  "mcpServers": {
    "vantage-architect": {
      "command": "npx",
      "args": ["-y", "@vantageos/mcp-architect"]
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
