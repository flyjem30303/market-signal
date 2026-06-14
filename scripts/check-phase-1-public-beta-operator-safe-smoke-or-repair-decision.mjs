import fs from "node:fs";

const docPath = "docs/PHASE_1_PUBLIC_BETA_OPERATOR_SAFE_SMOKE_OR_REPAIR_DECISION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const requiredPhrases = [
  "phase_1_public_beta_operator_safe_smoke_or_repair_decision_ready",
  "operator_safe_smoke_ready_or_repair_before_platform_action",
  "READY_FOR_HUMAN_OPERATED_PREVIEW_OR_PRODUCTION_CHECK_WITH_MOCK_BOUNDARY",
  "REPAIR_THEN_RECHECK",
  "NO_GO_BEFORE_PLATFORM_ACTION",
  "a3_public_beta_minimum_launch_engineering_ready",
  "phase_1_public_route_health_and_operator_safe_smoke_packet_ready",
  "a3_phase_1_metadata_and_public_route_smoke_checker_ready",
  "status=ok",
  "TypeScript",
  "Build",
  "publicDataSource=mock",
  "scoreSource=mock",
  "publicDataSource=supabase",
  "scoreSource=real",
  "cmd.exe /c npm run dev:recover",
  "prepare_human_operated_preview_or_production_check_without_data_promotion",
  "PM mainline",
  "A1 data/source coverage",
  "A2 public trust copy",
  "A3 launch operations",
  "A4 membership MVP planning",
  "No SQL",
  "No Supabase read/write",
  "No raw market data fetch"
];

const requiredEvidencePaths = [
  "docs/A3_PUBLIC_BETA_MINIMUM_LAUNCH_ENGINEERING_READINESS.md",
  "docs/PHASE_1_PUBLIC_ROUTE_HEALTH_AND_OPERATOR_SAFE_SMOKE_PACKET.md",
  "docs/A3_PHASE_1_METADATA_AND_PUBLIC_ROUTE_SMOKE_CHECKER.md",
  "docs/PHASE_1_PUBLIC_BETA_POST_OPERATOR_SMOKE_PACKET.md",
  "docs/PHASE_1_PUBLIC_BETA_KEEP_OPEN_OR_REPAIR_DECISION.md"
];

const doc = readText(docPath);
const packageJson = readText(packagePath);
const reviewGate = readText(reviewGatePath);

const missingPhrases = requiredPhrases.filter((phrase) => !doc.includes(phrase));
const missingEvidenceFiles = requiredEvidencePaths.filter((path) => !fs.existsSync(path));
const missingEvidenceReferences = requiredEvidencePaths.filter((path) => !doc.includes(path));
const packageRegistered = packageJson.includes(
  '"check:phase-1-public-beta-operator-safe-smoke-or-repair-decision": "node scripts/check-phase-1-public-beta-operator-safe-smoke-or-repair-decision.mjs"'
);
const reviewGateRegistered = reviewGate.includes(
  "scripts/check-phase-1-public-beta-operator-safe-smoke-or-repair-decision.mjs"
);
const focusedGateRegistered = reviewGate.includes("phase-1-public-beta-operator-safe-smoke-or-repair-decision");
const unsafeAllowHits = findUnsafeAllowHits(doc);
const mojibakeHits = findMojibakeMarkers(doc);

const status =
  missingPhrases.length === 0 &&
  missingEvidenceFiles.length === 0 &&
  missingEvidenceReferences.length === 0 &&
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
      guardedStatus: "phase_1_public_beta_operator_safe_smoke_or_repair_decision_ready",
      decision: "READY_FOR_HUMAN_OPERATED_PREVIEW_OR_PRODUCTION_CHECK_WITH_MOCK_BOUNDARY",
      missingPhrases,
      missingEvidenceFiles,
      missingEvidenceReferences,
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
  const readySection = sectionBetween(
    text,
    "`READY_FOR_HUMAN_OPERATED_PREVIEW_OR_PRODUCTION_CHECK_WITH_MOCK_BOUNDARY`",
    "`REPAIR_THEN_RECHECK`"
  );
  if (/publicDataSource=supabase/iu.test(readySection)) hits.push("ready-allows-publicDataSource-supabase");
  if (/scoreSource=real/iu.test(readySection)) hits.push("ready-allows-scoreSource-real");
  if (/Supabase write/iu.test(readySection)) hits.push("ready-allows-supabase-write");
  if (/SQL/iu.test(readySection)) hits.push("ready-allows-sql");
  if (/raw market data/iu.test(readySection)) hits.push("ready-allows-raw-market-data");
  if (/production deployment is approved/iu.test(text)) hits.push("approves-production-deployment");
  if (/DNS change is approved/iu.test(text)) hits.push("approves-dns-change");
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
