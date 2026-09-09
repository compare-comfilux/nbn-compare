import type { MetadataRoute } from "next";
import { getAllPlanSlugs } from "@/lib/database/plans";
import { DEMO_GUIDES } from "@/data/demo-plans/guides";
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const planSlugs = await getAllPlanSlugs();

  const staticEntries = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const planEntries = planSlugs.map((slug) => ({
    url: `${SITE_URL}/plans/${slug}`,
    lastModified: new Date(),
  }));

  const guideEntries = DEMO_GUIDES.map((guide) => ({
    url: `${SITE_URL}/guides/${guide.slug}`,
    lastModified: new Date(),
  }));

  return [...staticEntries, ...planEntries, ...guideEntries];
}
