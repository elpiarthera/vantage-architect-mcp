/**
 * In-memory tree store — server is the source of truth for spec trees
 * (mcp-app-standard.md "State management" : the server IS the store).
 *
 * v1.0 in-memory only. Persistence layer (SQLite/Convex) is a Phase 2 candidate.
 */
import type { ArchitectNode } from "../schemas/node.js";

export interface StoredTree {
  tree_id: string;
  root: ArchitectNode;
  fetchedAt: string;
  locale: "en" | "fr";
  domain: string;
}

const trees = new Map<string, StoredTree>();
const nodes = new Map<string, ArchitectNode>();

export function indexTree(tree: StoredTree): void {
  trees.set(tree.tree_id, tree);
  walk(tree.root, (n) => nodes.set(n.id, n));
}

export function getTree(tree_id: string): StoredTree | undefined {
  return trees.get(tree_id);
}

export function getNode(node_id: string): ArchitectNode | undefined {
  return nodes.get(node_id);
}

export function clearStore(): void {
  trees.clear();
  nodes.clear();
}

export function walk(
  node: ArchitectNode,
  visit: (n: ArchitectNode) => void,
): void {
  visit(node);
  for (const child of node.children ?? []) walk(child, visit);
}

export function flatCount(node: ArchitectNode): number {
  let n = 0;
  walk(node, () => {
    n += 1;
  });
  return n;
}
