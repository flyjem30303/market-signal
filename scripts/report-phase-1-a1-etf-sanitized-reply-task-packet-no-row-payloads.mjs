import fs from "node:fs";

const artifactPath = "data/evidence-intake/phase-1-a1-etf-sanitized-reply-task-packet-no-row-payloads.json";
const executionBriefPath = "data/evidence-intake/phase-1-etf-sanitized-candidate-artifact-reply-execution-brief-no-row-payloads.json";
const applyGatePath = "data/evidence-intake/phase-1-etf-reply-pm-acceptance-apply-gate-no-row-payloads.json";
const problems = [];

const artifact = readJson(artifactPath);
const executionBrief = readJson(executionBriefPath);
const applyGate = readJson(applyGatePath);

if (executionBrief.status !== artifact.sourceExecutionBriefStatus) problems.push("execution brief status mismatch");
if (applyGate.status !== artifact.sourceApplyGateStatus) problems.push("apply gate status mismatch");
if (artifact.pmAcceptsNow !== false) problems.push("PM must not accept now");
if (artifact.a1MayReplyNow !== true) problems.push("A1 task packet must be actionable");

const ok = problems.length === 0;

console.log(
  JSON.stringify(
    {
      status: ok ? artifact.status : "blocked",
      taskDecision: artifact.taskDecision ?? null,
      ownerLane: artifact.ownerLane ?? null,
      targetLane: artifact.targetLane ?? null,
      symbolGroup: artifact.symbolGroup ?? null,
      targetScope: artifact.targetScope ?? null,
      expectedRows: artifact.expectedRows ?? null,
      candidateMissingRows: artifact.candidateMissingRows ?? null,
      pmAcceptsNow: artifact.pmAcceptsNow ?? null,
      a1MayReplyNow: artifact.a1MayReplyNow ?? null,
      nextPmRouteAfterReply: artifact.nextPmRouteAfterReply ?? null,
      requiredReplyValues: artifact.requiredReplyValues ?? {},
      stoplines: artifact.stoplines ?? [],
      safety: artifact.safety ?? {},
      copyableTask: [
        "A1 ETF sanitized artifact reply task",
        "Goal: prepare an aggregate-only sanitized candidate artifact reply for Phase 1 ETF coverage closure.",
        "Do not include raw payload, row payload, stock-id payload, market rows, source values, secrets, SQL output, or Supabase write evidence.",
        "",
        "Reply with this exact shape:",
        "candidateArtifactPath:",
        "artifactId:",
        "lane: ETF",
        "symbolGroup: ETF",
        "scope: phase_1_core_etf_daily_prices_missing_rows",
        "sourceLane:",
        "coverageWindowSessions:",
        "candidateMissingRows: 118",
        "expectedRows: 118",
        "aggregateValidation:",
        "sanitizedAggregateOnly: true",
        "rawPayloadIncluded: false",
        "rowPayloadIncluded: false",
        "stockIdPayloadIncluded: false",
        "secretsIncluded: false"
      ].join("\n"),
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return {};
  }
}
