import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import Alert from "@/components/ui/Alert";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description: "How Compare NBN handles your personal information.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>

      <Alert tone="warning" className="mt-6">
        This page is a placeholder structure and has not yet been reviewed by
        a qualified lawyer. It must undergo legal review before this website
        handles real customer data in production.
      </Alert>

      <div className="mt-8 space-y-6 text-sm leading-relaxed text-slate-600">
        <section>
          <h2 className="text-lg font-bold text-slate-900">
            What information we collect
          </h2>
          <p className="mt-2">
            Our NBN comparison questionnaire is designed to collect only what
            is needed to suggest suitable plans: household size, usage type,
            device count, budget range and priority. We do not require your
            full name, phone number, date of birth or payment information to
            use the comparison tool.
          </p>
          <p className="mt-2">
            If you use our contact form, we collect the name, email address,
            reason and message you provide.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900">
            How we use information
          </h2>
          <p className="mt-2">
            [Placeholder — requires legal review] Information submitted via
            the contact form is used solely to respond to your enquiry.
            Anonymous, aggregated usage analytics may be collected to improve
            the website (see below).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900">Analytics</h2>
          <p className="mt-2">
            We may use privacy-conscious analytics tools to understand
            aggregate usage of the website (e.g. which pages are visited).
            This does not include collecting unnecessary personal
            information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900">Data sharing</h2>
          <p className="mt-2">
            [Placeholder — requires legal review] We do not sell personal
            information to third parties.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-slate-900">Contact</h2>
          <p className="mt-2">
            For privacy-related questions, use our{" "}
            <a href="/contact" className="text-teal-700 underline">
              contact form
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
