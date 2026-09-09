import type { Metadata } from "next";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Compare NBN Plans Without the Sales Pitch",
  description:
    "Tell us how you use the internet and we'll help you find NBN plans that fit your household, budget and usage.",
  path: "/",
});

const WHY_CARDS = [
  {
    title: "Independent",
    body: "Our rankings are based on transparent criteria, not paid placement.",
  },
  {
    title: "Simple",
    body: "Answer a few questions instead of comparing dozens of confusing plans.",
  },
  {
    title: "Transparent",
    body: "See pricing, speeds, features, sources and when information was last checked.",
  },
  {
    title: "AI-Assisted",
    body: "AI helps explain the results in plain English based on your requirements.",
  },
];

const STEPS = [
  "Tell us what you need",
  "Compare suitable plans",
  "Understand the differences",
  "Choose what works for you",
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-slate-100 bg-gradient-to-b from-teal-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Compare NBN Plans Without the Sales Pitch
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            Tell us how you use the internet and we&apos;ll help you find NBN
            plans that fit your household, budget and usage.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/compare">Compare NBN Plans</Button>
            <Button href="/how-it-works" variant="secondary">
              How It Works
            </Button>
          </div>
        </div>
      </section>

      {/* Why use us */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="text-center text-3xl font-bold text-slate-900">
          Why Use Us?
        </h2>
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {WHY_CARDS.map((card) => (
            <Card key={card.title}>
              <h3 className="font-bold text-teal-800">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                {card.body}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
          <ol className="mx-auto mt-10 grid max-w-3xl grid-cols-1 gap-6 text-left sm:grid-cols-2">
            {STEPS.map((step, i) => (
              <li
                key={step}
                className="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-700 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <span className="pt-1 font-medium text-slate-700">{step}</span>
              </li>
            ))}
          </ol>
          <div className="mt-10">
            <Button href="/compare">Start Comparing</Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16 text-center text-sm text-slate-500 sm:px-6">
        <p>
          Comparison results are informational and not financial or legal
          advice. See our{" "}
          <Link href="/methodology" className="underline hover:text-teal-800">
            methodology
          </Link>{" "}
          and{" "}
          <Link href="/disclaimer" className="underline hover:text-teal-800">
            disclaimer
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
