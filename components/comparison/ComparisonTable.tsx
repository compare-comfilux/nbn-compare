"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import type { ScoredPlan } from "@/types";
import ProviderLogo from "@/components/ui/ProviderLogo";

type SortKey =
  | "provider"
  | "plan"
  | "monthly"
  | "intro"
  | "ongoing"
  | "download"
  | "upload"
  | "contract"
  | "data"
  | "setupFee"
  | "score";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "provider", label: "Provider" },
  { key: "plan", label: "Plan" },
  { key: "monthly", label: "Monthly" },
  { key: "intro", label: "Intro" },
  { key: "ongoing", label: "Ongoing" },
  { key: "download", label: "Download" },
  { key: "upload", label: "Upload" },
  { key: "contract", label: "Contract" },
  { key: "data", label: "Data" },
  { key: "setupFee", label: "Setup fee" },
  { key: "score", label: "Score" },
];

/** Parses "No lock-in" / "12 months" / "24 months" / arbitrary strings into a sortable month count. */
function contractMonths(contractType: string): number {
  if (contractType === "No lock-in") return 0;
  const match = contractType.match(/\d+/);
  return match ? Number(match[0]) : Number.POSITIVE_INFINITY;
}

function getSortValue(sp: ScoredPlan, key: SortKey): string | number {
  const { plan, score } = sp;
  switch (key) {
    case "provider":
      return plan.provider.toLowerCase();
    case "plan":
      return plan.planName.toLowerCase();
    case "monthly":
      return plan.monthlyPrice;
    case "intro":
      // Plans with no intro discount sort to the end regardless of direction.
      return plan.introductoryPrice ?? Number.POSITIVE_INFINITY;
    case "ongoing":
      return plan.ongoingPrice;
    case "download":
      return plan.downloadSpeed;
    case "upload":
      return plan.uploadSpeed;
    case "contract":
      return contractMonths(plan.contractType);
    case "data":
      return plan.dataAllowance.toLowerCase();
    case "setupFee":
      return plan.setupFee;
    case "score":
      return score;
  }
}

// Show a manageable first page of results rather than dumping every
// matching plan at once — too many options at once makes it harder,
// not easier, to decide. "View more" reveals the rest on demand.
const INITIAL_VISIBLE = 8;
const REVEAL_STEP = 10;

export default function ComparisonTable({ plans }: { plans: ScoredPlan[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [ascending, setAscending] = useState(false);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const sorted = useMemo(() => {
    const copy = [...plans];
    copy.sort((a, b) => {
      const av = getSortValue(a, sortKey);
      const bv = getSortValue(b, sortKey);
      const diff =
        typeof av === "string" && typeof bv === "string"
          ? av.localeCompare(bv)
          : (av as number) - (bv as number);
      return ascending ? diff : -diff;
    });
    return copy;
  }, [plans, sortKey, ascending]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setAscending((v) => !v);
    } else {
      setSortKey(key);
      // Price/fee-style columns make more sense low-to-high by default;
      // speed/score-style columns make more sense high-to-low by default.
      setAscending(["monthly", "intro", "ongoing", "setupFee", "contract"].includes(key));
    }
    // Re-sorting changes what "the first 8" means, so collapse back to
    // the first page rather than showing a confusing partial reveal.
    setVisibleCount(INITIAL_VISIBLE);
  }

  const visible = sorted.slice(0, visibleCount);
  const remaining = sorted.length - visible.length;
  const activeLabel = COLUMNS.find((c) => c.key === sortKey)?.label ?? "";

  return (
    <div>
      {sorted.length > INITIAL_VISIBLE && (
        <p className="mb-3 text-sm text-slate-500">
          Showing {visible.length} of {sorted.length} plans, sorted by{" "}
          {activeLabel.toLowerCase()} ({ascending ? "lowest" : "highest"} first).
        </p>
      )}

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 lg:block">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="bg-slate-900 text-xs font-bold uppercase tracking-wide text-white">
            <tr>
              {COLUMNS.map((col) => (
                <th key={col.key} className="px-4 py-3.5">
                  <button
                    onClick={() => handleSort(col.key)}
                    className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 font-bold uppercase tracking-wide transition-colors hover:bg-white/10 hover:text-white ${
                      sortKey === col.key ? "bg-white/15 text-white" : "text-slate-300"
                    }`}
                  >
                    {col.label}
                    {sortKey === col.key ? (
                      ascending ? (
                        <ArrowUp size={13} strokeWidth={3} />
                      ) : (
                        <ArrowDown size={13} strokeWidth={3} />
                      )
                    ) : (
                      <ChevronsUpDown size={13} className="opacity-60" />
                    )}
                  </button>
                </th>
              ))}
              <th className="px-4 py-3.5" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {visible.map(({ plan, score }, i) => (
              <tr
                key={plan.id}
                className={`transition-colors hover:bg-signal-tint/40 ${
                  i % 2 === 1 ? "bg-slate-50/70" : "bg-white"
                }`}
              >
                <td className="px-4 py-3 font-medium text-slate-900">
                  <div className="flex items-center gap-2">
                    <ProviderLogo name={plan.provider} size={24} />
                    {plan.provider}
                  </div>
                </td>
                <td className="px-4 py-3">{plan.planName}</td>
                <td className="px-4 py-3">${plan.monthlyPrice}</td>
                <td className="px-4 py-3">
                  {plan.introductoryPrice ? `$${plan.introductoryPrice}` : "—"}
                </td>
                <td className="px-4 py-3">${plan.ongoingPrice}</td>
                <td className="px-4 py-3">{plan.downloadSpeed} Mbps</td>
                <td className="px-4 py-3">
                  {plan.uploadSpeedEstimated ? "~" : ""}
                  {plan.uploadSpeed} Mbps
                </td>
                <td className="px-4 py-3">{plan.contractType}</td>
                <td className="px-4 py-3">{plan.dataAllowance}</td>
                <td className="px-4 py-3">${plan.setupFee}</td>
                <td className="px-4 py-3 font-semibold text-data-dark">{score}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/plans/${plan.slug}`}
                    className="font-medium text-signal hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-2 hidden text-xs text-slate-400 lg:block">
        ~ indicates an estimated upload speed where the provider doesn&apos;t
        publish one.
      </p>

      {/* Mobile: sort chips + cards, since there's no table header to click */}
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400 lg:hidden">
        Sort by
      </p>
      <div className="mb-4 flex flex-wrap gap-2 lg:hidden">
        {COLUMNS.filter((c) =>
          ["ongoing", "download", "upload", "contract", "score"].includes(c.key)
        ).map((col) => (
          <button
            key={col.key}
            onClick={() => handleSort(col.key)}
            className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              sortKey === col.key
                ? "border-signal bg-signal text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-signal/40"
            }`}
          >
            {col.label}
            {sortKey === col.key ? (
              ascending ? (
                <ArrowUp size={12} strokeWidth={3} />
              ) : (
                <ArrowDown size={12} strokeWidth={3} />
              )
            ) : (
              <ChevronsUpDown size={12} className="opacity-60" />
            )}
          </button>
        ))}
      </div>

      <div className="space-y-3 lg:hidden">
        {visible.map(({ plan, score }, i) => (
          <div
            key={plan.id}
            className={`rounded-xl border border-slate-200 p-4 ${
              i % 2 === 1 ? "bg-slate-50/70" : "bg-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ProviderLogo name={plan.provider} size={28} />
                <div>
                  <p className="text-xs text-slate-500">{plan.provider}</p>
                  <p className="font-semibold text-slate-900">{plan.planName}</p>
                </div>
              </div>
              <span className="rounded-full bg-data-tint px-2 py-1 text-xs font-semibold text-data-dark">
                {score} / 100
              </span>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-600">
              <div>
                <dt className="text-slate-400">Ongoing price</dt>
                <dd>${plan.ongoingPrice}/mo</dd>
              </div>
              <div>
                <dt className="text-slate-400">Speed</dt>
                <dd>
                  {plan.downloadSpeed}/{plan.uploadSpeed} Mbps
                </dd>
              </div>
              <div>
                <dt className="text-slate-400">Contract</dt>
                <dd>{plan.contractType}</dd>
              </div>
              <div>
                <dt className="text-slate-400">Data</dt>
                <dd>{plan.dataAllowance}</dd>
              </div>
            </dl>
            <Link
              href={`/plans/${plan.slug}`}
              className="mt-3 inline-block text-sm font-medium text-signal hover:underline"
            >
              View plan →
            </Link>
          </div>
        ))}
      </div>

      {remaining > 0 && (
        <div className="mt-5 text-center">
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
