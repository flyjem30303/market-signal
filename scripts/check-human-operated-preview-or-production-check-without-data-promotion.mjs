import fs from "node:fs";

const docPath = "docs/HUMAN_OPERATED_PREVIEW_OR_PRODUCTION_CHECK_WITHOUT_DATA_PROMOTION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const requiredPhrases = [
  "human_operated_preview_or_production_check_without_data_promotion_ready",
  "READY_FOR_HUMAN_OPERATED_PREVIEW_OR_PRODUCTION_CHECK_WITH_MOCK_BOUNDARY",
  "Before Opening Vercel",
  "Human Operator Steps",
  "Remote Smoke Command",
  "Manual Route Checks",
  "Public Claim Checks",
  "Allowed Operator Reply",
  "KEEP_OPEN_WITH_DEFERRALS",
  "REPAIR_THEN_RECHECK",
  "ROLLBACK_OR_NO_GO",
  "record_human_operated_preview_or_production_check_reply_or_continue_public_runtime",
  "check:phase-1-public-beta-operator-safe-smoke-or-repair-decision",
  "check:phase-1-public-route-health-and-operator-safe-smoke-packet",
  "check:a3-public-beta-minimum-launch-engineering-readiness",
  "check:public-visible-language-quality",
  "check:public-surface-user-facing-audit",
  "check:public-beta-core-route-quick-proof",
  "PUBLIC_BETA_QUICK_PROOF_BASE_URL",
  "actionTaken=<none|preview_check|production_check|rollback>",
  "publicDataSource=mock",
  "scoreSource=mock",
  "publicDataSource=supabase",
  "scoreSource=real",
  "No SQL",
  "No Supabase read/write",
  "No raw market data fetch",
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
const packageJson = readText(packagePath);
const reviewGate = readText(reviewGatePath);

const missingPhrases = requiredPhrases.filter((phrase) => !doc.includes(phrase));
const missingRoutes = requiredRoutes.filter((route) => !doc.includes(`/${route.replace(/^\//u, "")}`));
const packageRegistered = packageJson.includes(
  '"check:human-operated-preview-or-production-check-without-data-promotion": "node scripts/check-human-operated-preview-or-production-check-without-data-promotion.mjs"'
);
const reviewGateRegistered = reviewGate.includes(
  "scripts/check-human-operated-preview-or-production-check-without-data-promotion.mjs"
);
const focusedGateRegistered = reviewGate.includes("human-operated-preview-or-production-check-without-data-promotion");
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
      guardedStatus: "human_operated_preview_or_production_check_without_data_promotion_ready",
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
  if (/publicDataSource=supabase/iu.test(keepOpenSection)) hits.push("keep-open-allows-publicDataSource-supabase");
  if (/scoreSource=real/iu.test(keepOpenSection)) hits.push("keep-open-allows-scoreSource-real");
  if (/Supabase read\/write/iu.test(keepOpenSection)) hits.push("keep-open-allows-supabase-read-write");
  if (/SQL/iu.test(keepOpenSection)) hits.push("keep-open-allows-sql");
  if (/raw market data/iu.test(keepOpenSection)) hits.push("keep-open-allows-raw-market-data");
  const replySection = sectionBetween(text, "## Allowed Operator Reply", "## Decision Outcomes");
  if (/\binclude environment values\b/iu.test(replySection.replace(/Do not include environment values/giu, ""))) {
    hits.push("operator-reply-may-include-env-values");
  }
  if (/secret query strings/iu.test(replySection)) hits.push("operator-reply-may-include-secret-query");
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
