import type { CustomerRequirements } from "@/types";

const HOUSEHOLD_LABEL: Record<CustomerRequirements["householdSize"], string> = {
  "1": "1-person household",
  "2": "2-person household",
  "3-4": "3–4 person household",
  "5+": "5+ person household",
};

const USAGE_LABEL: Record<string, string> = {
  browsing: "browsing",
  streaming: "streaming",
  streaming_4k: "4K streaming",
  gaming: "gaming",
  wfh: "working from home",
  video_calls: "video calls",
  study: "study",
  large_downloads: "large downloads",
  cloud_backup: "cloud backup",
  smart_home: "smart home devices",
};

const BUDGET_LABEL: Record<CustomerRequirements["budget"], string> = {
  under_60: "budget under $60/month",
  "60_80": "budget $60–$80/month",
  "80_100": "budget $80–$100/month",
  "100_120": "budget $100–$120/month",
  "120_plus": "budget $120+/month",
  no_preference: "no strict budget",
};

export function summariseRequirements(requirements: CustomerRequirements): string {
  const usage = requirements.usageTypes
    .map((u) => USAGE_LABEL[u] ?? u)
    .join(" + ");

  return `${HOUSEHOLD_LABEL[requirements.householdSize]} • ${usage} • ${BUDGET_LABEL[requirements.budget]}`;
}
