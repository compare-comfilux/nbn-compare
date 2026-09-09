export default function PriceDisplay({
  monthlyPrice,
  introductoryPrice,
  introductoryPeriodMonths,
  ongoingPrice,
}: {
  monthlyPrice: number;
  introductoryPrice?: number | null;
  introductoryPeriodMonths?: number | null;
  ongoingPrice: number;
}) {
  const hasIntro = Boolean(introductoryPrice && introductoryPeriodMonths);
  const headlinePrice = hasIntro ? introductoryPrice : monthlyPrice;

  return (
    <div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-slate-900">
          ${headlinePrice}
        </span>
        <span className="text-sm text-slate-500">/month</span>
      </div>
      {hasIntro ? (
        <p className="mt-1 text-xs text-slate-500">
          Intro price for {introductoryPeriodMonths} months, then $
          {ongoingPrice}/month ongoing
        </p>
      ) : (
        <p className="mt-1 text-xs text-slate-500">Ongoing price, no discount period</p>
      )}
    </div>
  );
}
