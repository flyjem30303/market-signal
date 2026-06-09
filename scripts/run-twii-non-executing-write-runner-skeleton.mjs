import { spawnSync } from "node:child_process";

const CONFIRMATION = "CEO_PM_ACK_TWII_NON_EXECUTING_WRITE_RUNNER_SKELETON_ONLY";
const args = parseArgs(process.argv.slice(2));
const problems = [];

const boundary = runJson(["scripts/report-twii-write-gate-runner-boundary.mjs"]);
if (boundary.status !== "twii_write_gate_runner_boundary_ready_local_only") {
  problems.push("runner_boundary_not_ready");
}

const packetPath = args["packet-path"];
const executeRequested = args.execute === "true" || args.execute === true;
const confirmationMatched = args.confirmation === CONFIRMATION;

let packetValidation = null;
if (!packetPath) {
  problems.push("blocked_missing_packet_path");
} else {
  packetValidation = runJson(["scripts/report-twii-supabase-write-gate-packet-template.mjs", "--packet-path", packetPath]);
  if (packetValidation.status !== "twii_supabase_write_gate_packet_template_ready_local_only") {
    problems.push("packet_shape_not_accepted");
  }
}

if (!executeRequested) problems.push("blocked_missing_execute_switch");
if (!confirmationMatched) problems.push("blocked_missing_confirmation_phrase");

const reachedSkeletonStopLine =
  problems.length === 0 &&
  boundary.status === "twii_write_gate_runner_boundary_ready_local_only" &&
  packetValidation?.status === "twii_supabase_write_gate_packet_template_ready_local_only" &&
  executeRequested &&
  confirmationMatched;

const status = reachedSkeletonStopLine
  ? "blocked_non_executing_skeleton_only"
  : problems[0] ?? "blocked";

const output = {
  status,
  outcome: reachedSkeletonStopLine ? "fail_closed_before_real_write" : "blocked",
  mode: "twii_non_executing_write_runner_skeleton",
  owner: "CEO/PM",
  packetPath: packetPath ?? null,
  executeSwitchPresent: executeRequested,
  confirmationMatched,
  upstream: {
    runnerBoundaryStatus: boundary.status ?? null,
    packetValidationStatus: packetValidation?.status ?? null
  },
  credentialHandling: {
    credentialValuesRead: false,
    credentialValuesPrinted: false,
    serviceRoleBrowserAllowed: false,
    futureCredentialPresenceCheckOnly: true
  },
  currentBoundary: {
    runnerExecutableNow: false,
    sqlExecutableNow: false,
    supabaseConnectionAllowedNow: false,
    supabaseWriteAllowedNow: false,
    dailyPricesMutationAllowedNow: false,
    candidateRowsAcceptedNow: false,
    rowCoverageScoringAllowedNow: false,
    publicPromotionAllowedNow: false,
    scoreSourceRealAllowedNow: false
  },
  nextAction: reachedSkeletonStopLine
    ? "Prepare a separate implementation review gate before adding any Supabase client or credential access."
    : "Repair the missing local precondition; this skeleton still cannot execute a write.",
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlExecuted: false,
    supabaseClientImported: false,
    supabaseConnectionAttempted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    marketDataFetched: false,
    marketDataIngested: false,
    candidateRowsAccepted: false,
    dailyPricesMutated: false,
    stagingRowsCreated: false,
    rowCoverageScoringAllowed: false,
    rawPayloadOutput: false,
    rowPayloadOutput: false,
    stockIdPayloadOutput: false,
    secretsOutput: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  },
  problems
};

console.log(JSON.stringify(output, null, 2));
process.exitCode = reachedSkeletonStopLine ? 0 : 1;

function runJson(runArgs) {
  const result = spawnSync(process.execPath, runArgs, {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });
  try {
    return JSON.parse(result.stdout ?? "{}");
  } catch {
    problems.push(`${runArgs[0]} did not return JSON`);
    return {};
  }
}

function parseArgs(rawArgs) {
  const parsed = {};
  for (let index = 0; index < rawArgs.length; index += 1) {
    const current = rawArgs[index];
    if (!current.startsWith("--")) continue;
    const key = current.slice(2);
    const next = rawArgs[index + 1];
    if (next && !next.startsWith("--")) {
      parsed[key] = next;
      index += 1;
    } else {
      parsed[key] = true;
    }
  }
  return parsed;
}

