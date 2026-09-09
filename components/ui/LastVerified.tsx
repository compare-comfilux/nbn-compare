export default function LastVerified({ date }: { date: string }) {
  const formatted = new Date(date).toLocaleDateString("en-AU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <span className="text-xs text-slate-500">Data checked {formatted}</span>
  );
}
