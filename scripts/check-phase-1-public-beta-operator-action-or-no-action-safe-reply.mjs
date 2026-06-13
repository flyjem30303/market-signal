import fs from "node:fs";

const docPath = "docs/PHASE_1_PUBLIC_BETA_OPERATOR_ACTION_OR_NO_ACTION_SAFE_REPLY.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const requiredPhrases = [
  "phase_1_public_beta_operator_action_or_no_action_safe_reply_recorded",
  "NO_PLATFORM_ACTION_RECORDED_AFTER_PRE_PLATFORM_PACKET",
  "a3_phase_1_public_beta_no_secret_pre_platform_action_packet_ready",
  "a3_phase_1_public_beta_manual_platform_action_checklist_ready",
  "phase_1_public_beta_operator_safe_reply_template_ready",
  "phase_1_public_beta_operator_safe_reply_pm_intake_recorder_ready",
  "a3_phase_1_public_beta_post_platform_action_report_template_ready",
  "phase_1_public_beta_chairman_visual_acceptance_recorded",
  "docs/A3_PHASE_1_PUBLIC_BETA_NO_SECRET_PRE_PLATFORM_ACTION_PACKET.md",
  "docs/A3_PHASE_1_PUBLIC_BETA_MANUAL_PLATFORM_ACTION_CHECKLIST.md",
  "docs/PHASE_1_PUBLIC_BETA_OPERATOR_SAFE_REPLY_TEMPLATE.md",
  "docs/PHASE_1_PUBLIC_BETA_OPERATOR_SAFE_REPLY_PM_INTAKE_RECORDER.md",
  "docs/A3_PHASE_1_PUBLIC_BETA_POST_PLATFORM_ACTION_REPORT_TEMPLATE.md",
  "docs/PHASE_1_PUBLIC_BETA_CHAIRMAN_VISUAL_ACCEPTANCE_RECORD.md",
  "operatorSafeReplyStatus: ready_for_pm_review",
  "actionTaken: none",
  "actionResult: not_run",
  "publicUrl: pending",
  "deploymentLabel: pending",
  "routeSmoke: not_run",
  "claimSmoke: not_run",
  "publicDataSource: mock",
  "scoreSource: mock",
  "ACCEPT_NO_ACTION_RECORD",
  "no post-platform report should be filled because no platform action occurred",
  "No platform deploy",
  "No SQL",
  "No Supabase write",
  "No post-platform report fill",
  "No `publicDataSource=supabase`",
  "No `scoreSource=real`",
  "check:phase-1-public-beta-operator-action-or-no-action-safe-reply",
  "check:a3-phase-1-public-beta-no-secret-pre-platform-action-packet",
  "check:phase-1-public-beta-operator-safe-reply-template",
  "check:phase-1-public-beta-operator-safe-reply-pm-intake-recorder",
  "NO_ACTION_ACCEPTED_RETURN_TO_PM_MAINLINE",
  "phase_1_public_beta_pm_mainline_or_reenter_a3_pre_platform_packet"
];

const requiredFiles = [
  "docs/A3_PHASE_1_PUBLIC_BETA_NO_SECRET_PRE_PLATFORM_ACTION_PACKET.md",
  "docs/A3_PHASE_1_PUBLIC_BETA_MANUAL_PLATFORM_ACTION_CHECKLIST.md",
  "docs/PHASE_1_PUBLIC_BETA_OPERATOR_SAFE_REPLY_TEMPLATE.md",
  "docs/PHASE_1_PUBLIC_BETA_OPERATOR_SAFE_REPLY_PM_INTAKE_RECORDER.md",
  "docs/A3_PHASE_1_PUBLIC_BETA_POST_PLATFORM_ACTION_REPORT_TEMPLATE.md",
  "docs/PHASE_1_PUBLIC_BETA_CHAIRMAN_VISUAL_ACCEPTANCE_RECORD.md"
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
  '"check:phase-1-public-beta-operator-action-or-no-action-safe-reply": "node scripts/check-phase-1-public-beta-operator-action-or-no-action-safe-reply.mjs"'
);
const reviewGateRegistered = reviewGate.includes(
  "scripts/check-phase-1-public-beta-operator-action-or-no-action-safe-reply.mjs"
);
const focusedGateRegistered = reviewGate.includes('"phase-1-public-beta-operator-action-or-no-action-safe-reply"');
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
      guardedStatus: "phase_1_public_beta_operator_action_or_no_action_safe_reply_recorded",
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
