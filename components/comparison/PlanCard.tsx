import type { ScoredPlan } from "@/types";
import Card from "@/components/ui/Card";
import ScoreBadge from "@/components/ui/ScoreBadge";
import PriceDisplay from "@/components/ui/PriceDisplay";
import SpeedDisplay from "@/components/ui/SpeedDisplay";
import LastVerified from "@/components/ui/LastVerified";
import SourceBadge from "@/components/ui/SourceBadge";
import Button from "@/components/ui/Button";
import { describePlan } from "@/lib/comparison/describePlan";

export default function PlanCard({
  scoredPlan,
  badge,
}: {
  scoredPlan: ScoredPlan;
  badge?: string;
}) {
  const { plan, score } = scoredPlan;
  const tags = describePlan(plan);

  return (
    <Card className="flex flex-col gap-4">
      {badge && (
        <span className="inline-flex w-fit items-center rounded-full bg-teal-700 px-3 py-1 text-xs font-semibold text-white">
          {badge}
        </span>
      )}

      {plan.promoCode && (
        <span className="inline-flex w-fit items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          Promo code: {plan.promoCode}
        </span>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{plan.provider}</p>
          <h3 className="text-lg font-bold text-slate-900">{plan.planName}</h3>
        </div>
        <ScoreBadge score={score} />
      </div>

      <PriceDisplay
        monthlyPrice={plan.monthlyPrice}
        introductoryPrice={plan.introductoryPrice}
        introductoryPeriodMonths={plan.introductoryPeriodMonths}
        ongoingPrice={plan.ongoingPrice}
      />

      <SpeedDisplay
        downloadSpeed={plan.downloadSpeed}
        uploadSpeed={plan.uploadSpeed}
        uploadSpeedEstimated={plan.uploadSpeedEstimated}
      />

      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Best for
        </p>
        <p className="mt-1 text-sm text-slate-700">{tags.join(" • ")}</p>
      </div>

      {plan.features.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
            Features
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            {plan.features.join(" • ")}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-slate-100 pt-3">
        <div className="flex flex-col gap-0.5">
          <LastVerified date={plan.lastVerified} />
          <SourceBadge sourceName={plan.sourceName} sourceUrl={plan.sourceUrl} />
        </div>
      </div>

      <div className="flex gap-3">
        <Button href={`/plans/${plan.slug}`} variant="secondary" className="flex-1">
          View Plan
        </Button>
      </div>
    </Card>
  );
}
