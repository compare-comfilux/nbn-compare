import type { Metadata } from "next";
import Link from "next/link";
import { Gauge, ShieldCheck, Eye, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Compare NBN Plans Without the Sales Pitch",
  description:
    "Tell us how you use the internet and we'll help you find NBN plans that fit your household, budget and usage.",
  path: "/",
});

const TRUST_POINTS = [
  { icon: ShieldCheck, label: "No paid rankings" },
  { icon: Eye, label: "Real, regularly-updated plan data" },
  { icon: Sparkles, label: "AI-assisted, never AI-invented" },
];

const WHY_ITEMS = [
  {
    icon: Eye,
    title: "Independent",
    body: "Rankings come from a published scoring formula, not paid placement — providers can't buy a better position.",
  },
  {
    icon: Gauge,
    title: "Simple",
    body: "Already know your speed? Pick it and go. Not sure? Answer a few questions and we'll work it out.",
  },
  {
    icon: ShieldCheck,
    title: "Transparent",
    body: "Every plan shows its price, speed, contract, source and when it was last checked.",
  },
  {
    icon: Sparkles,
    title: "AI-assisted",
    body: "Our assistant explains why a plan fits your answers — built only from real comparison data, never guessed.",
  },
];

const STEPS = [
  {
    title: "Tell us what you need",
    body: "Pick an exact speed, or answer a few questions about your household.",
  },
  {
    title: "We compare suitable plans",
    body: "Real, current plans are filtered and scored against your answers.",
  },
  {
    title: "You see why",
    body: "Every result shows its score breakdown — price, speed, flexibility.",
  },
  {
    title: "You decide",
    body: "We never pick for you. Confirm details with the provider before signing up.",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="overflow-hidden border-b border-slate-100 bg-gradient-to-b from-signal-tint/60 to-white">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Compare NBN plans without the sales pitch.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
              Tell us the speed you want, or answer a few quick questions
              about your household — either way, you&apos;ll see real plans,
              ranked transparently, in under a minute.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/compare/by-speed">I know my speed</Button>
              <Button href="/compare" variant="secondary">
                Not sure? Compare properly
              </Button>
            </div>

            <ul className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-6">
              {TRUST_POINTS.map(({ icon: Icon, label }) => (
                <li
                  key={label}
                  className="flex items-center gap-2 text-sm text-slate-600"
                >
                  <Icon size={16} className="shrink-0 text-signal" />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          {/* Illustrative mini comparison — not live data */}
          <div className="relative lg:col-span-5">
            <div className="relative mx-auto max-w-sm">
              <div
                aria-hidden
                className="absolute -right-3 top-6 h-full w-full rotate-3 rounded-2xl border border-slate-200 bg-white/70"
              />
              <div className="relative rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5">
                <p className="text-xs font-medium text-slate-400">
                  Example comparison
                </p>
                <div className="mt-3 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500">FastConnect</p>
                    <p className="text-lg font-bold text-slate-900">
                      Home 100
                    </p>
                  </div>
                  <span className="inline-flex items-baseline gap-1 rounded-full bg-data-tint px-3 py-1.5 font-bold text-data-dark">
                    <span className="text-xl">94</span>
                    <span className="text-[10px] font-medium opacity-70">
                      /100
                    </span>
                  </span>
                </div>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-slate-900">$79</span>
                  <span className="text-sm text-slate-500">/month</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4 text-sm">
                  <div>
                    <p className="font-semibold text-slate-900">100 Mbps</p>
                    <p className="text-slate-500">Download</p>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">40 Mbps</p>
                    <p className="text-slate-500">Upload</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-signal">
                  <Sparkles size={14} />
                  Best match for your answers
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-slate-900">How it works</h2>
          <ol className="mt-10 space-y-8 border-l border-slate-200 pl-8">
            {STEPS.map((step, i) => (
              <li key={step.title} className="relative">
                <span className="absolute -left-[calc(2rem+1px)] flex h-8 w-8 items-center justify-center rounded-full bg-signal text-sm font-bold text-white">
                  {i + 1}
                </span>
                <p className="font-semibold text-slate-900">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
          <div className="mt-10">
            <Button href="/compare">Start comparing</Button>
          </div>
        </div>
      </section>

      {/* Why use us */}
      <section className="border-t border-slate-100 bg-slate-50 py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-slate-900">Why use us?</h2>
          <div className="mt-10 grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2">
            {WHY_ITEMS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-signal-tint text-signal">
                  <Icon size={20} />
                </span>
                <div>
                  <h3 className="font-bold text-slate-900">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-slate-900 py-20">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold text-white">Ready to compare?</h2>
          <p className="mt-3 text-slate-300">
            Takes under a minute. No name, phone number or payment details
            needed.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/compare/by-speed">I know my speed</Button>
            <Button
              href="/compare"
              variant="secondary"
              className="!border-white/30 !bg-transparent !text-white hover:!border-white hover:!bg-white/10"
            >
              Not sure? Compare properly
            </Button>
          </div>
          <p className="mt-8 text-xs text-slate-400">
            Comparison results are informational and not financial or legal
            advice. See our{" "}
            <Link href="/methodology" className="underline hover:text-white">
              methodology
            </Link>{" "}
            and{" "}
            <Link href="/disclaimer" className="underline hover:text-white">
              disclaimer
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
