export default function OptionButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`w-full rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors ${
        selected
          ? "border-signal bg-signal-tint text-signal-dark"
          : "border-slate-200 bg-white text-slate-700 hover:border-signal/40 hover:bg-signal-tint/60"
      }`}
    >
      <span className="flex items-center justify-between">
        {label}
        {selected && <span className="text-signal">&#10003;</span>}
      </span>
    </button>
  );
}
