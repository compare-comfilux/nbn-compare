import type {
  BudgetRange,
  CustomerRequirements,
  NbnPlan,
  RecommendationCategory,
  RecommendationResult,
  ScoredPlan,
} from "@/types";
import { getAllPlans } from "@/lib/database/plans";
import { scorePlan } from "./scoring";

const BUDGET_MAX: Record<BudgetRange, number | null> = {
  under_60: 60,
  "60_80": 80,
  "80_100": 100,
  "100_120": 120,
  "120_plus": null, // no upper bound
  no_preference: null,
};

const DEVICE_MIN_SPEED: Record<CustomerRequirements["deviceCount"], number> = {
  "1-5": 0,
  "6-10": 25,
  "11-20": 50,
  "20+": 100,
};

/**
 * Filters the full plan catalogue down to plans that could reasonably
 * suit the customer's stated requirements. This is intentionally a
 * soft filter — if the strict budget filter would return too few
 * plans, we relax it rather than showing the customer nothing.
 */
function filterEligiblePlans(
  plans: NbnPlan[],
  requirements: CustomerRequirements
): NbnPlan[] {
  const budgetMax = BUDGET_MAX[requirements.budget];
  const minSpeed = DEVICE_MIN_SPEED[requirements.deviceCount];

  const strict = plans.filter((plan) => {
    const withinBudget = budgetMax === null || plan.ongoingPrice <= budgetMax;
    const meetsDeviceLoad = plan.downloadSpeed >= minSpeed;
    return withinBudget && meetsDeviceLoad;
  });

  if (strict.length >= 3) return strict;

  // Relax the budget constraint slightly (up to 20% over) before giving up.
  if (budgetMax !== null) {
    const relaxed = plans.filter(
      (plan) =>
        plan.ongoingPrice <= budgetMax * 1.2 &&
        plan.downloadSpeed >= minSpeed
    );
    if (relaxed.length > strict.length) return relaxed;
  }

  return strict.length > 0 ? strict : plans.filter((p) => p.downloadSpeed >= minSpeed);
}

function pickCategoryWinner(
  scored: ScoredPlan[],
  category: RecommendationCategory
): ScoredPlan | undefined {
  if (scored.length === 0) return undefined;

  switch (category) {
    case "best_overall":
      return [...scored].sort((a, b) => b.score - a.score)[0];

    case "cheapest_suitable":
      return [...scored].sort(
        (a, b) => a.plan.ongoingPrice - b.plan.ongoingPrice
      )[0];

    case "best_value": {
      // Best score-per-dollar, using score / price as a simple ratio.
      return [...scored].sort(
        (a, b) =>
          b.score / b.plan.ongoingPrice - a.score / a.plan.ongoingPrice
      )[0];
    }

    case "best_gaming": {
      const candidates = [...scored].sort(
        (a, b) =>
          b.plan.uploadSpeed - a.plan.uploadSpeed ||
          b.breakdown.uploadSpeed - a.breakdown.uploadSpeed
      );
      return candidates[0];
    }

    case "best_families": {
      const candidates = scored.filter((s) =>
        s.plan.suitableFor.some((tag) =>
          ["families", "multiple", "smart home"].some((kw) =>
            tag.toLowerCase().includes(kw)
          )
        )
      );
      const pool = candidates.length > 0 ? candidates : scored;
      return [...pool].sort((a, b) => b.score - a.score)[0];
    }

    default:
      return undefined;
  }
}

export async function getRecommendations(
  requirements: CustomerRequirements
): Promise<RecommendationResult> {
  const allPlans = await getAllPlans();
  const eligiblePlans = filterEligiblePlans(allPlans, requirements);

  const scored = eligiblePlans
    .map((plan) => scorePlan(plan, eligiblePlans, requirements))
    .sort((a, b) => b.score - a.score);

  const categories: Partial<Record<RecommendationCategory, ScoredPlan>> = {};

  // Only populate a category when there are enough plans to make the
  // distinction meaningful (per spec section 9).
  const MIN_PLANS_FOR_CATEGORIES = 2;
  if (scored.length >= 1) {
    categories.best_overall = pickCategoryWinner(scored, "best_overall");
  }
  if (scored.length >= MIN_PLANS_FOR_CATEGORIES) {
    categories.best_value = pickCategoryWinner(scored, "best_value");
    categories.cheapest_suitable = pickCategoryWinner(scored, "cheapest_suitable");
    categories.best_gaming = pickCategoryWinner(scored, "best_gaming");
    categories.best_families = pickCategoryWinner(scored, "best_families");
  }

  return {
    requirements,
    eligiblePlans: scored,
    categories,
    generatedAt: new Date().toISOString(),
  };
}
