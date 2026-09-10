import { cache } from "react";
import type { NbnPlan, Provider } from "@/types";
import { fetchNbnPlans } from "@/lib/external/ozbroadbandReview";

/**
 * Data access layer.
 *
 * Plan data is fetched live from the Oz Broadband Review API (see
 * lib/external/ozbroadbandReview.ts) and cached via Next.js's fetch
 * cache. `cache()` from React additionally de-duplicates calls within
 * a single request/render pass (e.g. generateMetadata + the page body
 * both asking for the same plan).
 *
 * Every consumer of plan/provider data goes through these functions
 * rather than calling the external client directly, so the source can
 * change later (e.g. adding a second provider feed, or a real
 * database) without touching callers.
 */

export const getAllPlans = cache(async (): Promise<NbnPlan[]> => {
  const plans = await fetchNbnPlans();
  return plans.filter((p) => p.active);
});

export async function getPlanBySlug(slug: string): Promise<NbnPlan | undefined> {
  const plans = await getAllPlans();
  return plans.find((p) => p.slug === slug);
}

export async function getAllPlanSlugs(): Promise<string[]> {
  const plans = await getAllPlans();
  return plans.map((p) => p.slug);
}

export async function getAllProviders(): Promise<Provider[]> {
  const plans = await getAllPlans();
  const byId = new Map<string, Provider>();
  for (const plan of plans) {
    if (!byId.has(plan.providerId)) {
      byId.set(plan.providerId, {
        id: plan.providerId,
        name: plan.provider,
        slug: plan.providerId,
      });
    }
  }
  return Array.from(byId.values());
}

export async function getProviderBySlug(slug: string): Promise<Provider | undefined> {
  const providers = await getAllProviders();
  return providers.find((p) => p.slug === slug);
}
