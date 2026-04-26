/**
 * <NodeCard>
 *
 * Per-node card composed from a popover-style block (lit-ui card+popover).
 * Click → bridge.callTool('expand_node') for drill-down.
 */
import { useState } from "react";
import { useBridge } from "../lib/bridge.js";
import { t } from "../i18n/index.js";
import type { UiNode } from "../lib/types.js";

interface NodeCardProps {
  node: UiNode;
  locale: "en" | "fr";
  tree_id: string;
  expanded?: boolean;
  onToggle?: () => void;
}

export function NodeCard({ node, locale, tree_id, expanded, onToggle }: NodeCardProps) {
  const bridge = useBridge();
  const [loading, setLoading] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const onExpand = async () => {
    setLoading(true);
    try {
      await bridge.callTool("expand_node", {
        node_id: node.id,
        expansion_depth: 1,
        tree_id,
        locale,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2 py-1">
      {onToggle ? (
        <button
          type="button"
          onClick={onToggle}
          aria-label={
            expanded ? t(locale, "a11y.collapse.button") : t(locale, "a11y.expand.button")
          }
          className="w-5 h-5 inline-flex items-center justify-center rounded bg-slate-100 hover:bg-slate-200 focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <span aria-hidden="true">{expanded ? "▾" : "▸"}</span>
        </button>
      ) : (
        <span className="w-5 h-5 inline-block" aria-hidden="true" />
      )}

      <span
        className="font-medium cursor-pointer hover:underline"
        onClick={() => setPopoverOpen((v) => !v)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            setPopoverOpen((v) => !v);
            e.preventDefault();
          }
        }}
        aria-haspopup="dialog"
        aria-expanded={popoverOpen}
      >
        {node.name}
      </span>
      <span className="text-xs text-slate-500">({node.type})</span>

      <button
        type="button"
        onClick={onExpand}
        disabled={loading}
        className="ml-auto text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 hover:bg-blue-100 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        {loading ? t(locale, "loading.expanding") : t(locale, "node.expand")}
      </button>

      {popoverOpen && (
        <div
          role="dialog"
          aria-label={node.name}
          className="absolute z-10 mt-8 ml-8 max-w-md p-3 rounded border border-slate-200 bg-white shadow-md text-xs"
        >
          <p className="mb-2">{node.description}</p>
          <p className="font-semibold">{t(locale, "node.metadata")}</p>
          <ul className="list-disc pl-4">
            {Object.entries(node.metadata).map(([k, v]) => (
              <li key={k}>
                {k}: {String(v)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
