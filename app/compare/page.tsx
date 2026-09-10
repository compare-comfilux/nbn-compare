import type { Metadata } from "next";
import Link from "next/link";
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
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h1 className="text-3xl font-bold text-slate-900">Compare NBN Plans</h1>
        <p className="mt-3 text-slate-600">
          There are two ways to compare — pick whichever fits how much you
          already know.
        </p>
      </div>

      {/* Two-path chooser: makes it unambiguous which button to use. */}
      <div className="mx-auto mb-14 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/compare/by-speed"
          className="flex flex-col rounded-2xl border-2 border-signal bg-signal-tint/60 p-6 transition-colors hover:bg-signal-tint"
        >
          <span className="inline-flex w-fit items-center rounded-full bg-signal px-3 py-1 text-xs font-semibold text-white">
            I know my speed
          </span>
          <h2 className="mt-4 text-lg font-bold text-slate-900">
            Search by Speed
          </h2>
          <p className="mt-2 flex-1 text-sm text-slate-600">
            Already know the exact NBN speed you want (e.g. 100 Mbps)? Pick a
            speed tier and see matching plans immediately.
          </p>
          <span className="mt-4 text-sm font-semibold text-signal">
            Search by speed →
          </span>
        </Link>

        <a
          href="#questionnaire"
          className="flex flex-col rounded-2xl border-2 border-slate-200 bg-white p-6 transition-colors hover:border-slate-300 hover:bg-slate-50"
        >
          <span className="inline-flex w-fit items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
            Not sure yet
          </span>
          <h2 className="mt-4 text-lg font-bold text-slate-900">
            Answer a Few Questions
          </h2>
          <p className="mt-2 flex-1 text-sm text-slate-600">
            Not sure what speed you need? Tell us about your household and
            usage instead, and we&apos;ll work it out for you.
          </p>
          <span className="mt-4 text-sm font-semibold text-slate-700">
            Start questionnaire ↓
          </span>
        </a>
      </div>

      <div id="questionnaire" className="scroll-mt-24">
        <div className="mx-auto mb-8 max-w-xl text-center">
          <h2 className="text-xl font-bold text-slate-900">
            Not sure what speed you need?
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Answer these quick questions instead — no name, phone number or
            payment details needed.
          </p>
        </div>
        <Questionnaire />
      </div>
    </div>
  );
}
