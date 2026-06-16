import { spawnSync } from "node:child_process";

const args = parseArgs(process.argv.slice(2));
const candidateArtifactPath =
  args.candidateArtifact ?? process.env.PHASE_1_SANITIZED_ROW_PAYLOAD_CANDIDATE_PATH ?? null;

const checks = [
  {
    id: "row_payload_pm_review",
    args: [
      "scripts/run-phase-1-row-payload-candidate-pm-review-once.mjs",
      "--candidate-artifact",
      candidateArtifactPath
    ],
    requiredStatus: "phase_1_row_payload_candidate_pm_review_ready_for_separate_write_review"
  },
  {
    id: "operator_boolean_review",
    args: ["scripts/check-phase-1-final-operator-boolean-reviewed-result.mjs"],
    requiredGuardedStatus: "phase_1_final_operator_boolean_reviewed_result_ready_no_values"
  },
  {
    id: "write_gate_preflight",
    args: ["scripts/check-phase-1-write-gate-preflight-after-operator-booleans.mjs"],
    requiredGuardedStatus: "phase_1_write_gate_preflight_after_operator_booleans_ready_no_execution"
  },
  {
    id: "execution_packet_draft",
    args: ["scripts/check-phase-1-write-gate-execution-packet-draft-no-execution.mjs"],
    requiredGuardedStatus: "phase_1_write_gate_execution_packet_draft_no_execution_ready"
  },
  {
    id: "fail_closed_runner_stub",
    args: ["scripts/check-phase-1-write-gate-fail-closed-runner-stub.mjs"],
    requiredGuardedStatus: "phase_1_write_gate_fail_closed_runner_stub_ready_no_execution"
  },
  {
    id: "readback_contract",
    args: ["scripts/check-phase-1-write-runner-aggregate-readback-contract-no-execution.mjs"],
    requiredGuardedStatus: "phase_1_write_runner_aggregate_readback_contract_no_execution_ready"
  },
  {
    id: "rollback_contract",
    args: ["scripts/check-phase-1-write-runner-rollback-or-quarantine-contract-no-execution.mjs"],
    requiredGuardedStatus: "phase_1_write_runner_rollback_or_quarantine_contract_no_execution_ready"
  },
  {
    id: "post_write_review_contract",
    args: ["scripts/check-phase-1-write-runner-post-write-review-contract-no-execution.mjs"],
    requiredGuardedStatus: "phase_1_write_runner_post_write_review_contract_no_execution_ready"
  }
];

const problems = [];
if (!candidateArtifactPath) problems.push("candidate_artifact_path_missing");

const results = [];
if (candidateArtifactPath) {
  for (const check of checks) {
    const output = runJson(check.args);
    const statusOk = check.requiredStatus ? output.status === check.requiredStatus : true;
    const guardedStatusOk = check.requiredGuardedStatus
      ? output.guardedStatus === check.requiredGuardedStatus
      : true;
    if (!statusOk) problems.push(`${check.id}_status_mismatch`);
    if (!guardedStatusOk) problems.push(`${check.id}_guarded_status_mismatch`);
    if (Array.isArray(output.problems) && output.problems.length > 0) {
      problems.push(`${check.id}_has_problems`);
    }

    results.push({
      id: check.id,
      status: output.status ?? null,
      guardedStatus: output.guardedStatus ?? null,
      decision: output.decision ?? null,
      nextRoute: output.nextRoute ?? null,
      accepted:
        output.accepted ??
        output.rowPayloadCandidate?.accepted ??
        output.commandResults?.every((item) => item.accepted === true) ??
        null,
      rowCount:
        output.rowCount ??
        output.rowPayloadCandidate?.rowCount ??
        output.commandResults?.find((item) => typeof item.rowCount === "number")?.rowCount ??
        null,
      executionAllowedNow: output.executionAllowedNow ?? null,
      writeGateExecutableNow: output.writeGateExecutableNow ?? null,
      publicDataSource: output.publicDataSource ?? output.safety?.publicDataSource ?? null,
      scoreSource: output.scoreSource ?? output.safety?.scoreSource ?? null
    });
  }
}

const readyForChairmanDecision = problems.length === 0 && Boolean(candidateArtifactPath);

console.log(
  JSON.stringify(
    {
      status: readyForChairmanDecision
        ? "phase_1_operator_write_review_summary_ready_for_chairman_decision_no_execution"
        : "phase_1_operator_write_review_summary_blocked_no_execution",
      mode: "aggregate_only_no_execution",
      candidateArtifactPathProvided: Boolean(candidateArtifactPath),
      boundedAttemptScope: "twii_and_etf_phase_1_missing_row_closure_only",
      targetTable: "daily_prices",
      maxRows: 178,
      decision: readyForChairmanDecision
        ? "ready_to_ask_chairman_for_one_bounded_write_attempt_authorization"
        : "not_ready_for_write_authorization",
      nextRoute: readyForChairmanDecision
        ? "chairman_authorizes_or_rejects_one_bounded_write_attempt"
        : "repair_blocked_operator_write_review_inputs",
      results,
      safety: {
        sqlExecuted: false,
        supabaseConnected: false,
        supabaseWriteAttempted: false,
        stagingRowsCreated: false,
        dailyPricesMutated: false,
        marketDataFetched: false,
        rawPayloadOutput: false,
        rowPayloadOutput: false,
        stockIdPayloadOutput: false,
        secretsOutput: false,
        publicDataSource: "mock",
        scoreSource: "mock"
      },
      problems
    },
    null,
    2
  )
);

process.exitCode = 0;

function runJson(commandArgs) {
  const run = spawnSync(process.execPath, commandArgs, {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });

  if (run.error) {
    return { status: "command_error", problems: [run.error.message] };
  }

  try {
    return JSON.parse(run.stdout);
  } catch (error) {
    return {
      status: "command_output_unreadable",
      problems: [`${commandArgs[0]}:${error.message}`]
    };
  }
}

function parseArgs(tokens) {
  const parsed = {};
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    const next = tokens[index + 1];
    if (!next || next.startsWith("--")) {
      parsed[key] = true;
      continue;
    }
    parsed[key] = next;
    index += 1;
  }
  return parsed;
}
