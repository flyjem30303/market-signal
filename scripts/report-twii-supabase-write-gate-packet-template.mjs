import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const args = parseArgs(process.argv.slice(2));
const problems = [];
const packetPath = args["packet-path"];
const outputPath = args.out ?? path.join("tmp", "twii-supabase-write-gate-packet-template-report.json");

const preauth = runJson(["scripts/report-twii-supabase-write-gate-preauth.mjs"]);
if (preauth.status !== "twii_supabase_write_gate_preauth_ready_for_chairman_authorization") {
  problems.push("preauth_not_ready_for_chairman_authorization");
}
if (preauth.outcome !== "preauth_ready_for_separate_explicit_write_gate_packet") {
  problems.push("preauth_outcome_not_ready_for_separate_packet");
}

const packet = packetPath ? readJson(packetPath) : createBlankTemplate();
validatePacket(packet);

const ok = problems.length === 0;
const report = {
  status: ok ? "twii_supabase_write_gate_packet_template_ready_local_only" : "blocked",
  outcome: ok ? "write_gate_packet_shape_accepted_for_future_authorization_review_only" : "blocked",
  mode: "twii_supabase_write_gate_packet_template",
  owner: "CEO/PM",
  packetPath: packetPath ?? null,
  packetKind: packet.packetKind ?? null,
  authorizationId: packet.authorizationId ?? null,
  upstream: {
    preauthStatus: preauth.status ?? null,
    preauthOutcome: preauth.outcome ?? null
  },
  requiredNextGates: [
    "chairman_ceo_pm_explicit_write_authorization",
    "credential_handling_check",
    "runner_boundary_check",
    "rollback_dry_run",
    "post_write_aggregate_readback",
    "post_write_review",
    "separate_row_coverage_scoring_gate",
    "separate_public_source_promotion_gate"
  ],
  currentBoundary: {
    writeGateExecutableNow: false,
    supabaseConnectionAllowedNow: false,
    dailyPricesMutationAllowedNow: false,
    candidateRowsAcceptedNow: false,
    rowCoverageScoringAllowedNow: false,
    publicPromotionAllowedNow: false,
    scoreSourceRealAllowedNow: false
  },
  template: packetPath ? null : packet,
  safety: {
    publicDataSource: "mock",
    scoreSource: "mock",
    sqlExecuted: false,
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

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
console.log(JSON.stringify(report, null, 2));
if (!ok) process.exit(1);

function createBlankTemplate() {
  return {
    packetKind: "twii_supabase_write_gate_packet",
    authorizationId: "twii-write-gate-YYYYMMDD-a",
    chairmanDecision: "accepted",
    ceoDecision: "accepted",
    pmOwner: "PM",
    candidateArtifactPath: "data/candidates/twii-sanitized-candidate.json",
    sourceRightsDecisionReference: "accepted-source-rights-reference",
    fieldContractReference: "accepted-field-contract-reference",
    assetMappingReference: "accepted-asset-mapping-reference",
    targetTable: "daily_prices",
    targetLane: "TWII",
    targetScope: "twii_index_daily_prices_missing_rows",
    maxRows: 60,
    writeMode: "bounded_insert_missing_only",
    duplicatePolicy: "reject_duplicates",
    rollbackPlan: {
      required: true,
      scope: "authorizationId",
      noWriteStopLine: true
    },
    postWriteReadbackPlan: {
      aggregateOnly: true,
      requiredFields: [
        "attempted_row_count",
        "inserted_row_count",
        "rejected_row_count",
        "duplicate_row_count",
        "target_scope",
        "target_table",
        "post_write_max_trade_date"
      ]
    },
    postWriteReviewCommand: "cmd.exe /c npm run report:twii-post-write-review -- --summary-path <SUMMARY_JSON>",
    promotionAllowed: false,
    rowCoverageScoringAllowed: false,
    scoreSourceRealAllowed: false,
    safety: {
      publicDataSource: "mock",
      scoreSource: "mock",
      rawPayloadOutputAllowed: false,
      rowPayloadOutputAllowed: false,
      stockIdPayloadOutputAllowed: false,
      secretOutputAllowed: false
    }
  };
}

function validatePacket(packet) {
  if (packet.packetKind !== "twii_supabase_write_gate_packet") problems.push("packetKind must be twii_supabase_write_gate_packet");
  if (!safeId(packet.authorizationId)) problems.push("authorizationId must be a safe id");
  if (packet.chairmanDecision !== "accepted") problems.push("chairmanDecision must be accepted");
  if (packet.ceoDecision !== "accepted") problems.push("ceoDecision must be accepted");
  for (const field of [
    "pmOwner",
    "candidateArtifactPath",
    "sourceRightsDecisionReference",
    "fieldContractReference",
    "assetMappingReference",
    "postWriteReviewCommand"
  ]) {
    if (!safeText(packet[field])) problems.push(`${field} is required`);
  }
  if (packet.targetTable !== "daily_prices") problems.push("targetTable must be daily_prices");
  if (packet.targetLane !== "TWII") problems.push("targetLane must be TWII");
  if (packet.targetScope !== "twii_index_daily_prices_missing_rows") problems.push("targetScope must be twii_index_daily_prices_missing_rows");
  if (packet.maxRows !== 60) problems.push("maxRows must be exactly 60");
  if (packet.writeMode !== "bounded_insert_missing_only") problems.push("writeMode must be bounded_insert_missing_only");
  if (packet.duplicatePolicy !== "reject_duplicates") problems.push("duplicatePolicy must be reject_duplicates");
  if (packet.rollbackPlan?.required !== true) problems.push("rollbackPlan.required must be true");
  if (packet.rollbackPlan?.scope !== "authorizationId") problems.push("rollbackPlan.scope must be authorizationId");
  if (packet.rollbackPlan?.noWriteStopLine !== true) problems.push("rollbackPlan.noWriteStopLine must be true");
  if (packet.postWriteReadbackPlan?.aggregateOnly !== true) problems.push("postWriteReadbackPlan.aggregateOnly must be true");
  for (const field of [
    "attempted_row_count",
    "inserted_row_count",
    "rejected_row_count",
    "duplicate_row_count",
    "target_scope",
    "target_table",
    "post_write_max_trade_date"
  ]) {
    if (!packet.postWriteReadbackPlan?.requiredFields?.includes(field)) {
      problems.push(`postWriteReadbackPlan.requiredFields missing ${field}`);
    }
  }
  if (!String(packet.postWriteReviewCommand ?? "").includes("report:twii-post-write-review")) {
    problems.push("postWriteReviewCommand must point to report:twii-post-write-review");
  }
  if (packet.promotionAllowed !== false) problems.push("promotionAllowed must be false");
  if (packet.rowCoverageScoringAllowed !== false) problems.push("rowCoverageScoringAllowed must be false");
  if (packet.scoreSourceRealAllowed !== false) problems.push("scoreSourceRealAllowed must be false");
  if (packet.safety?.publicDataSource !== "mock") problems.push("safety.publicDataSource must be mock");
  if (packet.safety?.scoreSource !== "mock") problems.push("safety.scoreSource must be mock");
  for (const key of [
    "rawPayloadOutputAllowed",
    "rowPayloadOutputAllowed",
    "stockIdPayloadOutputAllowed",
    "secretOutputAllowed"
  ]) {
    if (packet.safety?.[key] !== false) problems.push(`safety.${key} must be false`);
  }
}

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

function safeId(value) {
  return typeof value === "string" && /^[a-z0-9][a-z0-9_-]{2,80}$/iu.test(value);
}

function safeText(value) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= 260;
}

