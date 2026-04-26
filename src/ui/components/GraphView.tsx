/**
 * <GraphView>
 *
 * Custom minimal SVG (~3 KB additionnels) — justified deviation from lit-ui :
 * the catalog ships no force-directed graph component. Phase 2 candidate for
 * upstream `lit-ui/graph` skill.
 *
 * Layout : radial / concentric — each depth level is a ring around the root.
 * No external dependency, no animation by default (respects reduced-motion).
 */
import type { UiNode } from "../lib/types.js";

interface GraphViewProps {
  root: UiNode;
}

interface Placed {
  id: string;
  name: string;
  x: number;
  y: number;
  depth: number;
  parentId?: string;
}

function place(
  node: UiNode,
  depth: number,
  startAngle: number,
  endAngle: number,
  acc: Placed[] = [],
  parentId?: string,
): Placed[] {
  const cx = 200;
  const cy = 200;
  const radius = depth * 60;
  const angle = (startAngle + endAngle) / 2;
  acc.push({
    id: node.id,
    name: node.name,
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
    depth,
    parentId,
  });
  const children = node.children ?? [];
  if (children.length === 0) return acc;
  const slice = (endAngle - startAngle) / children.length;
  children.forEach((c, i) => {
    place(c, depth + 1, startAngle + i * slice, startAngle + (i + 1) * slice, acc, node.id);
  });
  return acc;
}

export function GraphView({ root }: GraphViewProps) {
  const points = place(root, 0, 0, Math.PI * 2);
  const byId = new Map(points.map((p) => [p.id, p]));

  return (
    <svg viewBox="0 0 400 400" role="img" aria-label="Architecture graph" className="w-full max-w-md">
      <g stroke="#94a3b8" strokeWidth="1">
        {points
          .filter((p) => p.parentId)
          .map((p) => {
            const parent = byId.get(p.parentId!);
            if (!parent) return null;
            return <line key={p.id} x1={parent.x} y1={parent.y} x2={p.x} y2={p.y} />;
          })}
      </g>
      <g>
        {points.map((p) => (
          <g key={p.id}>
            <circle cx={p.x} cy={p.y} r={p.depth === 0 ? 8 : 5} fill="#2563eb" />
            <text x={p.x + 8} y={p.y + 4} fontSize="10" fill="#0f172a">
              {p.name}
            </text>
          </g>
        ))}
      </g>
    </svg>
  );
}
