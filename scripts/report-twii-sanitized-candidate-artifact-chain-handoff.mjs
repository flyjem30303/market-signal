import {
  defaultTwiiCandidateArtifactPath,
  validateTwiiCandidateArtifact
} from "./lib/twii-candidate-artifact-validator.mjs";

const args = parseArgs(process.argv.slice(2));
const candidateArtifactPath =
  args["candidate-artifact-path"] ??
  process.env.A1_TWII_CANDIDATE_ARTIFACT_PATH ??
  defaultTwiiCandidateArtifactPath;

const validation = validateTwiiCandidateArtifact(candidateArtifactPath);
const accepted = validation.accepted === true;

const report = {
  status: accepted
    ? "twii_sanitized_candidate_artifact_chain_handoff_ready_for_named_packet"
    : "blocked",
  outcome: accepted ? "accepted_for_named_attempt_packet_no_write_only" : "blocked",
  candidateArtifactPath,
  candidateArtifactProvided: validation.artifactProvided,
  validation: {
    accepted,
    problems: validation.problems,
    summary: validation.summary
  },
  nextPacketUse:
    accepted
      ? {
          candidateArtifactPath,
          mode: "no-write-preview",
          targetLane: "TWII",
          targetScope: "twii_index_daily_prices_missing_rows",
          requiredDecisionStatus: "accepted_for_no_write_dry_run_chain",
          nextAllowedCommand:
            "cmd.exe /c npm run run:twii-bounded-data-acceptance-packet-driven-chain -- --packet-path <LOCAL_PACKET_JSON>"
        }
      : null,
  acceptedMeaning:
    "The artifact is accepted only as a sanitized aggregate-only input path for a future named attempt packet and packet-driven no-write chain.",
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
    rawPayloadOutputAllowed: false,
    rowPayloadOutputAllowed: false,
    stockIdPayloadOutputAllowed: false,
    secretOutputAllowed: false,
    publicPromotionAllowed: false,
    scoreSourceRealAllowed: false
  }
};

console.log(JSON.stringify(report, null, 2));

if (!accepted) process.exit(1);

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
