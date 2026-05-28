"use client";

import { useEffect } from "react";
import { trackEvent, type TrackingEventName, type TrackingPayload } from "@/lib/tracking";

type PageViewTrackerProps = {
  eventName: TrackingEventName;
  payload?: TrackingPayload;
};

export function PageViewTracker({ eventName, payload = {} }: PageViewTrackerProps) {
  useEffect(() => {
    trackEvent(eventName, payload);
  }, [eventName, payload]);

  return null;
}
