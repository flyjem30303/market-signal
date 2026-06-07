import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const reviewsDir = path.join(process.cwd(), "docs", "reviews");
const reviewedArtifacts = listReviewedArtifacts();
const acceptedArtifacts = reviewedArtifacts.filter((filePath) => read(filePath).includes("Status: `accepted`"));
const rejectedOrBlockedArtifacts = reviewedArtifacts.filter((filePath) => {
  const source = read(filePath);
  return source.includes("Status: `rejected`") || source.includes("Status: `blocked`");
});

if (acceptedArtifacts.length === 0) {
  print({
    status:
      rejectedOrBlockedArtifacts.length > 0
        ? "rejected_or_blocked_reviewed_artifact_requires_repair"
        : "blocked_waiting_accepted_reviewed_artifact",
    ok: false,
    candidateAllowed: false,
    deploymentAuthorized: false,
    runtimeBoundary: {
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    reviewedArtifactCount: reviewedArtifacts.length,
    acceptedArtifactCount: 0,
    rejectedOrBlockedArtifactCount: rejectedOrBlockedArtifacts.length,
    nextRoute:
      rejectedOrBlockedArtifacts.length > 0
        ? "repair_packet_window_reviewed_artifact"
        : "keep_waiting_for_safe_two_values_and_pm_accepted_review",
    notes: [
      "No accepted packet-window reviewed artifact exists.",
      "No pre-execution packet candidate was rendered.",
      "No deployment, SQL, Supabase write, market-data fetch, public source promotion, or real score promotion is authorized."
    ]
  });
  process.exit(0);
}

const selectedArtifactPath = acceptedArtifacts.at(-1);
const selectedArtifact = read(selectedArtifactPath);
const artifactProblems = validateAcceptedArtifact(selectedArtifact, selectedArtifactPath);

if (artifactProblems.length > 0) {
  print({
    status: "accepted_reviewed_artifact_boundary_invalid",
    ok: false,
    candidateAllowed: false,
    deploymentAuthorized: false,
    runtimeBoundary: {
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    reviewedArtifact: normalizePath(selectedArtifactPath),
    problems: artifactProblems,
    nextRoute: "repair_accepted_reviewed_artifact_boundary",
    notes: [
      "An accepted artifact exists, but it does not preserve the required no-deployment mock boundary.",
      "No pre-execution packet candidate was rendered.",
      "No deployment, SQL, Supabase write, market-data fetch, public source promotion, or real score promotion is authorized."
    ]
  });
  process.exit(1);
}

const gitBranch = runGit(["branch", "--show-current"]) || "unknown";
const gitCommit = runGit(["rev-parse", "--short", "HEAD"]) || "unknown";
const gitStatus = runGit(["status", "--short"]);
const worktreeState = gitStatus ? "dirty_requires_pm_review" : "clean";
const hostingProjectName = extractBulletValue(selectedArtifact, "Hosting project name recorded by validator");
const temporaryBetaUrl = extractBulletValue(selectedArtifact, "Temporary Beta URL recorded by validator");

print({
  status: "pre_execution_packet_candidate_ready_not_authorized",
  ok: true,
  candidateAllowed: true,
  deploymentAuthorized: false,
  publicDataSource: "mock",
  scoreSource: "mock",
  selectedReviewedArtifact: normalizePath(selectedArtifactPath),
  sourceBranch: gitBranch,
  sourceCommit: gitCommit,
  worktreeState,
  platformValues: {
    hostingProjectName,
    temporaryBetaUrl
  },
  routeHealthTargets: [
    "/",
    "/briefing",
    "/weekly",
    "/stocks/2330",
    "/stocks/TWII",
    "/disclaimer",
    "/terms",
    "/privacy",
    "/methodology"
  ],
  operatorPlaceholders: {
    rollbackOwner: "TBD_ROLLBACK_OWNER",
    rollbackReference: "TBD_ROLLBACK_REFERENCE",
    incidentOwner: "TBD_INCIDENT_OWNER",
    firstResponseChannel: "TBD_FIRST_RESPONSE_CHANNEL",
    environmentVariableOwner: "TBD_ENV_OWNER_NO_VALUES",
    secretInputOwner: "TBD_SECRET_OWNER_NO_VALUES"
  },
  postRunReviewPath: "docs/reviews/BETA_DEPLOYMENT_POST_RUN_REVIEW_TBD.md",
  hardStops: [
    "no_production_deployment",
    "no_preview_deployment",
    "no_deployment_command_execution",
    "no_hosting_project_creation_or_mutation",
    "no_dns_or_ssl_change",
    "no_platform_env_mutation",
    "no_secret_output",
    "no_sql_execution",
    "no_supabase_connection_or_write",
    "no_daily_prices_mutation",
    "no_market_data_fetch_ingest_store_or_commit",
    "no_publicDataSource_supabase",
    "no_scoreSource_real",
    "no_investment_advice_claim",
    "no_public_launch_completion_claim"
  ],
  nextRoute: "pm_creates_separate_execution_review_packet_candidate",
  notes: [
    "This is a local pre-execution candidate only.",
    "Deployment remains unauthorized.",
    "No deployment, SQL, Supabase write, market-data fetch, public source promotion, or real score promotion is authorized."
  ]
});

function listReviewedArtifacts() {
  if (!fs.existsSync(reviewsDir)) return [];
  return fs
    .readdirSync(reviewsDir)
    .filter((fileName) => /^BETA_PACKET_WINDOW_REVIEWED_ARTIFACT_\d{4}-\d{2}-\d{2}(?:_\d{2})?\.md$/u.test(fileName))
    .sort()
    .map((fileName) => path.join(reviewsDir, fileName));
}

function validateAcceptedArtifact(source, filePath) {
  const problems = [];
  for (const phrase of [
    "publicDataSource: `mock`",
    "scoreSource: `mock`",
    "Deployment authorized: `false`",
    "No deployment command execution.",
    "No `publicDataSource=supabase`.",
    "No `scoreSource=real`."
  ]) {
    if (!source.includes(phrase)) problems.push(`${normalizePath(filePath)} missing boundary phrase: ${phrase}`);
  }
  return problems;
}

function extractBulletValue(source, label) {
  const pattern = new RegExp(`- ${escapeRegExp(label)}: \`([^\\n\`]+)\``, "u");
  return pattern.exec(source)?.[1] ?? "not_recorded";
}

function runGit(args) {
  const result = spawnSync("git", args, {
    cwd: process.cwd(),
    encoding: "utf8",
    timeout: 30000,
    windowsHide: true
  });
  if ((result.status ?? 1) !== 0) return "";
  return (result.stdout ?? "").trim();
}

function read(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function normalizePath(filePath) {
  return path.relative(process.cwd(), filePath).replaceAll(path.sep, "/");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
}

function print(payload) {
  console.log(JSON.stringify(payload, null, 2));
}
