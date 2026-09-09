"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type {
  BudgetRange,
  DeviceCount,
  HouseholdSize,
  Priority,
  UsageType,
} from "@/types";
import ProgressBar from "@/components/ui/ProgressBar";
import Button from "@/components/ui/Button";
import QuestionnaireStep from "./QuestionnaireStep";
import OptionButton from "./OptionButton";
import { trackEvent } from "@/lib/analytics/events";

const TOTAL_STEPS = 5;

const HOUSEHOLD_OPTIONS: { value: HouseholdSize; label: string }[] = [
  { value: "1", label: "1 person" },
  { value: "2", label: "2 people" },
  { value: "3-4", label: "3–4 people" },
  { value: "5+", label: "5+ people" },
];

const USAGE_OPTIONS: { value: UsageType; label: string }[] = [
  { value: "browsing", label: "Browsing and email" },
  { value: "streaming", label: "Netflix / streaming" },
  { value: "streaming_4k", label: "4K streaming" },
  { value: "gaming", label: "Gaming" },
  { value: "wfh", label: "Working from home" },
  { value: "video_calls", label: "Video calls" },
  { value: "study", label: "Study / online learning" },
  { value: "large_downloads", label: "Large downloads" },
  { value: "cloud_backup", label: "Cloud backup" },
  { value: "smart_home", label: "Smart home devices" },
];

const DEVICE_OPTIONS: { value: DeviceCount; label: string }[] = [
  { value: "1-5", label: "1–5 devices" },
  { value: "6-10", label: "6–10 devices" },
  { value: "11-20", label: "11–20 devices" },
  { value: "20+", label: "20+ devices" },
];

const BUDGET_OPTIONS: { value: BudgetRange; label: string }[] = [
  { value: "under_60", label: "Under $60" },
  { value: "60_80", label: "$60–$80" },
  { value: "80_100", label: "$80–$100" },
  { value: "100_120", label: "$100–$120" },
  { value: "120_plus", label: "$120+" },
  { value: "no_preference", label: "No preference" },
];

const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: "best_overall", label: "Best overall" },
  { value: "lowest_price", label: "Lowest suitable price" },
  { value: "fastest_speed", label: "Fastest speed" },
  { value: "best_gaming", label: "Best for gaming" },
  { value: "best_wfh", label: "Best for working from home" },
  { value: "best_families", label: "Best for families" },
  { value: "best_value", label: "Best value" },
];

export default function Questionnaire() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [householdSize, setHouseholdSize] = useState<HouseholdSize | null>(null);
  const [usageTypes, setUsageTypes] = useState<UsageType[]>([]);
  const [deviceCount, setDeviceCount] = useState<DeviceCount | null>(null);
  const [budget, setBudget] = useState<BudgetRange | null>(null);
  const [priority, setPriority] = useState<Priority | null>(null);

  function toggleUsage(value: UsageType) {
    setUsageTypes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  function canProceed(): boolean {
    switch (step) {
      case 1:
        return householdSize !== null;
      case 2:
        return usageTypes.length > 0;
      case 3:
        return deviceCount !== null;
      case 4:
        return budget !== null;
      case 5:
        return priority !== null;
      default:
        return false;
    }
  }

  function goNext() {
    if (step === 1) trackEvent("comparison_started");
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
      return;
    }
    submit();
  }

  function goBack() {
    if (step > 1) setStep(step - 1);
  }

  function submit() {
    if (!householdSize || !deviceCount || !budget || !priority) return;
    trackEvent("comparison_completed");

    const params = new URLSearchParams({
      household: householdSize,
      usage: usageTypes.join(","),
      devices: deviceCount,
      budget,
      priority,
    });
    router.push(`/compare/results?${params.toString()}`);
  }

  return (
    <div className="mx-auto max-w-xl">
      <ProgressBar current={step} total={TOTAL_STEPS} />

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
        {step === 1 && (
          <QuestionnaireStep question="How many people use your internet connection?">
            <div className="grid grid-cols-2 gap-3">
              {HOUSEHOLD_OPTIONS.map((opt) => (
                <OptionButton
                  key={opt.value}
                  label={opt.label}
                  selected={householdSize === opt.value}
                  onClick={() => setHouseholdSize(opt.value)}
                />
              ))}
            </div>
          </QuestionnaireStep>
        )}

        {step === 2 && (
          <QuestionnaireStep
            question="What do you mainly use the internet for?"
            helpText="Select all that apply."
          >
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {USAGE_OPTIONS.map((opt) => (
                <OptionButton
                  key={opt.value}
                  label={opt.label}
                  selected={usageTypes.includes(opt.value)}
                  onClick={() => toggleUsage(opt.value)}
                />
              ))}
            </div>
          </QuestionnaireStep>
        )}

        {step === 3 && (
          <QuestionnaireStep question="How many devices are typically connected at the same time?">
            <div className="grid grid-cols-2 gap-3">
              {DEVICE_OPTIONS.map((opt) => (
                <OptionButton
                  key={opt.value}
                  label={opt.label}
                  selected={deviceCount === opt.value}
                  onClick={() => setDeviceCount(opt.value)}
                />
              ))}
            </div>
          </QuestionnaireStep>
        )}

        {step === 4 && (
          <QuestionnaireStep question="What would you ideally like to spend per month?">
            <div className="grid grid-cols-2 gap-3">
              {BUDGET_OPTIONS.map((opt) => (
                <OptionButton
                  key={opt.value}
                  label={opt.label}
                  selected={budget === opt.value}
                  onClick={() => setBudget(opt.value)}
                />
              ))}
            </div>
          </QuestionnaireStep>
        )}

        {step === 5 && (
          <QuestionnaireStep question="What matters most to you?">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {PRIORITY_OPTIONS.map((opt) => (
                <OptionButton
                  key={opt.value}
                  label={opt.label}
                  selected={priority === opt.value}
                  onClick={() => setPriority(opt.value)}
                />
              ))}
            </div>
          </QuestionnaireStep>
        )}

        <div className="mt-8 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={goBack}
            disabled={step === 1}
            className={step === 1 ? "invisible" : ""}
          >
            Back
          </Button>
          <Button onClick={goNext} disabled={!canProceed()}>
            {step === TOTAL_STEPS ? "Show My Results" : "Next"}
          </Button>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-slate-400">
        We only ask what&apos;s needed to compare plans — no name, phone
        number or payment details required.
      </p>
    </div>
  );
}
