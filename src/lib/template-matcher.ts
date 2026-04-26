/**
 * Template matcher for decompose_spec v1.1.0
 *
 * Scores domain templates against a user requirement string using
 * keyword matching (multi-word phrases score +3, single tokens +1).
 * Returns the best-matching template and the set of activated conditional modules.
 *
 * Authorship: Gamma (γ) — ElPi Corp / bu-mcp — 2026-04-26
 */

import type { ArchitectNode, Locale } from "../schemas/node.js";
import {
  DOMAIN_TEMPLATES,
  type DomainTemplate,
  type ModuleNode,
} from "../data/domain-templates.js";

// ---------------------------------------------------------------------------
// Tokenisation helpers
// ---------------------------------------------------------------------------

/** Normalise a string for keyword matching: lowercase + NFD + remove diacritics */
function normalise(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Returns true if the normalised haystack contains the normalised keyword
 * as a whole-word-prefix match:
 * - The keyword must start at a word boundary (not preceded by [a-z0-9]).
 * - The keyword may be followed by additional alphanumeric chars (e.g., plurals, suffixes).
 *   E.g., keyword "template" matches "templates", "template" but not "filetemplate".
 * - Multi-word phrases are matched as exact contiguous word sequence (no suffix flex).
 */
function containsKeyword(haystack: string, keyword: string): boolean {
  const normKeyword = normalise(keyword);
  // Escape regex special chars in the keyword
  const escaped = normKeyword.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

  const isMultiWord = normKeyword.includes(" ");
  let pattern: string;
  if (isMultiWord) {
    // Exact multi-word phrase with word boundaries on both sides
    pattern = `(?<![a-z0-9])${escaped}(?![a-z0-9])`;
  } else {
    // Single token: must start at word boundary; suffix allowed (covers plurals)
    pattern = `(?<![a-z0-9])${escaped}`;
  }

  const re = new RegExp(pattern, "i");
  return re.test(haystack);
}

// ---------------------------------------------------------------------------
// Scoring
// ---------------------------------------------------------------------------

interface TemplateScore {
  template: DomainTemplate;
  score: number;
}

/**
 * Score a single template against the requirement.
 * - Template-level keywords (en + fr): +3 for multi-word, +1 for single token
 */
function scoreTemplate(requirement: string, template: DomainTemplate): number {
  const normReq = normalise(requirement);
  let score = 0;

  const allKeywords = [...template.keywords.en, ...template.keywords.fr];
  for (const kw of allKeywords) {
    if (!containsKeyword(normReq, kw)) continue;
    const wordCount = kw.trim().split(/\s+/).length;
    score += wordCount > 1 ? 3 : 1;
  }

  return score;
}

/**
 * Score the full list of templates and return sorted by descending score.
 */
function rankTemplates(requirement: string): TemplateScore[] {
  return DOMAIN_TEMPLATES.map((t) => ({
    template: t,
    score: scoreTemplate(requirement, t),
  })).sort((a, b) => b.score - a.score);
}

// ---------------------------------------------------------------------------
// Conditional module activation
// ---------------------------------------------------------------------------

function activateConditionals(
  requirement: string,
  template: DomainTemplate,
): ModuleNode[] {
  const normReq = normalise(requirement);
  const activated: ModuleNode[] = [];

  for (const cond of template.conditional_modules) {
    const matched = cond.trigger_keywords.some((kw) =>
      containsKeyword(normReq, kw),
    );
    if (matched) {
      activated.push(cond.module);
    }
  }

  return activated;
}

// ---------------------------------------------------------------------------
// ModuleNode → ArchitectNode conversion
// ---------------------------------------------------------------------------

let _counter = 0;
function nextId(prefix: string): string {
  _counter += 1;
  return `node_${prefix}_${_counter.toString(36)}_${Date.now().toString(36)}`;
}

function slug(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 24);
}

/**
 * Convert a ModuleNode (template) into an ArchitectNode, using the given locale.
 * The requirement's key noun phrase is appended to node names for specificity.
 */
function moduleToNode(
  mod: ModuleNode,
  locale: Locale,
  requirementSlug: string,
  depth: number,
): ArchitectNode {
  const nameRaw = locale === "fr" ? mod.name.fr : mod.name.en;
  const descRaw = locale === "fr" ? mod.description.fr : mod.description.en;

  const node: ArchitectNode = {
    id: nextId(slug(mod.id)),
    name: nameRaw,
    type: mod.type,
    description: descRaw,
    metadata: {
      template_module_id: mod.id,
      locale,
      from_template: true,
    },
  };

  if (mod.children && mod.children.length > 0 && depth > 0) {
    node.children = mod.children.map((child) =>
      moduleToNode(child, locale, requirementSlug, depth - 1),
    );
  }

  return node;
}

// ---------------------------------------------------------------------------
// Root name from requirement
// ---------------------------------------------------------------------------

function shortName(req: string): string {
  const trimmed = req.trim().replace(/\s+/g, " ");
  return trimmed.length > 60 ? `${trimmed.slice(0, 57)}…` : trimmed;
}

function requirementSlug(req: string): string {
  return slug(req.trim().slice(0, 30));
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface TemplateMatchResult {
  matched: true;
  template: DomainTemplate;
  score: number;
  root: ArchitectNode;
}

export interface FallbackResult {
  matched: false;
  caveat: string;
}

export type MatchResult = TemplateMatchResult | FallbackResult;

const CAVEAT_EN =
  "ℹ️ No domain template matched. Use specific keywords (saas, marketplace, mobile, api, admin, data-pipeline, ml, content, ecommerce, iot, fintech, cli) for a richer domain-specific decomposition.";

const CAVEAT_FR =
  "ℹ️ Aucun template de domaine trouvé. Utilisez des mots-clés spécifiques (saas, marketplace, mobile, api, admin, data-pipeline, ml, contenu, ecommerce, iot, fintech, cli) pour une décomposition plus riche.";

/**
 * Main entry point: given a requirement string, locale, and desired depth,
 * either build a template-driven tree or signal fallback.
 */
export function matchAndBuild(opts: {
  requirement: string;
  locale: Locale;
  depth: number;
}): MatchResult {
  const { requirement, locale, depth } = opts;
  const ranked = rankTemplates(requirement);
  const best = ranked[0];

  if (!best || best.score === 0) {
    return {
      matched: false,
      caveat: locale === "fr" ? CAVEAT_FR : CAVEAT_EN,
    };
  }

  const template = best.template;
  const activated = activateConditionals(requirement, template);
  const reqSlug = requirementSlug(requirement);

  // Build all modules (base + activated conditionals)
  const allModules = [...template.base_modules, ...activated];

  const children = allModules.map((mod) =>
    moduleToNode(mod, locale, reqSlug, depth - 1),
  );

  // Root node
  const templateName = locale === "fr" ? template.name.fr : template.name.en;
  const root: ArchitectNode = {
    id: nextId("root"),
    name: shortName(requirement),
    type: "component",
    description:
      locale === "fr"
        ? `Décomposition via template "${templateName}" — ${template.description.fr}`
        : `Decomposed via template "${templateName}" — ${template.description.en}`,
    metadata: {
      domain_template: template.id,
      template_score: best.score,
      activated_conditionals: activated.map((m) => m.id).join(","),
      locale,
      depth,
      from_template: true,
    },
    children,
  };

  return {
    matched: true,
    template,
    score: best.score,
    root,
  };
}
