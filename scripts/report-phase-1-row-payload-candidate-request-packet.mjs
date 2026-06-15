import { spawnSync } from "node:child_process";

const dataOnline = runJson("scripts/check-phase-1-data-online-go-no-go-status.mjs");
const problems = [];

if (dataOnline.status !== "ok") problems.push("data_online_go_no_go_status_not_ok");
if (dataOnline.coverage?.fullLevel1MissingRows !== 178) problems.push("full_level_1_missing_rows_not_178");
if (dataOnline.rowPayloadCandidate?.expectedRows !== 178) problems.push("expected_row_payload_rows_not_178");
if (dataOnline.publicDataSource !== "mock") problems.push("public_data_source_must_remain_mock");
if (dataOnline.scoreSource !== "mock") problems.push("score_source_must_remain_mock");
if (dataOnline.twiiExecutionAllowedNow !== false) problems.push("twii_execution_must_remain_disabled");

const ok = problems.length === 0;

console.log(JSON.stringify({
  status: ok ? "ok" : "blocked",
  guardedStatus: ok
    ? "phase_1_row_payload_candidate_request_packet_ready"
    : "phase_1_row_payload_candidate_request_packet_blocked",
  decision: "request_non_committed_sanitized_row_payload_candidate_path",
  currentBlocker: dataOnline.rowPayloadCandidate?.accepted
    ? "row_payload_candidate_ready_write_review_required"
    : "candidate_row_payloads_missing",
  a1Assignment: {
    taskId: "prepare_phase_1_sanitized_row_payload_candidate_artifact_path",
    deliveryMode: "local_or_external_path_only",
    preferredLocalPath: "tmp/phase-1-sanitized-row-payload-candidate.json",
    storagePolicy: "outside_git_or_gitignored",
    doNotPlaceUnder: "data/candidates",
    expectedRows: 178,
    expectedSymbolCounts: {
      TWII: 60,
      "0050": 59,
      "006208": 59
    },
    requiredTopLevelFields: [
      "artifactId",
      "createdAt",
      "scope",
      "sourceRightsStatus",
      "fieldContractStatus",
      "sanitizedRowPayloadIncluded",
      "rawPayloadIncluded",
      "stockIdPayloadIncluded",
      "secretsIncluded",
      "expectedRows",
      "rows"
    ],
    requiredRowFields: [
      "symbol",
      "trade_date",
      "close",
      "source_name",
      "source_updated_at",
      "source_row_hash"
    ],
    optionalRowFields: ["open", "high", "low", "volume"],
    returnOnly: [
      "candidateArtifactPath",
      "artifactId",
      "rowCount",
      "symbolsCovered",
      "symbolCounts",
      "dateBounds",
      "duplicateCount",
      "missingRequiredFieldCount",
      "forbiddenFieldCount",
      "invalidTradeDateCount",
      "invalidSourceMetadataCount",
      "invalidOptionalNumberCount",
      "safetyFlags"
    ]
  },
  pmValidationCommands: [
    "cmd.exe /c npm run validate:phase-1-sanitized-row-payload-candidate-artifact -- --candidate-artifact <LOCAL_JSON_PATH>",
    "cmd.exe /c npm run check:phase-1-data-online-go-no-go-status -- --candidate-artifact <LOCAL_JSON_PATH>",
    "cmd.exe /c npm run run:phase-1-write-runner-implementation-candidate -- --candidate-artifact <LOCAL_JSON_PATH>"
  ],
  hardBoundaries: {
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
}, null, 2));

if (!ok) process.exitCode = 1;

function runJson(scriptPath) {
  const run = spawnSync(process.execPath, [scriptPath], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false,
    timeout: 120000,
    windowsHide: true
  });

  try {
    return JSON.parse(run.stdout);
  } catch {
    return { status: "blocked", problems: [`${scriptPath}_did_not_emit_json`] };
  }
}
