import type { RecommendationCategory, ScoredPlan } from "@/types";
import PlanCard from "./PlanCard";

const CATEGORY_LABELS: Record<RecommendationCategory, string> = {
  best_overall: "Best Overall",
  best_value: "Best Value",
  cheapest_suitable: "Cheapest Suitable",
  best_gaming: "Best for Gaming",
  best_families: "Best for Families",
};

export default function RecommendationCard({
  category,
  scoredPlan,
}: {
  category: RecommendationCategory;
  scoredPlan: ScoredPlan;
}) {
  return <PlanCard scoredPlan={scoredPlan} badge={CATEGORY_LABELS[category]} />;
}
