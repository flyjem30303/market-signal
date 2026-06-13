import fs from "node:fs";

const docPath = "docs/PHASE_1_PUBLIC_BETA_KEEP_OPEN_OR_REPAIR_DECISION.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const requiredPhrases = [
  "phase_1_public_beta_keep_open_or_repair_decision_ready_mock_only",
  "keep_open_repair_or_no_go_after_post_operator_smoke",
  "KEEP_OPEN_WITH_DEFERRALS",
  "REPAIR_THEN_RECHECK",
  "ROLLBACK_OR_NO_GO",
  "phase_1_public_beta_post_operator_smoke_packet_ready_mock_only",
  "a3_phase_1_public_beta_post_platform_action_report_template_ready",
  "phase_1_public_beta_operator_review_summary_ready_mock_only",
  "public_beta_phase_1_launch_gap_rollup_ready_mock_only",
  "a3_phase_1_public_beta_monitoring_and_repair_runbook_ready",
  "public visible residue cleanup passes",
  "development residue harms public trust",
  "cmd.exe /c npm run check:phase-1-public-beta-public-visible-residue-cleanup",
  "Accepted Deferrals For Keep-Open",
  "Repair Loop Rules",
  "Hard Stop Lines",
  "publicDataSource=mock",
  "scoreSource=mock",
  "publicDataSource=supabase",
  "scoreSource=real",
  "No SQL",
  "No Supabase write",
  "No raw market data fetch",
  "No investment advice or guaranteed-return language",
  "phase_1_public_beta_public_status_surface_alignment"
];

const requiredEvidencePaths = [
  "docs/PHASE_1_PUBLIC_BETA_POST_OPERATOR_SMOKE_PACKET.md",
  "docs/A3_PHASE_1_PUBLIC_BETA_POST_PLATFORM_ACTION_REPORT_TEMPLATE.md",
  "docs/PHASE_1_PUBLIC_BETA_OPERATOR_REVIEW_SUMMARY.md",
  "docs/PUBLIC_BETA_PHASE_1_LAUNCH_GAP_ROLLUP.md",
  "docs/A3_PHASE_1_PUBLIC_BETA_MONITORING_AND_REPAIR_RUNBOOK.md"
];

const doc = readText(docPath);
const packageJson = readText(packagePath);
const reviewGate = readText(reviewGatePath);

const missingPhrases = requiredPhrases.filter((phrase) => !doc.includes(phrase));
const missingEvidenceFiles = requiredEvidencePaths.filter((path) => !fs.existsSync(path));
const missingEvidenceReferences = requiredEvidencePaths.filter((path) => !doc.includes(path));
const packageRegistered = packageJson.includes(
  "\"check:phase-1-public-beta-keep-open-or-repair-decision\": \"node scripts/check-phase-1-public-beta-keep-open-or-repair-decision.mjs\""
);
const reviewGateRegistered = reviewGate.includes("scripts/check-phase-1-public-beta-keep-open-or-repair-decision.mjs");
const focusedGateRegistered = reviewGate.includes("\"phase-1-public-beta-keep-open-or-repair-decision\"");
const unsafeAllowHits = findUnsafeAllowHits(doc);

const status =
  missingPhrases.length === 0 &&
  missingEvidenceFiles.length === 0 &&
  missingEvidenceReferences.length === 0 &&
  packageRegistered &&
  reviewGateRegistered &&
  focusedGateRegistered &&
  unsafeAllowHits.length === 0
    ? "ok"
    : "blocked";

console.log(
  JSON.stringify(
    {
      status,
      guardedStatus: "phase_1_public_beta_keep_open_or_repair_decision_ready_mock_only",
      missingPhrases,
      missingEvidenceFiles,
      missingEvidenceReferences,
      packageRegistered,
      reviewGateRegistered,
      focusedGateRegistered,
      unsafeAllowHits,
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
  const keepOpenSection = sectionBetween(text, "`KEEP_OPEN_WITH_DEFERRALS`", "`REPAIR_THEN_RECHECK`");
  if (/publicDataSource=supabase/iu.test(keepOpenSection)) {
    hits.push("keep-open-allows-publicDataSource-supabase");
  }
  if (/scoreSource=real/iu.test(keepOpenSection)) {
    hits.push("keep-open-allows-scoreSource-real");
  }
  if (/raw market data fetch/iu.test(keepOpenSection)) {
    hits.push("keep-open-allows-raw-market-fetch");
  }
  return hits;
}

function sectionBetween(text, startMarker, endMarker) {
  const start = text.indexOf(startMarker);
  if (start === -1) return "";
  const end = text.indexOf(endMarker, start + startMarker.length);
  return end === -1 ? text.slice(start) : text.slice(start, end);
}
