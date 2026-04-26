/**
 * <LocaleToggle>
 *
 * lit-ui switch — toggles EN / FR at runtime. Notifies parent via callback.
 * Does NOT persist (sandbox compliance — no localStorage/cookie).
 */
import { t } from "../i18n/index.js";

interface LocaleToggleProps {
  locale: "en" | "fr";
  onChange: (next: "en" | "fr") => void;
}

export function LocaleToggle({ locale, onChange }: LocaleToggleProps) {
  const next: "en" | "fr" = locale === "en" ? "fr" : "en";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={locale === "fr"}
      aria-label={t(locale, "locale.toggle")}
      onClick={() => onChange(next)}
      className="text-xs px-2 py-1 rounded border bg-white hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      {locale === "en" ? t(locale, "locale.fr") : t(locale, "locale.en")}
    </button>
  );
}
