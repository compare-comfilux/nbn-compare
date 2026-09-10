import type { NbnPlan } from "@/types";

/**
 * Short "best for" style tags shown on plan cards, computed purely
 * from objective, published plan facts (speed tier, upload speed,
 * contract, data). There is no curated "suitable for" field in the
 * real data source — these are simple, documented thresholds, not
 * editorial claims. See /methodology for the exact rules.
 */
export function describePlan(plan: NbnPlan): string[] {
  const tags: string[] = [];

  if (plan.downloadSpeed <= 25) {
    tags.push("Light browsing");
  } else if (plan.downloadSpeed <= 50) {
    tags.push("Couples & small households");
  } else if (plan.downloadSpeed <= 100) {
    tags.push("Families & streaming");
  } else if (plan.downloadSpeed <= 250) {
    tags.push("Multiple devices");
  } else {
    tags.push("Power users");
  }

  if (plan.uploadSpeed >= 40) {
    tags.push("Fast upload");
  }

  if (plan.contractType === "No lock-in") {
    tags.push("No lock-in");
  }

  if (plan.introductoryPrice) {
    tags.push("Intro discount");
  }

  return tags;
}
