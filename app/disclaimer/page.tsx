import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Disclaimer",
  description: "Important disclaimer about NBN comparison information on this website.",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Disclaimer</h1>

      <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-600">
        <p>
          Comparison information on this website is provided for
          informational purposes only and does not constitute financial or
          legal advice.
        </p>
        <p>
          Plan information — including pricing, speeds and features — can
          change at any time. We display a &quot;last verified&quot; date and
          source for every plan, but you should always confirm current
          details with the provider before signing up.
        </p>
        <p>
          NBN availability and maximum achievable speeds depend on your
          address and the NBN technology serving your premises. We do not
          perform address-level availability checks in this version of the
          website.
        </p>
        <p>Provider terms and conditions apply to any plan you purchase.</p>
        <p>
          Plan data on this website is sourced live from Oz Broadband
          Review&apos;s public plans API and refreshed regularly, but it does
          not cover every retail provider in Australia — only the providers
          that source tracks.
        </p>
      </div>
    </div>
  );
}
