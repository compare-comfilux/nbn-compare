"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ScoredPlan } from "@/types";

type SortKey = "price" | "download" | "upload" | "score";

const SORT_LABELS: Record<SortKey, string> = {
  price: "Price",
  download: "Download speed",
  upload: "Upload speed",
  score: "Score",
};

export default function ComparisonTable({ plans }: { plans: ScoredPlan[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("score");
  const [ascending, setAscending] = useState(false);

  const sorted = useMemo(() => {
    const copy = [...plans];
    copy.sort((a, b) => {
      let diff = 0;
      switch (sortKey) {
        case "price":
          diff = a.plan.ongoingPrice - b.plan.ongoingPrice;
          break;
        case "download":
          diff = a.plan.downloadSpeed - b.plan.downloadSpeed;
          break;
        case "upload":
          diff = a.plan.uploadSpeed - b.plan.uploadSpeed;
          break;
        case "score":
          diff = a.score - b.score;
          break;
      }
      return ascending ? diff : -diff;
    });
    return copy;
  }, [plans, sortKey, ascending]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setAscending((v) => !v);
    } else {
      setSortKey(key);
      setAscending(false);
    }
  }

  return (
    <div>
      {/* Sort controls (also used as the mobile view) */}
      <div className="mb-4 flex flex-wrap gap-2">
        {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
          <button
            key={key}
            onClick={() => handleSort(key)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              sortKey === key
                ? "border-teal-700 bg-teal-700 text-white"
                : "border-slate-200 bg-white text-slate-600 hover:border-teal-300"
            }`}
          >
            Sort by {SORT_LABELS[key]} {sortKey === key ? (ascending ? "↑" : "↓") : ""}
          </button>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-xl border border-slate-200 lg:block">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Provider</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Monthly</th>
              <th className="px-4 py-3">Intro</th>
              <th className="px-4 py-3">Ongoing</th>
              <th className="px-4 py-3">Download</th>
              <th className="px-4 py-3">Upload</th>
              <th className="px-4 py-3">Evening speed</th>
              <th className="px-4 py-3">Contract</th>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Modem</th>
              <th className="px-4 py-3">Setup fee</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sorted.map(({ plan, score }) => (
              <tr key={plan.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">
                  {plan.provider}
                </td>
                <td className="px-4 py-3">{plan.planName}</td>
                <td className="px-4 py-3">${plan.monthlyPrice}</td>
                <td className="px-4 py-3">
                  {plan.introductoryPrice ? `$${plan.introductoryPrice}` : "—"}
                </td>
                <td className="px-4 py-3">${plan.ongoingPrice}</td>
                <td className="px-4 py-3">{plan.downloadSpeed} Mbps</td>
                <td className="px-4 py-3">{plan.uploadSpeed} Mbps</td>
                <td className="px-4 py-3">
                  {plan.typicalEveningSpeed ? `${plan.typicalEveningSpeed} Mbps` : "—"}
                </td>
                <td className="px-4 py-3">{plan.contractType}</td>
                <td className="px-4 py-3">{plan.dataAllowance}</td>
                <td className="px-4 py-3">{plan.modemIncluded ? "Included" : "Extra"}</td>
                <td className="px-4 py-3">${plan.setupFee}</td>
                <td className="px-4 py-3 font-semibold text-teal-800">{score}</td>
                <td className="px-4 py-3">
                  <Link
                    href={`/plans/${plan.slug}`}
                    className="font-medium text-teal-700 hover:underline"
                  >
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="space-y-3 lg:hidden">
        {sorted.map(({ plan, score }) => (
          <div
            key={plan.id}
            className="rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">{plan.provider}</p>
                <p className="font-semibold text-slate-900">{plan.planName}</p>
              </div>
              <span className="rounded-full bg-teal-50 px-2 py-1 text-xs font-semibold text-teal-800">
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
              className="mt-3 inline-block text-sm font-medium text-teal-700 hover:underline"
            >
              View plan →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
