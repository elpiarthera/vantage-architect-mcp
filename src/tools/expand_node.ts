/**
 * Tool: expand_node
 *
 * Re-triggers decomposition on a clicked node (drill-down deepening).
 * Called from the UI via `bridge.callTool('expand_node', {...})`.
 *
 * Critical Rule #1 — fallback markdown + ui resource.
 */
import { z } from "zod";
import { LocaleSchema, NodeIdSchema, NodeSchema } from "../schemas/node.js";
import { getNode, indexTree, getTree } from "../lib/store.js";
import { expand } from "../lib/decompose.js";
import { renderMarkdownNode } from "../lib/fallback.js";
import { buildUiResource } from "../lib/ui-resource.js";

export const inputSchema = z.object({
  node_id: NodeIdSchema.describe(
    "Node ID to expand (must match /^node_[a-z0-9_]+$/)",
  ),
  expansion_depth: z
    .number()
    .int()
    .min(1)
    .max(2)
    .default(1)
    .describe("Expansion depth (integer 1..2, default 1)"),
  tree_id: z
    .string()
    .optional()
    .describe("Optional source tree_id for re-indexing context"),
  locale: LocaleSchema.default("en").describe(
    "Locale for output: 'en' (default) | 'fr'",
  ),
});

export const outputSchema = z.object({
  node_id: z.string(),
  expanded: NodeSchema,
  fetchedAt: z.string().datetime(),
});

export const description =
  "Expand a specific node deeper. Triggered by UI clicks via the bridge. Use this whenever a user clicks a node to drill down further.";

export const description_fr =
  "Développe un nœud spécifique en profondeur. Déclenché par les clics UI via le bridge. Utilise-le quand un utilisateur clique sur un nœud pour drill-down.";

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
  const node = getNode(input.node_id);
  if (!node) {
    throw new Error(`node_id not found: ${input.node_id}`);
  }
  const expanded = expand(node, input.expansion_depth, input.locale);

  // Re-index expanded subtree so subsequent expand_node calls resolve.
  if (input.tree_id) {
    const tree = getTree(input.tree_id);
    if (tree) indexTree({ ...tree, root: tree.root });
  }
  // Always index the expanded subtree itself.
  indexTree({
    tree_id: input.tree_id ?? `tree_local_${input.node_id}`,
    root: expanded,
    fetchedAt: new Date().toISOString(),
    locale: input.locale,
    domain: "software",
  });

  const fallbackMarkdown = renderMarkdownNode(expanded);
  const ui = buildUiResource({
    view: "tree",
    root: expanded,
    tree_id: input.tree_id ?? `tree_local_${input.node_id}`,
    locale: input.locale,
  });

  return {
    content: [
      { type: "text" as const, text: fallbackMarkdown },
      { type: "resource" as const, resource: ui },
    ],
    structuredContent: {
      node_id: input.node_id,
      expanded,
      fetchedAt: new Date().toISOString(),
    },
  };
}

export const tool = {
  name: "expand_node",
  description,
  description_fr,
  inputSchema,
  outputSchema,
  handler,
};
