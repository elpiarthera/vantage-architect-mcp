/**
 * Tool: export_spec
 *
 * Exports a stored tree as Markdown / JSON / Mermaid.
 * Critical Rule #1 — dual content : payload-as-text + ui preview.
 */
import { z } from "zod";
import { LocaleSchema, TreeIdSchema } from "../schemas/node.js";
import { getTree } from "../lib/store.js";
import { renderMarkdownTree, renderMermaid } from "../lib/fallback.js";
import { buildUiResource } from "../lib/ui-resource.js";

export const inputSchema = z.object({
  tree_id: TreeIdSchema,
  format: z.enum(["markdown", "json", "mermaid"]).default("markdown"),
  locale: LocaleSchema.default("en"),
});

export const outputSchema = z.object({
  format: z.string(),
  payload: z.string(),
  fetchedAt: z.string().datetime(),
});

export const description =
  "Export the spec as markdown, JSON, or Mermaid diagram. Use this whenever the user wants to copy, share, or persist the structured output — even if they don't say 'export' explicitly.";

export const description_fr =
  "Exporte la spec en markdown, JSON ou diagramme Mermaid. Utilise-le quand l'utilisateur veut copier, partager ou persister la sortie structurée — même s'il ne dit pas 'exporter' explicitement.";

export async function handler(rawInput: unknown) {
  const input = inputSchema.parse(rawInput);
  const stored = getTree(input.tree_id);
  if (!stored) {
    throw new Error(`tree_id not found: ${input.tree_id}`);
  }

  let payload: string;
  switch (input.format) {
    case "json":
      payload = JSON.stringify(stored.root, null, 2);
      break;
    case "mermaid":
      payload = renderMermaid(stored.root);
      break;
    case "markdown":
    default:
      payload = renderMarkdownTree(stored.root);
      break;
  }

  const ui = buildUiResource({
    view: "tree",
    root: stored.root,
    tree_id: input.tree_id,
    locale: input.locale,
  });

  return {
    content: [
      { type: "text" as const, text: payload },
      { type: "resource" as const, resource: ui },
    ],
    structuredContent: {
      format: input.format,
      payload,
      fetchedAt: new Date().toISOString(),
    },
  };
}

export const tool = {
  name: "export_spec",
  description,
  description_fr,
  inputSchema,
  outputSchema,
  handler,
};
