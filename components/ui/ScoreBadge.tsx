export default function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 80
      ? "bg-data-tint text-data-dark"
      : score >= 60
        ? "bg-amber-100 text-amber-800"
        : "bg-slate-100 text-slate-700";

  return (
    <div className="flex flex-col items-center">
      <span
        className={`inline-flex items-baseline gap-1 rounded-full px-4 py-2 font-bold ${color}`}
      >
        <span className="text-2xl">{score}</span>
        <span className="text-xs font-medium opacity-70">/ 100</span>
      </span>
      <span className="mt-1 text-xs text-slate-500">Our Score</span>
    </div>
  );
}
