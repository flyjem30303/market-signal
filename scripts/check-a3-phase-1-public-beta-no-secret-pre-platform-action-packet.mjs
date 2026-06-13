import fs from "node:fs";

const docPath = "docs/A3_PHASE_1_PUBLIC_BETA_NO_SECRET_PRE_PLATFORM_ACTION_PACKET.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const requiredPhrases = [
  "a3_phase_1_public_beta_no_secret_pre_platform_action_packet_ready",
  "READY_FOR_NO_SECRET_OPERATOR_PRE_PLATFORM_ACTION",
  "one-page operator entrypoint",
  "chairman/operator decision is `GO` or `GO_WITH_DEFERRALS`",
  "phase_1_public_beta_chairman_visual_acceptance_recorded",
  "phase_1_public_beta_candidate_final_public_readiness_scan_ready",
  "phase_1_public_beta_human_visual_review_ready",
  "a3_phase_1_public_beta_manual_platform_action_checklist_ready",
  "a3_phase_1_public_beta_post_platform_action_report_template_ready",
  "docs/PHASE_1_PUBLIC_BETA_CHAIRMAN_VISUAL_ACCEPTANCE_RECORD.md",
  "docs/PHASE_1_PUBLIC_BETA_VISUAL_ACCEPTANCE_AND_A3_HANDOFF.md",
  "docs/PHASE_1_PUBLIC_BETA_CANDIDATE_FINAL_PUBLIC_READINESS_SCAN.md",
  "docs/PHASE_1_PUBLIC_BETA_HUMAN_VISUAL_REVIEW.md",
  "docs/A3_PHASE_1_PUBLIC_BETA_MANUAL_PLATFORM_ACTION_CHECKLIST.md",
  "docs/A3_NO_SECRET_PRODUCTION_ENV_AND_ROLLBACK_CHECKLIST.md",
  "docs/A3_PHASE_1_PUBLIC_BETA_POST_PLATFORM_ACTION_REPORT_TEMPLATE.md",
  "cmd.exe /c npm run check:phase-1-public-beta-chairman-visual-acceptance-record",
  "cmd.exe /c npm run check:phase-1-public-beta-visual-acceptance-and-a3-handoff",
  "cmd.exe /c npm run check:phase-1-public-beta-candidate-final-public-readiness-scan",
  "cmd.exe /c npm run check:phase-1-public-beta-human-visual-review",
  "cmd.exe /c npm run check:a3-phase-1-public-beta-manual-platform-action-checklist",
  "cmd.exe /c npm run check:a3-phase-1-public-beta-post-platform-action-report-template",
  "cmd.exe /c npm run check:a3-phase-1-public-beta-no-secret-pre-platform-action-packet",
  "cmd.exe /c npm run check:pm-brief-runtime-mainline-goal-and-workstreams",
  "cmd.exe /c npx tsc --noEmit",
  "cmd.exe /c npm run build",
  "No-Secret Platform Action Summary",
  "Operator Safe Reply Shape",
  "`actionTaken`",
  "`publicUrl`",
  "`deploymentLabel`",
  "`envNamesPresent`",
  "`routeSmoke`",
  "`claimSmoke`",
  "`rollbackReady`",
  "`nextRoute`",
  "fill_post_platform_report",
  "repair_then_recheck",
  "no_action",
  "phase_1_public_beta_operator_action_or_no_action_safe_reply",
  "No SQL",
  "No Supabase write",
  "No platform env value output",
  "No private dashboard URL output",
  "No `publicDataSource=supabase`",
  "No `scoreSource=real`"
];

const requiredFiles = [
  "docs/PHASE_1_PUBLIC_BETA_CHAIRMAN_VISUAL_ACCEPTANCE_RECORD.md",
  "docs/PHASE_1_PUBLIC_BETA_VISUAL_ACCEPTANCE_AND_A3_HANDOFF.md",
  "docs/PHASE_1_PUBLIC_BETA_CANDIDATE_FINAL_PUBLIC_READINESS_SCAN.md",
  "docs/PHASE_1_PUBLIC_BETA_HUMAN_VISUAL_REVIEW.md",
  "docs/A3_PHASE_1_PUBLIC_BETA_MANUAL_PLATFORM_ACTION_CHECKLIST.md",
  "docs/A3_NO_SECRET_PRODUCTION_ENV_AND_ROLLBACK_CHECKLIST.md",
  "docs/A3_PHASE_1_PUBLIC_BETA_POST_PLATFORM_ACTION_REPORT_TEMPLATE.md"
];

const forbiddenPatterns = [
  /publicDataSource\s*=\s*["']supabase["']/u,
  /scoreSource\s*=\s*["']real["']/u,
  /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
  /SQL execution is approved/iu,
  /Supabase writes are approved/iu,
  /raw market data fetch is approved/iu,
  /investment advice is provided/iu
];

const doc = readText(docPath);
const packageJson = readText(packagePath);
const reviewGate = readText(reviewGatePath);

const missingPhrases = requiredPhrases.filter((phrase) => !doc.includes(phrase));
const missingFiles = requiredFiles.filter((path) => !fs.existsSync(path));
const missingFileReferences = requiredFiles.filter((path) => !doc.includes(path));
const forbiddenHits = forbiddenPatterns
  .map((pattern) => pattern.exec(doc)?.[0])
  .filter(Boolean);
const packageRegistered = packageJson.includes(
  '"check:a3-phase-1-public-beta-no-secret-pre-platform-action-packet": "node scripts/check-a3-phase-1-public-beta-no-secret-pre-platform-action-packet.mjs"'
);
const reviewGateRegistered = reviewGate.includes(
  "scripts/check-a3-phase-1-public-beta-no-secret-pre-platform-action-packet.mjs"
);
const focusedGateRegistered = reviewGate.includes('"a3-phase-1-public-beta-no-secret-pre-platform-action-packet"');
const status =
  missingPhrases.length === 0 &&
  missingFiles.length === 0 &&
  missingFileReferences.length === 0 &&
  forbiddenHits.length === 0 &&
  packageRegistered &&
  reviewGateRegistered &&
  focusedGateRegistered
    ? "ok"
    : "blocked";

console.log(
  JSON.stringify(
    {
      status,
      guardedStatus: "a3_phase_1_public_beta_no_secret_pre_platform_action_packet_ready",
      missingPhrases,
      missingFiles,
      missingFileReferences,
      forbiddenHits,
      packageRegistered,
      reviewGateRegistered,
      focusedGateRegistered,
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
