import type { NbnPlan } from "@/types";

/**
 * Oz Broadband Review public plans API.
 *
 * Docs: https://www.ozbroadbandreview.com/plans-api.php
 * Endpoint: https://www.ozbroadbandreview.com/api/plans.php
 *
 * Free, no API key, CORS-open, CC BY 4.0 licensed. In exchange for use,
 * their terms require a visible, do-follow attribution link back to
 * Oz Broadband Review wherever this data is displayed — see
 * OBBR_ATTRIBUTION below and components/ui/DataAttribution.tsx, which is
 * rendered site-wide in the footer and again next to plan listings.
 *
 * IMPORTANT — what this feed does NOT give us:
 * - No distinct upload speed field (only a single `speed_mbps`). We parse
 *   an upload figure from the plan name when the provider publishes one
 *   (e.g. "100/40"), and otherwise fall back to a coarse estimate based on
 *   standard nbn wholesale tiers — always flagged via `uploadSpeedEstimated`.
 * - No modem, "pros/cons" or "suitable for" editorial content. We do not
 *   invent any of that; see lib/comparison/describePlan.ts for the
 *   objective, rule-based descriptors we compute instead.
 * - `review_url` points to Oz Broadband Review's own review page for that
 *   provider, not the provider's own website — labelled accordingly in the UI.
 */

const OBBR_API_URL = "https://www.ozbroadbandreview.com/api/plans.php";

export const OBBR_ATTRIBUTION = {
  text: "Broadband plan data by Oz Broadband Review",
  url: "https://www.ozbroadbandreview.com/",
};

// Cache the upstream response for an hour. Their fair-use guidance says
// daily is plenty; hourly keeps us comfortably under their 300 req/hour
// limit while giving noticeably fresher data than a daily refresh.
const REVALIDATE_SECONDS = 3600;

interface RawPlan {
  provider: string;
  provider_slug: string;
  plan_name: string;
  technology: string;
  sub_technology: string;
  speed_mbps: number;
  monthly_cost_aud: number;
  intro_cost_aud: number | null;
  intro_months: number | null;
  promo_code: string | null;
  data: string;
  contract_months: number;
  setup_fee_aud: number;
  type: string;
  last_updated: string;
  review_url: string;
}

interface RawResponse {
  meta: { count: number; generated_at: string };
  plans: RawPlan[];
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Standard nbn wholesale basic-tier upload speeds, used only as a
 * fallback estimate when a plan name doesn't publish its own upload
 * figure (e.g. "NBN 100/40"). Real plans vary — some providers sell
 * enhanced-upload variants of the same download tier — so this is
 * intentionally conservative and always flagged as an estimate.
 */
function estimateUploadSpeed(downloadSpeed: number): number {
  if (downloadSpeed <= 25) return 5;
  if (downloadSpeed <= 50) return 20;
  if (downloadSpeed <= 100) return 20;
  if (downloadSpeed <= 250) return 25;
  if (downloadSpeed <= 1000) return 50;
  return 100;
}

function deriveUploadSpeed(
  planName: string,
  downloadSpeed: number
): { uploadSpeed: number; uploadSpeedEstimated: boolean } {
  const match = planName.match(/(\d+)\s*\/\s*(\d+)/);
  if (match) {
    const upload = Number(match[2]);
    if (Number.isFinite(upload) && upload > 0 && upload < downloadSpeed) {
      return { uploadSpeed: upload, uploadSpeedEstimated: false };
    }
  }
  return {
    uploadSpeed: estimateUploadSpeed(downloadSpeed),
    uploadSpeedEstimated: true,
  };
}

function mapContractType(months: number): string {
  if (months === 0) return "No lock-in";
  if (months === 12) return "12 months";
  if (months === 24) return "24 months";
  return `${months} months`;
}

/** Rule-based, objective feature list — computed from published fields only. */
function buildFeatures(raw: RawPlan): string[] {
  const features: string[] = [];
  if (raw.contract_months === 0) features.push("No lock-in contract");
  if (raw.data?.toLowerCase() === "unlimited") features.push("Unlimited data");
  if (raw.setup_fee_aud === 0) features.push("No setup fee");
  if (raw.intro_cost_aud && raw.intro_months) {
    features.push(`Intro price for ${raw.intro_months} months`);
  }
  if (raw.promo_code) features.push("Promo code available");
  return features;
}

function transformPlan(raw: RawPlan, usedSlugs: Set<string>): NbnPlan {
  const providerId = raw.provider_slug || slugify(raw.provider);
  const baseSlug = `${providerId}-${slugify(raw.plan_name)}`;
  let slug = baseSlug;
  let suffix = 2;
  while (usedSlugs.has(slug)) {
    slug = `${baseSlug}-${suffix++}`;
  }
  usedSlugs.add(slug);

  const { uploadSpeed, uploadSpeedEstimated } = deriveUploadSpeed(
    raw.plan_name,
    raw.speed_mbps
  );

  const ongoingPrice = raw.monthly_cost_aud;

  return {
    id: slug,
    providerId,
    provider: raw.provider,
    planName: raw.plan_name,
    slug,

    monthlyPrice: ongoingPrice,
    introductoryPrice: raw.intro_cost_aud ?? undefined,
    introductoryPeriodMonths: raw.intro_months ?? undefined,
    ongoingPrice,

    downloadSpeed: raw.speed_mbps,
    uploadSpeed,
    uploadSpeedEstimated,

    dataAllowance: raw.data || "Unlimited",

    contractType: mapContractType(raw.contract_months),
    setupFee: raw.setup_fee_aud ?? 0,

    technology: raw.technology || "NBN",
    subTechnology: raw.sub_technology || "Not specified",

    promoCode: raw.promo_code ?? undefined,

    features: buildFeatures(raw),

    sourceUrl: raw.review_url,
    sourceName: "Oz Broadband Review",
    lastVerified: raw.last_updated,

    active: true,
  };
}

/**
 * Fetches and transforms the live residential NBN plan catalogue.
 * Cached via Next.js's fetch cache (shared across serverless
 * invocations on Vercel), so this rarely hits the upstream API
 * directly even under real traffic.
 */
export async function fetchNbnPlans(): Promise<NbnPlan[]> {
  const url = `${OBBR_API_URL}?technology=NBN&type=Residential&limit=1000`;

  const res = await fetch(url, {
    next: { revalidate: REVALIDATE_SECONDS },
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Oz Broadband Review API error: ${res.status}`);
  }

  const data: RawResponse = await res.json();
  const usedSlugs = new Set<string>();

  return data.plans
    .filter((p) => p.speed_mbps > 0 && p.monthly_cost_aud > 0)
    .map((raw) => transformPlan(raw, usedSlugs));
}
