import { OBBR_ATTRIBUTION } from "@/lib/external/ozbroadbandReview";

/**
 * Required attribution for the Oz Broadband Review plans API. Their
 * license requires a visible, do-follow link back wherever this data
 * is displayed — do not add rel="nofollow" here, and do not remove
 * this component from pages that show plan data (results, plan
 * detail pages) or from the site footer.
 */
export default function DataAttribution({ className = "" }: { className?: string }) {
  return (
    <p className={`text-xs text-slate-400 ${className}`}>
      Plan data by{" "}
      <a
        href={OBBR_ATTRIBUTION.url}
        target="_blank"
        rel="noopener"
        className="underline hover:text-slate-600"
      >
        Oz Broadband Review
      </a>
      . Checked roughly weekly — always confirm pricing and availability with
      the provider before signing up.
    </p>
  );
}
