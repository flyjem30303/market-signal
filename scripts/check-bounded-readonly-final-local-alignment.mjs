import { spawnSync } from "node:child_process";
import fs from "node:fs";

const reportPath = "scripts/report-bounded-readonly-final-local-alignment.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const source = fs.readFileSync(reportPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const fullHealth = fs.readFileSync(fullHealthPath, "utf8");
const missing = [];
const blocked = [];

for (const phrase of [
  "mode: \"bounded_readonly_final_local_alignment\"",
  "ready_for_separately_named_bounded_readonly_decision",
  "scripts/report-narrow-approval-post-review-gate.mjs",
  "scripts/report-provider-specific-terms-post-review-rollup.mjs",
  "scripts/report-mainline-readonly-packet-bridge.mjs",
  "scripts/report-row-coverage-readonly-preexecution-packet.mjs",
  "scripts/report-bounded-row-coverage-readonly-attempt-decision.mjs",
  "allRequiredOutcomesAccepted",
  "readyForNextReadonlyDecision",
  "requiresSeparateNamedAction",
  "remoteExecutionFromThisReport: false",
  "immediatePrechecksRequired",
  "sanitizedAggregateOutputOnly",
  "noRuntimePromotionFromAttemptAlone",
  "CP3_ROW_COVERAGE_READONLY_VALIDATE",
  "provider terms approval",
  "publicDataSource=supabase",
  "scoreSource=real",
  "CP3_READY_NOW",
  "does not connect to Supabase"
]) {
  if (!source.includes(phrase)) missing.push(`${reportPath}: ${phrase}`);
}

for (const pattern of [
  /run-row-coverage-readonly-once/,
  /validate-supabase-readonly/,
  /@supabase\/supabase-js/,
  /createClient/,
  /fetch\(/,
  /\.from\(/,
  /\.insert\(/,
  /\.update\(/,
  /\.delete\(/,
  /\.upsert\(/,
  /process\.env\.(NEXT_PUBLIC_SUPABASE_URL|NEXT_PUBLIC_SUPABASE_ANON_KEY|SUPABASE_SERVICE_ROLE_KEY)/,
  /publicDataSource:\s*"supabase"/,
  /scoreSource:\s*"real"/,
  /connectionAttempted:\s*true/,
  /sqlExecuted:\s*true/,
  /supabaseWritesEnabled:\s*true/
]) {
  if (pattern.test(source)) blocked.push(`${reportPath}: forbidden source pattern ${String(pattern)}`);
}

if (
  packageJson.scripts?.["report:bounded-readonly-final-local-alignment"] !==
  "node scripts/report-bounded-readonly-final-local-alignment.mjs"
) {
  missing.push(`${packagePath}: report:bounded-readonly-final-local-alignment`);
}

if (
  packageJson.scripts?.["check:bounded-readonly-final-local-alignment"] !==
  "node scripts/check-bounded-readonly-final-local-alignment.mjs"
) {
  missing.push(`${packagePath}: check:bounded-readonly-final-local-alignment`);
}

if (!reviewGate.includes("scripts/check-bounded-readonly-final-local-alignment.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-bounded-readonly-final-local-alignment.mjs`);
}

if (!fullHealth.includes("scripts/check-bounded-readonly-final-local-alignment.mjs")) {
  missing.push(`${fullHealthPath}: scripts/check-bounded-readonly-final-local-alignment.mjs`);
}

const run = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

let output = null;
if (run.status !== 0) {
  blocked.push(`${reportPath}: exited ${String(run.status)} ${run.stderr.trim()}`);
} else {
  for (const pattern of [
    /NEXT_PUBLIC_SUPABASE_URL/,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY/,
    /SUPABASE_SERVICE_ROLE_KEY/,
    /https:\/\/[a-z0-9-]+\.supabase\.co/i,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/i,
    /\bstock_id\b/,
    /\bstockId\b/,
    /\brawRows\b/,
    /\browPayload\b/i,
    /\bselect\s+\*\s+from\b/i,
    /\binsert\s+into\b/i,
    /\bupdate\s+[a-z_]+\s+set\b/i,
    /\bdelete\s+from\b/i
  ]) {
    if (pattern.test(run.stdout)) blocked.push(`${reportPath}: forbidden output pattern ${String(pattern)}`);
  }

  try {
    output = JSON.parse(run.stdout);
  } catch (error) {
    blocked.push(`${reportPath}: did not emit JSON ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (output) {
  if (output.mode !== "bounded_readonly_final_local_alignment") blocked.push(`output.mode: ${String(output.mode)}`);
  if (output.status !== "ready_for_separately_named_bounded_readonly_decision") {
    blocked.push(`output.status: ${String(output.status)}`);
  }

  for (const flag of [
    "automatedRemoteRun",
    "connectionAttempted",
    "ingestionStarted",
    "marketDataFetched",
    "providerTermsFetched",
    "rowPayloadsPrinted",
    "scoreSourceRealEnabled",
    "secretsPrinted",
    "sqlExecuted",
    "supabaseWritesEnabled"
  ]) {
    if (output.safety?.[flag] !== false) blocked.push(`output.safety.${flag}: ${String(output.safety?.[flag])}`);
  }

  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    blocked.push("output safety must keep publicDataSource and scoreSource mock");
  }

  if (!Array.isArray(output.localPrerequisites) || output.localPrerequisites.length !== 5) {
    blocked.push("output.localPrerequisites: expected five prerequisite rows");
  }
  if (!output.localPrerequisites?.every((item) => item.ok === true)) {
    blocked.push("output.localPrerequisites: every prerequisite must be ok");
  }

  if (output.nextDecisionContract?.requiresSeparateNamedAction !== true) {
    blocked.push("output.nextDecisionContract.requiresSeparateNamedAction must be true");
  }
  if (output.nextDecisionContract?.remoteExecutionFromThisReport !== false) {
    blocked.push("output.nextDecisionContract.remoteExecutionFromThisReport must be false");
  }
  if (output.nextDecisionContract?.exactAttemptCount !== 1) {
    blocked.push("output.nextDecisionContract.exactAttemptCount must be 1");
  }
  if (output.nextDecisionContract?.immediatePostRunReviewRequired !== true) {
    blocked.push("output.nextDecisionContract.immediatePostRunReviewRequired must be true");
  }
  if (!Array.isArray(output.nextDecisionContract?.immediatePrechecksRequired) || output.nextDecisionContract.immediatePrechecksRequired.length < 5) {
    blocked.push("output.nextDecisionContract.immediatePrechecksRequired expected at least five commands");
  }
  if (!Array.isArray(output.stillBlocked) || output.stillBlocked.length < 12) {
    blocked.push("output.stillBlocked expected at least twelve blocked items");
  }
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}
