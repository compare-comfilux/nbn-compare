// Lightweight Google Analytics (GA4) event helper.
//
// Does nothing unless NEXT_PUBLIC_GA_ID is set and gtag has loaded
// (see components/layout/Analytics.tsx). Never collects personal
// information — only anonymous product-usage events.

export type AnalyticsEvent =
  | "page_view"
  | "comparison_started"
  | "comparison_completed"
  | "filter_used"
  | "plan_viewed"
  | "compare_plans"
  | "cta_clicked";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(
  event: AnalyticsEvent,
  params: Record<string, string | number | boolean | undefined> = {}
) {
  if (typeof window === "undefined") return;
  if (!process.env.NEXT_PUBLIC_GA_ID) return;
  window.gtag?.("event", event, params);
}
