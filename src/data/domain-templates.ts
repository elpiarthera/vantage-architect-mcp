/**
 * Domain templates for decompose_spec v1.1.0
 *
 * 12 handcrafted FR+EN templates covering the most common software product domains.
 * Each template has base_modules (always present) and conditional_modules (activated
 * by keyword matching on the user requirement).
 *
 * Authorship: Gamma (γ) — ElPi Corp / bu-mcp — 2026-04-26
 */

import type { ArchitectNode, NodeType } from "../schemas/node.js";

export interface BilingualString {
  en: string;
  fr: string;
}

export interface ModuleNode {
  id: string;
  name: BilingualString;
  description: BilingualString;
  type: NodeType;
  children?: ModuleNode[];
}

export interface ConditionalModule {
  trigger_keywords: string[];
  module: ModuleNode;
}

export interface DomainTemplate {
  id: string;
  name: BilingualString;
  description: BilingualString;
  keywords: { en: string[]; fr: string[] };
  base_modules: ModuleNode[];
  conditional_modules: ConditionalModule[];
}

// ---------------------------------------------------------------------------
// Helper: build a leaf ModuleNode quickly
// ---------------------------------------------------------------------------
function leaf(
  id: string,
  nameEn: string,
  nameFr: string,
  descEn: string,
  descFr: string,
  type: NodeType = "task",
): ModuleNode {
  return { id, name: { en: nameEn, fr: nameFr }, description: { en: descEn, fr: descFr }, type };
}

// ---------------------------------------------------------------------------
// Helper: build a module with children
// ---------------------------------------------------------------------------
function mod(
  id: string,
  nameEn: string,
  nameFr: string,
  descEn: string,
  descFr: string,
  children: ModuleNode[],
  type: NodeType = "module",
): ModuleNode {
  return { id, name: { en: nameEn, fr: nameFr }, description: { en: descEn, fr: descFr }, type, children };
}

// ===========================================================================
// 1. saas-b2b-dashboard
// ===========================================================================
const saasB2bDashboard: DomainTemplate = {
  id: "saas-b2b-dashboard",
  name: { en: "SaaS B2B Dashboard", fr: "Dashboard SaaS B2B" },
  description: {
    en: "Multi-tenant business dashboard with authentication, analytics, and integrations.",
    fr: "Dashboard multi-tenant avec authentification, analytics et intégrations.",
  },
  keywords: {
    en: ["saas", "dashboard", "b2b", "business", "multi-tenant", "tenant", "rbac", "analytics", "admin", "enterprise", "organization"],
    fr: ["saas", "dashboard", "b2b", "entreprise", "multi-tenant", "organisation", "tableau de bord", "analytique"],
  },
  base_modules: [
    mod("saas-auth", "Authentication & RBAC", "Authentification & RBAC",
      "User authentication, role-based access control, SSO, and session management.",
      "Authentification utilisateurs, contrôle d'accès par rôles, SSO et gestion de sessions.",
      [
        leaf("saas-auth-signup", "Sign-up & Onboarding Flow", "Flux d'inscription et d'onboarding",
          "User registration, email verification, welcome tour.", "Inscription, vérification email, visite guidée."),
        leaf("saas-auth-sso", "SSO / OAuth2 Providers", "Fournisseurs SSO / OAuth2",
          "Google, Microsoft, GitHub or enterprise SAML integration.", "Intégration Google, Microsoft, GitHub ou SAML entreprise."),
        leaf("saas-auth-rbac", "Roles & Permissions Matrix", "Matrice rôles & permissions",
          "Define owner, admin, member, viewer roles and enforce per-resource.", "Définir rôles propriétaire, admin, membre, lecteur et appliquer par ressource."),
        leaf("saas-auth-session", "Session & Token Management", "Gestion sessions & tokens",
          "JWT/refresh token rotation, logout, device sessions.", "Rotation JWT/refresh token, déconnexion, sessions par appareil."),
      ], "component"),
    mod("saas-tenant", "Multi-tenant Architecture", "Architecture multi-tenant",
      "Tenant isolation, data segregation strategy, and workspace provisioning.",
      "Isolation des tenants, stratégie de séparation des données, provisionnement des espaces de travail.",
      [
        leaf("saas-tenant-isolation", "Tenant Data Isolation", "Isolation des données tenant",
          "Row-level security or schema-per-tenant strategy.", "Sécurité par ligne ou stratégie schéma-par-tenant."),
        leaf("saas-tenant-provision", "Workspace Provisioning", "Provisionnement espace de travail",
          "Auto-create tenant resources at signup, default seeding.", "Création auto des ressources tenant à l'inscription, données par défaut."),
        leaf("saas-tenant-limits", "Usage Quotas & Limits", "Quotas & limites d'utilisation",
          "Per-tenant rate limits, storage caps, seat counts.", "Limites par tenant : débit, stockage, nombre de sièges."),
      ], "component"),
    mod("saas-dashboard-ui", "Dashboard UI", "Interface dashboard",
      "Main data visualisation interface with charts, tables, and drill-downs.",
      "Interface principale de visualisation avec graphiques, tableaux et drill-downs.",
      [
        leaf("saas-ui-kpi", "KPI Cards & Metrics", "Cartes KPI & indicateurs",
          "Top-line metrics, trend badges, comparison to previous period.", "Indicateurs clés, badges de tendance, comparaison période précédente."),
        leaf("saas-ui-charts", "Charts & Data Viz", "Graphiques & dataviz",
          "Line, bar, pie, funnel charts via Recharts or Chart.js.", "Graphiques lignes, barres, secteurs, entonnoir via Recharts ou Chart.js."),
        leaf("saas-ui-filters", "Filters & Date Range", "Filtres & plage de dates",
          "Global filter bar, date picker, multi-select segments.", "Barre de filtres globaux, sélecteur de dates, segments multi-sélection."),
        leaf("saas-ui-export", "Data Export (CSV / PDF)", "Export données (CSV / PDF)",
          "User-triggered export of tables and charts.", "Export déclenché par l'utilisateur pour tableaux et graphiques."),
      ], "component"),
    mod("saas-settings", "Settings & Administration", "Paramètres & administration",
      "Account settings, team management, notifications, and audit log.",
      "Paramètres du compte, gestion d'équipe, notifications et journal d'audit.",
      [
        leaf("saas-settings-profile", "User Profile & Preferences", "Profil utilisateur & préférences",
          "Avatar, display name, locale, notification preferences.", "Avatar, nom d'affichage, langue, préférences notifications."),
        leaf("saas-settings-team", "Team Management", "Gestion d'équipe",
          "Invite members, assign roles, remove users.", "Inviter membres, assigner rôles, supprimer utilisateurs."),
        leaf("saas-settings-audit", "Audit Log", "Journal d'audit",
          "Immutable event log of all sensitive actions.", "Journal immuable de toutes les actions sensibles."),
      ], "module"),
    mod("saas-api", "Public API & Webhooks", "API publique & webhooks",
      "REST/GraphQL API for integrations, plus outbound webhooks.",
      "API REST/GraphQL pour intégrations, plus webhooks sortants.",
      [
        leaf("saas-api-rest", "REST / GraphQL Endpoints", "Endpoints REST / GraphQL",
          "Versioned API (v1+), OpenAPI spec, auth via API keys.", "API versionnée (v1+), spec OpenAPI, auth via clés API."),
        leaf("saas-api-webhooks", "Outbound Webhooks", "Webhooks sortants",
          "Event subscriptions, delivery retries, signature verification.", "Abonnements événements, nouvelles tentatives, vérification signature."),
      ], "module"),
  ],
  conditional_modules: [
    {
      trigger_keywords: ["stripe", "billing", "subscription", "abonnement", "facturation", "invoice", "facture", "payment plan", "plan tarifaire"],
      module: mod("saas-billing", "Billing & Subscription Management", "Gestion facturation & abonnements",
        "Stripe integration, subscription plans, invoices, upgrade/downgrade flows.",
        "Intégration Stripe, plans d'abonnement, factures, flux de mise à niveau/rétrogradation.",
        [
          leaf("saas-billing-plans", "Subscription Plans & Tiers", "Plans & niveaux d'abonnement",
            "Free, Pro, Team tiers with feature flags per plan.", "Niveaux Gratuit, Pro, Équipe avec indicateurs de fonctionnalités par plan."),
          leaf("saas-billing-stripe", "Stripe Payment Integration", "Intégration paiement Stripe",
            "Checkout sessions, customer portal, webhook handling.", "Sessions de paiement, portail client, gestion des webhooks."),
          leaf("saas-billing-invoices", "Invoice Generation & History", "Génération & historique de factures",
            "PDF invoices, payment history, tax handling.", "Factures PDF, historique des paiements, gestion de la TVA."),
          leaf("saas-billing-dunning", "Dunning & Failed Payment Recovery", "Relance & récupération paiements échoués",
            "Retry logic, grace period, cancellation email flows.", "Logique de relance, période de grâce, flux d'e-mails d'annulation."),
        ], "feature"),
    },
    {
      trigger_keywords: ["real-time", "websocket", "live", "temps réel", "streaming", "events", "push notification", "notification push"],
      module: mod("saas-realtime", "Real-time Updates", "Mises à jour temps réel",
        "WebSocket or SSE channel for live dashboard refresh and notifications.",
        "Canal WebSocket ou SSE pour actualisation live du dashboard et notifications.",
        [
          leaf("saas-rt-channel", "WebSocket / SSE Channel", "Canal WebSocket / SSE",
            "Authenticated persistent connection per session.", "Connexion persistante authentifiée par session."),
          leaf("saas-rt-events", "Event Bus & Broadcasting", "Bus d'événements & diffusion",
            "Internal pub/sub, fan-out to subscribed sessions.", "Pub/sub interne, diffusion aux sessions abonnées."),
        ], "feature"),
    },
    {
      trigger_keywords: ["i18n", "internationalization", "localisation", "localization", "multilingual", "fr+en", "multilingue", "bilingue"],
      module: mod("saas-i18n", "Internationalisation (i18n)", "Internationalisation (i18n)",
        "Multi-language support with locale detection and translation management.",
        "Support multilingue avec détection de locale et gestion des traductions.",
        [
          leaf("saas-i18n-detection", "Locale Detection & Switching", "Détection & commutation de locale",
            "Browser locale fallback, user preference override, URL prefix.", "Locale navigateur, préférence utilisateur, préfixe URL."),
          leaf("saas-i18n-strings", "Translation Strings Management", "Gestion des chaînes de traduction",
            "JSON/YAML translation files, plurals, interpolation.", "Fichiers de traduction JSON/YAML, pluriels, interpolation."),
        ], "feature"),
    },
    {
      trigger_keywords: ["oauth", "sso", "saml", "ldap", "active directory", "google workspace", "azure ad", "enterprise auth"],
      module: mod("saas-enterprise-sso", "Enterprise SSO & Directory Sync", "SSO entreprise & synchronisation annuaire",
        "SAML 2.0, OIDC, SCIM provisioning for enterprise customers.",
        "SAML 2.0, OIDC, provisionnement SCIM pour les clients entreprise.",
        [
          leaf("saas-sso-saml", "SAML 2.0 / OIDC Configuration", "Configuration SAML 2.0 / OIDC",
            "Per-tenant IdP metadata, assertion parsing.", "Métadonnées IdP par tenant, analyse des assertions."),
          leaf("saas-sso-scim", "SCIM Directory Provisioning", "Provisionnement annuaire SCIM",
            "Auto-create/deactivate users from IdP directory.", "Création/désactivation auto des utilisateurs depuis l'annuaire IdP."),
        ], "feature"),
    },
  ],
};

// ===========================================================================
// 2. mobile-app-consumer
// ===========================================================================
const mobileAppConsumer: DomainTemplate = {
  id: "mobile-app-consumer",
  name: { en: "Mobile App (Consumer)", fr: "Application mobile grand public" },
  description: {
    en: "Cross-platform iOS/Android consumer app with push, social, and IAP.",
    fr: "Application mobile grand public iOS/Android avec push, social et achats intégrés.",
  },
  keywords: {
    en: ["mobile", "ios", "android", "app", "react native", "flutter", "push notification", "consumer", "smartphone"],
    fr: ["mobile", "ios", "android", "application", "react native", "flutter", "notification push", "grand public", "smartphone"],
  },
  base_modules: [
    mod("mob-auth", "Authentication & Profiles", "Authentification & profils",
      "Phone/email sign-up, social login, profile management.",
      "Inscription téléphone/email, connexion sociale, gestion de profil.",
      [
        leaf("mob-auth-signup", "Sign-up & Email/Phone Verification", "Inscription & vérification email/téléphone",
          "OTP or magic link verification flow.", "Flux de vérification OTP ou lien magique."),
        leaf("mob-auth-social", "Social Login (Google, Apple, Facebook)", "Connexion sociale (Google, Apple, Facebook)",
          "OAuth 2.0 integration with major providers.", "Intégration OAuth 2.0 avec les principaux fournisseurs."),
        leaf("mob-auth-profile", "User Profile & Avatar", "Profil utilisateur & avatar",
          "Edit name, bio, photo upload, account deletion.", "Modifier nom, bio, téléchargement photo, suppression de compte."),
      ], "component"),
    mod("mob-home", "Home Feed & Discovery", "Fil principal & découverte",
      "Personalised content feed, search, and category browsing.",
      "Fil de contenu personnalisé, recherche et navigation par catégories.",
      [
        leaf("mob-home-feed", "Personalised Feed Algorithm", "Algorithme fil personnalisé",
          "Collaborative filtering or rule-based ranked content list.", "Filtrage collaboratif ou liste de contenus classés par règles."),
        leaf("mob-home-search", "Full-text Search & Filters", "Recherche plein texte & filtres",
          "Debounced search bar, category and tag filters.", "Barre de recherche débouncée, filtres par catégorie et tags."),
        leaf("mob-home-recommend", "Recommendations & Trending", "Recommandations & tendances",
          "Trending section, you-may-also-like carousel.", "Section tendances, carrousel vous pourriez aimer."),
      ], "component"),
    mod("mob-nav", "Navigation & Onboarding", "Navigation & onboarding",
      "Bottom tab navigation, onboarding carousel, deep link routing.",
      "Navigation par onglets bas, carrousel d'onboarding, routage deep link.",
      [
        leaf("mob-nav-tabs", "Bottom Tab Bar", "Barre d'onglets bas",
          "Tab icons, active state, badge counters.", "Icônes d'onglets, état actif, compteurs de badges."),
        leaf("mob-nav-onboarding", "Onboarding Carousel & Permissions", "Carrousel d'onboarding & permissions",
          "Feature intro slides, request push/location permissions.", "Diapositives d'introduction, demande permissions push/localisation."),
        leaf("mob-nav-deeplink", "Deep Link & Universal Link Routing", "Routage deep link & universal link",
          "Open specific screen from external URL/notification tap.", "Ouverture d'un écran depuis une URL externe ou un tap de notification."),
      ], "component"),
    mod("mob-settings", "Settings & Account", "Paramètres & compte",
      "Notification preferences, privacy controls, help & support.",
      "Préférences notifications, contrôles vie privée, aide & support.",
      [
        leaf("mob-settings-notif", "Notification Preferences", "Préférences de notifications",
          "Granular push/email opt-in per category.", "Opt-in push/email granulaire par catégorie."),
        leaf("mob-settings-privacy", "Privacy & Data Controls", "Contrôles vie privée & données",
          "Download my data, delete account, GDPR compliance.", "Télécharger mes données, supprimer le compte, conformité RGPD."),
      ], "module"),
    mod("mob-perf", "Performance & Offline", "Performances & hors-ligne",
      "Asset caching, offline mode, background sync, launch time optimisation.",
      "Cache des ressources, mode hors-ligne, synchronisation en arrière-plan, optimisation du temps de lancement.",
      [
        leaf("mob-perf-cache", "Asset & API Response Caching", "Cache des ressources & réponses API",
          "Stale-while-revalidate strategy, image cache.", "Stratégie stale-while-revalidate, cache images."),
        leaf("mob-perf-offline", "Offline Read Mode", "Mode lecture hors-ligne",
          "Queue writes when offline, sync on reconnect.", "Mettre en file d'attente les écritures hors-ligne, synchroniser à la reconnexion."),
      ], "module"),
  ],
  conditional_modules: [
    {
      trigger_keywords: ["push", "push notification", "notification push", "firebase", "fcm", "apns", "alert"],
      module: mod("mob-push", "Push Notification System", "Système de notifications push",
        "FCM/APNs integration, topic subscriptions, deep link on tap.",
        "Intégration FCM/APNs, abonnements aux topics, deep link au tap.",
        [
          leaf("mob-push-fcm", "FCM / APNs Token Registration", "Enregistrement token FCM / APNs",
            "Device token collection, refresh handling.", "Collecte du token appareil, gestion des actualisations."),
          leaf("mob-push-targeting", "Segmented Push Campaigns", "Campagnes push segmentées",
            "Push by user segment, topic, or individual ID.", "Push par segment utilisateur, topic ou ID individuel."),
          leaf("mob-push-analytics", "Delivery & Open Rate Analytics", "Analytics livraison & taux d'ouverture",
            "Track sent, delivered, opened per campaign.", "Suivre envoyé, livré, ouvert par campagne."),
        ], "feature"),
    },
    {
      trigger_keywords: ["iap", "in-app purchase", "achat intégré", "subscription mobile", "abonnement mobile", "premium", "freemium", "revenue cat", "revenuecat"],
      module: mod("mob-iap", "In-App Purchases (IAP)", "Achats intégrés (IAP)",
        "StoreKit 2 / Google Play Billing, subscription management, receipt validation.",
        "StoreKit 2 / Google Play Billing, gestion des abonnements, validation des reçus.",
        [
          leaf("mob-iap-products", "Product Catalogue (SKUs)", "Catalogue produits (SKUs)",
            "Define consumables, non-consumables, subscriptions.", "Définir consommables, non-consommables, abonnements."),
          leaf("mob-iap-validation", "Server-side Receipt Validation", "Validation des reçus côté serveur",
            "Verify purchase receipts to prevent fraud.", "Vérifier les reçus d'achat pour prévenir la fraude."),
          leaf("mob-iap-restore", "Restore Purchases Flow", "Flux de restauration des achats",
            "Allow users to restore on new device.", "Permettre aux utilisateurs de restaurer sur un nouvel appareil."),
        ], "feature"),
    },
    {
      trigger_keywords: ["social", "share", "community", "follow", "likes", "comments", "feed social", "partage", "communauté"],
      module: mod("mob-social", "Social & Community Features", "Fonctionnalités sociales & communauté",
        "Follows, likes, comments, sharing, and activity feed.",
        "Abonnements, likes, commentaires, partage et fil d'activité.",
        [
          leaf("mob-social-follow", "Follow / Friend System", "Système d'abonnement / amis",
            "Mutual follows, follow requests, block list.", "Abonnements mutuels, demandes d'abonnement, liste de blocage."),
          leaf("mob-social-reactions", "Likes & Reactions", "Likes & réactions",
            "Optimistic UI update, server sync, reaction counts.", "Mise à jour UI optimiste, synchronisation serveur, compteurs de réactions."),
          leaf("mob-social-share", "Share to External Platforms", "Partage vers plateformes externes",
            "Native share sheet, deep link generation.", "Feuille de partage native, génération de deep link."),
        ], "feature"),
    },
    {
      trigger_keywords: ["map", "location", "géolocalisation", "gps", "geofence", "local", "nearby"],
      module: mod("mob-location", "Location & Maps", "Localisation & cartes",
        "Device GPS, map display, geofencing, and location-based features.",
        "GPS appareil, affichage carte, géofencing et fonctionnalités basées sur la localisation.",
        [
          leaf("mob-location-perms", "Location Permission Request", "Demande de permission de localisation",
            "Foreground/background permission with rationale.", "Permission premier plan/arrière-plan avec justification."),
          leaf("mob-location-map", "Interactive Map View", "Vue carte interactive",
            "Map rendering (Mapbox / Google Maps / Apple Maps).", "Rendu carte (Mapbox / Google Maps / Apple Maps)."),
        ], "feature"),
    },
  ],
};

// ===========================================================================
// 3. marketplace-2-sided
// ===========================================================================
const marketplace2Sided: DomainTemplate = {
  id: "marketplace-2-sided",
  name: { en: "2-Sided Marketplace", fr: "Marketplace 2 faces" },
  description: {
    en: "Buyer/seller platform with listings, payments split, ratings, and trust.",
    fr: "Plateforme acheteur/vendeur avec annonces, partage des paiements, notes et confiance.",
  },
  keywords: {
    en: ["marketplace", "2-sided", "two-sided", "seller", "buyer", "listing", "vendor", "platform", "commission"],
    fr: ["marketplace", "marché", "place de marché", "vendeur", "acheteur", "annonce", "commission", "plateforme"],
  },
  base_modules: [
    mod("mkt-seller", "Seller Onboarding & Storefront", "Onboarding vendeur & vitrine",
      "Seller registration, KYC, product/service listing management.",
      "Inscription vendeur, KYC, gestion des annonces produits/services.",
      [
        leaf("mkt-seller-register", "Seller Registration & KYC", "Inscription vendeur & KYC",
          "Identity verification, bank account linking, tax info.", "Vérification d'identité, liaison compte bancaire, infos fiscales."),
        leaf("mkt-seller-listings", "Listing Creation & Management", "Création & gestion des annonces",
          "Photos, descriptions, pricing, stock, variants.", "Photos, descriptions, prix, stock, variantes."),
        leaf("mkt-seller-dashboard", "Seller Dashboard & Analytics", "Dashboard vendeur & analytics",
          "Revenue, orders, views, conversion rates.", "Revenus, commandes, vues, taux de conversion."),
      ], "component"),
    mod("mkt-buyer", "Buyer Discovery & Cart", "Découverte acheteur & panier",
      "Search, browse, wishlist, and checkout flow for buyers.",
      "Recherche, navigation, favoris et flux de paiement pour les acheteurs.",
      [
        leaf("mkt-buyer-search", "Search & Filter Engine", "Moteur de recherche & filtres",
          "Full-text + faceted search, price range, category, location.", "Recherche plein texte + facettes, plage de prix, catégorie, localisation."),
        leaf("mkt-buyer-wishlist", "Wishlist & Saved Items", "Favoris & articles sauvegardés",
          "Save listings, receive restock alerts.", "Sauvegarder des annonces, recevoir des alertes de réapprovisionnement."),
        leaf("mkt-buyer-cart", "Cart & Checkout Flow", "Panier & flux de paiement",
          "Multi-seller cart, address, shipping method, payment.", "Panier multi-vendeur, adresse, mode de livraison, paiement."),
      ], "component"),
    mod("mkt-payments", "Payment Split & Escrow", "Partage paiement & séquestre",
      "Collect from buyers, hold in escrow, split to sellers minus platform fee.",
      "Collecter auprès des acheteurs, conserver en séquestre, reverser aux vendeurs moins la commission.",
      [
        leaf("mkt-payments-collect", "Payment Collection (Stripe Connect)", "Collecte paiement (Stripe Connect)",
          "Checkout sessions, 3D Secure, multi-currency.", "Sessions de paiement, 3D Secure, multi-devises."),
        leaf("mkt-payments-split", "Commission Split & Payout Logic", "Logique de partage commission & versement",
          "Platform fee deduction, seller payout schedule.", "Déduction de la commission plateforme, calendrier de versement vendeur."),
        leaf("mkt-payments-refund", "Refunds & Dispute Resolution", "Remboursements & résolution des litiges",
          "Partial/full refund flows, chargeback handling.", "Flux de remboursement partiel/total, gestion des rétrofacturations."),
      ], "component"),
    mod("mkt-trust", "Ratings, Reviews & Trust", "Notes, avis & confiance",
      "Buyer/seller reviews, trust badges, fraud detection signals.",
      "Avis acheteurs/vendeurs, badges de confiance, signaux de détection de fraude.",
      [
        leaf("mkt-trust-reviews", "Dual-way Reviews System", "Système d'avis bidirectionnel",
          "Buyer reviews seller and seller reviews buyer post-transaction.", "L'acheteur note le vendeur et le vendeur note l'acheteur après transaction."),
        leaf("mkt-trust-badges", "Trust Badges & Verification", "Badges de confiance & vérification",
          "Verified seller, top-rated, identity verified badges.", "Badges vendeur vérifié, mieux noté, identité vérifiée."),
        leaf("mkt-trust-fraud", "Fraud & Abuse Signals", "Signaux de fraude & abus",
          "Velocity checks, IP fraud scoring, listing moderation queue.", "Vérifications de vélocité, score de fraude IP, file de modération des annonces."),
      ], "component"),
    mod("mkt-comms", "Messaging & Negotiations", "Messagerie & négociations",
      "In-platform messaging between buyers and sellers.",
      "Messagerie intra-plateforme entre acheteurs et vendeurs.",
      [
        leaf("mkt-comms-chat", "Buyer-Seller Chat", "Chat acheteur-vendeur",
          "Threaded conversation per listing, image attachments.", "Conversation par fil par annonce, pièces jointes images."),
        leaf("mkt-comms-offers", "Offer & Counter-offer Flow", "Flux d'offre & contre-offre",
          "Negotiate price within chat thread.", "Négocier le prix dans le fil de discussion."),
      ], "module"),
  ],
  conditional_modules: [
    {
      trigger_keywords: ["service", "booking", "reservation", "appointment", "calendrier", "calendar", "schedule", "slot"],
      module: mod("mkt-booking", "Service Booking & Calendar", "Réservation de services & calendrier",
        "Time-slot booking system for service-based marketplace.",
        "Système de réservation de créneaux pour marketplace de services.",
        [
          leaf("mkt-booking-calendar", "Availability Calendar", "Calendrier de disponibilités",
            "Provider sets available slots, buyer books.", "Le prestataire définit les créneaux, l'acheteur réserve."),
          leaf("mkt-booking-reminders", "Booking Reminders & Cancellation", "Rappels de réservation & annulation",
            "Email/push reminders, cancellation policy enforcement.", "Rappels email/push, application de la politique d'annulation."),
        ], "feature"),
    },
    {
      trigger_keywords: ["shipping", "delivery", "livraison", "logistics", "fulfillment", "tracking", "suivi"],
      module: mod("mkt-shipping", "Shipping & Logistics", "Livraison & logistique",
        "Carrier integration, tracking, and fulfilment flow.",
        "Intégration transporteur, suivi et flux d'exécution des commandes.",
        [
          leaf("mkt-shipping-labels", "Shipping Label Generation", "Génération d'étiquettes d'expédition",
            "Carrier API (La Poste, UPS, DHL) label creation.", "Création d'étiquette via API transporteur (La Poste, UPS, DHL)."),
          leaf("mkt-shipping-tracking", "Order Tracking Page", "Page de suivi de commande",
            "Real-time status updates, estimated delivery.", "Mises à jour de statut en temps réel, livraison estimée."),
        ], "feature"),
    },
    {
      trigger_keywords: ["category", "taxonomy", "catalogu", "attribute", "facet", "filter", "ontology"],
      module: mod("mkt-catalog", "Category & Taxonomy Management", "Gestion des catégories & taxonomie",
        "Hierarchical category tree, attribute schemas per category.",
        "Arbre de catégories hiérarchique, schémas d'attributs par catégorie.",
        [
          leaf("mkt-catalog-tree", "Category Tree Builder", "Constructeur d'arbre de catégories",
            "Admin UI to manage hierarchy, icons, slugs.", "Interface admin pour gérer la hiérarchie, icônes, slugs."),
          leaf("mkt-catalog-attrs", "Custom Attribute Schemas", "Schémas d'attributs personnalisés",
            "Per-category dynamic fields (colour, size, specs).", "Champs dynamiques par catégorie (couleur, taille, spécifications)."),
        ], "feature"),
    },
  ],
};

// ===========================================================================
// 4. api-product
// ===========================================================================
const apiProduct: DomainTemplate = {
  id: "api-product",
  name: { en: "API Product / Developer Platform", fr: "Produit API / Plateforme développeurs" },
  description: {
    en: "Public API with developer portal, rate limiting, keys, and webhook support.",
    fr: "API publique avec portail développeurs, limitation de débit, clés et webhooks.",
  },
  keywords: {
    en: ["api", "rest", "graphql", "developer", "developer portal", "sdk", "rate limit", "api key", "openapi", "webhook"],
    fr: ["api", "rest", "graphql", "développeur", "portail développeurs", "sdk", "limite de débit", "clé api", "openapi", "webhook"],
  },
  base_modules: [
    mod("api-core", "API Core & Routing", "Cœur API & routage",
      "Versioned REST or GraphQL API with request validation and error formats.",
      "API REST ou GraphQL versionnée avec validation des requêtes et formats d'erreurs.",
      [
        leaf("api-core-versions", "API Versioning Strategy", "Stratégie de versionnage API",
          "URL prefix (v1/) or header-based versioning.", "Préfixe URL (v1/) ou versionnage par en-tête."),
        leaf("api-core-validation", "Request / Response Validation", "Validation requêtes / réponses",
          "JSON Schema or Zod validation, typed error envelopes.", "Validation JSON Schema ou Zod, enveloppes d'erreurs typées."),
        leaf("api-core-errors", "Error Format & HTTP Codes", "Format d'erreurs & codes HTTP",
          "Consistent problem+json or RFC 7807 error shape.", "Format d'erreur cohérent problem+json ou RFC 7807."),
      ], "component"),
    mod("api-auth", "Authentication & API Keys", "Authentification & clés API",
      "API key issuance, OAuth 2.0 machine-to-machine, key rotation.",
      "Émission de clés API, OAuth 2.0 machine-to-machine, rotation des clés.",
      [
        leaf("api-auth-keys", "API Key Generation & Management", "Génération & gestion des clés API",
          "Create, rotate, revoke keys via dashboard.", "Créer, alterner, révoquer les clés via le tableau de bord."),
        leaf("api-auth-scopes", "OAuth2 Scopes & Permissions", "Scopes & permissions OAuth2",
          "Fine-grained scope claims on access tokens.", "Claims de scope granulaires sur les tokens d'accès."),
      ], "component"),
    mod("api-rate", "Rate Limiting & Quotas", "Limitation de débit & quotas",
      "Per-key rate limiting with sliding window algorithm, quota by tier.",
      "Limitation de débit par clé avec algorithme de fenêtre glissante, quota par niveau.",
      [
        leaf("api-rate-limit", "Request Rate Limiting (per key/IP)", "Limitation de débit (par clé/IP)",
          "Token bucket or sliding window counter in Redis.", "Compteur token bucket ou fenêtre glissante dans Redis."),
        leaf("api-rate-headers", "Rate Limit Headers (X-RateLimit-*)", "En-têtes de limite de débit (X-RateLimit-*)",
          "Expose remaining, reset, limit in response headers.", "Exposer remaining, reset, limit dans les en-têtes de réponse."),
      ], "component"),
    mod("api-portal", "Developer Portal", "Portail développeurs",
      "Documentation site, interactive playground, changelog, and API explorer.",
      "Site de documentation, terrain de jeu interactif, changelog et explorateur API.",
      [
        leaf("api-portal-docs", "OpenAPI / AsyncAPI Documentation", "Documentation OpenAPI / AsyncAPI",
          "Auto-generated from spec, versioned, searchable.", "Générée automatiquement depuis la spec, versionnée, consultable."),
        leaf("api-portal-playground", "Interactive API Playground", "Terrain de jeu API interactif",
          "Try requests in-browser with live auth.", "Essayer des requêtes dans le navigateur avec authentification live."),
        leaf("api-portal-changelog", "API Changelog & Migration Guides", "Changelog API & guides de migration",
          "Versioned changelog, deprecation notices.", "Changelog versionné, avis de dépréciation."),
      ], "component"),
    mod("api-webhooks", "Outbound Webhooks", "Webhooks sortants",
      "Event subscription, delivery with retries, signature verification.",
      "Abonnement aux événements, livraison avec nouvelles tentatives, vérification de signature.",
      [
        leaf("api-webhooks-sub", "Event Subscription Management", "Gestion des abonnements aux événements",
          "Register endpoint URL, choose event types.", "Enregistrer l'URL de destination, choisir les types d'événements."),
        leaf("api-webhooks-delivery", "Delivery Retries & Dead Letter", "Nouvelles tentatives & file d'attente morte",
          "Exponential backoff, dead letter queue after N failures.", "Backoff exponentiel, file morte après N échecs."),
        leaf("api-webhooks-sig", "HMAC Signature Verification", "Vérification de signature HMAC",
          "Shared secret signing, timestamp anti-replay.", "Signature avec secret partagé, anti-replay par timestamp."),
      ], "module"),
  ],
  conditional_modules: [
    {
      trigger_keywords: ["sdk", "client library", "bibliothèque client", "python", "node", "go", "ruby", "typescript"],
      module: mod("api-sdks", "Client SDK Generation", "Génération de SDKs clients",
        "Auto-generated or handcrafted SDKs for major languages.",
        "SDKs générés automatiquement ou artisanaux pour les langages principaux.",
        [
          leaf("api-sdks-gen", "OpenAPI Code Generation Pipeline", "Pipeline de génération de code OpenAPI",
            "openapi-generator or speakeasy for typed SDKs.", "openapi-generator ou speakeasy pour des SDKs typés."),
          leaf("api-sdks-publish", "SDK Publishing (npm, PyPI, RubyGems)", "Publication SDK (npm, PyPI, RubyGems)",
            "Automated publish on spec change via CI.", "Publication automatisée lors d'un changement de spec via CI."),
        ], "feature"),
    },
    {
      trigger_keywords: ["graphql", "subscription", "schema", "resolver", "query", "mutation"],
      module: mod("api-graphql", "GraphQL Schema & Subscriptions", "Schéma GraphQL & abonnements",
        "GraphQL SDL schema, resolvers, real-time subscriptions.",
        "Schéma SDL GraphQL, résolveurs, abonnements temps réel.",
        [
          leaf("api-gql-schema", "Schema Definition Language (SDL)", "Langage de définition de schéma (SDL)",
            "Type definitions, queries, mutations, subscriptions.", "Définitions de types, queries, mutations, abonnements."),
          leaf("api-gql-subs", "WebSocket Subscriptions", "Abonnements WebSocket",
            "graphql-ws protocol, authentication via connection params.", "Protocole graphql-ws, authentification via paramètres de connexion."),
        ], "feature"),
    },
  ],
};

// ===========================================================================
// 5. internal-admin-tool
// ===========================================================================
const internalAdminTool: DomainTemplate = {
  id: "internal-admin-tool",
  name: { en: "Internal Admin Tool", fr: "Outil d'administration interne" },
  description: {
    en: "Back-office CRUD interface for operations teams with permissions and reporting.",
    fr: "Interface CRUD back-office pour équipes opérations avec permissions et reporting.",
  },
  keywords: {
    en: ["admin", "back-office", "backoffice", "internal tool", "ops", "crud", "operations", "management tool"],
    fr: ["admin", "back-office", "backoffice", "outil interne", "ops", "crud", "opérations", "outil de gestion"],
  },
  base_modules: [
    mod("adm-auth", "Authentication & Access Control", "Authentification & contrôle d'accès",
      "Internal SSO, role-based access, audit trail.",
      "SSO interne, accès basé sur les rôles, piste d'audit.",
      [
        leaf("adm-auth-sso", "Internal SSO / LDAP Login", "Connexion SSO interne / LDAP",
          "Connect to company identity provider.", "Connexion au fournisseur d'identité de l'entreprise."),
        leaf("adm-auth-roles", "Role Definitions & Enforcement", "Définition & application des rôles",
          "Viewer, operator, manager, super-admin roles.", "Rôles lecteur, opérateur, gestionnaire, super-admin."),
      ], "component"),
    mod("adm-crud", "Entity CRUD Interfaces", "Interfaces CRUD d'entités",
      "List, create, edit, delete views for core business entities.",
      "Vues liste, création, édition, suppression pour les entités métier principales.",
      [
        leaf("adm-crud-list", "Searchable & Sortable List Views", "Vues liste consultables & triables",
          "Paginated tables with column sort, global search.", "Tableaux paginés avec tri de colonnes, recherche globale."),
        leaf("adm-crud-forms", "Create / Edit Forms with Validation", "Formulaires création / édition avec validation",
          "Server + client validation, field-level error messages.", "Validation serveur + client, messages d'erreur par champ."),
        leaf("adm-crud-bulk", "Bulk Actions & Imports", "Actions en masse & imports",
          "Multi-select actions, CSV import with preview.", "Actions multi-sélection, import CSV avec prévisualisation."),
      ], "component"),
    mod("adm-reporting", "Reports & Data Exports", "Rapports & exports de données",
      "Scheduled reports, CSV/Excel export, and basic charts for ops KPIs.",
      "Rapports planifiés, export CSV/Excel et graphiques de base pour KPIs opérationnels.",
      [
        leaf("adm-report-scheduled", "Scheduled Report Emails", "E-mails de rapports planifiés",
          "Daily/weekly automated report delivery to team.", "Livraison automatique quotidienne/hebdomadaire de rapports à l'équipe."),
        leaf("adm-report-export", "CSV / Excel Export", "Export CSV / Excel",
          "Filtered data export, large file streaming.", "Export de données filtrées, streaming de fichiers volumineux."),
      ], "module"),
    mod("adm-integrations", "External Integrations", "Intégrations externes",
      "Connections to CRM, ERP, Slack, or ticketing systems.",
      "Connexions au CRM, ERP, Slack ou systèmes de tickets.",
      [
        leaf("adm-int-crm", "CRM Sync (Salesforce / HubSpot)", "Synchronisation CRM (Salesforce / HubSpot)",
          "Two-way contact and deal sync.", "Synchronisation bidirectionnelle des contacts et opportunités."),
        leaf("adm-int-slack", "Slack Notifications", "Notifications Slack",
          "Alert ops channel on critical events.", "Alerter le canal ops sur les événements critiques."),
      ], "module"),
  ],
  conditional_modules: [
    {
      trigger_keywords: ["approval", "workflow", "review", "validation", "approbation", "flux de travail", "modération"],
      module: mod("adm-workflow", "Approval Workflows", "Flux d'approbation",
        "Multi-step approval chains with notifications and delegation.",
        "Chaînes d'approbation multi-étapes avec notifications et délégation.",
        [
          leaf("adm-wf-steps", "Workflow Step Definition", "Définition des étapes du flux",
            "Configure approvers per step, parallel or sequential.", "Configurer les approbateurs par étape, parallèle ou séquentiel."),
          leaf("adm-wf-notify", "Approver Notifications", "Notifications aux approbateurs",
            "Email + Slack alert when action needed.", "Alerte email + Slack quand une action est requise."),
        ], "feature"),
    },
    {
      trigger_keywords: ["audit", "log", "history", "trail", "journal", "historique", "compliance"],
      module: mod("adm-audit", "Audit Log & Compliance", "Journal d'audit & conformité",
        "Immutable record of all user actions with timestamp and diff.",
        "Enregistrement immuable de toutes les actions utilisateurs avec horodatage et différence.",
        [
          leaf("adm-audit-events", "Event Capture & Storage", "Capture & stockage des événements",
            "Log who, what, when, before/after state.", "Enregistrer qui, quoi, quand, état avant/après."),
          leaf("adm-audit-search", "Audit Log Search UI", "Interface de recherche du journal d'audit",
            "Filter by user, date, entity, action type.", "Filtrer par utilisateur, date, entité, type d'action."),
        ], "feature"),
    },
  ],
};

// ===========================================================================
// 6. data-pipeline
// ===========================================================================
const dataPipeline: DomainTemplate = {
  id: "data-pipeline",
  name: { en: "Data Pipeline", fr: "Pipeline de données" },
  description: {
    en: "ETL / ELT pipeline: ingestion, transformation, storage, and serving layer.",
    fr: "Pipeline ETL / ELT : ingestion, transformation, stockage et couche de service.",
  },
  keywords: {
    en: ["data pipeline", "etl", "elt", "ingestion", "transform", "warehouse", "dbt", "airflow", "spark", "kafka", "flink", "batch", "streaming"],
    fr: ["pipeline de données", "etl", "elt", "ingestion", "transformation", "entrepôt de données", "dbt", "airflow", "spark", "kafka", "batch", "streaming"],
  },
  base_modules: [
    mod("dp-ingest", "Data Ingestion Layer", "Couche d'ingestion des données",
      "Connectors for source systems: databases, APIs, files, event streams.",
      "Connecteurs pour les systèmes sources : bases de données, APIs, fichiers, flux d'événements.",
      [
        leaf("dp-ingest-connectors", "Source Connectors", "Connecteurs sources",
          "JDBC, REST, S3, Kafka, webhook connectors.", "Connecteurs JDBC, REST, S3, Kafka, webhook."),
        leaf("dp-ingest-schema", "Schema Registry & Evolution", "Registre & évolution de schéma",
          "Avro/Protobuf schema versioning, backward compatibility.", "Versionnage de schéma Avro/Protobuf, compatibilité ascendante."),
        leaf("dp-ingest-backfill", "Historical Backfill Strategy", "Stratégie de rétro-remplissage historique",
          "Controlled historical load with watermarks.", "Chargement historique contrôlé avec des filigranes."),
      ], "component"),
    mod("dp-transform", "Transformation & Business Logic", "Transformation & logique métier",
      "SQL/dbt models, deduplication, enrichment, and aggregations.",
      "Modèles SQL/dbt, déduplication, enrichissement et agrégations.",
      [
        leaf("dp-transform-models", "dbt / SQL Transform Models", "Modèles de transformation dbt / SQL",
          "Staging, intermediate, marts model layers.", "Couches de modèles staging, intermédiaire, marts."),
        leaf("dp-transform-dedup", "Deduplication & Idempotency", "Déduplication & idempotence",
          "Upsert strategy, CRC-based duplicate detection.", "Stratégie d'upsert, détection de doublons basée sur CRC."),
        leaf("dp-transform-enrich", "Data Enrichment & Lookups", "Enrichissement des données & lookups",
          "Join with reference tables, geolocation, company data.", "Jointure avec tables de référence, géolocalisation, données entreprise."),
      ], "component"),
    mod("dp-storage", "Storage Layer", "Couche de stockage",
      "Data warehouse, data lake, and operational data store design.",
      "Conception entrepôt de données, lac de données et magasin de données opérationnel.",
      [
        leaf("dp-storage-warehouse", "Data Warehouse (BigQuery / Snowflake)", "Entrepôt de données (BigQuery / Snowflake)",
          "Partitioning, clustering, cost optimisation.", "Partitionnement, clustering, optimisation des coûts."),
        leaf("dp-storage-lake", "Data Lake (S3 / GCS) & Delta/Iceberg", "Lac de données (S3 / GCS) & Delta/Iceberg",
          "Parquet storage with ACID table format.", "Stockage Parquet avec format de table ACID."),
      ], "component"),
    mod("dp-serve", "Serving Layer & APIs", "Couche de service & APIs",
      "Query APIs, caches, and BI tool connections for downstream consumers.",
      "APIs de requête, caches et connexions outils BI pour les consommateurs en aval.",
      [
        leaf("dp-serve-api", "Metrics / Query API", "API métriques / requêtes",
          "REST or GraphQL endpoint over warehouse views.", "Endpoint REST ou GraphQL sur les vues de l'entrepôt."),
        leaf("dp-serve-bi", "BI Tool Connection (Metabase / Looker)", "Connexion outil BI (Metabase / Looker)",
          "JDBC/ODBC access, semantic layer.", "Accès JDBC/ODBC, couche sémantique."),
      ], "component"),
    mod("dp-observability", "Pipeline Observability", "Observabilité du pipeline",
      "Data quality checks, SLA monitoring, and alerting.",
      "Contrôles de qualité des données, surveillance des SLA et alertes.",
      [
        leaf("dp-obs-quality", "Data Quality Rules (Great Expectations / dbt tests)", "Règles de qualité données",
          "Null rate, uniqueness, referential integrity checks.", "Contrôles de taux de nullité, unicité, intégrité référentielle."),
        leaf("dp-obs-alerts", "SLA Breach Alerts", "Alertes de dépassement de SLA",
          "Freshness checks, failure rate PagerDuty integration.", "Contrôles de fraîcheur, intégration PagerDuty pour taux d'échec."),
      ], "module"),
  ],
  conditional_modules: [
    {
      trigger_keywords: ["real-time", "streaming", "kafka", "flink", "kinesis", "pubsub", "temps réel", "flux"],
      module: mod("dp-streaming", "Real-time Streaming Layer", "Couche de streaming temps réel",
        "Event streaming with Kafka/Flink for sub-second latency.",
        "Streaming d'événements avec Kafka/Flink pour une latence inférieure à la seconde.",
        [
          leaf("dp-stream-kafka", "Kafka Topics & Consumer Groups", "Topics Kafka & groupes de consommateurs",
            "Topic design, partition strategy, consumer group lag.", "Conception des topics, stratégie de partitionnement, lag des groupes de consommateurs."),
          leaf("dp-stream-flink", "Flink / Spark Streaming Jobs", "Jobs Flink / Spark Streaming",
            "Windowed aggregations, state management, checkpointing.", "Agrégations par fenêtre, gestion d'état, points de contrôle."),
        ], "feature"),
    },
    {
      trigger_keywords: ["ml", "machine learning", "feature store", "features", "training", "model", "prediction"],
      module: mod("dp-feature-store", "Feature Store for ML", "Feature store pour ML",
        "Online/offline feature store feeding ML model training and inference.",
        "Feature store en ligne/hors ligne alimentant l'entraînement et l'inférence des modèles ML.",
        [
          leaf("dp-fs-offline", "Offline Feature Materialisation", "Matérialisation des features hors ligne",
            "Batch compute features stored in Parquet/warehouse.", "Calcul batch de features stockés en Parquet/entrepôt."),
          leaf("dp-fs-online", "Online Feature Serving (Redis)", "Service de features en ligne (Redis)",
            "Low-latency key-value feature lookup for inference.", "Lecture de features clé-valeur à faible latence pour l'inférence."),
        ], "feature"),
    },
  ],
};

// ===========================================================================
// 7. ml-product
// ===========================================================================
const mlProduct: DomainTemplate = {
  id: "ml-product",
  name: { en: "ML Product / AI Platform", fr: "Produit ML / Plateforme IA" },
  description: {
    en: "End-to-end ML product with training, serving, feedback loop, and monitoring.",
    fr: "Produit ML bout en bout avec entraînement, service, boucle de feedback et monitoring.",
  },
  keywords: {
    en: ["ml", "machine learning", "ai", "model", "training", "inference", "llm", "embedding", "fine-tuning", "prediction", "neural", "deep learning"],
    fr: ["ml", "machine learning", "ia", "modèle", "entraînement", "inférence", "llm", "embedding", "fine-tuning", "prédiction", "réseau de neurones"],
  },
  base_modules: [
    mod("ml-data", "Data Preparation & Labelling", "Préparation des données & annotation",
      "Dataset curation, annotation pipeline, train/val/test splits.",
      "Curation du jeu de données, pipeline d'annotation, découpage entraînement/validation/test.",
      [
        leaf("ml-data-collect", "Data Collection & Sourcing", "Collecte & sourcing des données",
          "Web scraping, public datasets, synthetic data generation.", "Web scraping, jeux de données publics, génération de données synthétiques."),
        leaf("ml-data-label", "Annotation Tool & Labelling Workflow", "Outil d'annotation & flux d'étiquetage",
          "Label Studio or custom UI, inter-annotator agreement.", "Label Studio ou UI personnalisée, accord inter-annotateurs."),
        leaf("ml-data-split", "Train / Val / Test Splits", "Découpage entraînement / validation / test",
          "Stratified split, data versioning with DVC.", "Découpage stratifié, versionnage des données avec DVC."),
      ], "component"),
    mod("ml-train", "Model Training Infrastructure", "Infrastructure d'entraînement des modèles",
      "Training job orchestration, hyperparameter tuning, experiment tracking.",
      "Orchestration des jobs d'entraînement, réglage des hyperparamètres, suivi des expériences.",
      [
        leaf("ml-train-jobs", "Distributed Training Jobs", "Jobs d'entraînement distribués",
          "GPU cluster scheduling, multi-node training.", "Planification de cluster GPU, entraînement multi-nœuds."),
        leaf("ml-train-experiments", "Experiment Tracking (MLflow / W&B)", "Suivi des expériences (MLflow / W&B)",
          "Log metrics, params, artefacts per run.", "Journaliser métriques, paramètres, artefacts par exécution."),
        leaf("ml-train-hpo", "Hyperparameter Optimisation", "Optimisation des hyperparamètres",
          "Optuna or Ray Tune grid/random/Bayesian search.", "Recherche par grille/aléatoire/bayésienne avec Optuna ou Ray Tune."),
      ], "component"),
    mod("ml-serve", "Model Serving & Inference", "Service & inférence des modèles",
      "REST inference API, model versioning, A/B shadow serving.",
      "API d'inférence REST, versionnage des modèles, service en ombre A/B.",
      [
        leaf("ml-serve-api", "Inference REST API", "API REST d'inférence",
          "FastAPI / BentoML endpoint, batching support.", "Endpoint FastAPI / BentoML, support du batching."),
        leaf("ml-serve-versions", "Model Version Registry", "Registre des versions de modèles",
          "Champion/challenger tracking, rollback capability.", "Suivi champion/challenger, capacité de rollback."),
        leaf("ml-serve-ab", "A/B & Shadow Serving", "Service A/B & en ombre",
          "Traffic split, shadow evaluation without production impact.", "Partage du trafic, évaluation en ombre sans impact production."),
      ], "component"),
    mod("ml-monitor", "Model Monitoring & Drift", "Monitoring des modèles & dérive",
      "Data drift, concept drift detection, retraining triggers.",
      "Détection de dérive des données et des concepts, déclencheurs de ré-entraînement.",
      [
        leaf("ml-monitor-drift", "Data & Concept Drift Detection", "Détection dérive données & concepts",
          "PSI, KS test, or embedding distance monitoring.", "Surveillance PSI, test KS ou distance d'embedding."),
        leaf("ml-monitor-retrain", "Automated Retraining Triggers", "Déclencheurs de ré-entraînement automatisé",
          "Trigger on performance degradation or data volume.", "Déclenchement sur dégradation des performances ou volume de données."),
      ], "module"),
    mod("ml-feedback", "Human Feedback Loop", "Boucle de feedback humain",
      "Collect user feedback, RLHF signal, annotation correction pipeline.",
      "Collecte du feedback utilisateur, signal RLHF, pipeline de correction des annotations.",
      [
        leaf("ml-feedback-collect", "Feedback Collection UI", "Interface de collecte du feedback",
          "Thumbs up/down, correction editor, flagging.", "Pouce haut/bas, éditeur de correction, signalement."),
        leaf("ml-feedback-loop", "Feedback → Training Loop", "Boucle feedback → entraînement",
          "Batch feedback into next training run.", "Intégrer le feedback batch dans le prochain run d'entraînement."),
      ], "module"),
  ],
  conditional_modules: [
    {
      trigger_keywords: ["llm", "gpt", "claude", "gemini", "fine-tuning", "fine tuning", "instruction tuning", "rlhf", "sft"],
      module: mod("ml-llm", "LLM Fine-tuning & Alignment", "Fine-tuning & alignement LLM",
        "SFT, RLHF, and DPO pipelines for language model adaptation.",
        "Pipelines SFT, RLHF et DPO pour l'adaptation des modèles de langage.",
        [
          leaf("ml-llm-sft", "Supervised Fine-tuning (SFT)", "Ajustement supervisé (SFT)",
            "Dataset preparation, LoRA/QLoRA adapter training.", "Préparation du jeu de données, entraînement d'adaptateurs LoRA/QLoRA."),
          leaf("ml-llm-rlhf", "RLHF / DPO Reward Modelling", "Modélisation de récompense RLHF / DPO",
            "Preference pairs, reward model training.", "Paires de préférences, entraînement du modèle de récompense."),
        ], "feature"),
    },
    {
      trigger_keywords: ["embedding", "rag", "vector", "similarity", "retrieval", "semantic search", "recherche sémantique"],
      module: mod("ml-rag", "RAG & Vector Search", "RAG & recherche vectorielle",
        "Document embedding, vector index, and retrieval-augmented generation.",
        "Embedding de documents, index vectoriel et génération augmentée par récupération.",
        [
          leaf("ml-rag-embed", "Embedding Pipeline", "Pipeline d'embedding",
            "Chunk, embed, upsert to Pinecone / Qdrant / pgvector.", "Découper, encoder, insérer dans Pinecone / Qdrant / pgvector."),
          leaf("ml-rag-retrieval", "Retrieval & Re-ranking", "Récupération & re-classement",
            "Top-K retrieval, cross-encoder re-ranking.", "Récupération Top-K, re-classement par cross-encoder."),
        ], "feature"),
    },
  ],
};

// ===========================================================================
// 8. content-platform
// ===========================================================================
const contentPlatform: DomainTemplate = {
  id: "content-platform",
  name: { en: "Content Platform / CMS", fr: "Plateforme de contenu / CMS" },
  description: {
    en: "Content creation, publishing, distribution, and moderation platform.",
    fr: "Plateforme de création, publication, distribution et modération de contenu.",
  },
  keywords: {
    en: ["content", "cms", "blog", "article", "publish", "editorial", "media", "newsletter", "publication", "writer"],
    fr: ["contenu", "cms", "blog", "article", "publication", "éditorial", "media", "newsletter", "rédaction"],
  },
  base_modules: [
    mod("cms-editor", "Content Editor", "Éditeur de contenu",
      "Rich-text editor with blocks, embeds, and collaborative editing.",
      "Éditeur de texte enrichi avec blocs, intégrations et édition collaborative.",
      [
        leaf("cms-editor-rich", "Rich-text Block Editor (Tiptap / Slate)", "Éditeur de blocs (Tiptap / Slate)",
          "Headings, lists, quotes, code, image blocks.", "Titres, listes, citations, code, blocs image."),
        leaf("cms-editor-media", "Media Library & Uploads", "Bibliothèque de médias & téléchargements",
          "Image upload, CDN delivery, alt text management.", "Téléchargement d'images, livraison CDN, gestion du texte alternatif."),
        leaf("cms-editor-draft", "Drafts, Autosave & Version History", "Brouillons, sauvegarde automatique & historique",
          "Auto-save every 30s, named version snapshots.", "Sauvegarde automatique toutes les 30s, instantanés de versions nommés."),
      ], "component"),
    mod("cms-publish", "Publishing Workflow", "Flux de publication",
      "Draft → review → published → archived state machine.",
      "Machine à états brouillon → révision → publié → archivé.",
      [
        leaf("cms-publish-schedule", "Scheduled Publishing", "Publication planifiée",
          "Set future publish datetime, timezone aware.", "Définir une date/heure de publication future, avec prise en charge des fuseaux horaires."),
        leaf("cms-publish-approval", "Editorial Approval Flow", "Flux d'approbation éditorial",
          "Assign reviewer, comment, approve/reject.", "Assigner un relecteur, commenter, approuver/rejeter."),
      ], "component"),
    mod("cms-distribute", "Distribution Channels", "Canaux de distribution",
      "Multi-channel publish: web, RSS, email newsletter, social.",
      "Publication multi-canal : web, RSS, newsletter email, social.",
      [
        leaf("cms-dist-web", "Web Publication (SSG / SSR)", "Publication web (SSG / SSR)",
          "Next.js ISR or static export on publish.", "ISR Next.js ou export statique à la publication."),
        leaf("cms-dist-rss", "RSS / Atom Feed", "Flux RSS / Atom",
          "Auto-generated feed per category/tag.", "Flux généré automatiquement par catégorie/tag."),
        leaf("cms-dist-email", "Newsletter Distribution", "Distribution newsletter",
          "Send to subscriber list via email provider.", "Envoi à la liste d'abonnés via fournisseur email."),
      ], "component"),
    mod("cms-seo", "SEO & Metadata", "SEO & métadonnées",
      "Meta tags, Open Graph, sitemap, canonical URLs.",
      "Balises meta, Open Graph, sitemap, URLs canoniques.",
      [
        leaf("cms-seo-meta", "Meta Title, Description & OG Tags", "Titre meta, description & balises OG",
          "Per-content SEO fields with character counter.", "Champs SEO par contenu avec compteur de caractères."),
        leaf("cms-seo-sitemap", "XML Sitemap Generation", "Génération de sitemap XML",
          "Auto-generated, submitted to Google Search Console.", "Généré automatiquement, soumis à la Google Search Console."),
      ], "module"),
  ],
  conditional_modules: [
    {
      trigger_keywords: ["moderation", "comment", "ugc", "user generated", "contenu utilisateur", "spam", "toxic", "modération"],
      module: mod("cms-moderation", "Content Moderation", "Modération du contenu",
        "Automated and human moderation queue for user-generated content.",
        "File de modération automatisée et humaine pour le contenu généré par les utilisateurs.",
        [
          leaf("cms-mod-auto", "Automated Toxicity Detection", "Détection automatique de toxicité",
            "OpenAI Moderation API or Perspective API integration.", "Intégration API OpenAI Moderation ou Perspective API."),
          leaf("cms-mod-queue", "Human Review Queue", "File de révision humaine",
            "Flagged content dashboard for moderators.", "Tableau de bord de contenu signalé pour les modérateurs."),
        ], "feature"),
    },
    {
      trigger_keywords: ["paywall", "subscription", "membre", "member", "gated", "premium content", "contenu premium"],
      module: mod("cms-paywall", "Paywall & Member Access", "Paywall & accès membres",
        "Free/paid content gating, member-only sections.",
        "Blocage contenu gratuit/payant, sections réservées aux membres.",
        [
          leaf("cms-paywall-gate", "Content Access Gating Logic", "Logique de blocage d'accès au contenu",
            "Middleware checks subscription tier on page render.", "Le middleware vérifie le niveau d'abonnement au rendu de page."),
          leaf("cms-paywall-cta", "Upgrade CTA & Conversion Flow", "CTA de mise à niveau & flux de conversion",
            "Preview teaser, subscription upsell modal.", "Aperçu teasé, modal d'upsell d'abonnement."),
        ], "feature"),
    },
  ],
};

// ===========================================================================
// 9. ecommerce-storefront
// ===========================================================================
const ecommerceStorefront: DomainTemplate = {
  id: "ecommerce-storefront",
  name: { en: "E-commerce Storefront", fr: "Boutique e-commerce" },
  description: {
    en: "Online store with catalogue, cart, checkout, payments, and fulfillment.",
    fr: "Boutique en ligne avec catalogue, panier, paiement et fulfillment.",
  },
  keywords: {
    en: ["ecommerce", "e-commerce", "store", "shop", "boutique", "product", "cart", "checkout", "shopify", "woocommerce", "order"],
    fr: ["ecommerce", "e-commerce", "boutique", "magasin", "produit", "panier", "paiement", "commande", "livraison"],
  },
  base_modules: [
    mod("ec-catalog", "Product Catalogue", "Catalogue produits",
      "Product listings, variants, inventory, and collections.",
      "Listes de produits, variantes, inventaire et collections.",
      [
        leaf("ec-catalog-products", "Product Listings & Variants", "Listes de produits & variantes",
          "Size, colour, SKU-level inventory, product images.", "Taille, couleur, inventaire au niveau SKU, images produit."),
        leaf("ec-catalog-collections", "Collections & Categories", "Collections & catégories",
          "Curated collections, category hierarchy, filters.", "Collections curatées, hiérarchie de catégories, filtres."),
        leaf("ec-catalog-search", "Product Search & Recommendations", "Recherche produits & recommandations",
          "Elasticsearch / Algolia integration, you-may-also-like.", "Intégration Elasticsearch / Algolia, vous pourriez aussi aimer."),
      ], "component"),
    mod("ec-cart", "Cart & Checkout", "Panier & checkout",
      "Add-to-cart, cart persistence, multi-step checkout flow.",
      "Ajout au panier, persistance du panier, flux de paiement multi-étapes.",
      [
        leaf("ec-cart-add", "Add to Cart & Quantity Management", "Ajout au panier & gestion des quantités",
          "Optimistic UI, stock check on add.", "UI optimiste, vérification du stock à l'ajout."),
        leaf("ec-cart-checkout", "Multi-step Checkout (Address → Payment → Confirm)", "Checkout multi-étapes",
          "Guest or authenticated checkout, address book.", "Paiement invité ou authentifié, carnet d'adresses."),
        leaf("ec-cart-coupon", "Discount Codes & Promotions", "Codes promo & promotions",
          "Percentage, fixed, free shipping codes.", "Codes pourcentage, montant fixe, livraison gratuite."),
      ], "component"),
    mod("ec-payments", "Payments & Tax", "Paiements & taxe",
      "Stripe/Adyen integration, tax calculation, invoice generation.",
      "Intégration Stripe/Adyen, calcul de taxe, génération de factures.",
      [
        leaf("ec-payments-gateway", "Payment Gateway (Stripe / Adyen)", "Passerelle de paiement (Stripe / Adyen)",
          "3D Secure, Apple Pay, Google Pay, saved cards.", "3D Secure, Apple Pay, Google Pay, cartes enregistrées."),
        leaf("ec-payments-tax", "Tax Calculation (VAT / Sales Tax)", "Calcul de taxe (TVA / Sales Tax)",
          "Geo-based tax rate lookup, TaxJar / Stripe Tax.", "Taux de taxe basé sur la géo, TaxJar / Stripe Tax."),
      ], "component"),
    mod("ec-fulfillment", "Fulfillment & Returns", "Fulfillment & retours",
      "Order management, warehouse pick/pack/ship, return flows.",
      "Gestion des commandes, préparation entrepôt, flux de retours.",
      [
        leaf("ec-ful-orders", "Order Management System", "Système de gestion des commandes",
          "Order status machine, internal fulfilment queue.", "Machine à états commande, file interne de fulfilment."),
        leaf("ec-ful-shipping", "Carrier Integration & Labels", "Intégration transporteur & étiquettes",
          "La Poste, UPS, DHL rate shopping and label print.", "Comparaison de tarifs et impression d'étiquettes La Poste, UPS, DHL."),
        leaf("ec-ful-returns", "Returns & RMA Flow", "Flux de retours & RMA",
          "Return request, QC inspection, refund trigger.", "Demande de retour, inspection qualité, déclenchement de remboursement."),
      ], "component"),
  ],
  conditional_modules: [
    {
      trigger_keywords: ["subscription box", "recurring order", "commande récurrente", "abonnement produit", "replenishment"],
      module: mod("ec-subscriptions", "Subscription Commerce", "Commerce par abonnement",
        "Recurring orders, subscription management, pause/cancel flows.",
        "Commandes récurrentes, gestion des abonnements, flux de pause/annulation.",
        [
          leaf("ec-sub-plans", "Subscription Plan Builder", "Constructeur de plans d'abonnement",
            "Weekly/monthly billing, discount for commitment.", "Facturation hebdomadaire/mensuelle, remise pour engagement."),
          leaf("ec-sub-manage", "Customer Subscription Portal", "Portail d'abonnement client",
            "Pause, skip, swap product, cancel self-serve.", "Pause, ignorer, échanger le produit, annulation en libre-service."),
        ], "feature"),
    },
    {
      trigger_keywords: ["loyalty", "fidélité", "points", "rewards", "programme de fidélité", "referral"],
      module: mod("ec-loyalty", "Loyalty & Rewards Programme", "Programme de fidélité & récompenses",
        "Points earning, redemption, and referral mechanics.",
        "Accumulation de points, remboursement et mécaniques de parrainage.",
        [
          leaf("ec-loyalty-earn", "Points Earning Rules", "Règles d'accumulation de points",
            "X points per euro, bonus for first purchase.", "X points par euro, bonus premier achat."),
          leaf("ec-loyalty-redeem", "Points Redemption at Checkout", "Remboursement de points au checkout",
            "Apply points as discount, minimum threshold.", "Appliquer les points comme remise, seuil minimum."),
        ], "feature"),
    },
  ],
};

// ===========================================================================
// 10. iot-platform
// ===========================================================================
const iotPlatform: DomainTemplate = {
  id: "iot-platform",
  name: { en: "IoT Platform", fr: "Plateforme IoT" },
  description: {
    en: "Device management, telemetry ingestion, alerting, OTA updates, and dashboards.",
    fr: "Gestion des appareils, ingestion de télémétrie, alertes, mises à jour OTA et dashboards.",
  },
  keywords: {
    en: ["iot", "device", "sensor", "telemetry", "mqtt", "firmware", "ota", "embedded", "edge", "gateway", "connected"],
    fr: ["iot", "appareil", "capteur", "télémétrie", "mqtt", "firmware", "ota", "embarqué", "edge", "passerelle", "connecté"],
  },
  base_modules: [
    mod("iot-device", "Device Registry & Provisioning", "Registre & provisionnement des appareils",
      "Device identity, certificates, fleet provisioning at scale.",
      "Identité des appareils, certificats, provisionnement de flotte à grande échelle.",
      [
        leaf("iot-device-identity", "Device Identity & mTLS Certs", "Identité appareil & certificats mTLS",
          "X.509 certificate issuance per device.", "Émission de certificats X.509 par appareil."),
        leaf("iot-device-provision", "Bulk Fleet Provisioning", "Provisionnement en masse de flotte",
          "CSV upload, zero-touch provisioning via bootstrap cert.", "Téléchargement CSV, provisionnement zéro-contact via certificat bootstrap."),
        leaf("iot-device-status", "Device Status & Connectivity Tracking", "Suivi statut & connectivité appareil",
          "Online/offline heartbeat, last-seen timestamp.", "Battement de cœur en ligne/hors ligne, horodatage dernière connexion."),
      ], "component"),
    mod("iot-telemetry", "Telemetry Ingestion & Storage", "Ingestion & stockage de télémétrie",
      "High-throughput time-series ingestion via MQTT / HTTP.",
      "Ingestion de séries temporelles à haut débit via MQTT / HTTP.",
      [
        leaf("iot-tel-mqtt", "MQTT Broker (EMQX / Mosquitto)", "Broker MQTT (EMQX / Mosquitto)",
          "TLS-encrypted, QoS 0/1/2 message handling.", "Gestion des messages chiffrés TLS, QoS 0/1/2."),
        leaf("iot-tel-tsdb", "Time-Series DB (InfluxDB / TimescaleDB)", "Base de données séries temporelles",
          "Efficient storage of sensor readings with retention policies.", "Stockage efficace des mesures capteurs avec politiques de rétention."),
      ], "component"),
    mod("iot-alerts", "Alerting & Rules Engine", "Alertes & moteur de règles",
      "Threshold-based and anomaly-detection alerts sent via email/SMS/webhook.",
      "Alertes basées sur des seuils et détection d'anomalies envoyées par email/SMS/webhook.",
      [
        leaf("iot-alerts-rules", "Rule Builder (Threshold & Anomaly)", "Constructeur de règles (seuil & anomalie)",
          "If sensor > threshold for N minutes → alert.", "Si capteur > seuil pendant N minutes → alerte."),
        leaf("iot-alerts-channels", "Alert Channels (Email, SMS, Webhook)", "Canaux d'alerte (Email, SMS, Webhook)",
          "Configurable per device group, escalation policy.", "Configurable par groupe d'appareils, politique d'escalade."),
      ], "component"),
    mod("iot-dashboard", "Device & Fleet Dashboard", "Dashboard appareils & flotte",
      "Real-time fleet overview, telemetry charts, map view.",
      "Vue d'ensemble de la flotte en temps réel, graphiques de télémétrie, vue carte.",
      [
        leaf("iot-dash-fleet", "Fleet Health Overview", "Vue d'ensemble santé de la flotte",
          "Aggregate online %, alert count, top offenders.", "% en ligne agrégé, nombre d'alertes, principaux contrevenants."),
        leaf("iot-dash-charts", "Sensor Telemetry Charts", "Graphiques de télémétrie capteurs",
          "Time-series line charts per device/metric.", "Graphiques en courbe de séries temporelles par appareil/métrique."),
      ], "module"),
    mod("iot-ota", "OTA Firmware Updates", "Mises à jour firmware OTA",
      "Staged firmware rollout, rollback on failure, delta updates.",
      "Déploiement progressif du firmware, rollback en cas d'échec, mises à jour delta.",
      [
        leaf("iot-ota-release", "Firmware Release Management", "Gestion des releases firmware",
          "Upload binary, set target group, staged rollout %.", "Télécharger le binaire, définir le groupe cible, déploiement progressif %."),
        leaf("iot-ota-rollback", "Automatic Rollback on Failure", "Rollback automatique en cas d'échec",
          "Heartbeat watchdog triggers rollback if boot fails.", "Le chien de garde heartbeat déclenche le rollback si le boot échoue."),
      ], "module"),
  ],
  conditional_modules: [
    {
      trigger_keywords: ["edge", "local processing", "traitement local", "offline", "edge computing"],
      module: mod("iot-edge", "Edge Computing Layer", "Couche de traitement en périphérie",
        "Local data processing on gateway before cloud upload.",
        "Traitement local des données sur la passerelle avant envoi au cloud.",
        [
          leaf("iot-edge-filter", "Edge Filtering & Aggregation", "Filtrage & agrégation en périphérie",
            "Reduce upload volume by pre-aggregating on device.", "Réduire le volume d'envoi en pré-agrégeant sur l'appareil."),
          leaf("iot-edge-sync", "Offline Buffer & Cloud Sync", "Buffer hors-ligne & synchronisation cloud",
            "Store-and-forward when connectivity lost.", "Stocker et transmettre en cas de perte de connectivité."),
        ], "feature"),
    },
  ],
};

// ===========================================================================
// 11. fintech-app
// ===========================================================================
const fintechApp: DomainTemplate = {
  id: "fintech-app",
  name: { en: "Fintech Application", fr: "Application fintech" },
  description: {
    en: "Financial app with KYC, ledger, compliance, reporting, and bank integrations.",
    fr: "Application financière avec KYC, grand livre, conformité, reporting et intégrations bancaires.",
  },
  keywords: {
    en: ["fintech", "finance", "payment", "bank", "transfer", "ledger", "kyc", "aml", "compliance", "wallet", "money", "transaction", "psd2", "open banking"],
    fr: ["fintech", "finance", "paiement", "banque", "virement", "grand livre", "kyc", "lcb-ft", "conformité", "portefeuille", "argent", "transaction", "psd2"],
  },
  base_modules: [
    mod("fin-kyc", "KYC & Identity Verification", "KYC & vérification d'identité",
      "Document verification, liveness check, risk scoring.",
      "Vérification de documents, contrôle de vivacité, scoring de risque.",
      [
        leaf("fin-kyc-docs", "ID Document OCR & Verification", "OCR & vérification de documents d'identité",
          "Passport, driving licence, national ID via Onfido/Jumio.", "Passeport, permis de conduire, carte nationale via Onfido/Jumio."),
        leaf("fin-kyc-liveness", "Liveness Check & Biometrics", "Contrôle de vivacité & biométrie",
          "Selfie matching against ID photo.", "Correspondance du selfie avec la photo de la pièce d'identité."),
        leaf("fin-kyc-risk", "Risk Scoring & Tier Assignment", "Scoring de risque & attribution de niveau",
          "Rule-based + ML risk score, tier limits assignment.", "Score de risque basé sur des règles + ML, attribution des limites de niveau."),
      ], "component"),
    mod("fin-ledger", "Double-entry Ledger", "Grand livre à double entrée",
      "Immutable financial ledger with account hierarchy and journal entries.",
      "Grand livre financier immuable avec hiérarchie de comptes et écritures comptables.",
      [
        leaf("fin-ledger-accounts", "Chart of Accounts", "Plan comptable",
          "Asset, liability, equity, income, expense account types.", "Types de comptes actif, passif, capitaux propres, revenus, charges."),
        leaf("fin-ledger-entries", "Journal Entry Processing", "Traitement des écritures comptables",
          "Atomic debit/credit pairs, balance assertion.", "Paires débit/crédit atomiques, assertion de solde."),
        leaf("fin-ledger-recon", "Reconciliation & Dispute Handling", "Rapprochement & gestion des litiges",
          "Statement import, matching, exception queue.", "Import de relevés, correspondance, file des exceptions."),
      ], "component"),
    mod("fin-compliance", "Compliance & AML", "Conformité & LCB-FT",
      "Transaction monitoring, PEP/sanctions screening, regulatory reporting.",
      "Surveillance des transactions, criblage PEP/sanctions, reporting réglementaire.",
      [
        leaf("fin-compliance-tm", "Transaction Monitoring Rules", "Règles de surveillance des transactions",
          "Velocity, amount, geography anomaly rules.", "Règles d'anomalie de vélocité, montant, géographie."),
        leaf("fin-compliance-screening", "PEP & Sanctions Screening", "Criblage PEP & sanctions",
          "Realtime check against OFAC, EU consolidated list.", "Contrôle en temps réel contre OFAC, liste consolidée UE."),
        leaf("fin-compliance-sar", "SAR / STR Regulatory Reporting", "Déclarations réglementaires SAR / STR",
          "Suspicious Activity / Transaction Report submission.", "Soumission de déclarations d'activité / transaction suspecte."),
      ], "component"),
    mod("fin-reporting", "Financial Reporting", "Reporting financier",
      "P&L, balance sheet, cash flow statements, and regulatory filings.",
      "Compte de résultat, bilan, flux de trésorerie et déclarations réglementaires.",
      [
        leaf("fin-report-pnl", "P&L & Balance Sheet", "Compte de résultat & bilan",
          "Period-close automation, multi-currency consolidation.", "Automatisation de la clôture de période, consolidation multi-devises."),
        leaf("fin-report-reg", "Regulatory Filing Exports", "Exports de déclarations réglementaires",
          "COREP, FINREP, PSD2 reporting templates.", "Modèles de reporting COREP, FINREP, PSD2."),
      ], "module"),
  ],
  conditional_modules: [
    {
      trigger_keywords: ["open banking", "psd2", "plaid", "tink", "account aggregation", "agregation bancaire", "bank connection"],
      module: mod("fin-openbanking", "Open Banking Integration", "Intégration open banking",
        "PSD2 / Open Banking API connections via Plaid or Tink.",
        "Connexions API PSD2 / Open Banking via Plaid ou Tink.",
        [
          leaf("fin-ob-connect", "Bank Account Connection Flow", "Flux de connexion compte bancaire",
            "OAuth bank authorisation, account link persistence.", "Autorisation bancaire OAuth, persistance du lien compte."),
          leaf("fin-ob-sync", "Transaction History Sync", "Synchronisation de l'historique des transactions",
            "Pull 90-day history, webhook on new transactions.", "Récupérer l'historique 90 jours, webhook sur nouvelles transactions."),
        ], "feature"),
    },
    {
      trigger_keywords: ["crypto", "blockchain", "wallet", "defi", "token", "nft", "web3"],
      module: mod("fin-crypto", "Crypto / Blockchain Integration", "Intégration crypto / blockchain",
        "Wallet management, on-chain transactions, and token handling.",
        "Gestion de portefeuilles, transactions on-chain et gestion des tokens.",
        [
          leaf("fin-crypto-wallet", "Custodial Wallet Management", "Gestion de portefeuilles custody",
            "HD wallet derivation, private key custody (HSM).", "Dérivation de portefeuille HD, custody de clé privée (HSM)."),
          leaf("fin-crypto-tx", "On-chain Transaction Submission", "Soumission de transactions on-chain",
            "Gas estimation, nonce management, confirmation tracking.", "Estimation du gas, gestion du nonce, suivi des confirmations."),
        ], "feature"),
    },
  ],
};

// ===========================================================================
// 12. dev-tool-cli
// ===========================================================================
const devToolCli: DomainTemplate = {
  id: "dev-tool-cli",
  name: { en: "Developer Tool / CLI", fr: "Outil développeur / CLI" },
  description: {
    en: "Command-line developer tool with commands, config, plugins, and distribution.",
    fr: "Outil développeur en ligne de commande avec commandes, config, plugins et distribution.",
  },
  keywords: {
    en: ["cli", "command line", "developer tool", "dev tool", "terminal", "plugin", "shell", "npm package", "binary", "scaffold", "codegen"],
    fr: ["cli", "ligne de commande", "outil développeur", "terminal", "plugin", "shell", "package npm", "binaire", "scaffold", "génération de code"],
  },
  base_modules: [
    mod("cli-commands", "Command Structure & Routing", "Structure & routage des commandes",
      "Command hierarchy, argument/flag parsing, help generation.",
      "Hiérarchie des commandes, analyse des arguments/flags, génération de l'aide.",
      [
        leaf("cli-cmd-parse", "Argument & Flag Parsing (oclif / Yargs / Commander)", "Analyse arguments & flags",
          "Typed positional args, flags with defaults, subcommands.", "Arguments positionnels typés, flags avec défauts, sous-commandes."),
        leaf("cli-cmd-help", "Auto-generated Help & Man Pages", "Aide auto-générée & pages man",
          "Usage examples, flag descriptions, command tree.", "Exemples d'utilisation, descriptions des flags, arbre de commandes."),
        leaf("cli-cmd-errors", "User-friendly Error Messages", "Messages d'erreur conviviaux",
          "Coloured stderr output, suggestions on typos.", "Sortie stderr colorée, suggestions en cas de fautes de frappe."),
      ], "component"),
    mod("cli-config", "Configuration Management", "Gestion de la configuration",
      "Config file (YAML/JSON/TOML), env override, defaults, and validation.",
      "Fichier de configuration (YAML/JSON/TOML), surcharge par env, défauts et validation.",
      [
        leaf("cli-config-file", "Config File Schema & Validation", "Schéma & validation du fichier de config",
          "Zod/Joi schema validation on load, error on bad config.", "Validation de schéma Zod/Joi au chargement, erreur sur config incorrecte."),
        leaf("cli-config-env", "Environment Variable Override", "Surcharge par variable d'environnement",
          "ENV vars take precedence over config file.", "Les variables ENV ont priorité sur le fichier de config."),
        leaf("cli-config-init", "Interactive Init Command", "Commande d'initialisation interactive",
          "Guided prompts to generate initial config file.", "Invites guidées pour générer le fichier de config initial."),
      ], "component"),
    mod("cli-plugins", "Plugin System", "Système de plugins",
      "Extensible plugin architecture, discovery, lifecycle hooks.",
      "Architecture de plugins extensible, découverte, hooks de cycle de vie.",
      [
        leaf("cli-plugins-api", "Plugin API & Lifecycle Hooks", "API plugin & hooks de cycle de vie",
          "beforeRun, afterRun, onError hook contracts.", "Contrats de hooks beforeRun, afterRun, onError."),
        leaf("cli-plugins-discover", "Plugin Discovery & Installation", "Découverte & installation de plugins",
          "npm install + auto-register pattern.", "npm install + pattern d'auto-enregistrement."),
      ], "component"),
    mod("cli-ux", "Terminal UX & Output", "UX terminal & sortie",
      "Spinners, progress bars, coloured output, and interactive prompts.",
      "Spinners, barres de progression, sortie colorée et invites interactives.",
      [
        leaf("cli-ux-spinner", "Spinners & Progress Indicators", "Spinners & indicateurs de progression",
          "Ora or listr2 for async operation feedback.", "Ora ou listr2 pour le feedback des opérations asynchrones."),
        leaf("cli-ux-prompts", "Interactive Prompts (Inquirer / Clack)", "Invites interactives (Inquirer / Clack)",
          "Select, confirm, text input, password fields.", "Sélection, confirmation, saisie texte, champs mot de passe."),
        leaf("cli-ux-table", "Table & Tree Output (cli-table3)", "Sortie tableau & arbre (cli-table3)",
          "Formatted tabular data output to stdout.", "Sortie de données tabulaires formatées vers stdout."),
      ], "component"),
    mod("cli-dist", "Distribution & Release", "Distribution & release",
      "npm publish, GitHub releases, binary packaging, auto-update.",
      "Publication npm, releases GitHub, packaging binaire, mise à jour automatique.",
      [
        leaf("cli-dist-npm", "npm Package Publishing", "Publication de package npm",
          "prepublishOnly gate, scoped package, provenance.", "Porte prepublishOnly, package scopé, provenance."),
        leaf("cli-dist-binary", "Standalone Binary Packaging (pkg / nexe)", "Packaging binaire autonome",
          "Single executable, no Node runtime required.", "Exécutable unique, aucun runtime Node requis."),
        leaf("cli-dist-update", "Auto-update Notifier", "Notificateur de mise à jour automatique",
          "update-notifier: check npm registry on startup.", "update-notifier : vérifier le registre npm au démarrage."),
      ], "module"),
  ],
  conditional_modules: [
    {
      trigger_keywords: ["scaffold", "template", "generate", "codegen", "boilerplate", "init project", "new project"],
      module: mod("cli-scaffold", "Project Scaffolding", "Scaffold de projet",
        "Template-based project generation with variable interpolation.",
        "Génération de projets basée sur des templates avec interpolation de variables.",
        [
          leaf("cli-scaffold-templates", "Template Registry & Selection", "Registre & sélection de templates",
            "Built-in templates, custom template URL.", "Templates intégrés, URL de template personnalisé."),
          leaf("cli-scaffold-render", "Template Rendering & File Generation", "Rendu de template & génération de fichiers",
            "Handlebars/EJS variable interpolation, post-install hooks.", "Interpolation de variables Handlebars/EJS, hooks post-installation."),
        ], "feature"),
    },
    {
      trigger_keywords: ["test", "watch", "hot reload", "daemon", "watch mode"],
      module: mod("cli-watch", "Watch Mode & Dev Server", "Mode watch & serveur de développement",
        "File watcher with hot-reload for development workflows.",
        "Observateur de fichiers avec hot-reload pour les flux de développement.",
        [
          leaf("cli-watch-files", "File System Watcher (chokidar)", "Observateur système de fichiers (chokidar)",
            "Debounced change events, glob pattern matching.", "Événements de changement débouncés, correspondance de patterns glob."),
          leaf("cli-watch-reload", "Hot-reload & Live Feedback", "Hot-reload & feedback live",
            "Re-run on change, diff output highlighting.", "Ré-exécution au changement, mise en évidence des différences de sortie."),
        ], "feature"),
    },
  ],
};

// ===========================================================================
// Export all templates
// ===========================================================================
export const DOMAIN_TEMPLATES: DomainTemplate[] = [
  saasB2bDashboard,
  mobileAppConsumer,
  marketplace2Sided,
  apiProduct,
  internalAdminTool,
  dataPipeline,
  mlProduct,
  contentPlatform,
  ecommerceStorefront,
  iotPlatform,
  fintechApp,
  devToolCli,
];

export function getTemplateById(id: string): DomainTemplate | undefined {
  return DOMAIN_TEMPLATES.find((t) => t.id === id);
}
