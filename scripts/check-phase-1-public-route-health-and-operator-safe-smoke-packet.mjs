import fs from "node:fs";

const docPath = "docs/PHASE_1_PUBLIC_ROUTE_HEALTH_AND_OPERATOR_SAFE_SMOKE_PACKET.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const requiredPhrases = [
  "phase_1_public_route_health_and_operator_safe_smoke_packet_ready",
  "Operator-Safe Pre-Action Checks",
  "Minimum Public Route Smoke",
  "Remote URL Smoke Pattern",
  "Public Claim Guards",
  "KEEP_OPEN_WITH_DEFERRALS",
  "REPAIR_THEN_RECHECK",
  "ROLLBACK_OR_NO_GO",
  "phase_1_public_beta_operator_safe_smoke_or_repair_decision",
  "check:a3-public-beta-minimum-launch-engineering-readiness",
  "check:a3-phase-1-metadata-and-public-route-smoke-checker",
  "check:public-visible-language-quality",
  "check:public-surface-user-facing-audit",
  "check:public-beta-core-route-quick-proof",
  "npm run dev:recover",
  "PUBLIC_BETA_QUICK_PROOF_BASE_URL",
  "publicDataSource=mock",
  "scoreSource=mock",
  "publicDataSource=supabase",
  "scoreSource=real",
  "PM mainline",
  "A1 data/source coverage",
  "A2 public trust copy",
  "A3 launch operations",
  "A4 membership MVP planning"
];

const requiredRoutes = [
  "/",
  "/briefing",
  "/weekly",
  "/membership",
  "/methodology",
  "/disclaimer",
  "/terms",
  "/privacy",
  "/stocks/TWII",
  "/stocks/2330",
  "/stocks/0050",
  "/robots.txt",
  "/sitemap.xml"
];

const doc = readText(docPath);
const pkg = readText(packagePath);
const reviewGate = readText(reviewGatePath);

const missingPhrases = requiredPhrases.filter((phrase) => !doc.includes(phrase));
const missingRoutes = requiredRoutes.filter((route) => !doc.includes(`\`${route}\``));
const packageRegistered = pkg.includes(
  '"check:phase-1-public-route-health-and-operator-safe-smoke-packet": "node scripts/check-phase-1-public-route-health-and-operator-safe-smoke-packet.mjs"'
);
const reviewGateRegistered = reviewGate.includes(
  "scripts/check-phase-1-public-route-health-and-operator-safe-smoke-packet.mjs"
);
const focusedGateRegistered = reviewGate.includes("phase-1-public-route-health-and-operator-safe-smoke-packet");
const unsafeAllowHits = findUnsafeAllowHits(doc);
const mojibakeHits = findMojibakeMarkers(doc);

const status =
  missingPhrases.length === 0 &&
  missingRoutes.length === 0 &&
  packageRegistered &&
  reviewGateRegistered &&
  focusedGateRegistered &&
  unsafeAllowHits.length === 0 &&
  mojibakeHits.length === 0
    ? "ok"
    : "blocked";

console.log(
  JSON.stringify(
    {
      status,
      guardedStatus: "phase_1_public_route_health_and_operator_safe_smoke_packet_ready",
      missingPhrases,
      missingRoutes,
      packageRegistered,
      reviewGateRegistered,
      focusedGateRegistered,
      unsafeAllowHits,
      mojibakeHits,
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    null,
    2
  )
);

if (status !== "ok") process.exitCode = 1;

function readText(path) {
  if (!fs.existsSync(path)) return "";
  return fs.readFileSync(path, "utf8");
}

function findUnsafeAllowHits(text) {
  const hits = [];
  const keepOpenSection = sectionBetween(text, "`KEEP_OPEN_WITH_DEFERRALS`:", "`REPAIR_THEN_RECHECK`:");
  if (/publicDataSource=supabase/iu.test(keepOpenSection)) {
    hits.push("keep-open-allows-publicDataSource-supabase");
  }
  if (/scoreSource=real/iu.test(keepOpenSection)) {
    hits.push("keep-open-allows-scoreSource-real");
  }
  if (/Supabase write/iu.test(keepOpenSection)) {
    hits.push("keep-open-allows-supabase-write");
  }
  if (/SQL/iu.test(keepOpenSection)) {
    hits.push("keep-open-allows-sql");
  }
  if (/raw market data/iu.test(keepOpenSection)) {
    hits.push("keep-open-allows-raw-market-data");
  }
  return hits;
}

function sectionBetween(text, startMarker, endMarker) {
  const start = text.indexOf(startMarker);
  if (start === -1) return "";
  const end = text.indexOf(endMarker, start + startMarker.length);
  return end === -1 ? text.slice(start) : text.slice(start, end);
}

function findMojibakeMarkers(source) {
  const markers = [];
  if (/\uFFFD/u.test(source)) markers.push("replacement-character");
  if (/[\uE000-\uF8FF]/u.test(source)) markers.push("private-use-codepoint");
  if (/\?{3,}/u.test(source)) markers.push("question-mark-run");
  return markers;
}
