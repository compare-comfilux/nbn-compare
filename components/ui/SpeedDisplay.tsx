export default function SpeedDisplay({
  downloadSpeed,
  uploadSpeed,
  uploadSpeedEstimated,
}: {
  downloadSpeed: number;
  uploadSpeed: number;
  uploadSpeedEstimated?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 text-sm">
      <div>
        <p className="font-semibold text-slate-900">{downloadSpeed} Mbps</p>
        <p className="text-slate-500">Download</p>
      </div>
      <div>
        <p className="font-semibold text-slate-900">
          {uploadSpeedEstimated ? "~" : ""}
          {uploadSpeed} Mbps
        </p>
        <p className="text-slate-500">
          Upload{uploadSpeedEstimated ? " (estimated)" : ""}
        </p>
      </div>
    </div>
  );
}
