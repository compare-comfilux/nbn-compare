import type { Metadata } from "next";
import Link from "next/link";
import type { RecommendationCategory, RecommendationResult } from "@/types";
import { buildMetadata } from "@/lib/seo/metadata";
import { parseRequirements } from "@/lib/comparison/parseRequirements";
import { summariseRequirements } from "@/lib/comparison/summarise";
import { getRecommendations } from "@/lib/comparison/engine";
import { getAiRecommendation } from "@/lib/ai/aiRecommendationService";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import DataAttribution from "@/components/ui/DataAttribution";
import PlanDataUnavailable from "@/components/ui/PlanDataUnavailable";
import RecommendationCard from "@/components/comparison/RecommendationCard";
import ComparisonTable from "@/components/comparison/ComparisonTable";

export const metadata: Metadata = buildMetadata({
  title: "Your NBN Comparison Results",
  description: "Your personalised NBN plan comparison results.",
  path: "/compare/results",
});

const CATEGORY_ORDER: RecommendationCategory[] = [
  "best_overall",
  "best_value",
  "cheapest_suitable",
  "best_gaming",
  "best_families",
];

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolvedParams = await searchParams;
  const usp = new URLSearchParams();
  for (const [key, value] of Object.entries(resolvedParams)) {
    if (typeof value === "string") usp.set(key, value);
  }

  const requirements = parseRequirements(usp);

  let result: RecommendationResult;
  try {
    result = await getRecommendations(requirements);
  } catch {
    return <PlanDataUnavailable />;
  }

  let ai = null;
  try {
    ai = await getAiRecommendation({
      requirements,
      eligiblePlans: result.eligiblePlans,
      categories: result.categories,
    });
  } catch {
    ai = null; // AI must never break this page — see spec section 36.
  }

  if (result.eligiblePlans.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-slate-900">
          We couldn&apos;t find a matching plan
        </h1>
        <p className="mt-4 text-slate-600">
          Try widening your budget or device requirements and comparing
          again.
        </p>
        <div className="mt-6">
          <Button href="/compare">Modify Requirements</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          We found {result.eligiblePlans.length} plan
          {result.eligiblePlans.length === 1 ? "" : "s"} that may suit you
        </h1>
        <p className="mt-2 text-slate-600">{summariseRequirements(requirements)}</p>
        <div className="mt-4">
          <Button href="/compare" variant="secondary" className="!px-4 !py-2">
            Modify Requirements
          </Button>
        </div>
      </div>

      <Alert tone="neutral" className="mb-10">
        Availability and maximum speeds depend on your address and NBN
        technology. Confirm availability with the provider before ordering.
      </Alert>

      {ai && (
        <div className="mb-10 rounded-xl border border-signal/20 bg-signal-tint p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-signal">
            AI-assisted summary
          </p>
          <p className="mt-2 text-slate-800">{ai.recommendation}</p>
          <p className="mt-2 text-sm text-slate-600">{ai.reasoning}</p>
          {ai.considerations.length > 0 && (
            <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-slate-600">
              {ai.considerations.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          )}
          <p className="mt-3 text-xs text-slate-400">
            AI explains recommendations using our structured comparison data —
            it does not invent prices, speeds or features. See our{" "}
            <Link href="/methodology" className="underline">
              methodology
            </Link>
            .
          </p>
        </div>
      )}

      {/* Recommendation categories */}
      <h2 className="mb-4 text-xl font-bold text-slate-900">Recommendations</h2>
      <div className="mb-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORY_ORDER.filter((cat) => result.categories[cat]).map((cat) => (
          <RecommendationCard
            key={cat}
            category={cat}
            scoredPlan={result.categories[cat]!}
          />
        ))}
      </div>

      {/* Full comparison table */}
      <h2 className="mb-4 text-xl font-bold text-slate-900">
        All Suitable Plans
      </h2>
      <ComparisonTable plans={result.eligiblePlans} />
      <DataAttribution className="mt-4" />
    </div>
  );
}
