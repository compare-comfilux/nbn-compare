import type { Metadata } from "next";

const SITE_NAME = "Compare NBN";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://compare.comfilux.com.au";

interface PageMetaOptions {
  title: string;
  description: string;
  path?: string;
}

export function buildMetadata({
  title,
  description,
  path = "",
}: PageMetaOptions): Metadata {
  const url = `${SITE_URL}${path}`;
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_AU",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}

export { SITE_NAME, SITE_URL };
