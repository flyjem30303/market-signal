export type TrackingEventName =
  | "asset_selected"
  | "asset_search_changed"
  | "asset_search_cleared"
  | "asset_group_changed"
  | "favorite_added"
  | "favorite_removed"
  | "tab_changed"
  | "chart_mode_changed"
  | "home_page_viewed"
  | "home_cta_clicked"
  | "nav_link_clicked"
  | "site_chrome_link_clicked"
  | "trust_link_clicked"
  | "commercial_disclosure_link_clicked"
  | "stock_page_viewed"
  | "stock_link_clicked"
  | "briefing_page_viewed"
  | "briefing_link_clicked"
  | "disclaimer_page_viewed"
  | "methodology_page_viewed"
  | "privacy_page_viewed"
  | "terms_page_viewed"
  | "weekly_page_viewed"
  | "weekly_link_clicked"
  | "news_date_changed";

export type TrackingPayload = Record<string, string | number | boolean | null | undefined>;

export type TrackingEventRecord = {
  name: TrackingEventName;
  payload: TrackingPayload;
  timestamp: string;
};

export const trackingEventBufferLimit = 100;
export const trackingEventDomEventName = "market-signal:tracking";

declare global {
  interface Window {
    __marketSignalEvents?: TrackingEventRecord[];
  }
}

export function trackEvent(name: TrackingEventName, payload: TrackingPayload = {}) {
  if (typeof window === "undefined") return;

  const event = {
    name,
    payload: cleanTrackingPayload(payload),
    timestamp: new Date().toISOString()
  };

  window.__marketSignalEvents = [...(window.__marketSignalEvents ?? []), event].slice(-trackingEventBufferLimit);

  try {
    window.dispatchEvent(new CustomEvent<TrackingEventRecord>(trackingEventDomEventName, { detail: event }));
  } catch {
    // Tracking must never break the user flow.
  }

  console.info("[tracking]", event);
}

function cleanTrackingPayload(payload: TrackingPayload): TrackingPayload {
  return Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined)) as TrackingPayload;
}
