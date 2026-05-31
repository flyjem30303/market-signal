export type TrackingEventName =
  | "asset_selected"
  | "favorite_added"
  | "favorite_removed"
  | "tab_changed"
  | "stock_page_viewed"
  | "briefing_page_viewed"
  | "disclaimer_page_viewed"
  | "methodology_page_viewed"
  | "privacy_page_viewed"
  | "terms_page_viewed"
  | "weekly_page_viewed"
  | "news_date_changed";

export type TrackingPayload = Record<string, string | number | boolean | null | undefined>;

type TrackingEventRecord = {
  name: TrackingEventName;
  payload: TrackingPayload;
  timestamp: string;
};

declare global {
  interface Window {
    __marketSignalEvents?: TrackingEventRecord[];
  }
}

export function trackEvent(name: TrackingEventName, payload: TrackingPayload = {}) {
  if (typeof window === "undefined") return;

  const event = {
    name,
    payload,
    timestamp: new Date().toISOString()
  };

  window.__marketSignalEvents = [...(window.__marketSignalEvents ?? []), event].slice(-50);
  console.info("[tracking]", event);
}
