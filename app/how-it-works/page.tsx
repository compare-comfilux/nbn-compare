import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo/metadata";
import Button from "@/components/ui/Button";

export const metadata: Metadata = buildMetadata({
  title: "How It Works",
  description: "How our NBN comparison process works, step by step.",
  path: "/how-it-works",
});

const STEPS = [
  {
    title: "1. Tell us about your household",
    body: "Answer a few quick questions about household size, usage, devices and budget. No name, phone number or payment details required.",
  },
  {
    title: "2. We identify suitable plans",
    body: "We filter our plan database down to plans that could reasonably meet your stated requirements.",
  },
  {
    title: "3. We compare important differences",
    body: "Price, speed, contract flexibility, data allowance and features are laid out side by side.",
  },
  {
    title: "4. Our scoring model ranks the options",
    body: "A transparent, configurable scoring model — explained on our Methodology page — ranks suitable plans.",
  },
  {
    title: "5. AI explains the recommendation",
    body: "AI turns the structured scoring data into a plain-English explanation. It never invents facts.",
  },
  {
    title: "6. You make the final decision",
    body: "We do not make the decision for you. Always confirm pricing and availability with the provider before signing up.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">How It Works</h1>
      <p className="mt-4 text-slate-600">
        The website does not make the decision for you — it helps you compare
        clearly so you can decide.
      </p>

      <div className="mt-10 space-y-6">
        {STEPS.map((step) => (
          <div key={step.title} className="rounded-xl border border-slate-200 p-5">
            <h2 className="font-bold text-slate-900">{step.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{step.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <Button href="/compare">Compare NBN Plans</Button>
      </div>
    </div>
  );
}
