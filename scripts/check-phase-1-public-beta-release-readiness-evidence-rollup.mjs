import fs from "node:fs";

const docPath = "docs/PHASE_1_PUBLIC_BETA_RELEASE_READINESS_EVIDENCE_ROLLUP.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const requiredDocPhrases = [
  "phase_1_public_beta_release_readiness_evidence_rollup_ready",
  "GO_WITH_DEFERRALS_READY_FOR_OPERATOR_REVIEW",
  "Home first-screen decision hierarchy",
  "Public next reading flow",
  "check:home-first-screen-decision-hierarchy",
  "check:experience-flow-navigation",
  "check:public-visible-language-quality",
  "check:public-source-residue-scan",
  "check:public-surface-user-facing-audit",
  "check:public-beta-index-dashboard-brief-loop",
  "check:public-beta-membership-mvp-roadmap",
  "check:public-beta-mock-launch-proof-bundle",
  "check:phase-1-public-beta-mock-launch-candidate-status-summary",
  "check:phase-1-public-beta-candidate-final-public-readiness-scan",
  "check:a3-phase-1-public-beta-release-go-no-go-packet",
  "check:a3-phase-1-public-beta-release-ops-index",
  "check:a3-phase-1-public-beta-release-review-summary-for-chairman",
  "check:a3-phase-1-public-beta-deploy-smoke-rollback-closure",
  "check:a3-phase-1-public-beta-monitoring-and-repair-runbook",
  "A1 Data / Source / Coverage Deferrals",
  "A2 Trust / Legal / Public Copy Evidence",
  "A4 Membership MVP Path",
  "No SQL",
  "No Supabase read or write",
  "No `daily_prices` mutation",
  "No raw market data fetch, ingest, storage, logging, or commit",
  "No `publicDataSource=supabase`",
  "No `scoreSource=real`",
  "No investment advice claim",
  "No Phase 2 membership implementation",
  "continue_phase_1_release_operator_review_or_public_information_density_cleanup"
];

const requiredEvidenceFiles = [
  "docs/PHASE_1_PUBLIC_BETA_MOCK_LAUNCH_CANDIDATE_STATUS_SUMMARY.md",
  "docs/PHASE_1_PUBLIC_BETA_CANDIDATE_FINAL_PUBLIC_READINESS_SCAN.md",
  "docs/A3_PHASE_1_PUBLIC_BETA_RELEASE_GO_NO_GO_PACKET.md",
  "docs/A3_PHASE_1_PUBLIC_BETA_RELEASE_OPS_INDEX.md",
  "docs/A3_PHASE_1_PUBLIC_BETA_RELEASE_REVIEW_SUMMARY_FOR_CHAIRMAN.md",
  "docs/A3_PHASE_1_PUBLIC_BETA_DEPLOY_SMOKE_ROLLBACK_CLOSURE.md",
  "docs/A3_PHASE_1_PUBLIC_BETA_MONITORING_AND_REPAIR_RUNBOOK.md"
];

const doc = readText(docPath);
const packageJson = readText(packagePath);
const reviewGate = readText(reviewGatePath);

const missingDocPhrases = requiredDocPhrases.filter((phrase) => !doc.includes(phrase));
const missingEvidenceFiles = requiredEvidenceFiles.filter((path) => !fs.existsSync(path));
const missingEvidenceReferences = requiredEvidenceFiles.filter((path) => !doc.includes(path));
const packageRegistered = packageJson.includes(
  '"check:phase-1-public-beta-release-readiness-evidence-rollup": "node scripts/check-phase-1-public-beta-release-readiness-evidence-rollup.mjs"'
);
const reviewGateRegistered =
  reviewGate.includes("scripts/check-phase-1-public-beta-release-readiness-evidence-rollup.mjs") &&
  reviewGate.includes('"phase-1-public-beta-release-readiness-evidence-rollup"');
const forbiddenHits = findForbiddenHits(doc);

const status =
  missingDocPhrases.length === 0 &&
  missingEvidenceFiles.length === 0 &&
  missingEvidenceReferences.length === 0 &&
  packageRegistered &&
  reviewGateRegistered &&
  forbiddenHits.length === 0
    ? "ok"
    : "blocked";

console.log(
  JSON.stringify(
    {
      forbiddenHits,
      guardedStatus: "phase_1_public_beta_release_readiness_evidence_rollup_ready",
      missingDocPhrases,
      missingEvidenceFiles,
      missingEvidenceReferences,
      packageRegistered,
      publicDataSource: "mock",
      reviewGateRegistered,
      scoreSource: "mock",
      status
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

function findForbiddenHits(text) {
  const hits = [];
  if (/publicDataSource\s*=\s*["']supabase["']/u.test(text)) hits.push("publicDataSource assignment");
  if (/scoreSource\s*=\s*["']real["']/u.test(text)) hits.push("scoreSource assignment");
  if (/GO\s+WITH\s+REAL\s+DATA/iu.test(text)) hits.push("go-with-real-data-claim");
  if (/SQL execution is approved/iu.test(text)) hits.push("sql-approved");
  if (/Supabase writes are approved/iu.test(text)) hits.push("supabase-write-approved");
  if (/raw market data fetch is approved/iu.test(text)) hits.push("raw-fetch-approved");
  if (/investment advice is provided/iu.test(text)) hits.push("investment-advice-claim");
  if (/production deploy is approved/iu.test(text)) hits.push("production-deploy-approved");
  return hits;
}
