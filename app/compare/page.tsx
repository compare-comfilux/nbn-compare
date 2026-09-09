import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import Questionnaire from "@/components/questionnaire/Questionnaire";

export const metadata: Metadata = buildMetadata({
  title: "Compare NBN Plans",
  description:
    "Answer a few quick questions about your household and internet usage to see NBN plans that suit you.",
  path: "/compare",
});

export default function ComparePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div className="mx-auto mb-10 max-w-xl text-center">
        <h1 className="text-3xl font-bold text-slate-900">Compare NBN Plans</h1>
        <p className="mt-3 text-slate-600">
          A few quick questions about your household and internet usage — no
          name, phone number or payment details needed.
        </p>
      </div>
      <Questionnaire />
    </div>
  );
}
