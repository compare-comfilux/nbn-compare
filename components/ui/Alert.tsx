import type { ReactNode } from "react";

type Tone = "info" | "warning" | "neutral";

const TONE_CLASSES: Record<Tone, string> = {
  info: "bg-signal-tint border-signal/20 text-signal-dark",
  warning: "bg-amber-50 border-amber-200 text-amber-900",
  neutral: "bg-slate-50 border-slate-200 text-slate-700",
};

export default function Alert({
  children,
  tone = "info",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border px-4 py-3 text-sm leading-relaxed ${TONE_CLASSES[tone]} ${className}`}
      role="note"
    >
      {children}
    </div>
  );
}
