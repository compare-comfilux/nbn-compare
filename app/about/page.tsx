import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "About",
  description: "About Compare NBN — an independent comparison platform.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">About Compare NBN</h1>

      <div className="mt-6 space-y-5 text-slate-600">
        <p>
          Our goal is to make comparing household services simpler, clearer
          and more transparent. NBN is the first category we&apos;re building
          this for.
        </p>
        <p>
          We compare plans using structured data and a transparent scoring
          methodology — not paid placement. AI helps explain results in plain
          English, but it never invents prices, speeds or features; see our{" "}
          <a href="/methodology" className="text-signal underline">
            methodology
          </a>{" "}
          page for the full detail.
        </p>
        <p>
          Comparing household services shouldn&apos;t require an afternoon of
          reading fine print across a dozen tabs. We&apos;re starting with
          NBN, and the platform may expand into other household services —
          like mobile, energy or insurance — over time.
        </p>
        <p>
          This is an early-stage product. We&apos;re not Australia&apos;s
          biggest comparison site, and we don&apos;t claim to be 100%
          unbiased — we do claim to show you exactly how our comparisons are
          calculated, and to never let a provider pay for a better rank.
        </p>
      </div>
    </div>
  );
}
