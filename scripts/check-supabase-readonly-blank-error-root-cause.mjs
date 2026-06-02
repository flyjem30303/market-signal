import fs from "node:fs";
import { spawnSync } from "node:child_process";

const reportPath = "scripts/report-supabase-readonly-blank-error-root-cause.mjs";
const evidencePath = "docs/reviews/CP3_SUPABASE_BLANK_ERROR_ROOT_CAUSE_2026-06-02.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const childEnv = { ...process.env };
delete childEnv.SUPABASE_BLANK_ERROR_ROOT_CAUSE_CONFIRMATION;
delete childEnv.NEXT_PUBLIC_SUPABASE_URL;
delete childEnv.SUPABASE_SERVICE_ROLE_KEY;

const run = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  env: childEnv
});

const blocked = [];
const missing = [];

if (run.status !== 1) blocked.push(`${reportPath}: expected fail-closed exit 1, got ${String(run.status)}`);

let output;
try {
  output = JSON.parse(run.stdout);
} catch (error) {
  blocked.push(`${reportPath}: did not emit JSON ${error instanceof Error ? error.message : String(error)}`);
}

if (output) {
  if (output.mode !== "supabase_readonly_blank_error_root_cause") blocked.push(`output.mode: ${String(output.mode)}`);
  if (output.status !== "blocked") blocked.push(`output.status: ${String(output.status)}`);
  if (output.confirmation !== "missing_or_invalid") blocked.push(`output.confirmation: ${String(output.confirmation)}`);
  if (output.connectionAttempted !== false) blocked.push(`output.connectionAttempted: ${String(output.connectionAttempted)}`);
  if (output.diagnostic?.restRootReachability !== "not_run") {
    blocked.push(`output.diagnostic.restRootReachability: ${String(output.diagnostic?.restRootReachability)}`);
  }

  for (const flag of [
    "filesWritten",
    "mutations",
    "publicClaimsChanged",
    "rowPayloadsPrinted",
    "scoreSourceRealChanged",
    "secretsPrinted",
    "sqlExecuted"
  ]) {
    if (output[flag] !== false) blocked.push(`output.${flag}: ${String(output[flag])}`);
  }
}

const reportSource = fs.readFileSync(reportPath, "utf8");
const evidence = fs.readFileSync(evidencePath, "utf8");
for (const phrase of [
  "CP3_SUPABASE_BLANK_ERROR_ROOT_CAUSE",
  "restRootReachability",
  "sanitizedHttpStatus",
  "suggestedRootCause",
  "sdk_query_or_policy_layer",
  "project_url_or_network",
  "environment_loading",
  "new URL(\"/rest/v1/\", value)",
  "method: \"HEAD\""
]) {
  if (!reportSource.includes(phrase)) missing.push(`${reportPath}: ${phrase}`);
}

for (const phrase of [
  "CP3 Supabase Blank Error Root-Cause Diagnostic",
  "ACCEPT_NETWORK_LAYER_AS_CURRENT_ROOT_CAUSE_CANDIDATE",
  "does not record secrets",
  "raw response bodies",
  "raw error messages",
  "Diagnostic status: `blocked`",
  "Diagnostic reason: `rest_root_blocked`",
  "URL shape: `supabase_host`, `https`, `ok`",
  "REST root reachability: `blocked`",
  "Sanitized HTTP status: `network_error`",
  "Suggested root cause: `project_url_or_network`",
  "The current root-cause candidate is therefore `project_url_or_network`",
  "not table/RLS policy",
  "not repeat table-level readonly attempts",
  "Keep public data source as mock",
  "Keep `scoreSource=real` blocked",
  "Review gates pass"
]) {
  if (!evidence.includes(phrase)) missing.push(`${evidencePath}: ${phrase}`);
}

for (const forbidden of ["console.log(process.env", "serviceRoleKey.slice", "serviceRoleKey.length", "response.text", "response.json", "message:", "details:", "hint:"]) {
  if (reportSource.includes(forbidden)) blocked.push(`${reportPath}: forbidden token ${forbidden}`);
}

for (const forbidden of ["CP3_READY_NOW", "scoreSource=real approved", "SQL execution is approved", "Supabase writes are approved", "PUBLIC_CLAIMS_APPROVED", "raw URL recorded", "row count:"]) {
  if (evidence.includes(forbidden)) blocked.push(`${evidencePath}: forbidden token ${forbidden}`);
}

const packageJson = fs.readFileSync(packagePath, "utf8");
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
for (const [file, content, phrase] of [
  [packagePath, packageJson, "\"report:supabase-readonly-blank-error-root-cause\": \"node --env-file=.env.local scripts/report-supabase-readonly-blank-error-root-cause.mjs\""],
  [packagePath, packageJson, "\"check:supabase-readonly-blank-error-root-cause\": \"node scripts/check-supabase-readonly-blank-error-root-cause.mjs\""],
  [reviewGatePath, reviewGate, "scripts/check-supabase-readonly-blank-error-root-cause.mjs"]
]) {
  if (!content.includes(phrase)) missing.push(`${file}: ${phrase}`);
}

console.log(
  JSON.stringify(
    {
      blocked,
      missing,
      status: blocked.length === 0 && missing.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (blocked.length > 0 || missing.length > 0) process.exitCode = 1;
