import type { ScoringWeights } from "@/types";

/**
 * MVP scoring weights.
 *
 * This is the single source of truth for how much each factor
 * contributes to a plan's overall score. Change these numbers to
 * retune the model — nothing else in the codebase hard-codes weights.
 *
 * These weights are also displayed on the /methodology page, so keep
 * this file and that page's copy roughly in sync if you change it.
 *
 * NOTE: There is deliberately no "commission", "affiliateValue" or
 * "advertiserPriority" field anywhere in this model. Providers cannot
 * pay to change these numbers or their resulting rank.
 */
export const SCORING_WEIGHTS: ScoringWeights = {
  price: 0.3,
  downloadSpeed: 0.2,
  uploadSpeed: 0.15,
  suitability: 0.15,
  flexibility: 0.1,
  features: 0.1,
};

// Sanity check in dev — weights should sum to 1.
const total = Object.values(SCORING_WEIGHTS).reduce((a, b) => a + b, 0);
if (Math.abs(total - 1) > 0.001) {
  console.warn(`SCORING_WEIGHTS sum to ${total}, expected 1.0`);
}
