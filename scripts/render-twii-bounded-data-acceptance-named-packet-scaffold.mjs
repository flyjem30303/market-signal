import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const args = parseArgs(process.argv.slice(2));
const problems = [];

const candidateArtifactPath = args["candidate-artifact-path"];
const attemptId = args["attempt-id"];
const decisionId = args["decision-id"];
const decisionSummary = args["decision-summary"];
const owner = args.owner ?? "CEO/PM";
const outPath =
  args.out ?? path.join("tmp", `twii-bounded-named-attempt-packet-${safeFileStamp(attemptId ?? "missing")}.json`);

if (!candidateArtifactPath) problems.push("candidate-artifact-path is required");
if (!attemptId || !/^[a-z0-9][a-z0-9_-]{2,80}$/iu.test(attemptId)) {
  problems.push("attempt-id is required and must be a safe 3-81 character id");
}
if (!safeText(decisionId)) problems.push("decision-id is required");
if (!safeText(decisionSummary)) problems.push("decision-summary is required");
if (!safeText(owner)) problems.push("owner is required");

let handoff = {};
if (problems.length === 0) {
  const handoffRun = spawnSync(
    process.execPath,
    [
      "scripts/report-twii-sanitized-candidate-artifact-chain-handoff.mjs",
      "--candidate-artifact-path",
      candidateArtifactPath
    ],
    { cwd: process.cwd(), encoding: "utf8", shell: false, timeout: 120000, windowsHide: true }
  );
  handoff = parseJson(handoffRun.stdout ?? "", "handoff stdout");
  if (handoffRun.status !== 0) problems.push("candidate artifact handoff gate failed");
  if (handoff.status !== "twii_sanitized_candidate_artifact_chain_handoff_ready_for_named_packet") {
    problems.push("candidate artifact handoff must be ready for named packet");
  }
}

const packet = {
  packetKind: "twii_bounded_data_acceptance_named_attempt_packet",
  attemptId: attemptId ?? null,
  candidateArtifactPath: candidateArtifactPath ?? null,
  mode: "no-write-preview",
  targetLane: "TWII",
  targetScope: "twii_index_daily_prices_missing_rows",
  decisionReference: {
    decisionId: decisionId ?? null,
    owner: owner ?? null,
    decisionStatus: "accepted_for_no_write_dry_run_chain",
    summary: decisionSummary ?? null
  },
  commands: {
    chainCommand:
      "cmd.exe /c npm run run:twii-bounded-data-acceptance-dry-run-review-chain -- --attempt-id <ATTEMPT_ID> --candidate-artifact-path <LOCAL_JSON_PATH> --mode no-write-preview",
    postRunReviewCommand:
      "cmd.exe /c npm run report:twii-bounded-data-acceptance-post-run-review -- --summary-path <SUMMARY_JSON_PATH>",
    packetDrivenChainCommand:
      "cmd.exe /c npm run run:twii-bounded-data-acceptance-packet-driven-chain -- --packet-path <LOCAL_PACKET_JSON>"
  },
  handoff: {
    status: handoff.status ?? null,
    outcome: handoff.outcome ?? null,
    candidateArtifactProvided: handoff.candidateArtifactProvided === true,
    acceptedMeaning: handoff.acceptedMeaning ?? null
  },
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlAllowed: false,
    supabaseAllowed: false,
    marketDataFetchAllowed: false,
    marketDataIngestAllowed: false,
    dailyPricesMutationAllowed: false,
    stagingRowsAllowed: false,
    candidateRowsAcceptanceAllowed: false,
    rowCoverageScoringAllowed: false,
    sourcePayloadOutputAllowed: false,
    secretOutputAllowed: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  }
};

if (problems.length === 0) {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, `${JSON.stringify(packet, null, 2)}\n`);
}

const result = {
  status:
    problems.length === 0
      ? "twii_bounded_named_packet_scaffold_rendered_for_no_write_chain"
      : "blocked",
  outcome: problems.length === 0 ? "rendered" : "blocked",
  outPath: problems.length === 0 ? outPath : null,
  attemptId: attemptId ?? null,
  candidateArtifactPathProvided: Boolean(candidateArtifactPath),
  handoffStatus: handoff.status ?? null,
  packetWritten: problems.length === 0,
  acceptedMeaning:
    "Rendered packet scaffold is for packet-driven no-write chain only; it does not approve SQL, Supabase, market fetch, candidate row acceptance, row coverage scoring, source promotion, or real score.",
  safety: packet.safety,
  problems
};

console.log(JSON.stringify(result, null, 2));

if (problems.length > 0) process.exit(1);

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
      parsed[key] = "true";
    }
  }
  return parsed;
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch {
    problems.push(`${label} is not valid JSON`);
    return {};
  }
}

function safeText(value) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= 240;
}

function safeFileStamp(value) {
  return String(value).replace(/[^a-z0-9_-]/giu, "_").slice(0, 80);
}
