import fs from "node:fs";

const artifactPath = "data/evidence-intake/phase-1-server-only-credential-presence-reviewed-result.json";
const docPath = "docs/PHASE_1_SERVER_ONLY_CREDENTIAL_PRESENCE_REVIEWED_RESULT.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const envPath = ".env.local";
const requiredEnvKey = "SUPABASE_SERVICE_ROLE_KEY";
const problems = [];

const artifactRaw = readText(artifactPath);
const artifact = parseJson(artifactRaw, artifactPath);
const doc = readText(docPath);
const packageJson = parseJson(readText(packagePath), packagePath);
const reviewGate = readText(reviewGatePath);
const envPresence = readEnvPresence(envPath, requiredEnvKey);

validateArtifact();
validateDoc();
validateRegistration();
validateBoundaries();

const ok = problems.length === 0;

console.log(
  JSON.stringify(
    {
      status: ok ? "ok" : "blocked",
      guardedStatus: ok
        ? "phase_1_server_only_credential_presence_reviewed_result_ready_boolean_only"
        : "phase_1_server_only_credential_presence_reviewed_result_blocked",
      reviewedResultStatus: artifact.reviewedResultStatus ?? null,
      serverOnlyCredentialPresent: artifact.serverOnlyCredentialPresent === true && envPresence.present === true,
      credentialValueExposed: false,
      writeGateExecutableNow: artifact.writeGateExecutableNow ?? null,
      remainingBlockersAfterThisResult: artifact.remainingBlockersAfterThisResult ?? [],
      publicDataSource: artifact.safety?.publicDataSource ?? null,
      scoreSource: artifact.safety?.scoreSource ?? null,
      problems
    },
    null,
    2
  )
);

if (!ok) process.exit(1);

function validateArtifact() {
  expect(
    artifact.status,
    "phase_1_server_only_credential_presence_reviewed_result_ready_boolean_only",
    "artifact status"
  );
  expect(artifact.packetMode, "server_only_credential_presence_reviewed_result", "packetMode");
  expect(artifact.reviewedResultStatus, "credential_presence_reviewed_boolean_only", "reviewedResultStatus");
  expect(artifact.serverOnlyCredentialPresent, true, "serverOnlyCredentialPresent");
  expect(envPresence.present, true, "local credential env presence");
  expect(artifact.credentialPresenceSource, "local_env_presence_boolean_only", "credentialPresenceSource");
  expect(artifact.writeGateExecutableNow, false, "writeGateExecutableNow");
  expect(artifact.reducesBlocker, "credential_presence_unverified", "reducesBlocker");
  for (const key of [
    "credentialValueStored",
    "credentialValuePrinted",
    "credentialValueHashed",
    "credentialValueCompared",
    "credentialValueTransformed"
  ]) {
    expect(artifact[key], false, key);
  }
  expectArray(artifact.remainingBlockersAfterThisResult, [
    "operator_values_missing",
    "operator_owned_presence_confirmation_unverified",
    "external_presence_acceptance_unverified",
    "external_presence_reviewed_result_missing"
  ]);
  expect(artifact.safety?.publicDataSource, "mock", "safety publicDataSource");
  expect(artifact.safety?.scoreSource, "mock", "safety scoreSource");
  for (const key of [
    "sqlExecuted",
    "supabaseReadAttempted",
    "supabaseWriteAttempted",
    "marketDataFetched",
    "marketDataIngested",
    "dailyPricesMutated",
    "stagingRowsCreated",
    "rawPayloadsPrinted",
    "rowPayloadsPrinted",
    "secretsPrinted",
    "publicPromotionAllowed",
    "scoreSourceRealAllowed",
    "investmentAdviceClaimAllowed"
  ]) {
    expect(artifact.safety?.[key], false, `safety.${key}`);
  }
}

function validateDoc() {
  const requiredTokens = [
    "phase_1_server_only_credential_presence_reviewed_result_ready_boolean_only",
    "server_only_credential_presence_reviewed_result",
    "credential_presence_reviewed_boolean_only",
    "credential_presence_unverified",
    "serverOnlyCredentialPresent=true",
    "credentialPresenceSource=local_env_presence_boolean_only",
    "credentialValueStored=false",
    "credentialValuePrinted=false",
    "credentialValueHashed=false",
    "credentialValueCompared=false",
    "credentialValueTransformed=false",
    "operator_values_missing",
    "operator_owned_presence_confirmation_unverified",
    "external_presence_acceptance_unverified",
    "external_presence_reviewed_result_missing",
    "publicDataSource=mock",
    "scoreSource=mock",
    "writeGateExecutableNow=false",
    "No SQL",
    "No Supabase read",
    "No Supabase write",
    "No staging rows",
    "No `daily_prices` mutation",
    "No market-data fetch",
    "No market-data ingestion",
    "No raw payload output",
    "No row payload output",
    "No secret output",
    "No credential value output",
    "No source promotion",
    "No score promotion",
    "No public real-data claim",
    "No investment advice"
  ];
  for (const token of requiredTokens) if (!doc.includes(token)) problems.push(`${docPath} missing ${token}`);
}

function validateRegistration() {
  if (
    packageJson.scripts?.["check:phase-1-server-only-credential-presence-reviewed-result"] !==
    "node scripts/check-phase-1-server-only-credential-presence-reviewed-result.mjs"
  ) {
    problems.push("package.json missing check:phase-1-server-only-credential-presence-reviewed-result");
  }
  if (!reviewGate.includes("scripts/check-phase-1-server-only-credential-presence-reviewed-result.mjs")) {
    problems.push("review gate missing server-only credential presence reviewed result checker");
  }
  if (!reviewGate.includes('"phase-1-server-only-credential-presence-reviewed-result"')) {
    problems.push("focused review gate missing server-only credential presence reviewed result checker");
  }
}

function validateBoundaries() {
  const forbiddenPatterns = [
    /sb_secret_/u,
    /SUPABASE_SERVICE_ROLE_KEY\s*[:=]/u,
    /NEXT_PUBLIC_SUPABASE_URL\s*[:=]/u,
    /https:\/\/[a-z0-9.-]+supabase/iu,
    /"credentialValue"\s*:/u,
    /credentialValueStored"\s*:\s*true/u,
    /credentialValuePrinted"\s*:\s*true/u,
    /credentialValueHashed"\s*:\s*true/u,
    /credentialValueCompared"\s*:\s*true/u,
    /credentialValueTransformed"\s*:\s*true/u,
    /supabaseReadAttempted"\s*:\s*true/u,
    /supabaseWriteAttempted"\s*:\s*true/u,
    /publicDataSource"\s*:\s*"supabase"/u,
    /scoreSource"\s*:\s*"real"/u,
    /writeGateExecutableNow"\s*:\s*true/u
  ];
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(artifactRaw)) problems.push(`${artifactPath} contains forbidden pattern ${pattern}`);
    if (pattern.test(doc)) problems.push(`${docPath} contains forbidden pattern ${pattern}`);
  }
}

function readEnvPresence(filePath, key) {
  if (!fs.existsSync(filePath)) {
    problems.push(`${filePath} is missing`);
    return { present: false };
  }
  const text = fs.readFileSync(filePath, "utf8");
  const line = text
    .split(/\r?\n/u)
    .find((entry) => entry.trim().startsWith(`${key}=`));
  if (!line) return { present: false };
  const value = line.slice(line.indexOf("=") + 1).trim();
  return { present: value.length > 0 };
}

function expect(actual, expected, label) {
  if (actual !== expected) problems.push(`${label} expected ${JSON.stringify(expected)} but got ${JSON.stringify(actual)}`);
}

function expectArray(actual, expected) {
  if (!Array.isArray(actual)) {
    problems.push("remainingBlockersAfterThisResult must be an array");
    return;
  }
  const missing = expected.filter((item) => !actual.includes(item));
  const extra = actual.filter((item) => !expected.includes(item));
  if (missing.length > 0 || extra.length > 0) {
    problems.push(`remainingBlockersAfterThisResult mismatch missing=${JSON.stringify(missing)} extra=${JSON.stringify(extra)}`);
  }
}

function readText(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch (error) {
    problems.push(`failed to read ${filePath}: ${error.message}`);
    return "";
  }
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    problems.push(`${label} JSON parse failed: ${error.message}`);
    return {};
  }
}
