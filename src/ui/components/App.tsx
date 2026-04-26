/**
 * <App>
 *
 * Top-level UI shell. Hydrated with `window.__MCP_PROPS__` injected by the
 * MCP Apps host runtime (Critical Rule #4 sandbox).
 */
import { useState } from "react";
import type { UiProps } from "../lib/types.js";
import { TreeView } from "./TreeView.js";
import { MatrixView } from "./MatrixView.js";
import { GraphView } from "./GraphView.js";
import { ExportPanel } from "./ExportPanel.js";
import { LocaleToggle } from "./LocaleToggle.js";
import { t } from "../i18n/index.js";

export function App(initial: UiProps) {
  const [view, setView] = useState<UiProps["view"]>(initial.view);
  const [locale, setLocale] = useState<UiProps["locale"]>(initial.locale);

  return (
    <main className="p-4 max-w-3xl mx-auto font-sans">
      <header className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold">{t(locale, "app.title")}</h1>
          <p className="text-xs text-slate-500">{t(locale, "app.subtitle")}</p>
        </div>
        <LocaleToggle locale={locale} onChange={setLocale} />
      </header>

      <nav role="tablist" aria-label="View" className="flex gap-2 mb-4">
        {(["tree", "graph", "matrix"] as const).map((v) => (
          <button
            key={v}
            role="tab"
            aria-selected={view === v}
            onClick={() => setView(v)}
            className={`text-sm px-3 py-1 rounded border focus-visible:ring-2 focus-visible:ring-blue-500 ${
              view === v ? "bg-blue-600 text-white" : "bg-white text-slate-700"
            }`}
          >
            {t(locale, `view.${v}`)}
          </button>
        ))}
      </nav>

      <section className="mb-4">
        {view === "tree" && (
          <TreeView root={initial.root} locale={locale} tree_id={initial.tree_id} />
        )}
        {view === "matrix" && <MatrixView root={initial.root} locale={locale} />}
        {view === "graph" && <GraphView root={initial.root} />}
      </section>

      <ExportPanel tree_id={initial.tree_id} locale={locale} />
    </main>
  );
}
