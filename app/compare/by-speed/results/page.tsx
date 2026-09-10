import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { getPlansBySpeedTier } from "@/lib/comparison/engine";
import Button from "@/components/ui/Button";
import Alert from "@/components/ui/Alert";
import DataAttribution from "@/components/ui/DataAttribution";
import PlanDataUnavailable from "@/components/ui/PlanDataUnavailable";
import PlanCard from "@/components/comparison/PlanCard";
import ComparisonTable from "@/components/comparison/ComparisonTable";

export const metadata: Metadata = buildMetadata({
  title: "NBN Plans by Speed",
  description: "NBN plans matching your chosen speed tier.",
  path: "/compare/by-speed/results",
});

export default async function SpeedResultsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolved = await searchParams;
  const speedParam = resolved.speed;
  const speedTier = Number(Array.isArray(speedParam) ? speedParam[0] : speedParam);

  if (!speedTier || Number.isNaN(speedTier)) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-slate-900">
          No speed selected
        </h1>
        <p className="mt-3 text-slate-600">
          Pick a speed tier to see matching plans.
        </p>
        <div className="mt-6">
          <Button href="/compare/by-speed">Choose a Speed</Button>
        </div>
      </div>
    );
  }

  let matches, availableTiers;
  try {
    ({ matches, availableTiers } = await getPlansBySpeedTier(speedTier));
  } catch {
    return <PlanDataUnavailable />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link href="/compare/by-speed" className="text-sm text-teal-700 hover:underline">
        ← Choose a different speed
      </Link>

      <h1 className="mt-4 text-3xl font-bold text-slate-900">
        {speedTier} Mbps NBN Plans
      </h1>

      <Alert tone="neutral" className="mt-4">
        Availability and maximum speeds depend on your address and NBN
        technology. Confirm availability with the provider before ordering.
      </Alert>

      {matches.length === 0 ? (
        <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-8 text-center">
          <p className="font-semibold text-slate-900">
            No plans found at the {speedTier} Mbps tier
          </p>
          <p className="mt-2 text-sm text-slate-600">
            Try one of the speeds below, or answer a few quick questions for
            a personalised recommendation instead.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {availableTiers.map((tier) => (
              <Link
                key={tier}
                href={`/compare/by-speed/results?speed=${tier}`}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-teal-400"
              >
                {tier} Mbps
              </Link>
            ))}
          </div>
          <div className="mt-6">
            <Button href="/compare#questionnaire" variant="secondary">
              Answer a Few Questions Instead
            </Button>
          </div>
        </div>
      ) : (
        <>
          <p className="mt-2 text-slate-600">
            {matches.length} plan{matches.length === 1 ? "" : "s"} at the{" "}
            {speedTier} Mbps tier, ranked by price, flexibility and features.
            Plans are grouped by their nearest standard speed tier — exact
            published speeds are shown on each card.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((scoredPlan, i) => (
              <PlanCard
                key={scoredPlan.plan.id}
                scoredPlan={scoredPlan}
                badge={i === 0 ? "Top Match" : undefined}
              />
            ))}
          </div>

          {matches.length > 1 && (
            <div className="mt-14">
              <h2 className="mb-4 text-xl font-bold text-slate-900">
                Compare All {speedTier} Mbps Plans
              </h2>
              <ComparisonTable plans={matches} />
            </div>
          )}
          <DataAttribution className="mt-6" />
        </>
      )}
    </div>
  );
}
