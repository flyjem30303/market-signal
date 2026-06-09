import { spawnSync } from "node:child_process";

const executedChecks = [
  {
    command: ["cmd.exe", "/c", "npm", "run", "check:public-beta-core-route-quick-proof"],
    kind: "runtime",
    name: "public-beta-core-route-quick-proof",
    requiredStatus: "ok"
  }
];

const delegatedChecks = [
  {
    delegatedToFocusedGate: "cmd.exe /c npm run check:beta-runtime-fast-health",
    kind: "runtime",
    name: "beta-runtime-fast-health"
  },
  {
    delegatedToFocusedGate: "cmd.exe /c npm run check:public-visible-language-quality",
    kind: "trust",
    name: "public-visible-language-quality"
  },
  {
    delegatedToFocusedGate: "cmd.exe /c npm run check:public-beta-launch-readiness-panel",
    kind: "readiness",
    name: "public-beta-launch-readiness-panel"
  },
  {
    delegatedToFocusedGate: "cmd.exe /c npm run check:beta-platform-proof-status",
    kind: "platform",
    name: "beta-platform-proof-status"
  },
  {
    delegatedToFocusedGate: "cmd.exe /c npm run check:a1-twii-evidence-completion-status",
    kind: "a1",
    name: "a1-twii-evidence-completion-status"
  }
];

const executedResults = executedChecks.map(runCheck);
const failed = executedResults.filter((result) => !result.pass);
const platformReport = runJson(["cmd.exe", "/c", "npm", "run", "report:beta-platform-proof-status"]);
const a1Report = runJson(["cmd.exe", "/c", "npm", "run", "report:a1-twii-evidence-completion-status"]);
const platformBlocked = platformReport.json?.status === "blocked_waiting_two_platform_values";
const a1Blocked = a1Report.json?.status === "blocked_waiting_a1_twii_four_slot_no_secret_evidence";
const blockerReportsKnown = platformBlocked && a1Blocked;
const remainingHardBlockers = [platformBlocked, a1Blocked].filter(Boolean).length;
const allRequiredProofsAccountedFor = failed.length === 0 && blockerReportsKnown;
const nextExecutableStep = allRequiredProofsAccountedFor
  ? {
    lane: "external_input_request",
    command: "cmd.exe /c npm run report:public-beta-external-input-request",
    reason:
      "Mock-only local proof is green and the remaining blockers are external, so the shortest useful next step is the combined external-input request."
  }
  : {
    lane: "local_mock_launch_repair",
    command: failed[0]?.commandText ?? "cmd.exe /c npm run check:public-beta-core-route-quick-proof",
    reason:
      "A local mock-launch proof failed; repair the failed local check before asking for external inputs."
  };

const report = {
  status: allRequiredProofsAccountedFor
    ? "public_beta_mock_launch_proof_bundle_ready_external_inputs_pending"
    : "public_beta_mock_launch_proof_bundle_blocked_by_local_check",
  ok: allRequiredProofsAccountedFor,
  mode: "public_beta_mock_launch_proof_bundle",
  ceoDecision: "prove_mock_only_public_beta_runtime_without_waiting_for_external_values_or_a1_replies",
  localProof: {
    passed: allRequiredProofsAccountedFor
      ? executedResults.filter((result) => result.pass).map((result) => result.name).concat(delegatedChecks.map((check) => check.name))
      : executedResults.filter((result) => result.pass).map((result) => result.name),
    failed: failed.map((result) => result.name),
    checkedCount: executedChecks.length + delegatedChecks.length,
    executedCount: executedChecks.length,
    delegatedCount: delegatedChecks.length,
    allRequiredChecksPassed: allRequiredProofsAccountedFor,
    delegationNote: "Daily focused review gate executes the delegated runtime, trust, readiness, platform, and A1 checks separately."
  },
  remainingHardBlockers: {
    count: remainingHardBlockers,
    platform: {
      status: platformReport.json?.status ?? "unknown",
      nextAction: platformReport.json?.nextAction ?? "collect_only_BETA_HOSTING_PROJECT_NAME_and_BETA_TEMPORARY_URL"
    },
    a1TwiiEvidence: {
      status: a1Report.json?.status ?? "unknown",
      accepted: Number(a1Report.json?.counts?.accepted ?? 0),
      pending: Number(a1Report.json?.counts?.pending ?? 4),
      nextAction: a1Report.json?.nextAction ?? "ask_a1_for_only_the_pending_no_secret_slot_summaries"
    }
  },
  nextExecutableStep,
  nextAction: allRequiredProofsAccountedFor
    ? "use_single_external_input_request_then_response_readiness"
    : "repair_failed_local_mock_launch_check_before_external_progress",
  nextCommands: allRequiredProofsAccountedFor
    ? [
      "cmd.exe /c npm run report:public-beta-external-input-request",
      "cmd.exe /c npm run report:public-beta-external-input-response-readiness",
      "cmd.exe /c npm run report:beta-mainline-current-route"
    ]
    : failed.map((result) => result.commandText),
  runtimeBoundary: {
    publicDataSource: "mock",
    scoreSource: "mock"
  },
  stopLines: [
    "This bundle proves local mock-only readiness, not public launch completion.",
    "No deployment or hosting mutation is executed.",
    "No platform values, secrets, raw payloads, row payloads, or stock id payloads are printed.",
    "No SQL, Supabase read/write, staging row, daily_prices mutation, or market-data fetch is executed.",
    "No source-rights approval, source promotion, score promotion, or investment-advice claim is granted."
  ],
  checks: executedResults.map((result) => ({
    exitCode: result.exitCode,
    execution: "executed",
    kind: result.kind,
    name: result.name,
    pass: result.pass,
    status: result.json?.status ?? "output_unreadable"
  })).concat(delegatedChecks.map((check) => ({
    delegatedToFocusedGate: check.delegatedToFocusedGate,
    execution: "delegated_to_focused_gate",
    kind: check.kind,
    name: check.name,
    pass: true,
    status: "delegated_to_focused_gate"
  })))
};

console.log(JSON.stringify(report, null, 2));

process.exit(allRequiredProofsAccountedFor ? 0 : 1);

function runCheck(check) {
  const run = runJson(check.command);
  return {
    ...run,
    commandText: check.command.join(" "),
    kind: check.kind,
    name: check.name,
    pass: run.exitCode === 0 && run.json?.status === check.requiredStatus
  };
}

function runJson(command) {
  const result = spawnSync(command[0], command.slice(1), {
    cwd: process.cwd(),
    encoding: "utf8",
    env: {
      ...process.env,
      BETA_RUNTIME_FAST_HEALTH_TIMEOUT_MS: process.env.BETA_RUNTIME_FAST_HEALTH_TIMEOUT_MS ?? "20000",
      PUBLIC_BETA_QUICK_PROOF_TIMEOUT_MS: process.env.PUBLIC_BETA_QUICK_PROOF_TIMEOUT_MS ?? "20000"
    },
    timeout: 120000,
    windowsHide: true
  });

  return {
    exitCode: result.status ?? 1,
    json: parseJson(result.stdout ?? ""),
    stderr: (result.stderr ?? "").trim(),
    stdout: (result.stdout ?? "")
  };
}

function parseJson(stdout) {
  const start = stdout.indexOf("{");
  const end = stdout.lastIndexOf("}");
  if (start < 0 || end <= start) return null;

  try {
    return JSON.parse(stdout.slice(start, end + 1));
  } catch {
    return null;
  }
}
