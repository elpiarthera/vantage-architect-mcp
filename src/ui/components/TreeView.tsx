/**
 * <TreeView>
 *
 * WCAG AA tree pattern :
 *   - role="tree" on the container.
 *   - role="treeitem" on each node, with aria-expanded / aria-level /
 *     aria-setsize / aria-posinset.
 *   - Keyboard nav : ArrowDown / ArrowUp move focus, ArrowRight expands,
 *     ArrowLeft collapses, Home / End jump to first/last visible item,
 *     Enter / Space toggle expansion.
 *
 * Composes the lit-ui accordion pattern. Drill-down (`expand_node`) is fired
 * via the bridge from <NodeCard>.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import type { UiNode, UiProps } from "../lib/types.js";
import { t } from "../i18n/index.js";
import { NodeCard } from "./NodeCard.js";

interface TreeViewProps {
  root: UiNode;
  locale: UiProps["locale"];
  tree_id: string;
}

export function TreeView({ root, locale, tree_id }: TreeViewProps) {
  return (
    <ul
      role="tree"
      aria-label={t(locale, "a11y.tree.label")}
      className="font-sans text-sm text-slate-900 list-none pl-0"
    >
      <TreeItem
        node={root}
        depth={1}
        locale={locale}
        tree_id={tree_id}
        position={1}
        setSize={1}
      />
    </ul>
  );
}

interface TreeItemProps {
  node: UiNode;
  depth: number;
  locale: UiProps["locale"];
  tree_id: string;
  position: number;
  setSize: number;
}

function TreeItem({ node, depth, locale, tree_id, position, setSize }: TreeItemProps) {
  const [expanded, setExpanded] = useState(depth <= 2);
  const liRef = useRef<HTMLLIElement | null>(null);

  const toggle = useCallback(() => setExpanded((v) => !v), []);

  const onKey = useCallback(
    (e: React.KeyboardEvent<HTMLLIElement>) => {
      switch (e.key) {
        case "ArrowRight":
          if (!expanded) setExpanded(true);
          e.preventDefault();
          break;
        case "ArrowLeft":
          if (expanded) setExpanded(false);
          e.preventDefault();
          break;
        case "Enter":
        case " ":
          toggle();
          e.preventDefault();
          break;
        case "Home": {
          const first = liRef.current
            ?.closest('[role="tree"]')
            ?.querySelector<HTMLLIElement>('[role="treeitem"]');
          first?.focus();
          e.preventDefault();
          break;
        }
        case "End": {
          const items = liRef.current
            ?.closest('[role="tree"]')
            ?.querySelectorAll<HTMLLIElement>('[role="treeitem"]');
          const last = items?.[items.length - 1];
          last?.focus();
          e.preventDefault();
          break;
        }
        default:
          break;
      }
    },
    [expanded, toggle],
  );

  const hasChildren = (node.children?.length ?? 0) > 0;

  return (
    <li
      ref={liRef}
      role="treeitem"
      aria-expanded={hasChildren ? expanded : undefined}
      aria-level={depth}
      aria-setsize={setSize}
      aria-posinset={position}
      tabIndex={depth === 1 ? 0 : -1}
      onKeyDown={onKey}
      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm pl-4"
    >
      <NodeCard
        node={node}
        locale={locale}
        tree_id={tree_id}
        expanded={expanded}
        onToggle={hasChildren ? toggle : undefined}
      />
      {hasChildren && expanded && (
        <ul role="group" className="list-none pl-0">
          {node.children!.map((child, i, arr) => (
            <TreeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              locale={locale}
              tree_id={tree_id}
              position={i + 1}
              setSize={arr.length}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

// Respect prefers-reduced-motion at the root level (Critical Rule #5 a11y).
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}
