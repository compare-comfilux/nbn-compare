// Core domain types.
//
// NOTE ON NAMING: this platform is designed to eventually support more than
// NBN plans (mobile, energy, insurance, etc). Where a generic name makes
// sense we use it (Product, Provider, ComparisonEngine) even though today
// every Product is an NBN plan. See methodology/roadmap docs.
//
// DATA PROVENANCE: plan data is sourced live from the Oz Broadband Review
// public plans API (see lib/external/ozbroadbandReview.ts). That feed does
// NOT include: upload speed as a distinct field, modem details, or curated
// "pros/cons/suitable for" copy. Fields below reflect only what is actually
// published or objectively computable from it — nothing here is invented
// editorial content. See /methodology for exactly how each field is derived.

export type ContractType = "No lock-in" | "12 months" | "24 months" | string;

export interface Provider {
  id: string;
  name: string;
  slug: string;
}

/**
 * A single comparable product (currently always a residential NBN plan).
 * Field names are intentionally generic-friendly for future categories.
 */
export interface NbnPlan {
  id: string;
  providerId: string;
  provider: string; // denormalised provider name for convenience/display
  planName: string;
  slug: string;

  monthlyPrice: number; // = ongoingPrice; kept for display components that show a headline price
  introductoryPrice?: number;
  introductoryPeriodMonths?: number;
  ongoingPrice: number;

  downloadSpeed: number; // Mbps, as published by the source
  uploadSpeed: number; // Mbps — parsed from the plan name if published, otherwise estimated
  uploadSpeedEstimated: boolean; // true if uploadSpeed above is an estimate, not a published figure

  dataAllowance: "Unlimited" | string;

  contractType: ContractType;
  setupFee: number;

  technology: string; // e.g. "NBN" as reported by the source
  subTechnology: string; // e.g. "Fixed Line", "Fixed Wireless", "Private Fibre" — as reported, not address-verified

  promoCode?: string;

  /** Computed, rule-based facts derived from the fields above (not marketing copy). */
  features: string[];

  sourceUrl: string; // links to the source's review/plan page, not necessarily the provider's own site
  sourceName: string;
  lastVerified: string; // ISO date string

  active: boolean;
}

// ---- Questionnaire / customer requirements ----

export type HouseholdSize = "1" | "2" | "3-4" | "5+";

export type UsageType =
  | "browsing"
  | "streaming"
  | "streaming_4k"
  | "gaming"
  | "wfh"
  | "video_calls"
  | "study"
  | "large_downloads"
  | "cloud_backup"
  | "smart_home";

export type DeviceCount = "1-5" | "6-10" | "11-20" | "20+";

export type BudgetRange =
  | "under_60"
  | "60_80"
  | "80_100"
  | "100_120"
  | "120_plus"
  | "no_preference";

export type Priority =
  | "best_overall"
  | "lowest_price"
  | "fastest_speed"
  | "best_gaming"
  | "best_wfh"
  | "best_families"
  | "best_value";

export interface CustomerRequirements {
  householdSize: HouseholdSize;
  usageTypes: UsageType[];
  deviceCount: DeviceCount;
  budget: BudgetRange;
  priority: Priority;
}

// ---- Scoring / comparison engine ----

export interface ScoringWeights {
  price: number;
  downloadSpeed: number;
  uploadSpeed: number;
  suitability: number;
  flexibility: number;
  features: number;
}

export interface ScoredPlan {
  plan: NbnPlan;
  score: number; // 0-100
  breakdown: {
    price: number;
    downloadSpeed: number;
    uploadSpeed: number;
    suitability: number;
    flexibility: number;
    features: number;
  };
}

export type RecommendationCategory =
  | "best_overall"
  | "best_value"
  | "cheapest_suitable"
  | "best_gaming"
  | "best_families";

export interface RecommendationResult {
  requirements: CustomerRequirements;
  eligiblePlans: ScoredPlan[];
  categories: Partial<Record<RecommendationCategory, ScoredPlan>>;
  generatedAt: string;
}

// ---- AI recommendation service ----

export interface AiRecommendationInput {
  requirements: CustomerRequirements;
  eligiblePlans: ScoredPlan[];
  categories: Partial<Record<RecommendationCategory, ScoredPlan>>;
}

export interface AiRecommendationOutput {
  recommendation: string;
  reasoning: string;
  considerations: string[];
  source: "ai" | "mock";
}
