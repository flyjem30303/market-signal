import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const trackingSource = readFileSync("src/lib/tracking.ts", "utf8");
const trackingDocs = readFileSync("docs/TRACKING_EVENTS.md", "utf8");
const sourceFiles = listSourceFiles("src");

const typeMatch = trackingSource.match(/export type TrackingEventName =([\s\S]*?);/);

if (!typeMatch) {
  fail("TrackingEventName union not found");
}

const typeEvents = [...typeMatch[1].matchAll(/\|\s+"([^"]+)"/g)].map((match) => match[1]).sort();
const docEvents = [...trackingDocs.matchAll(/(?:^|\n)\|\s+`([^`]+)`\s+\|/g)]
  .map((match) => match[1])
  .filter((eventName) => eventName !== "Event")
  .sort();
const usedEvents = findUsedEvents(sourceFiles).sort();

const missingFromDocs = typeEvents.filter((eventName) => !docEvents.includes(eventName));
const missingFromType = docEvents.filter((eventName) => !typeEvents.includes(eventName));
const usedMissingFromDocs = usedEvents.filter((eventName) => !docEvents.includes(eventName));
const usedMissingFromType = usedEvents.filter((eventName) => !typeEvents.includes(eventName));
const documentedButUnused = docEvents.filter((eventName) => !usedEvents.includes(eventName));
const duplicates = findDuplicates(docEvents);

if (typeEvents.length === 0) {
  fail("No tracking events found in TrackingEventName union");
}

if (
  missingFromDocs.length ||
  missingFromType.length ||
  usedMissingFromDocs.length ||
  usedMissingFromType.length ||
  documentedButUnused.length ||
  duplicates.length
) {
  fail("Tracking events are out of sync", {
    documentedButUnused,
    duplicates,
    missingFromDocs,
    missingFromType,
    usedMissingFromDocs,
    usedMissingFromType
  });
}

console.log(
  JSON.stringify(
    {
      eventCount: typeEvents.length,
      usedEventCount: usedEvents.length,
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

function findUsedEvents(files) {
  const events = new Set();

  for (const file of files) {
    const source = readFileSync(file, "utf8");
    collectMatches(source, /trackEvent\(\s*"([^"]+)"/g, events);
    collectConditionalTrackEventMatches(source, events);
    collectMatches(source, /eventName="([^"]+)"/g, events);
    collectMatches(source, /eventName:\s*"([^"]+)"/g, events);
  }

  return [...events];
}

function collectMatches(source, pattern, events) {
  for (const match of source.matchAll(pattern)) {
    events.add(match[1]);
  }
}

function collectConditionalTrackEventMatches(source, events) {
  for (const match of source.matchAll(/trackEvent\(\s*[^?]+?\?\s*"([^"]+)"\s*:\s*"([^"]+)"/g)) {
    events.add(match[1]);
    events.add(match[2]);
  }
}

function listSourceFiles(directory) {
  const entries = readdirSync(directory);
  const files = [];

  for (const entry of entries) {
    const path = join(directory, entry);
    const stat = statSync(path);

    if (stat.isDirectory()) {
      files.push(...listSourceFiles(path));
      continue;
    }

    if (/\.(ts|tsx)$/.test(path)) {
      files.push(path);
    }
  }

  return files;
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
