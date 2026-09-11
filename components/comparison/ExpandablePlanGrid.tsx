"use client";

import { useState } from "react";
import type { ScoredPlan } from "@/types";
import PlanCard from "./PlanCard";

const INITIAL_VISIBLE = 9;
const REVEAL_STEP = 9;

export default function ExpandablePlanGrid({
  plans,
  topBadge,
}: {
  plans: ScoredPlan[];
  /** Label shown on the very first card only, e.g. "Top Match". */
  topBadge?: string;
}) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const visible = plans.slice(0, visibleCount);
  const remaining = plans.length - visible.length;

  return (
    <div>
      {plans.length > INITIAL_VISIBLE && (
        <p className="mb-4 text-sm text-slate-500">
          Showing {visible.length} of {plans.length} plans, best match first.
        </p>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((scoredPlan, i) => (
          <PlanCard
            key={scoredPlan.plan.id}
            scoredPlan={scoredPlan}
            badge={i === 0 ? topBadge : undefined}
          />
        ))}
      </div>

      {remaining > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setVisibleCount((v) => v + REVEAL_STEP)}
            className="rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-signal/40 hover:text-signal"
          >
            View {Math.min(remaining, REVEAL_STEP)} more plan
            {Math.min(remaining, REVEAL_STEP) === 1 ? "" : "s"} ({remaining} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
