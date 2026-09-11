"use client";

import { useState } from "react";
import { getProviderDomain } from "@/lib/providers/providerDomains";

/**
 * Shows a provider's real logo, sourced live from their official
 * domain — we don't store or fabricate logo files ourselves.
 *
 * How it resolves, in order:
 * 1. If NEXT_PUBLIC_LOGO_DEV_KEY is set (a free logo.dev account —
 *    see .env.example) and we have a verified domain for this
 *    provider: fetch a proper logo image via logo.dev.
 * 2. Otherwise, if we have a verified domain: fetch that domain's own
 *    favicon via Google's public favicon service (no key needed, but
 *    lower visual quality than a full logo).
 * 3. If we don't have a verified domain for this provider, or the
 *    image fails to load, fall back to a deterministic initials
 *    avatar so the UI never shows a broken image.
 */

const PALETTE = [
  "#5B4EF0",
  "#0E8A72",
  "#D97706",
  "#DB2777",
  "#2563EB",
  "#16A34A",
  "#7C3AED",
  "#0891B2",
];

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function InitialsAvatar({ name, size }: { name: string; size: number }) {
  const color = PALETTE[hashString(name) % PALETTE.length];
  return (
    <span
      aria-hidden
      className="inline-flex shrink-0 items-center justify-center rounded-full font-bold text-white"
      style={{
        backgroundColor: color,
        width: size,
        height: size,
        fontSize: Math.max(10, size * 0.38),
      }}
    >
      {getInitials(name)}
    </span>
  );
}

export default function ProviderLogo({
  name,
  size = 28,
}: {
  name: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);
  const domain = getProviderDomain(name);

  if (!domain || failed) {
    return <InitialsAvatar name={name} size={size} />;
  }

  const logoDevKey = process.env.NEXT_PUBLIC_LOGO_DEV_KEY;
  const src = logoDevKey
    ? `https://img.logo.dev/${domain}?token=${logoDevKey}&size=${size * 2}&format=png`
    : `https://www.google.com/s2/favicons?domain=${domain}&sz=${size * 2}`;

  return (
    // eslint-disable-next-line @next/next/no-img-element -- external, unpredictable-domain logo images; next/image optimization isn't applicable here
    <img
      src={src}
      alt={`${name} logo`}
      width={size}
      height={size}
      className="shrink-0 rounded-full bg-white object-contain ring-1 ring-slate-100"
      style={{ width: size, height: size }}
      onError={() => setFailed(true)}
    />
  );
}
