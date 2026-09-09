import type { CustomerRequirements, NbnPlan, ScoredPlan } from "@/types";
import { SCORING_WEIGHTS } from "./weights";

/**
 * Scoring engine.
 *
 * Every sub-score is normalised to a 0-100 scale before weights are
 * applied, so the final score is always comparable across plans and
 * always sits between 0 and 100.
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
 * How well the plan's stated "suitableFor" tags and speed match the
 * customer's selected usage types and household size.
 */
function scoreSuitability(plan: NbnPlan, requirements: CustomerRequirements): number {
  let score = 50; // baseline

  const usageMatchers: Record<string, string[]> = {
    browsing: ["browsing", "email", "single user"],
    streaming: ["streaming", "families", "couples"],
    streaming_4k: ["4k streaming", "families", "multiple simultaneous 4k streams"],
    gaming: ["gaming", "streaming while gaming"],
    wfh: ["working from home", "video calls"],
    video_calls: ["video calls", "working from home"],
    study: ["browsing", "video calls", "working from home"],
    large_downloads: ["large downloads", "cloud backup"],
    cloud_backup: ["cloud backup", "large downloads"],
    smart_home: ["smart home devices", "families"],
  };

  const suitableForLower = plan.suitableFor.map((s) => s.toLowerCase());

  for (const usage of requirements.usageTypes) {
    const keywords = usageMatchers[usage] ?? [];
    const matched = keywords.some((kw) =>
      suitableForLower.some((tag) => tag.includes(kw))
    );
    score += matched ? 8 : -2;
  }

  // Household size vs typical evening speed as a rough proxy for headroom.
  const householdMultiplier: Record<CustomerRequirements["householdSize"], number> = {
    "1": 15,
    "2": 25,
    "3-4": 50,
    "5+": 80,
  };
  const requiredHeadroom = householdMultiplier[requirements.householdSize];
  const availableSpeed = plan.typicalEveningSpeed ?? plan.downloadSpeed;
  if (availableSpeed >= requiredHeadroom) {
    score += 15;
  } else {
    score -= 15;
  }

  return clamp(score);
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

/** More included features/inclusions (modem, etc.) scores higher. */
function scoreFeatures(plan: NbnPlan): number {
  let score = 40;
  if (plan.modemIncluded) score += 25;
  if (plan.setupFee === 0) score += 15;
  score += Math.min(plan.features.length * 5, 20);
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
