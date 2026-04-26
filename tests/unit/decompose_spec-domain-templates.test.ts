/**
 * Unit tests — decompose_spec v1.1.0 domain template matching
 *
 * Validates:
 * - SaaS + Stripe → saas-b2b-dashboard template with billing + multi-tenant modules
 * - Marketplace 2-sided → marketplace template with sellers/buyers/payments nodes
 * - Mobile app consumer → mobile-app-consumer template with iOS/Android/push nodes
 * - Fintech / KYC → fintech-app template
 * - Random topic → fallback heuristic + caveat present
 *
 * Authorship: Gamma (γ) — ElPi Corp / bu-mcp — 2026-04-26
 */
import { describe, expect, it, beforeEach } from "vitest";
import { tool as decomposeSpec } from "../../src/tools/decompose_spec.js";
import { clearStore } from "../../src/lib/store.js";

beforeEach(() => clearStore());

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function allNodeNames(node: { name: string; children?: { name: string; children?: unknown[] }[] }): string[] {
  const names: string[] = [node.name];
  if (node.children) {
    for (const child of node.children) {
      names.push(...allNodeNames(child as Parameters<typeof allNodeNames>[0]));
    }
  }
  return names;
}

// ---------------------------------------------------------------------------
// Test 1 — SaaS + Stripe → saas-b2b-dashboard + billing + multi-tenant
// ---------------------------------------------------------------------------
describe("domain template: saas-b2b-dashboard", () => {
  it("matches saas-b2b-dashboard for SaaS dashboard with Stripe billing and multi-tenant", async () => {
    const res = await decomposeSpec.handler({
      requirement:
        "Build a SaaS B2B dashboard for enterprise teams with Stripe billing, multi-tenant organisation isolation, RBAC permissions, real-time analytics, and an admin panel.",
      domain: "software",
      depth: 3,
      locale: "en",
    });

    expect(res.isError).toBeFalsy();
    const root = res.structuredContent.root as { name: string; metadata: Record<string, unknown>; children?: { name: string; children?: unknown[] }[] };

    // Template should be saas-b2b-dashboard
    expect(root.metadata.domain_template).toBe("saas-b2b-dashboard");
    expect(root.metadata.from_template).toBe(true);

    // Score should be > 0
    expect(root.metadata.template_score).toBeGreaterThan(0);

    // Billing module activated (Stripe keyword)
    const names = allNodeNames(root);
    const hassBilling = names.some((n) =>
      /billing|subscription|stripe/i.test(n),
    );
    expect(hassBilling).toBe(true);

    // Multi-tenant module present in base
    const hasMultiTenant = names.some((n) =>
      /multi.tenant|tenant|organisation|workspace/i.test(n),
    );
    expect(hasMultiTenant).toBe(true);

    // Real-time module activated (real-time keyword)
    const hasRealtime = names.some((n) =>
      /real.time|realtime|websocket/i.test(n),
    );
    expect(hasRealtime).toBe(true);

    // Dual content shape maintained
    expect(res.content).toHaveLength(2);
    expect(res.content[0]).toMatchObject({ type: "text" });
    expect(res.content[1]).toMatchObject({ type: "resource" });
  });

  it("matches saas-b2b-dashboard in FR locale and returns French node names", async () => {
    const res = await decomposeSpec.handler({
      requirement:
        "Créer un dashboard SaaS B2B multi-tenant pour des équipes entreprise avec abonnement Stripe, RBAC, analytics en temps réel et tableau de bord administrateur.",
      domain: "software",
      depth: 2,
      locale: "fr",
    });

    expect(res.isError).toBeFalsy();
    const root = res.structuredContent.root as { name: string; metadata: Record<string, unknown>; children?: { name: string; children?: unknown[] }[] };
    expect(root.metadata.domain_template).toBe("saas-b2b-dashboard");

    const names = allNodeNames(root);
    // Should have French node names
    const hasFrenchNames = names.some((n) =>
      /authentification|facturation|multi-tenant|organisation/i.test(n),
    );
    expect(hasFrenchNames).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Test 2 — Marketplace 2-sided → marketplace template + sellers/buyers/payments
// ---------------------------------------------------------------------------
describe("domain template: marketplace-2-sided", () => {
  it("matches marketplace-2-sided for 2-sided marketplace with sellers, buyers and payments split", async () => {
    const res = await decomposeSpec.handler({
      requirement:
        "Build a 2-sided marketplace platform where sellers can list products and buyers can purchase them, with payment split, commission model, ratings and reviews system.",
      domain: "software",
      depth: 3,
      locale: "en",
    });

    expect(res.isError).toBeFalsy();
    const root = res.structuredContent.root as { name: string; metadata: Record<string, unknown>; children?: { name: string; children?: unknown[] }[] };

    expect(root.metadata.domain_template).toBe("marketplace-2-sided");

    const names = allNodeNames(root);

    // Sellers module
    const hasSellers = names.some((n) => /seller/i.test(n));
    expect(hasSellers).toBe(true);

    // Buyers module
    const hasBuyers = names.some((n) => /buyer/i.test(n));
    expect(hasBuyers).toBe(true);

    // Payment split module
    const hasPayments = names.some((n) =>
      /payment|split|commission|payout/i.test(n),
    );
    expect(hasPayments).toBe(true);

    // Ratings / trust module
    const hasTrust = names.some((n) =>
      /rating|review|trust/i.test(n),
    );
    expect(hasTrust).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Test 3 — Mobile app consumer → mobile-app-consumer + push + IAP
// ---------------------------------------------------------------------------
describe("domain template: mobile-app-consumer", () => {
  it("matches mobile-app-consumer for iOS/Android consumer app with push and IAP", async () => {
    const res = await decomposeSpec.handler({
      requirement:
        "Build a mobile app for iOS and Android consumers with push notifications, in-app purchases IAP, social feed, and offline mode support.",
      domain: "software",
      depth: 3,
      locale: "en",
    });

    expect(res.isError).toBeFalsy();
    const root = res.structuredContent.root as { name: string; metadata: Record<string, unknown>; children?: { name: string; children?: unknown[] }[] };

    expect(root.metadata.domain_template).toBe("mobile-app-consumer");

    const names = allNodeNames(root);

    // Push notification module activated
    const hasPush = names.some((n) => /push|fcm|apns|notification/i.test(n));
    expect(hasPush).toBe(true);

    // IAP module activated
    const hasIap = names.some((n) => /iap|in.app|purchase|storekit/i.test(n));
    expect(hasIap).toBe(true);

    // Social module activated
    const hasSocial = names.some((n) => /social|follow|like|share/i.test(n));
    expect(hasSocial).toBe(true);

    // Activated conditionals metadata
    const activatedStr = root.metadata.activated_conditionals as string;
    expect(activatedStr).toContain("mob-push");
    expect(activatedStr).toContain("mob-iap");
  });
});

// ---------------------------------------------------------------------------
// Test 4 — Fintech with KYC → fintech-app template
// ---------------------------------------------------------------------------
describe("domain template: fintech-app", () => {
  it("matches fintech-app for a KYC-based financial application", async () => {
    const res = await decomposeSpec.handler({
      requirement:
        "Build a fintech application with KYC identity verification, double-entry ledger, AML compliance transaction monitoring, and open banking PSD2 account aggregation.",
      domain: "software",
      depth: 3,
      locale: "en",
    });

    expect(res.isError).toBeFalsy();
    const root = res.structuredContent.root as { name: string; metadata: Record<string, unknown>; children?: { name: string; children?: unknown[] }[] };

    expect(root.metadata.domain_template).toBe("fintech-app");

    const names = allNodeNames(root);
    const hasKyc = names.some((n) => /kyc|identity|verification/i.test(n));
    expect(hasKyc).toBe(true);

    const hasLedger = names.some((n) => /ledger|journal|accounting/i.test(n));
    expect(hasLedger).toBe(true);

    // Open banking conditional
    const hasOpenBanking = names.some((n) => /open.banking|bank.connect|plaid|psd2/i.test(n));
    expect(hasOpenBanking).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Test 5 — Dev CLI → dev-tool-cli template with scaffold conditional
// ---------------------------------------------------------------------------
describe("domain template: dev-tool-cli", () => {
  it("matches dev-tool-cli for a CLI tool with scaffold and plugins", async () => {
    const res = await decomposeSpec.handler({
      requirement:
        "Build a developer CLI tool with commands, config file support, a plugin system, project scaffolding templates, and npm package distribution.",
      domain: "software",
      depth: 3,
      locale: "en",
    });

    expect(res.isError).toBeFalsy();
    const root = res.structuredContent.root as { name: string; metadata: Record<string, unknown>; children?: { name: string; children?: unknown[] }[] };

    expect(root.metadata.domain_template).toBe("dev-tool-cli");

    const names = allNodeNames(root);
    const hasPlugin = names.some((n) => /plugin/i.test(n));
    expect(hasPlugin).toBe(true);

    const hasScaffold = names.some((n) => /scaffold|template/i.test(n));
    expect(hasScaffold).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// Test 6 — Random/generic topic → fallback heuristic + caveat in markdown
// ---------------------------------------------------------------------------
describe("domain template: fallback heuristic", () => {
  it("falls back to v1.0 heuristic for a topic with no domain keywords, adding caveat", async () => {
    const res = await decomposeSpec.handler({
      requirement:
        "Explore and document the migratory patterns of ancient butterfly species across alpine meadows using photographic surveys and written field journals.",
      domain: "software",
      depth: 3,
      locale: "en",
    });

    expect(res.isError).toBeFalsy();
    const root = res.structuredContent.root as { name: string; metadata: Record<string, unknown> };

    // Should NOT have domain_template metadata
    expect(root.metadata.domain_template).toBeUndefined();

    // Markdown should contain the caveat
    const markdownText = (res.content[0] as { text: string }).text;
    expect(markdownText).toContain("No domain template matched");
    expect(markdownText).toContain("saas");

    // Still returns dual content
    expect(res.content).toHaveLength(2);
    expect(res.structuredContent.flat_count).toBeGreaterThan(0);
  });

  it("falls back with FR caveat when locale is fr", async () => {
    const res = await decomposeSpec.handler({
      requirement:
        "Étudier et consigner les migrations des papillons alpins à travers des prairies montagnardes en utilisant des relevés photographiques et des journaux de terrain.",
      domain: "software",
      depth: 2,
      locale: "fr",
    });

    expect(res.isError).toBeFalsy();
    const markdownText = (res.content[0] as { text: string }).text;
    expect(markdownText).toContain("Aucun template de domaine");
  });
});

// ---------------------------------------------------------------------------
// Test 7 — augment param accepted without error
// ---------------------------------------------------------------------------
describe("augment parameter (Phase 2 stub)", () => {
  it("accepts augment: 'none' without error", async () => {
    const res = await decomposeSpec.handler({
      requirement:
        "Build a SaaS analytics dashboard for marketing teams with multi-tenant support and Stripe billing.",
      domain: "software",
      depth: 2,
      locale: "en",
      augment: "none",
    });
    expect(res.isError).toBeFalsy();
  });

  it("accepts augment: 'llm' without error (Phase 2 reserved)", async () => {
    const res = await decomposeSpec.handler({
      requirement:
        "Build a SaaS analytics dashboard for marketing teams with multi-tenant support and Stripe billing.",
      domain: "software",
      depth: 2,
      locale: "en",
      augment: "llm",
    });
    // Should not error — Phase 2 stub treats llm same as none for now
    expect(res.isError).toBeFalsy();
  });
});
