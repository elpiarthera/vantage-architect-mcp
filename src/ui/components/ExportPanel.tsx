/**
 * <ExportPanel>
 *
 * lit-ui dialog + select + button. Triggers `export_spec` via the bridge,
 * displays the payload, copies it to clipboard.
 *
 * Sandbox-safe : `navigator.clipboard` is a sandboxed iframe API, OK per
 * MCP Apps spec. No window.parent / localStorage / fetch.
 */
import { useState } from "react";
import { useBridge } from "../lib/bridge.js";
import { t } from "../i18n/index.js";

interface ExportPanelProps {
  tree_id: string;
  locale: "en" | "fr";
}

type Format = "markdown" | "json" | "mermaid";

export function ExportPanel({ tree_id, locale }: ExportPanelProps) {
  const bridge = useBridge();
  const [format, setFormat] = useState<Format>("markdown");
  const [payload, setPayload] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const run = async () => {
    const res = await bridge.callTool<{ payload?: string }>("export_spec", {
      tree_id,
      format,
      locale,
    });
    if (res && typeof res.payload === "string") setPayload(res.payload);
  };

  const copy = async () => {
    if (!payload) return;
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard not available in some sandboxes — silent fallback.
    }
  };

  return (
    <section
      role="dialog"
      aria-label={t(locale, "export.title")}
      className="border border-slate-200 rounded p-3 bg-white"
    >
      <h2 className="font-semibold mb-2">{t(locale, "export.title")}</h2>
      <div className="flex gap-2 items-center">
        <label htmlFor="fmt" className="sr-only">
          {t(locale, "export.title")}
        </label>
        <select
          id="fmt"
          value={format}
          onChange={(e) => setFormat(e.target.value as Format)}
          className="border rounded px-2 py-1 text-sm focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <option value="markdown">{t(locale, "export.format.markdown")}</option>
          <option value="json">{t(locale, "export.format.json")}</option>
          <option value="mermaid">{t(locale, "export.format.mermaid")}</option>
        </select>
        <button
          type="button"
          onClick={run}
          aria-label={t(locale, "export.title")}
          className="text-sm px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          {locale === "fr" ? "Exporter" : "Run"}
        </button>
        <button
          type="button"
          onClick={copy}
          disabled={!payload}
          className="text-sm px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-50 focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          {copied ? t(locale, "export.copied") : t(locale, "export.copy")}
        </button>
      </div>
      {payload && (
        <pre className="mt-2 p-2 bg-slate-50 rounded text-xs overflow-x-auto max-h-64">
          {payload}
        </pre>
      )}
    </section>
  );
}
