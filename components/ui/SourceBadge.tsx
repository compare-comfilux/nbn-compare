export default function SourceBadge({
  sourceName,
  sourceUrl,
}: {
  sourceName: string;
  sourceUrl: string;
}) {
  return (
    <span className="text-xs text-slate-500">
      Source:{" "}
      <a
        href={sourceUrl}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="underline hover:text-slate-700"
      >
        {sourceName}
      </a>
    </span>
  );
}
