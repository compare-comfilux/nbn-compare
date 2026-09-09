import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { SPEED_TIERS } from "@/lib/comparison/speedTiers";
import Button from "@/components/ui/Button";

export const metadata: Metadata = buildMetadata({
  title: "Search NBN Plans by Speed",
  description:
    "Already know the NBN speed you want? Pick a speed tier and see matching plans straight away.",
  path: "/compare/by-speed",
});

const TIER_DESCRIPTIONS: Record<number, string> = {
  25: "Light browsing, email and standard-definition streaming.",
  50: "Couples and small households with everyday streaming.",
  100: "Families, HD/4K streaming and working from home.",
  250: "Larger households with many devices and simultaneous streams.",
  500: "Power users, large downloads and cloud backup.",
  1000: "Maximum available speed for the heaviest usage.",
};

export default function SearchBySpeedPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Link href="/compare" className="text-sm text-teal-700 hover:underline">
        ← Back to full comparison
      </Link>

      <h1 className="mt-4 text-3xl font-bold text-slate-900">
        Already know the speed you want?
      </h1>
      <p className="mt-3 text-slate-600">
        Pick an NBN speed tier below and we&apos;ll show you every plan
        available at that speed, ranked by price, flexibility and features —
        no other questions needed.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {SPEED_TIERS.map((tier) => (
          <Link
            key={tier}
            href={`/compare/by-speed/results?speed=${tier}`}
            className="rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-teal-400 hover:bg-teal-50/40"
          >
            <p className="text-2xl font-bold text-slate-900">
              {tier} <span className="text-sm font-medium text-slate-500">Mbps</span>
            </p>
            <p className="mt-1 text-sm text-slate-600">
              {TIER_DESCRIPTIONS[tier]}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
        Not sure which speed you need?{" "}
        <Button href="/compare" variant="secondary" className="mt-3 !px-4 !py-2">
          Answer a few quick questions instead
        </Button>
      </div>
    </div>
  );
}
