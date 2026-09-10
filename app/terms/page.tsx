import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import Alert from "@/components/ui/Alert";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Use",
  description: "Terms of use for the Compare NBN website.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Terms of Use</h1>

      <Alert tone="warning" className="mt-6">
        This page is a placeholder structure and has not yet been reviewed by
        a qualified lawyer. It must undergo legal review before being relied
        upon as a binding legal agreement.
      </Alert>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-600">
        <section>
          <h2 className="text-lg font-bold text-slate-900">
            Informational purpose only
          </h2>
          <p className="mt-2">
            Comparison results provided by this website are informational and
            are not financial or legal advice. They are generated using a
            transparent, published scoring methodology — see our{" "}
            <a href="/methodology" className="text-signal underline">
              methodology
            </a>{" "}
            page.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900">
            Plan information can change
          </h2>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>Prices may change at any time.</li>
            <li>Availability varies by address.</li>
            <li>NBN technology and maximum achievable speed vary by premises.</li>
            <li>
              Always confirm current pricing, availability and terms directly
              with the provider before signing up.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900">No warranty</h2>
          <p className="mt-2">
            [Placeholder — requires legal review] While we aim for accuracy,
            we make no warranty as to the completeness or currency of plan
            information displayed.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900">
            Acceptable use
          </h2>
          <p className="mt-2">
            [Placeholder — requires legal review] You agree to use this
            website lawfully and not to misuse, scrape or disrupt the
            service.
          </p>
        </section>
      </div>
    </div>
  );
}
