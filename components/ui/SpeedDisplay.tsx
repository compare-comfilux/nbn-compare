export default function SpeedDisplay({
  downloadSpeed,
  uploadSpeed,
  typicalEveningSpeed,
}: {
  downloadSpeed: number;
  uploadSpeed: number;
  typicalEveningSpeed?: number;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 text-sm">
      <div>
        <p className="font-semibold text-slate-900">{downloadSpeed} Mbps</p>
        <p className="text-slate-500">Download</p>
      </div>
      <div>
        <p className="font-semibold text-slate-900">{uploadSpeed} Mbps</p>
        <p className="text-slate-500">Upload</p>
      </div>
      {typicalEveningSpeed !== undefined && (
        <div className="col-span-2">
          <p className="text-slate-500">
            Typical evening speed:{" "}
            <span className="font-medium text-slate-700">
              {typicalEveningSpeed} Mbps
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
