/**
 * Recursive Node schema — drives the four `vantage-architect` tools.
 *
 * Critical Rule #4 server : NEVER use z.any() — always type recursive structures
 * with z.lazy(). Reviewer rejects PRs that violate this.
 */
import { z } from "zod";

export const NODE_TYPES = [
  "component",
  "module",
  "feature",
  "task",
  "decision",
] as const;
export type NodeType = (typeof NODE_TYPES)[number];

export interface ArchitectNode {
  id: string;
  name: string;
  type: NodeType;
  description: string;
  children?: ArchitectNode[];
  metadata: Record<string, string | number | boolean>;
}

export const NodeSchema: z.ZodType<ArchitectNode> = z.lazy(() =>
  z.object({
    id: z.string().min(1),
    name: z.string().min(1),
    type: z
      .enum(NODE_TYPES)
      .describe(
        "Node type: 'component' | 'module' | 'feature' | 'task' | 'decision'",
      ),
    description: z.string(),
    children: z.array(NodeSchema).optional(),
    metadata: z.record(
      z.string(),
      z.union([z.string(), z.number(), z.boolean()]),
    ),
  }),
);

export const TreeIdSchema = z
  .string()
  .regex(/^tree_[a-z0-9]{6,}$/)
  .describe(
    "Tree identifier returned by decompose_spec — pattern /^tree_[a-z0-9]{6,}$/",
  );
export const NodeIdSchema = z
  .string()
  .regex(/^node_[a-z0-9_]{1,}$/)
  .describe(
    "Node identifier within a decomposed tree — pattern /^node_[a-z0-9_]+$/",
  );

export const LocaleSchema = z
  .enum(["en", "fr"])
  .describe("Locale: 'en' | 'fr'");
export type Locale = z.infer<typeof LocaleSchema>;
