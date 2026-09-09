// Core domain types.
//
// NOTE ON NAMING: this platform is designed to eventually support more than
// NBN plans (mobile, energy, insurance, etc). Where a generic name makes
// sense we use it (Product, Provider, ComparisonEngine) even though today
// every Product is an NBN plan. See methodology/roadmap docs.

export type NbnTechnology =
  | "FTTP"
  | "HFC"
  | "FTTC"
  | "FTTN"
  | "FTTB"
  | "Fixed Wireless"
  | "Satellite";

export type ContractType = "No lock-in" | "12 months" | "24 months";

export interface Provider {
  id: string;
  name: string;
  slug: string;
  website: string;
  logo?: string;
  description: string;
  active: boolean;
}

/**
 * A single comparable product (currently always an NBN plan).
 * Field names are intentionally generic-friendly for future categories.
 */
export interface NbnPlan {
  id: string;
  providerId: string;
  provider: string; // denormalised provider name for convenience/display
  planName: string;
  slug: string;

  monthlyPrice: number; // ongoing price shown as the "sticker" price
  introductoryPrice?: number;
  introductoryPeriodMonths?: number;
  ongoingPrice: number;

  downloadSpeed: number; // Mbps
  uploadSpeed: number; // Mbps
  typicalEveningSpeed?: number; // Mbps, self-reported / ACCC-style metric

  dataAllowance: "Unlimited" | string;

  contractType: ContractType;
  setupFee: number;

  modemIncluded: boolean;
  modemCost?: number;

  nbnTechnology: NbnTechnology[];

  features: string[];
  suitableFor: string[]; // e.g. "Families", "Gaming", "Working from home"

  pros: string[];
  cons: string[];
  whoThisSuits: string;
  whoShouldConsiderAnother: string;

  sourceUrl: string;
  sourceName: string;
  lastVerified: string; // ISO date string

  isDemoData: boolean;
  active: boolean;

  createdAt: string;
  updatedAt: string;
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
