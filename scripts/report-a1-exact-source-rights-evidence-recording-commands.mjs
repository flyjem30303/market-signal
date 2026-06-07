import fs from "node:fs";

const outcomePath = "data/source-gates/a1-exact-source-rights-evidence-intake-outcomes.json";
const outcomes = JSON.parse(fs.readFileSync(outcomePath, "utf8")).outcomes;

if (!Array.isArray(outcomes)) throw new Error("Outcome file must include outcomes array");

const pending = outcomes.filter((item) => item.classification === "pending");
const commands = pending.map((item) => buildCommand(item));

console.log(
  JSON.stringify(
    {
      mode: "a1_exact_source_rights_evidence_recording_commands",
      status: pending.length === 0 ? "no_pending_slots" : "pending_slot_dry_run_commands_ready",
      outcomeData: outcomePath,
      pendingCount: pending.length,
      commandCount: commands.length,
      safety: {
        automatedRemoteRun: false,
        candidateArtifactGenerated: false,
        connectionAttempted: false,
        ingestionStarted: false,
        marketDataFetched: false,
        publicDataSource: "mock",
        rowCoverageAwarded: false,
        scoreSource: "mock",
        scoreSourceRealEnabled: false,
        secretsPrinted: false,
        sqlExecuted: false,
        supabaseReadsEnabled: false,
        supabaseWritesEnabled: false
      },
      usage: {
        defaultMode: "dry_run_only",
        applyRequiresHumanReviewedNoSecretEvidence: true,
        replacePlaceholdersBeforeApply: true
      },
      commands,
      stillDoesNotAuthorize: [
        "source-rights approval",
        "candidate generation",
        "SQL execution",
        "Supabase reads",
        "Supabase writes",
        "staging rows",
        "daily_prices mutation",
        "market-data fetch",
        "market-data ingestion",
        "row coverage points",
        "publicDataSource=supabase",
        "scoreSource=real"
      ]
    },
    null,
    2
  )
);

function buildCommand(item) {
  const nextGateCandidate = item.lane === "TWII" ? "twii_source_rights_outcome_gate" : "etf_source_rights_outcome_gate";
  const safeSummary = `${item.id} REPLACE_WITH_NO_SECRET_SUMMARY`;
  const remainingRisk = `${item.id} REPLACE_WITH_NO_SECRET_REMAINING_RISK`;
  const sourceReferenceLabel = `${item.id}-no-secret-reference-label`;

  return {
    id: item.id,
    lane: item.lane,
    currentClassification: item.classification,
    recommendedDryRunCommand: [
      "cmd.exe /c npm run record:a1-exact-source-rights-evidence-outcome --",
      "--dry-run",
      "--id",
      item.id,
      "--classification",
      "accepted",
      "--recordedBy",
      "A1",
      "--pm-question-resolved",
      "true",
      "--safe-summary",
      quote(safeSummary),
      "--source-reference-label",
      quote(sourceReferenceLabel),
      "--remaining-risk",
      quote(remainingRisk),
      "--next-gate-candidate",
      nextGateCandidate
    ].join(" "),
    applyInstruction:
      "Change --dry-run to --apply only after PM/CEO reviews no-secret evidence; do not paste raw source text, secrets, row payloads, or stock id payloads.",
    fallbackBlockedDryRunCommand: [
      "cmd.exe /c npm run record:a1-exact-source-rights-evidence-outcome --",
      "--dry-run",
      "--id",
      item.id,
      "--classification",
      "blocked",
      "--recordedBy",
      "A1",
      "--safe-summary",
      quote(`${item.id} evidence unavailable or unsafe; no-secret summary only.`),
      "--source-reference-label",
      quote(sourceReferenceLabel),
      "--remaining-risk",
      quote(`${item.id} remains blocked; ask for the narrow missing evidence.`),
      "--next-gate-candidate",
      "blocked"
    ].join(" ")
  };
}

function quote(value) {
  return `"${value.replaceAll('"', '\\"')}"`;
}
