/**
 * i18n loader. Mêmes clés EN/FR — vérifié par scripts/i18n-parity.sh (CI gate).
 */
import en from "./en.json";
import fr from "./fr.json";

export type Locale = "en" | "fr";
export const dictionaries: Record<Locale, Record<string, string>> = { en, fr };

export function t(locale: Locale, key: string): string {
  return dictionaries[locale][key] ?? key;
}
