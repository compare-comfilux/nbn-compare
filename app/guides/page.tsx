import type { Metadata } from "next";
import Link from "next/link";
import { buildMetadata } from "@/lib/seo/metadata";
import { GUIDES, GUIDE_TOPICS } from "@/data/guides";
import Card from "@/components/ui/Card";

export const metadata: Metadata = buildMetadata({
  title: "NBN Guides",
  description: "Plain-English guides to help you understand NBN speeds, technologies and plans.",
  path: "/guides",
});

export default function GuidesPage() {
  const availableTitles = new Set(GUIDES.map((g) => g.title));

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900">NBN Guides</h1>
      <p className="mt-4 text-slate-600">
        Plain-English guides to help you understand NBN speeds, technologies
        and how to choose a plan.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {GUIDE_TOPICS.map((topic) => {
          const guide = GUIDES.find((g) => g.title === topic);
          const isLive = availableTitles.has(topic) && guide;

          return (
            <Card key={topic} className="flex flex-col justify-between">
              <div>
                <h2 className="font-semibold text-slate-900">{topic}</h2>
                {guide && (
                  <p className="mt-2 text-sm text-slate-600">{guide.excerpt}</p>
                )}
              </div>
              <div className="mt-4">
                {isLive ? (
                  <Link
                    href={`/guides/${guide!.slug}`}
                    className="text-sm font-medium text-signal hover:underline"
                  >
                    Read guide →
                  </Link>
                ) : (
                  <span className="text-xs font-medium text-slate-400">
                    Coming soon
                  </span>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
