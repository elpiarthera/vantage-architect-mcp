/**
 * Decomposition heuristic.
 *
 * v1.0 ships a deterministic, locale-aware heuristic so the server is testable
 * end-to-end without an LLM dependency. Phase 2 will swap this for an LLM call
 * (Anthropic SDK) behind the same interface — the tools and UI never see the
 * difference (Doctrine "abstraction fonctionnelle").
 */
import type { ArchitectNode, Locale, NodeType } from "../schemas/node.js";

const ROOT_TYPES: Record<string, NodeType> = {
  software: "component",
  product: "feature",
  process: "task",
  research: "decision",
};

const CHILD_BUCKETS_EN: Record<string, string[]> = {
  software: ["Frontend", "Backend", "Data", "Ops", "Tests"],
  product: ["Discovery", "Scope", "UX", "Launch", "Metrics"],
  process: ["Inputs", "Steps", "Quality gates", "Outputs", "Owner"],
  research: ["Question", "Hypotheses", "Method", "Sources", "Conclusion"],
};

const CHILD_BUCKETS_FR: Record<string, string[]> = {
  software: ["Frontend", "Backend", "Données", "Ops", "Tests"],
  product: ["Découverte", "Périmètre", "UX", "Lancement", "Indicateurs"],
  process: ["Entrées", "Étapes", "Points de contrôle", "Sorties", "Responsable"],
  research: ["Question", "Hypothèses", "Méthode", "Sources", "Conclusion"],
};

const LEAF_HINTS_EN = ["Specify", "Implement", "Test", "Document"];
const LEAF_HINTS_FR = ["Spécifier", "Implémenter", "Tester", "Documenter"];

let counter = 0;
function nextId(prefix = "node"): string {
  counter += 1;
  return `${prefix}_${counter.toString(36)}_${Date.now().toString(36)}`;
}

export function freshTreeId(): string {
  return `tree_${Math.random().toString(36).slice(2, 10)}`;
}

export interface DecomposeOptions {
  requirement: string;
  domain: keyof typeof CHILD_BUCKETS_EN;
  depth: number;
  locale: Locale;
}

export function decompose(opts: DecomposeOptions): ArchitectNode {
  const buckets =
    opts.locale === "fr"
      ? (CHILD_BUCKETS_FR[opts.domain] ?? CHILD_BUCKETS_FR["software"]!)
      : (CHILD_BUCKETS_EN[opts.domain] ?? CHILD_BUCKETS_EN["software"]!);
  const leafHints = opts.locale === "fr" ? LEAF_HINTS_FR : LEAF_HINTS_EN;

  const root: ArchitectNode = {
    id: nextId("node_root"),
    name: shortName(opts.requirement),
    type: ROOT_TYPES[opts.domain] ?? "component",
    description: opts.requirement,
    metadata: { domain: opts.domain, locale: opts.locale, depth: opts.depth },
    children: buckets.map((label, idx) =>
      buildSubtree({
        label,
        depth: opts.depth - 1,
        leafHints,
        position: idx,
      }),
    ),
  };
  return root;
}

function buildSubtree(args: {
  label: string;
  depth: number;
  leafHints: string[];
  position: number;
}): ArchitectNode {
  const node: ArchitectNode = {
    id: nextId(`node_${slug(args.label)}`),
    name: args.label,
    type: args.depth <= 0 ? "task" : "module",
    description: `${args.label} — auto-decomposition (heuristic v1.0).`,
    metadata: { position: args.position },
  };
  if (args.depth > 0) {
    node.children = args.leafHints.map((hint, idx) => ({
      id: nextId(`node_${slug(args.label)}_${slug(hint)}`),
      name: `${hint} ${args.label}`,
      type: "task" as const,
      description: `${hint} ${args.label}.`,
      metadata: { leaf: true, position: idx },
    }));
  }
  return node;
}

export function expand(node: ArchitectNode, addedDepth: number, locale: Locale): ArchitectNode {
  if (addedDepth <= 0) return node;
  const leafHints = locale === "fr" ? LEAF_HINTS_FR : LEAF_HINTS_EN;
  const expanded: ArchitectNode = {
    ...node,
    children: (node.children && node.children.length > 0
      ? node.children
      : leafHints.map((hint, idx) => ({
          id: nextId(`node_${slug(node.name)}_${slug(hint)}`),
          name: `${hint} ${node.name}`,
          type: "task" as const,
          description: `${hint} ${node.name}.`,
          metadata: { leaf: true, position: idx },
        }))
    ).map((c) => expand(c, addedDepth - 1, locale)),
  };
  return expanded;
}

function shortName(req: string): string {
  const trimmed = req.trim().replace(/\s+/g, " ");
  return trimmed.length > 60 ? `${trimmed.slice(0, 57)}…` : trimmed;
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 24);
}
