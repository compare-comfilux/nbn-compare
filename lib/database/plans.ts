import type { NbnPlan, Provider } from "@/types";
import plansData from "@/data/demo-plans/plans.json";
import providersData from "@/data/demo-plans/providers.json";

/**
 * Data access layer.
 *
 * For the MVP this reads from a static JSON seed file (demo data only).
 * The function signatures here are the seam for swapping in a real
 * database (Postgres/Supabase) later without touching callers — every
 * consumer of plan/provider data goes through these functions rather
 * than importing the JSON directly.
 */

export async function getAllPlans(): Promise<NbnPlan[]> {
  return (plansData as NbnPlan[]).filter((p) => p.active);
}

export async function getPlanBySlug(slug: string): Promise<NbnPlan | undefined> {
  const plans = await getAllPlans();
  return plans.find((p) => p.slug === slug);
}

export async function getAllProviders(): Promise<Provider[]> {
  return (providersData as Provider[]).filter((p) => p.active);
}

export async function getProviderBySlug(slug: string): Promise<Provider | undefined> {
  const providers = await getAllProviders();
  return providers.find((p) => p.slug === slug);
}

export async function getAllPlanSlugs(): Promise<string[]> {
  const plans = await getAllPlans();
  return plans.map((p) => p.slug);
}
