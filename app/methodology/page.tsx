import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import { SCORING_WEIGHTS } from "@/lib/comparison/weights";
import Alert from "@/components/ui/Alert";
import Card from "@/components/ui/Card";
import DataAttribution from "@/components/ui/DataAttribution";

export const metadata: Metadata = buildMetadata({
  title: "Methodology",
  description: "How we source, compare and score NBN plans — transparently.",
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
  "Upload speed (published, or a flagged estimate — see below)",
  "Contract length",
  "Data allowance",
  "Setup fees",
  "Suitability for the customer's stated household size and usage",
];

export default function MethodologyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Methodology</h1>
      <p className="mt-4 text-slate-600">
        This page explains, in plain language, where our plan data comes
        from and exactly how we compare and rank it.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">Where Our Data Comes From</h2>
        <p className="mt-3 text-slate-600">
          There is no single official feed of every Australian retail
          service provider&apos;s NBN plans — nbn co runs the wholesale
          network, but each provider sets its own retail pricing and offers.
          We source live plan data from{" "}
          <a
            href="https://www.ozbroadbandreview.com/"
            target="_blank"
            rel="noopener"
            className="text-teal-700 underline"
          >
            Oz Broadband Review&apos;s
          </a>{" "}
          public plans API, which tracks residential NBN plans across a
          range of Australian providers and is refreshed roughly weekly.
        </p>
        <p className="mt-3 text-slate-600">
          This means our catalogue is real and current, but it isn&apos;t
          exhaustive — it only includes providers that source tracks, and
          any individual plan can change or be discontinued between
          refreshes. Always confirm final pricing and availability with the
          provider before signing up.
        </p>
        <DataAttribution className="mt-3" />
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">
          What We Show vs. What&apos;s Estimated
        </h2>
        <p className="mt-3 text-slate-600">
          Most fields shown — price, download speed, contract length, data
          allowance, setup fee — are exactly what the provider publishes.
          Two things are worth knowing:
        </p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-slate-600">
          <li>
            <strong>Upload speed</strong> isn&apos;t published as a separate
            field by every provider. Where a plan name states it (e.g. &ldquo;100/40&rdquo;),
            we use that. Where it doesn&apos;t, we show a conservative estimate
            based on standard nbn wholesale tiers, always marked with a{" "}
            <span className="whitespace-nowrap">~ symbol</span> and the word
            &ldquo;estimated&rdquo;.
          </li>
          <li>
            <strong>Connection technology</strong> (e.g. Fixed Line, Fixed
            Wireless) is shown as reported at the plan level — the specific
            nbn technology available at your address (FTTP, HFC, FTTN, etc.)
            depends on your premises, not the plan, and isn&apos;t checked by
            this site.
          </li>
        </ul>
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
        <p className="mt-3 text-slate-600">
          &ldquo;Suitability&rdquo; is computed purely from your own questionnaire
          answers — we combine a baseline speed for your household size with
          extra speed load for each usage type you select (e.g. 4K
          streaming or gaming add more than light browsing), then compare
          that requirement against each plan&apos;s real download speed. We
          don&apos;t use any curated &ldquo;good for families&rdquo; style tags — the
          real plan data doesn&apos;t include editorial claims like that,
          and we won&apos;t invent them.
        </p>
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
          AI is used to help personalise and explain recommendations, and to
          answer general questions in the chat assistant. AI does not create
          or invent plan prices, speeds or features. Core comparison data
          comes from the structured plan feed described above — AI only
          explains and personalises what the scoring model already
          calculated.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold text-slate-900">Data Freshness</h2>
        <p className="mt-3 text-slate-600">Every plan shown includes:</p>
        <ul className="mt-3 list-inside list-disc space-y-1 text-slate-600">
          <li>A source (Oz Broadband Review) and link to its review page</li>
          <li>A last-verified date, as reported by the source</li>
        </ul>
        <p className="mt-3 text-slate-600">
          The underlying feed is refreshed on our end at least hourly.
        </p>
      </section>
    </div>
  );
}
