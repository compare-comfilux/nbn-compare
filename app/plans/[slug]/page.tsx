import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllPlanSlugs, getPlanBySlug } from "@/lib/database/plans";
import { buildMetadata } from "@/lib/seo/metadata";
import PriceDisplay from "@/components/ui/PriceDisplay";
import SpeedDisplay from "@/components/ui/SpeedDisplay";
import LastVerified from "@/components/ui/LastVerified";
import SourceBadge from "@/components/ui/SourceBadge";
import Disclaimer from "@/components/ui/Disclaimer";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export async function generateStaticParams() {
  const slugs = await getAllPlanSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const plan = await getPlanBySlug(slug);
  if (!plan) return buildMetadata({ title: "Plan not found", description: "" });

  return buildMetadata({
    title: `${plan.provider} ${plan.planName}`,
    description: `${plan.provider} ${plan.planName}: $${plan.ongoingPrice}/month, ${plan.downloadSpeed} Mbps download, ${plan.uploadSpeed} Mbps upload.`,
    path: `/plans/${plan.slug}`,
  });
}

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const plan = await getPlanBySlug(slug);
  if (!plan) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      {plan.isDemoData && (
        <span className="mb-4 inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
          Demo data — not currently available for purchase
        </span>
      )}

      <p className="text-sm text-slate-500">{plan.provider}</p>
      <h1 className="mt-1 text-3xl font-bold text-slate-900">{plan.planName}</h1>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Card>
          <PriceDisplay
            monthlyPrice={plan.monthlyPrice}
            introductoryPrice={plan.introductoryPrice}
            introductoryPeriodMonths={plan.introductoryPeriodMonths}
            ongoingPrice={plan.ongoingPrice}
          />
        </Card>
        <Card>
          <SpeedDisplay
            downloadSpeed={plan.downloadSpeed}
            uploadSpeed={plan.uploadSpeed}
            typicalEveningSpeed={plan.typicalEveningSpeed}
          />
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          ["Data allowance", plan.dataAllowance],
          ["Contract", plan.contractType],
          ["Setup fee", `$${plan.setupFee}`],
          [
            "Modem",
            plan.modemIncluded
              ? "Included"
              : plan.modemCost
                ? `$${plan.modemCost} extra`
                : "Not included",
          ],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-slate-200 p-4">
            <p className="text-xs text-slate-400">{label}</p>
            <p className="mt-1 text-sm font-semibold text-slate-800">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          NBN technology
        </p>
        <p className="mt-1 text-sm text-slate-700">
          {plan.nbnTechnology.join(", ")}
        </p>
      </div>

      <div className="mt-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Features
        </p>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-700">
          {plan.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <p className="text-sm font-bold text-teal-800">Pros</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-700">
            {plan.pros.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-500">Cons</p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-700">
            {plan.cons.map((c) => (
              <li key={c}>{c}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <div>
          <p className="text-sm font-bold text-slate-900">Who this plan may suit</p>
          <p className="mt-1 text-sm text-slate-600">{plan.whoThisSuits}</p>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">
            Who should consider another plan
          </p>
          <p className="mt-1 text-sm text-slate-600">
            {plan.whoShouldConsiderAnother}
          </p>
        </div>
      </div>

      <div className="mt-8 flex items-center gap-3">
        <LastVerified date={plan.lastVerified} />
        <SourceBadge sourceName={plan.sourceName} sourceUrl={plan.sourceUrl} />
      </div>

      <Disclaimer className="mt-6" />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button href={plan.sourceUrl} className="flex-1">
          View Plan
        </Button>
        <Button href="/compare" variant="secondary" className="flex-1">
          Back to Comparison
        </Button>
      </div>
    </div>
  );
}
