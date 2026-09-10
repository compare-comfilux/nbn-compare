import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { GUIDES, getGuideBySlug } from "@/data/guides";
import Button from "@/components/ui/Button";

export async function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return buildMetadata({ title: "Guide not found", description: "" });

  return buildMetadata({
    title: guide.title,
    description: guide.excerpt,
    path: `/guides/${guide.slug}`,
  });
}

export default async function GuideDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  return (
    <article className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <Link href="/guides" className="text-sm text-teal-700 hover:underline">
        ← Back to guides
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-slate-900">{guide.title}</h1>
      <div className="prose prose-slate mt-6 max-w-none space-y-4 text-slate-700">
        {guide.body.map((para, i) => (
          <p key={i} className="leading-relaxed">
            {para}
          </p>
        ))}
      </div>
      <div className="mt-10">
        <Button href="/compare">Compare NBN Plans</Button>
      </div>
    </article>
  );
}
