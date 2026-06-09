import fs from "node:fs";
import path from "node:path";

export const defaultTwiiCandidateArtifactPath = "data/candidates/twii-sanitized-candidate.json";

const requiredFalseFlags = [
  "rawPayloadIncluded",
  "rowPayloadIncluded",
  "stockIdPayloadIncluded",
  "secretsIncluded"
];

const forbiddenKeys = new Set([
  "rawPayload",
  "rawSourcePayload",
  "sourcePayload",
  "sourceRows",
  "rawRows",
  "rowPayload",
  "stockIdPayload",
  "sourceUrlPayload",
  "html",
  "csv",
  "secret",
  "secrets",
  "serviceRoleKey"
]);

export function validateTwiiCandidateArtifact(inputPath = defaultTwiiCandidateArtifactPath) {
  const resolvedPath = path.resolve(process.cwd(), inputPath);
  const artifactProvided = fs.existsSync(resolvedPath);
  const problems = [];

  if (!artifactProvided) {
    return {
      artifactProvided,
      accepted: false,
      path: inputPath,
      problems: ["candidate_artifact_not_provided"],
      summary: emptySummary()
    };
  }

  let artifact = null;
  try {
    artifact = JSON.parse(fs.readFileSync(resolvedPath, "utf8"));
  } catch {
    return {
      artifactProvided,
      accepted: false,
      path: inputPath,
      problems: ["candidate_artifact_json_invalid"],
      summary: emptySummary()
    };
  }

  expect(artifact.lane === "TWII", "lane_must_be_TWII");
  expect(artifact.assetType === "index", "assetType_must_be_index");
  expect(artifact.symbol === "TWII", "symbol_must_be_TWII");
  expect(artifact.scope === "twii_index_daily_prices_missing_rows", "scope_mismatch");
  expect(
    ["official-exchange-index", "licensed-market-data-vendor", "internal-approved-feed"].includes(artifact.sourceLane),
    "sourceLane_not_allowed"
  );
  expect(typeof artifact.artifactId === "string" && artifact.artifactId.trim().length >= 8, "artifactId_missing");
  expect(typeof artifact.fieldContractVersion === "string" && artifact.fieldContractVersion.trim().length >= 6, "fieldContractVersion_missing");
  expect(
    typeof artifact.sourceRightsGateStatus === "string" &&
      artifact.sourceRightsGateStatus.includes("twii_source_rights_outcome_gate"),
    "sourceRightsGateStatus_mismatch"
  );
  expect(artifact.coverageWindowSessions === 60, "coverageWindowSessions_must_be_60");
  expect(artifact.alreadyObservedRows === 0, "alreadyObservedRows_must_be_0");
  expect(artifact.candidateMissingRows === 60, "candidateMissingRows_must_be_60");
  expect(artifact.expectedRows === 60, "expectedRows_must_be_60");
  expect(
    artifact.reviewOutputPolicy === "aggregate_only_no_raw_or_row_payloads_no_stock_id_payloads",
    "reviewOutputPolicy_mismatch"
  );
  expect(artifact.sanitizedAggregateOnly === true, "sanitizedAggregateOnly_must_be_true");

  for (const flag of requiredFalseFlags) {
    expect(artifact[flag] === false, `${flag}_must_be_false`);
  }

  const aggregate = artifact.aggregateValidation;
  expect(aggregate && typeof aggregate === "object" && !Array.isArray(aggregate), "aggregateValidation_missing");
  if (aggregate && typeof aggregate === "object" && !Array.isArray(aggregate)) {
    expect(aggregate.expectedRows === 60, "aggregate_expectedRows_must_be_60");
    expect(Number.isInteger(aggregate.candidateRows), "aggregate_candidateRows_must_be_integer");
    expect(Number.isInteger(aggregate.duplicateRows), "aggregate_duplicateRows_must_be_integer");
    expect(Number.isInteger(aggregate.rejectedRows), "aggregate_rejectedRows_must_be_integer");
    expect(Number.isInteger(aggregate.missingRows), "aggregate_missingRows_must_be_integer");
    expect(Array.isArray(aggregate.fieldNames), "aggregate_fieldNames_must_be_array");
    expect(["draft", "pending_pm_review"].includes(aggregate.validationStatus), "aggregate_validationStatus_invalid");
  }

  const foundForbiddenKeys = [];
  scanKeys(artifact, foundForbiddenKeys);
  for (const key of foundForbiddenKeys) problems.push(`forbidden_key_${key}`);

  return {
    artifactProvided,
    accepted: problems.length === 0,
    path: inputPath,
    problems,
    summary: {
      lane: artifact.lane ?? "unknown",
      symbol: artifact.symbol ?? "unknown",
      expectedRows: Number(artifact.expectedRows ?? 0),
      candidateRows: Number(artifact.aggregateValidation?.candidateRows ?? 0),
      duplicateRows: Number(artifact.aggregateValidation?.duplicateRows ?? 0),
      rejectedRows: Number(artifact.aggregateValidation?.rejectedRows ?? 0),
      missingRows: Number(artifact.aggregateValidation?.missingRows ?? 0),
      rawPayloadIncluded: artifact.rawPayloadIncluded === true,
      rowPayloadIncluded: artifact.rowPayloadIncluded === true,
      stockIdPayloadIncluded: artifact.stockIdPayloadIncluded === true,
      secretsIncluded: artifact.secretsIncluded === true
    }
  };

  function expect(pass, problem) {
    if (!pass) problems.push(problem);
  }
}

function scanKeys(value, found) {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    for (const item of value) scanKeys(item, found);
    return;
  }
  for (const [key, child] of Object.entries(value)) {
    if (forbiddenKeys.has(key)) found.push(key);
    scanKeys(child, found);
  }
}

function emptySummary() {
  return {
    lane: "unknown",
    symbol: "unknown",
    expectedRows: 0,
    candidateRows: 0,
    duplicateRows: 0,
    rejectedRows: 0,
    missingRows: 0,
    rawPayloadIncluded: false,
    rowPayloadIncluded: false,
    stockIdPayloadIncluded: false,
    secretsIncluded: false
  };
}
