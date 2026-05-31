"use client";

import type { ReactNode } from "react";
import { trackEvent, type TrackingEventName, type TrackingPayload } from "@/lib/tracking";

type TrackedLinkProps = {
  children: ReactNode;
  className?: string;
  eventName: TrackingEventName;
  href: string;
  label: string;
  payload?: TrackingPayload;
};

export function TrackedLink({ children, className, eventName, href, label, payload = {} }: TrackedLinkProps) {
  return (
    <a
      className={className}
      href={href}
      onClick={() =>
        trackEvent(eventName, {
          href,
          label,
          ...payload
        })
      }
    >
      {children}
    </a>
  );
}
