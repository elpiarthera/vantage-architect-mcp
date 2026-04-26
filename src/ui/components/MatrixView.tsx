/**
 * <MatrixView>
 *
 * Tabular alternative composed from lit-ui data-table. Flattens the tree to
 * one row per node ; nesting is signaled by the `depth` column + visual indent.
 */
import { t } from "../i18n/index.js";
import type { UiNode } from "../lib/types.js";

interface MatrixViewProps {
  root: UiNode;
  locale: "en" | "fr";
}

interface Row {
  id: string;
  name: string;
  type: string;
  depth: number;
  description: string;
}

function flatten(node: UiNode, depth = 0, acc: Row[] = []): Row[] {
  acc.push({
    id: node.id,
    name: node.name,
    type: node.type,
    depth,
    description: node.description,
  });
  for (const c of node.children ?? []) flatten(c, depth + 1, acc);
  return acc;
}

export function MatrixView({ root, locale }: MatrixViewProps) {
  const rows = flatten(root);
  return (
    <table className="min-w-full text-sm border-collapse" aria-label={t(locale, "view.matrix")}>
      <thead className="bg-slate-50">
        <tr>
          <th scope="col" className="text-left p-2 border-b">{t(locale, "node.type")}</th>
          <th scope="col" className="text-left p-2 border-b">Name</th>
          <th scope="col" className="text-left p-2 border-b">Description</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.id} className="even:bg-slate-50">
            <td className="p-2 border-b text-xs text-slate-600">{r.type}</td>
            <td className="p-2 border-b" style={{ paddingLeft: 8 + r.depth * 16 }}>
              {r.name}
            </td>
            <td className="p-2 border-b text-slate-700">{r.description}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
