import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { SCORING_WEIGHTS } from "@/lib/comparison/weights";
import Alert from "@/components/ui/Alert";
import Card from "@/components/ui/Card";

export const metadata: Metadata = buildMetadata({
  title: "Methodology",
  description: "How we compare and score NBN plans — transparently.",
  path: "/methodology",
});

const WEIGHT_ROWS: { label: string; key: keyof typeof SCORING_WEIGHTS }[] = [
  { label: "Price", key: "price" },
  { label: "Download speed", key: "downloadSpeed" },
  { label: "Upload speed", key: "uploadSpeed" },
  { label: "Suitability for your requirements", key: "suitability" },
  { label: "Contract flexibility", key: "flexibility" },
  { label: "Features / inclusions", key: "features" },
];

const CONSIDERATIONS = [
  "Price (introductory and ongoing)",
  "Download speed",
  "Upload speed",
  "Typical evening performance, where available",
  "Contract flexibility",
  "Data allowance",
  "Modem inclusion",
  "Setup fees",
  "Features",
  "Suitability for the customer's stated requirements",
];

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Methodology</h1>
      <p className="mt-4 text-slate-600">
        This page explains, in plain language, exactly how we compare and
        rank NBN plans.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">Our Approach</h2>
        <p className="mt-3 text-slate-600">
          We compare plans using structured information and transparent
          criteria. Every plan in our database is scored the same way, using
          the same formula — there is no manual override.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">What We Consider</h2>
        <ul className="mt-3 list-inside list-disc space-y-1 text-slate-600">
          {CONSIDERATIONS.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">Ranking</h2>
        <p className="mt-3 text-slate-600">
          Rankings are calculated using a transparent, configurable scoring
          model. Each factor is weighted as follows:
        </p>
        <Card className="mt-4">
          <ul className="divide-y divide-slate-100">
            {WEIGHT_ROWS.map((row) => (
              <li
                key={row.key}
                className="flex items-center justify-between py-2 text-sm"
              >
                <span className="text-slate-700">{row.label}</span>
                <span className="font-semibold text-teal-800">
                  {Math.round(SCORING_WEIGHTS[row.key] * 100)}%
                </span>
              </li>
            ))}
          </ul>
        </Card>
        <p className="mt-3 text-sm text-slate-500">
          This is the MVP methodology and will be refined using user testing —
          it is not claimed to be objectively perfect.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">No Paid Rankings</h2>
        <Alert tone="info" className="mt-3">
          Providers cannot pay to improve their ranking.
        </Alert>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">AI</h2>
        <p className="mt-3 text-slate-600">
          AI is used to help personalise and explain recommendations. AI does
          not create or invent plan prices, speeds or features. Core
          comparison data comes from structured plan information — AI only
          explains and personalises what the scoring model already
          calculated.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">Data Freshness</h2>
        <p className="mt-3 text-slate-600">Every plan in our database includes:</p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-slate-600">
          <li>A source and source URL</li>
          <li>A last-verified date</li>
          <li>An optional next review date</li>
        </ul>
      </section>
    </div>
  );
}
