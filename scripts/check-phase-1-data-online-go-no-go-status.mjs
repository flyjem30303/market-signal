import { spawnSync } from "node:child_process";
import fs from "node:fs";

const docPath = "docs/PHASE_1_DATA_ONLINE_GO_NO_GO_STATUS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const publicBetaReportPath = "scripts/report-public-beta-data-realification-next-action.mjs";
const twiiOperatorReportPath = "scripts/report-twii-final-operator-authorization-packet-preflight.mjs";

const problems = [];

const doc = readText(docPath);
const packageJson = JSON.parse(readText(packagePath));
const reviewGate = readText(reviewGatePath);
const publicBetaReport = runJson(publicBetaReportPath);
const twiiOperatorReport = runJson(twiiOperatorReportPath);

for (const phrase of [
  "phase_1_data_online_go_no_go_status_ready_no_go",
  "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO",
  "NO_GO_FOR_DATA_ONLINE",
  "Level 1 coverage is still `182/360`",
  "Missing Level 1 rows remain `178/360`",
  "TWII can add `60` rows",
  "ETF coverage still has `118` missing rows",
  "publicDataSource=mock",
  "scoreSource=mock",
  "check:twse-openapi-runtime-mock-consumer-wire",
  "report:twii-final-operator-authorization-packet-preflight",
  "authorizationDecisionAcceptedNow=false",
  "runnerExecutableNow=false",
  "writeGateExecutableNow=false",
  "phase_1_data_online_no_go_status_then_prepare_bounded_write_decision"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

if (
  packageJson.scripts?.["check:phase-1-data-online-go-no-go-status"] !==
  "node scripts/check-phase-1-data-online-go-no-go-status.mjs"
) {
  problems.push(`${packagePath} missing check:phase-1-data-online-go-no-go-status`);
}

if (!reviewGate.includes("scripts/check-phase-1-data-online-go-no-go-status.mjs")) {
  problems.push(`${reviewGatePath} missing checker command`);
}

if (!reviewGate.includes('"phase-1-data-online-go-no-go-status"')) {
  problems.push(`${reviewGatePath} missing focused gate name`);
}

const expectedCoverage = {
  fullLevel1ExpectedRows: 360,
  fullLevel1ObservedRows: 182,
  fullLevel1MissingRows: 178,
  twEquityObservedRows: 180,
  twEquityExpectedRows: 180,
  twiiMissingRows: 60,
  etfMissingRows: 118
};

for (const [key, value] of Object.entries(expectedCoverage)) {
  if (publicBetaReport.coverage?.[key] !== value) {
    problems.push(`public beta coverage ${key} must be ${value}`);
  }
}

if (publicBetaReport.sourceBoundary?.publicDataSource !== "mock") {
  problems.push("publicDataSource must remain mock");
}

if (publicBetaReport.sourceBoundary?.scoreSource !== "mock") {
  problems.push("scoreSource must remain mock");
}

if (publicBetaReport.sourceBoundary?.realDataDisplayActive !== false) {
  problems.push("realDataDisplayActive must be false");
}

if (publicBetaReport.sourceBoundary?.realScoreActive !== false) {
  problems.push("realScoreActive must be false");
}

if (twiiOperatorReport.operatorAuthorizationPacketState?.authorizationDecisionAcceptedNow !== false) {
  problems.push("TWII authorizationDecisionAcceptedNow must remain false");
}

if (twiiOperatorReport.operatorAuthorizationPacketState?.runnerExecutableNow !== false) {
  problems.push("TWII runnerExecutableNow must remain false");
}

if (twiiOperatorReport.operatorAuthorizationPacketState?.writeGateExecutableNow !== false) {
  problems.push("TWII writeGateExecutableNow must remain false");
}

for (const [key, value] of Object.entries(publicBetaReport.hardStops ?? {})) {
  if (value !== false) problems.push(`hardStops.${key} must be false`);
}

for (const pattern of [
  /sb_secret_/u,
  /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
  /executeSwitchValue/u,
  /confirmationPhraseValue/u,
  /rowBody/u,
  /rawPayload/u,
  /buySellHoldSignal/u,
  /guaranteed return/iu
]) {
  if (pattern.test(doc)) problems.push(`${docPath} contains forbidden pattern ${pattern}`);
}

const status = problems.length === 0 ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      status,
      guardedStatus: "phase_1_data_online_go_no_go_status_ready_no_go",
      decision: "PUBLIC_RUNTIME_READY_BUT_DATA_ONLINE_NO_GO",
      coverage: expectedCoverage,
      publicDataSource: publicBetaReport.sourceBoundary?.publicDataSource,
      scoreSource: publicBetaReport.sourceBoundary?.scoreSource,
      twiiExecutionAllowedNow: twiiOperatorReport.operatorAuthorizationPacketState?.executionAllowedNow,
      problems
    },
    null,
    2
  )
);

if (status !== "ok") process.exit(1);

function readText(path) {
  if (!fs.existsSync(path)) {
    problems.push(`missing ${path}`);
    return "{}";
  }

  return fs.readFileSync(path, "utf8");
}

function runJson(scriptPath) {
  const run = spawnSync(process.execPath, [scriptPath], {
    encoding: "utf8",
    maxBuffer: 1024 * 1024 * 2
  });

  if (run.status !== 0) problems.push(`${scriptPath} exited ${run.status}`);

  try {
    return JSON.parse(run.stdout);
  } catch {
    problems.push(`${scriptPath} did not emit JSON`);
    return {};
  }
}
