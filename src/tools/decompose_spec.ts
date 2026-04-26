/**
 * Tool: decompose_spec
 *
 * Decomposes a high-level requirement into a hierarchical structured spec tree.
 * Returns the mandatory dual content shape : fallback markdown + ui:// resource
 * (Critical Rule #1 mcp-app-standard).
 */
import { z } from "zod";
import { LocaleSchema, NodeSchema } from "../schemas/node.js";
import {
  decompose,
  freshTreeId,
} from "../lib/decompose.js";
import { flatCount, indexTree } from "../lib/store.js";
import { renderMarkdownTree } from "../lib/fallback.js";
import { buildUiResource } from "../lib/ui-resource.js";

export const DOMAINS = ["software", "product", "process", "research"] as const;

export const inputSchema = z.object({
  requirement: z
    .string()
    .min(50)
    .describe("High-level requirement / product idea / feature ask"),
  domain: z.enum(DOMAINS).default("software"),
  depth: z.number().int().min(1).max(4).default(3),
  locale: LocaleSchema.default("en"),
});

export const outputSchema = z.object({
  tree_id: z.string(),
  root: NodeSchema,
  flat_count: z.number(),
  fetchedAt: z.string().datetime(),
});

export type DecomposeInput = z.infer<typeof inputSchema>;
export type DecomposeOutput = z.infer<typeof outputSchema>;

export const description =
  "Decompose a high-level requirement into a hierarchical structured spec tree. Use this whenever the user asks for an architecture, plan, breakdown, decomposition, or 'how would you structure X' — even if they don't say 'decompose' explicitly.";

export const description_fr =
  "Décompose une exigence de haut niveau en un arbre de spec structuré hiérarchique. Utilise-le quand l'utilisateur demande une architecture, un plan, une décomposition ou 'comment structurer X' — même s'il ne dit pas 'décomposer' explicitement.";

export async function handler(rawInput: unknown) {
  const input = inputSchema.parse(rawInput);
  const root = decompose(input);
  const tree_id = freshTreeId();
  const fetchedAt = new Date().toISOString();
  const stored = {
    tree_id,
    root,
    fetchedAt,
    locale: input.locale,
    domain: input.domain,
  };
  indexTree(stored);

  const fallbackMarkdown = renderMarkdownTree(root);
  const ui = buildUiResource({
    view: "tree",
    root,
    tree_id,
    locale: input.locale,
  });

  const structured: DecomposeOutput = {
    tree_id,
    root,
    flat_count: flatCount(root),
    fetchedAt,
  };

  return {
    content: [
      { type: "text" as const, text: fallbackMarkdown },
      { type: "resource" as const, resource: ui },
    ],
    structuredContent: structured,
  };
}

export const tool = {
  name: "decompose_spec",
  description,
  description_fr,
  inputSchema,
  outputSchema,
  handler,
};
