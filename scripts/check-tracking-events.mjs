import { readFileSync } from "node:fs";

const trackingSource = readFileSync("src/lib/tracking.ts", "utf8");
const trackingDocs = readFileSync("docs/TRACKING_EVENTS.md", "utf8");

const typeMatch = trackingSource.match(/export type TrackingEventName =([\s\S]*?);/);

if (!typeMatch) {
  fail("TrackingEventName union not found");
}

const typeEvents = [...typeMatch[1].matchAll(/\|\s+"([^"]+)"/g)].map((match) => match[1]).sort();
const docEvents = [...trackingDocs.matchAll(/(?:^|\n)\|\s+`([^`]+)`\s+\|/g)]
  .map((match) => match[1])
  .filter((eventName) => eventName !== "Event")
  .sort();

const missingFromDocs = typeEvents.filter((eventName) => !docEvents.includes(eventName));
const missingFromType = docEvents.filter((eventName) => !typeEvents.includes(eventName));
const duplicates = findDuplicates(docEvents);

if (typeEvents.length === 0) {
  fail("No tracking events found in TrackingEventName union");
}

if (missingFromDocs.length || missingFromType.length || duplicates.length) {
  fail("Tracking events are out of sync", {
    duplicates,
    missingFromDocs,
    missingFromType
  });
}

console.log(
  JSON.stringify(
    {
      eventCount: typeEvents.length,
      status: "ok"
    },
    null,
    2
  )
);

function findDuplicates(items) {
  const seen = new Set();
  const duplicates = new Set();

  for (const item of items) {
    if (seen.has(item)) duplicates.add(item);
    seen.add(item);
  }

  return [...duplicates].sort();
}

function fail(message, detail = {}) {
  console.error(
    JSON.stringify(
      {
        detail,
        message,
        status: "blocked"
      },
      null,
      2
    )
  );
  process.exit(1);
}
