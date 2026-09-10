import type { CustomerRequirements, NbnPlan, ScoredPlan, UsageType } from "@/types";
import { SCORING_WEIGHTS } from "./weights";

/**
 * Scoring engine.
 *
 * Every sub-score is normalised to a 0-100 scale before weights are
 * applied, so the final score is always comparable across plans and
 * always sits between 0 and 100.
 *
 * All inputs here are objective, published (or clearly-flagged
 * estimated) facts about each plan — see lib/external/ozbroadbandReview.ts
 * for exactly what's real vs. estimated. Nothing in this file relies on
 * curated editorial tags; suitability is computed purely from speed vs.
 * a usage-implied speed requirement.
 *
 * This is an MVP methodology, not a claim of objective perfection —
 * see /methodology. It is designed to be transparent and easy to
 * adjust, not to be the final word on "best".
 */

function clamp(value: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, value));
}

/** Cheaper plans score higher. Scored relative to the plan set's price range. */
function scorePrice(plan: NbnPlan, allPlans: NbnPlan[]): number {
  const prices = allPlans.map((p) => p.ongoingPrice);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  if (max === min) return 100;
  // Invert: lowest price = 100, highest price = 0.
  return clamp(100 - ((plan.ongoingPrice - min) / (max - min)) * 100);
}

/** Faster download speed scores higher, scored relative to the plan set. */
function scoreDownloadSpeed(plan: NbnPlan, allPlans: NbnPlan[]): number {
  const speeds = allPlans.map((p) => p.downloadSpeed);
  const max = Math.max(...speeds);
  if (max === 0) return 0;
  return clamp((plan.downloadSpeed / max) * 100);
}

/** Faster upload speed scores higher, scored relative to the plan set. */
function scoreUploadSpeed(plan: NbnPlan, allPlans: NbnPlan[]): number {
  const speeds = allPlans.map((p) => p.uploadSpeed);
  const max = Math.max(...speeds);
  if (max === 0) return 0;
  return clamp((plan.uploadSpeed / max) * 100);
}

/**
 * Additional Mbps a usage type implies on top of a light baseline, used
 * to compute an objective "required speed" for the household — not a
 * curated per-plan tag, just arithmetic over the customer's own answers.
 */
const USAGE_SPEED_LOAD: Record<UsageType, number> = {
  browsing: 5,
  streaming: 15,
  streaming_4k: 25,
  gaming: 15,
  wfh: 15,
  video_calls: 10,
  study: 10,
  large_downloads: 20,
  cloud_backup: 20,
  smart_home: 10,
};

const HOUSEHOLD_BASELINE: Record<CustomerRequirements["householdSize"], number> = {
  "1": 10,
  "2": 15,
  "3-4": 25,
  "5+": 35,
};

/**
 * How well the plan's speed matches the household's computed speed
 * requirement, derived entirely from their own questionnaire answers
 * (household size baseline + sum of selected usage loads). A plan right
 * at the requirement scores around 70; comfortable headroom scores up
 * to 100; falling short scores down toward 0.
 */
function scoreSuitability(plan: NbnPlan, requirements: CustomerRequirements): number {
  const usageLoad = requirements.usageTypes.reduce(
    (sum, usage) => sum + (USAGE_SPEED_LOAD[usage] ?? 5),
    0
  );
  const requiredSpeed = HOUSEHOLD_BASELINE[requirements.householdSize] + usageLoad;

  const ratio = plan.downloadSpeed / requiredSpeed;

  if (ratio >= 2) return 100;
  if (ratio >= 1) return 70 + (ratio - 1) * 30; // 70-100 as headroom grows
  return clamp(ratio * 70); // under the requirement: scales down toward 0
}

/** No lock-in contracts score highest; longer contracts score lower. */
function scoreFlexibility(plan: NbnPlan): number {
  switch (plan.contractType) {
    case "No lock-in":
      return 100;
    case "12 months":
      return 55;
    case "24 months":
      return 20;
    default:
      return 50;
  }
}

/** More included, objectively-computed features score higher. */
function scoreFeatures(plan: NbnPlan): number {
  let score = 45;
  if (plan.setupFee === 0) score += 20;
  if (plan.introductoryPrice) score += 10;
  score += Math.min(plan.features.length * 5, 25);
  return clamp(score);
}

export function scorePlan(
  plan: NbnPlan,
  allEligiblePlans: NbnPlan[],
  requirements: CustomerRequirements
): ScoredPlan {
  const breakdown = {
    price: scorePrice(plan, allEligiblePlans),
    downloadSpeed: scoreDownloadSpeed(plan, allEligiblePlans),
    uploadSpeed: scoreUploadSpeed(plan, allEligiblePlans),
    suitability: scoreSuitability(plan, requirements),
    flexibility: scoreFlexibility(plan),
    features: scoreFeatures(plan),
  };

  const score =
    breakdown.price * SCORING_WEIGHTS.price +
    breakdown.downloadSpeed * SCORING_WEIGHTS.downloadSpeed +
    breakdown.uploadSpeed * SCORING_WEIGHTS.uploadSpeed +
    breakdown.suitability * SCORING_WEIGHTS.suitability +
    breakdown.flexibility * SCORING_WEIGHTS.flexibility +
    breakdown.features * SCORING_WEIGHTS.features;

  return {
    plan,
    score: Math.round(clamp(score)),
    breakdown,
  };
}
