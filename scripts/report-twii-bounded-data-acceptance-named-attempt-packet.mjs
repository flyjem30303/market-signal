import fs from "node:fs";
import path from "node:path";

const args = parseArgs(process.argv.slice(2));
const problems = [];

const packetPath = args["packet-path"];
const outputPath =
  args.out ?? path.join("tmp", "twii-bounded-data-acceptance-named-attempt-packet-result.json");

if (!packetPath) problems.push("packet-path is required");

const packet = packetPath ? readJson(packetPath) : {};
const attemptId = packet.attemptId;
const candidateArtifactPath = packet.candidateArtifactPath;

if (!attemptId || !/^[a-z0-9][a-z0-9_-]{2,80}$/iu.test(attemptId)) {
  problems.push("attemptId is required and must be a safe 3-81 character id");
}
if (packet.mode !== "no-write-preview") problems.push("mode must be no-write-preview");
if (packet.targetLane !== "TWII") problems.push("targetLane must be TWII");
if (packet.targetScope !== "twii_index_daily_prices_missing_rows") {
  problems.push("targetScope must be twii_index_daily_prices_missing_rows");
}
if (!candidateArtifactPath) {
  problems.push("candidateArtifactPath is required");
} else {
  try {
    const stats = fs.statSync(candidateArtifactPath);
    if (!stats.isFile()) problems.push("candidateArtifactPath must point to a local file");
  } catch {
    problems.push("candidateArtifactPath must point to an existing local file");
  }
}

if (!packet.decisionReference || typeof packet.decisionReference !== "object") {
  problems.push("decisionReference object is required");
} else {
  for (const field of ["decisionId", "owner", "decisionStatus", "summary"]) {
    if (!safeText(packet.decisionReference[field])) problems.push(`decisionReference.${field} is required`);
  }
  if (packet.decisionReference.decisionStatus !== "accepted_for_no_write_dry_run_chain") {
    problems.push("decisionReference.decisionStatus must be accepted_for_no_write_dry_run_chain");
  }
}

if (!packet.commands || typeof packet.commands !== "object") {
  problems.push("commands object is required");
} else {
  if (!String(packet.commands.chainCommand ?? "").includes("run:twii-bounded-data-acceptance-dry-run-review-chain")) {
    problems.push("commands.chainCommand must point to the dry-run review chain");
  }
  if (!String(packet.commands.postRunReviewCommand ?? "").includes("report:twii-bounded-data-acceptance-post-run-review")) {
    problems.push("commands.postRunReviewCommand must point to post-run review");
  }
}

assertSafety(packet);

const result = {
  status:
    problems.length === 0
      ? "twii_bounded_data_acceptance_named_attempt_packet_accepted_for_no_write_chain"
      : "blocked",
  outcome: problems.length === 0 ? "accepted" : "blocked",
  packetPath: packetPath ?? null,
  attemptId: attemptId ?? null,
  candidateArtifactPathProvided: Boolean(candidateArtifactPath),
  candidateArtifactBasename: candidateArtifactPath ? path.basename(candidateArtifactPath) : null,
  nextAllowedCommand:
    problems.length === 0
      ? "cmd.exe /c npm run run:twii-bounded-data-acceptance-dry-run-review-chain -- --attempt-id <ATTEMPT_ID> --candidate-artifact-path <LOCAL_JSON_PATH> --mode no-write-preview"
      : null,
  acceptedMeaning:
    "The packet is accepted only as a local no-write chain preflight. It does not approve SQL, Supabase activity, market-data fetch, row acceptance, row coverage scoring, source promotion, or real score.",
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
  },
  problems
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify(result, null, 2));

if (problems.length > 0) process.exit(1);

function assertSafety(output) {
  const safety = output.safety ?? {};
  if (safety.publicDataSource !== "mock") problems.push("safety.publicDataSource must be mock");
  if (safety.scoreSource !== "mock") problems.push("safety.scoreSource must be mock");
  for (const key of [
    "sqlAllowed",
    "supabaseAllowed",
    "marketDataFetchAllowed",
    "marketDataIngestAllowed",
    "dailyPricesMutationAllowed",
    "stagingRowsAllowed",
    "candidateRowsAcceptanceAllowed",
    "rowCoverageScoringAllowed",
    "sourcePayloadOutputAllowed",
    "secretOutputAllowed",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed"
  ]) {
    if (safety[key] !== false) problems.push(`safety.${key} must be false`);
  }
}

function safeText(value) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= 240;
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    problems.push("packet-path must point to valid JSON");
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
      parsed[key] = "true";
    }
  }
  return parsed;
}
