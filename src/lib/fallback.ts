/**
 * Fallback markdown renderers (Critical Rule #1 — fallback markdown obligatoire).
 *
 * Every tool returning a UI resource MUST also include a `text` content block
 * with a meaningful markdown rendering. Clients without io.modelcontextprotocol/ui
 * support read this directly.
 */
import type { ArchitectNode } from "../schemas/node.js";

export function renderMarkdownTree(root: ArchitectNode, depth = 0): string {
  const indent = "  ".repeat(depth);
  const head = `${indent}- **${root.name}** _(${root.type})_ — ${root.description}`;
  if (!root.children || root.children.length === 0) return head;
  const children = root.children
    .map((c) => renderMarkdownTree(c, depth + 1))
    .join("\n");
  return `${head}\n${children}`;
}

export function renderMarkdownNode(node: ArchitectNode): string {
  return [
    `### ${node.name} _(${node.type})_`,
    "",
    node.description,
    "",
    ...renderMetadataList(node.metadata),
    ...(node.children && node.children.length > 0
      ? ["", "**Children**:", "", renderMarkdownTree({ ...node, description: "" }, 0)]
      : []),
  ].join("\n");
}

function renderMetadataList(
  metadata: Record<string, string | number | boolean>,
): string[] {
  const entries = Object.entries(metadata);
  if (entries.length === 0) return [];
  return ["**Metadata**:", ...entries.map(([k, v]) => `- ${k}: ${v}`)];
}

export function renderMermaid(root: ArchitectNode): string {
  const lines = ["graph TD"];
  const visit = (node: ArchitectNode) => {
    for (const c of node.children ?? []) {
      lines.push(`  ${node.id}["${escape(node.name)}"] --> ${c.id}["${escape(c.name)}"]`);
      visit(c);
    }
  };
  visit(root);
  if (lines.length === 1) {
    lines.push(`  ${root.id}["${escape(root.name)}"]`);
  }
  return lines.join("\n");
}

function escape(s: string): string {
  return s.replace(/"/g, "\\\"");
}
