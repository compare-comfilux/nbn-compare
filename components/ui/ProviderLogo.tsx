// The plans API doesn't provide logo images, and we won't hotlink or
// fabricate trademarked provider logos from an unverified source. This
// renders a small, consistent "initials avatar" instead — a common,
// safe pattern for identifying a provider at a glance without a real
// logo asset. Colour is deterministically derived from the provider
// name, so the same provider always gets the same colour across the site.

const PALETTE = [
  "#5B4EF0", // signal
  "#0E8A72", // data
  "#D97706", // amber
  "#DB2777", // pink
  "#2563EB", // blue
  "#16A34A", // green
  "#7C3AED", // violet
  "#0891B2", // cyan
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

export default function ProviderLogo({
  name,
  size = 28,
}: {
  name: string;
  size?: number;
}) {
  const color = PALETTE[hashString(name) % PALETTE.length];
  const initials = getInitials(name);

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
      {initials}
    </span>
  );
}
