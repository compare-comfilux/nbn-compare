import type { MetadataRoute } from "next";
import { getAllPlanSlugs } from "@/lib/database/plans";
import { GUIDES } from "@/data/guides";
import { SITE_URL } from "@/lib/seo/metadata";

const STATIC_ROUTES = [
  "",
  "/compare",
  "/compare/by-speed",
  "/guides",
  "/how-it-works",
  "/methodology",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/disclaimer",
];

// Plan data is live and fetched from an external API — don't attempt
// this at build time. Rendered on demand when a crawler requests it.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const guideEntries = GUIDES.map((guide) => ({
    url: `${SITE_URL}/guides/${guide.slug}`,
    lastModified: new Date(),
  }));

  let planEntries: MetadataRoute.Sitemap = [];
  try {
    const planSlugs = await getAllPlanSlugs();
    planEntries = planSlugs.map((slug) => ({
      url: `${SITE_URL}/plans/${slug}`,
      lastModified: new Date(),
    }));
  } catch {
    // If the upstream plans API is temporarily unavailable, still serve
    // a valid sitemap for the static and guide pages rather than 500ing.
  }

  return [...staticEntries, ...planEntries, ...guideEntries];
}
