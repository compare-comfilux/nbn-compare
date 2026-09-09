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
          ? "border-teal-700 bg-teal-50 text-teal-900"
          : "border-slate-200 bg-white text-slate-700 hover:border-teal-300 hover:bg-teal-50/50"
      }`}
    >
      <span className="flex items-center justify-between">
        {label}
        {selected && <span className="text-teal-700">&#10003;</span>}
      </span>
    </button>
  );
}
