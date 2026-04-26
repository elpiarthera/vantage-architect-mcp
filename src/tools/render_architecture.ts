/**
 * Tool: render_architecture
 *
 * Renders an existing tree (tree/graph/matrix view) as the MCP App UI.
 * Critical Rule #1 — dual content (markdown + ui resource), no exception.
 */
import { z } from "zod";
import { LocaleSchema, NodeSchema, TreeIdSchema } from "../schemas/node.js";
import { getTree } from "../lib/store.js";
import { renderMarkdownTree } from "../lib/fallback.js";
import { buildUiResource } from "../lib/ui-resource.js";

export const inputSchema = z.object({
  tree_id: TreeIdSchema.describe("Tree ID returned by a previous decompose_spec call"),
  view: z
    .enum(["tree", "graph", "matrix"])
    .default("tree")
    .describe(
      "Render view type: 'tree' (default drill-down) | 'graph' (force-directed) | 'matrix' (table)",
    ),
  locale: LocaleSchema.default("en").describe(
    "Locale for output: 'en' (default) | 'fr'",
  ),
});

export const outputSchema = z.object({
  tree_id: z.string(),
  root: NodeSchema,
  view: z
    .enum(["tree", "graph", "matrix"])
    .describe("Echoed view type: 'tree' | 'graph' | 'matrix'"),
  fetchedAt: z.string().datetime(),
});

export const description =
  "Render the architecture/plan as an interactive visual UI (tree/graph/matrix view with drill-down). Use this whenever the user wants to see the structure visually, or after decompose_spec was called — even if they don't say 'render' explicitly.";

export const description_fr =
  "Rend l'architecture/plan en UI visuelle interactive (vue arbre/graphe/matrice avec drill-down). Utilise-le quand l'utilisateur veut voir la structure visuellement, ou après decompose_spec — même s'il ne dit pas 'afficher' explicitement.";

export async function handler(rawInput: unknown) {
  let input: z.infer<typeof inputSchema>;
  try {
    input = inputSchema.parse(rawInput);
  } catch (e) {
    if (e instanceof z.ZodError) {
      const msg = e.errors
        .map(
          (err) => `${err.path.join(".") || "<root>"}: ${err.message}`,
        )
        .join("; ");
      return {
        content: [
          { type: "text" as const, text: `Validation error: ${msg}` },
        ],
        isError: true,
      };
    }
    throw e;
  }
  const stored = getTree(input.tree_id);
  if (!stored) {
    throw new Error(`tree_id not found: ${input.tree_id}`);
  }

  const fallbackMarkdown = renderMarkdownTree(stored.root);
  const ui = buildUiResource({
    view: input.view,
    root: stored.root,
    tree_id: input.tree_id,
    locale: input.locale,
  });

  return {
    content: [
      { type: "text" as const, text: fallbackMarkdown },
      { type: "resource" as const, resource: ui },
    ],
    structuredContent: {
      tree_id: input.tree_id,
      root: stored.root,
      view: input.view,
      fetchedAt: new Date().toISOString(),
    },
  };
}

export const tool = {
  name: "render_architecture",
  description,
  description_fr,
  inputSchema,
  outputSchema,
  handler,
};
