import fs from "node:fs";
import path from "node:path";

const outputPath = path.normalize(process.env.PUBLIC_BETA_EXTERNAL_REPLY_PATH || "tmp/public-beta-external-reply.txt");
const routeCommand = "cmd.exe /c npm run report:public-beta-external-reply-file-route";
const dryRunCommand = "cmd.exe /c npm run report:public-beta-external-reply-intake-dry-run";
const workflowProofCommand = "cmd.exe /c npm run run:public-beta-external-reply-file-workflow-proof";

const slotSpecs = [
  ["vendor-terms-evidence", "PUBLIC_BETA_A1_VENDOR_TERMS"],
  ["internal-feed-owner-evidence", "PUBLIC_BETA_A1_INTERNAL_FEED_OWNER"],
  ["field-contract-evidence", "PUBLIC_BETA_A1_FIELD_CONTRACT"],
  ["asset-mapping-evidence", "PUBLIC_BETA_A1_ASSET_MAPPING"]
];
const requiredEnvVars = [
  "BETA_HOSTING_PROJECT_NAME",
  "BETA_TEMPORARY_URL",
  "PUBLIC_BETA_A1_VENDOR_TERMS_LABEL",
  "PUBLIC_BETA_A1_VENDOR_TERMS_SUMMARY",
  "PUBLIC_BETA_A1_VENDOR_TERMS_RISK",
  "PUBLIC_BETA_A1_INTERNAL_FEED_OWNER_LABEL",
  "PUBLIC_BETA_A1_INTERNAL_FEED_OWNER_SUMMARY",
  "PUBLIC_BETA_A1_INTERNAL_FEED_OWNER_RISK",
  "PUBLIC_BETA_A1_FIELD_CONTRACT_LABEL",
  "PUBLIC_BETA_A1_FIELD_CONTRACT_SUMMARY",
  "PUBLIC_BETA_A1_FIELD_CONTRACT_RISK",
  "PUBLIC_BETA_A1_ASSET_MAPPING_LABEL",
  "PUBLIC_BETA_A1_ASSET_MAPPING_SUMMARY",
  "PUBLIC_BETA_A1_ASSET_MAPPING_RISK"
];

const values = {
  hostingProjectName: readEnv("BETA_HOSTING_PROJECT_NAME"),
  temporaryBetaUrl: readEnv("BETA_TEMPORARY_URL"),
  slots: slotSpecs.map(([id, prefix]) => ({
    id,
    label: readEnv(`${prefix}_LABEL`),
    remainingRisk: readEnv(`${prefix}_RISK`),
    safeSummary: readEnv(`${prefix}_SUMMARY`)
  }))
};

const missing = [
  missingIf("BETA_HOSTING_PROJECT_NAME", !isFilled(values.hostingProjectName)),
  missingIf("BETA_TEMPORARY_URL", !isFilled(values.temporaryBetaUrl)),
  ...values.slots.flatMap((slot) => [
    missingIf(`${slotPrefix(slot.id)}_LABEL`, !isFilled(slot.label)),
    missingIf(`${slotPrefix(slot.id)}_SUMMARY`, !isFilled(slot.safeSummary)),
    missingIf(`${slotPrefix(slot.id)}_RISK`, !isFilled(slot.remainingRisk))
  ])
].filter(Boolean);

const unsafe = findUnsafe([
  values.hostingProjectName,
  values.temporaryBetaUrl,
  ...values.slots.flatMap((slot) => [slot.label, slot.safeSummary, slot.remainingRisk])
].join("\n"));

if (missing.length > 0 || unsafe.length > 0) {
  console.log(JSON.stringify({
    status: "public_beta_external_reply_env_fill_blocked_missing_or_unsafe_inputs",
    ok: false,
    mode: "public_beta_external_reply_env_fill",
    missingEnvVars: missing,
    unsafeProblemCount: unsafe.length,
    outputPath,
    fileWritten: false,
    fileTextEchoed: false,
    valuesEchoed: false,
    nextAction: "Provide all listed no-secret env vars, then rerun this command.",
    requiredEnvVars,
    runtimeBoundary: runtimeBoundary(),
    safety: safety({ localReplyFileWritten: false })
  }, null, 2));
  process.exit(0);
}

const platformProblems = validatePlatform(values.hostingProjectName, values.temporaryBetaUrl);
if (platformProblems.length > 0) {
  console.log(JSON.stringify({
    status: "public_beta_external_reply_env_fill_blocked_invalid_platform_shape",
    ok: false,
    mode: "public_beta_external_reply_env_fill",
    platformProblemCount: platformProblems.length,
    outputPath,
    fileWritten: false,
    fileTextEchoed: false,
    valuesEchoed: false,
    nextAction: "Repair the platform value shape, then rerun this command.",
    runtimeBoundary: runtimeBoundary(),
    safety: safety({ localReplyFileWritten: false })
  }, null, 2));
  process.exit(0);
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${renderReply(values)}\n`, "utf8");

console.log(JSON.stringify({
  status: "public_beta_external_reply_env_fill_written",
  ok: true,
  mode: "public_beta_external_reply_env_fill",
  outputPath,
  fileWritten: true,
  fileTextEchoed: false,
  valuesEchoed: false,
  writtenBlocks: {
    platformTwoValues: true,
    a1TwiiFourSlotEvidence: true
  },
  nextCommand: routeCommand,
  nextCommands: [routeCommand, dryRunCommand, workflowProofCommand],
  runtimeBoundary: runtimeBoundary(),
  safety: safety({ localReplyFileWritten: true })
}, null, 2));

function renderReply(input) {
  return [
    `BETA_HOSTING_PROJECT_NAME=${input.hostingProjectName}`,
    `BETA_TEMPORARY_URL=${input.temporaryBetaUrl}`,
    "",
    ...input.slots.flatMap((slot) => [
      `evidenceSlotId: ${slot.id}`,
      `sourceReferenceLabel: ${slot.label}`,
      `safeEvidenceSummary: ${slot.safeSummary}`,
      `remainingRisk: ${slot.remainingRisk}`,
      ""
    ])
  ].join("\n");
}

function readEnv(name) {
  return (process.env[name] ?? "").trim();
}

function isFilled(value) {
  return Boolean(value) && !/^<[^>]+>$/u.test(value) && !value.includes("<") && !value.includes(">");
}

function missingIf(name, condition) {
  return condition ? name : null;
}

function slotPrefix(id) {
  if (id === "vendor-terms-evidence") return "PUBLIC_BETA_A1_VENDOR_TERMS";
  if (id === "internal-feed-owner-evidence") return "PUBLIC_BETA_A1_INTERNAL_FEED_OWNER";
  if (id === "field-contract-evidence") return "PUBLIC_BETA_A1_FIELD_CONTRACT";
  if (id === "asset-mapping-evidence") return "PUBLIC_BETA_A1_ASSET_MAPPING";
  return id;
}

function validatePlatform(projectName, betaUrl) {
  const problems = [];
  if (projectName.length < 3 || projectName.length > 64) problems.push("hosting-project-name-length");
  if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/u.test(projectName)) problems.push("hosting-project-name-shape");
  if (/(http|token|secret|key|password|dashboard|invite)/iu.test(projectName)) problems.push("hosting-project-name-unsafe-word");
  try {
    const parsed = new URL(betaUrl);
    if (parsed.protocol !== "https:") problems.push("temporary-url-not-https");
    if (parsed.username || parsed.password) problems.push("temporary-url-credential");
    if (parsed.search || parsed.hash) problems.push("temporary-url-query-or-hash");
    if (!parsed.hostname.includes(".")) problems.push("temporary-url-host-not-public-like");
    if (parsed.pathname !== "/" && parsed.pathname !== "") problems.push("temporary-url-path");
    if (/(localhost|127\.0\.0\.1|dashboard|token|secret|key|password|invite|supabase\.co)/iu.test(parsed.hostname)) {
      problems.push("temporary-url-unsafe-host");
    }
  } catch {
    problems.push("temporary-url-invalid");
  }
  return problems;
}

function findUnsafe(text) {
  const findings = [];
  const checks = [
    [/NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?:/iu, "supabase-url-env"],
    [/NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/iu, "supabase-anon-key"],
    [/SUPABASE_SERVICE_ROLE_KEY\s*=/iu, "supabase-service-role-key"],
    [/\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu, "supabase-key-looking-token"],
    [/https:\/\/[a-z0-9-]+\.supabase\.co/iu, "supabase-project-url"],
    [/\braw payload\b/iu, "raw-payload"],
    [/\brow payload\b/iu, "row-payload"],
    [/\bstock-id payload\b|\bstock id payload\b/iu, "stock-id-payload"],
    [/\bservice role\b/iu, "service-role-text"],
    [/\bprivate key\b/iu, "private-key-text"],
    [/\bpassword\b/iu, "password-text"]
  ];
  for (const [pattern, label] of checks) {
    if (pattern.test(text)) findings.push(label);
  }
  return [...new Set(findings)];
}

function runtimeBoundary() {
  return {
    publicDataSource: "mock",
    scoreSource: "mock"
  };
}

function safety({ localReplyFileWritten }) {
  return {
    deploymentAuthorized: false,
    evidenceRecorded: false,
    fileTextEchoed: false,
    hostingMutated: false,
    localReplyFileWritten,
    marketDataFetched: false,
    rawPayloadPrinted: false,
    scoreSourceRealEnabled: false,
    secretsPrinted: false,
    sourceRightsApproved: false,
    sqlExecuted: false,
    supabaseReadsEnabled: false,
    supabaseWritesEnabled: false,
    valuesEchoed: false,
    valuesStoredInRepo: false
  };
}
