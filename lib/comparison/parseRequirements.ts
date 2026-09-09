import type {
  BudgetRange,
  CustomerRequirements,
  DeviceCount,
  HouseholdSize,
  Priority,
  UsageType,
} from "@/types";

const VALID_HOUSEHOLD: HouseholdSize[] = ["1", "2", "3-4", "5+"];
const VALID_DEVICES: DeviceCount[] = ["1-5", "6-10", "11-20", "20+"];
const VALID_BUDGET: BudgetRange[] = [
  "under_60",
  "60_80",
  "80_100",
  "100_120",
  "120_plus",
  "no_preference",
];
const VALID_PRIORITY: Priority[] = [
  "best_overall",
  "lowest_price",
  "fastest_speed",
  "best_gaming",
  "best_wfh",
  "best_families",
  "best_value",
];
const VALID_USAGE: UsageType[] = [
  "browsing",
  "streaming",
  "streaming_4k",
  "gaming",
  "wfh",
  "video_calls",
  "study",
  "large_downloads",
  "cloud_backup",
  "smart_home",
];

function pick<T extends string>(value: string | null, valid: T[], fallback: T): T {
  return value && (valid as string[]).includes(value) ? (value as T) : fallback;
}

/**
 * Parses questionnaire results from URL search params, falling back to
 * sensible defaults on missing or invalid input rather than erroring
 * (per spec section 36 — invalid questionnaire input must not break
 * the page).
 */
export function parseRequirements(
  searchParams: URLSearchParams
): CustomerRequirements {
  const usageRaw = searchParams.get("usage") ?? "";
  const usageTypes = usageRaw
    .split(",")
    .map((v) => v.trim())
    .filter((v): v is UsageType => (VALID_USAGE as string[]).includes(v));

  return {
    householdSize: pick(searchParams.get("household"), VALID_HOUSEHOLD, "2"),
    usageTypes: usageTypes.length > 0 ? usageTypes : ["browsing"],
    deviceCount: pick(searchParams.get("devices"), VALID_DEVICES, "1-5"),
    budget: pick(searchParams.get("budget"), VALID_BUDGET, "no_preference"),
    priority: pick(searchParams.get("priority"), VALID_PRIORITY, "best_overall"),
  };
}
