import fs from "node:fs";
import { spawnSync } from "node:child_process";

const reportPath = "scripts/report-supabase-network-layer-diagnostic.mjs";
const evidencePath = "docs/reviews/CP3_SUPABASE_NETWORK_LAYER_DIAGNOSTIC_2026-06-02.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const childEnv = { ...process.env };
delete childEnv.SUPABASE_NETWORK_LAYER_DIAGNOSTIC_CONFIRMATION;
delete childEnv.NEXT_PUBLIC_SUPABASE_URL;

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
  if (output.mode !== "supabase_network_layer_diagnostic") blocked.push(`output.mode: ${String(output.mode)}`);
  if (output.status !== "blocked") blocked.push(`output.status: ${String(output.status)}`);
  if (output.confirmation !== "missing_or_invalid") blocked.push(`output.confirmation: ${String(output.confirmation)}`);
  if (output.connectionAttempted !== false) blocked.push(`output.connectionAttempted: ${String(output.connectionAttempted)}`);

  for (const key of ["dns", "tcp443", "tlsHandshake", "restRootReachability"]) {
    if (output.diagnostic?.[key] !== "not_run") blocked.push(`output.diagnostic.${key}: ${String(output.diagnostic?.[key])}`);
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
for (const phrase of [
  "CP3_SUPABASE_NETWORK_LAYER_DIAGNOSTIC",
  "dns.lookup",
  "net.createConnection",
  "tls.connect",
  "method: \"HEAD\"",
  "dns_or_project_host",
  "tcp443_or_firewall",
  "tls_or_proxy",
  "fetch_layer_or_proxy",
  "rest_root_reachable"
]) {
  if (!reportSource.includes(phrase)) missing.push(`${reportPath}: ${phrase}`);
}

for (const forbidden of ["console.log(process.env", "response.text", "response.json", "serviceRoleKey", "SUPABASE_SERVICE_ROLE_KEY", "hostname:", "address:", "rawUrl"]) {
  if (reportSource.includes(forbidden)) blocked.push(`${reportPath}: forbidden token ${forbidden}`);
}

if (fs.existsSync(evidencePath)) {
  const evidence = fs.readFileSync(evidencePath, "utf8");
  for (const phrase of [
    "CP3 Supabase Network Layer Diagnostic",
    "does not record raw URLs",
    "IP addresses",
    "DNS status:",
    "TCP 443 status:",
    "TLS handshake status:",
    "REST root reachability:",
    "Keep public data source as mock",
    "Keep `scoreSource=real` blocked",
    "Review gates pass"
  ]) {
    if (!evidence.includes(phrase)) missing.push(`${evidencePath}: ${phrase}`);
  }

  for (const forbidden of ["CP3_READY_NOW", "scoreSource=real approved", "SQL execution is approved", "Supabase writes are approved", "raw URL recorded", "IP address recorded", "row count:"]) {
    if (evidence.includes(forbidden)) blocked.push(`${evidencePath}: forbidden token ${forbidden}`);
  }
}

const packageJson = fs.readFileSync(packagePath, "utf8");
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
for (const [file, content, phrase] of [
  [packagePath, packageJson, "\"report:supabase-network-layer-diagnostic\": \"node --env-file=.env.local scripts/report-supabase-network-layer-diagnostic.mjs\""],
  [packagePath, packageJson, "\"check:supabase-network-layer-diagnostic\": \"node scripts/check-supabase-network-layer-diagnostic.mjs\""],
  [reviewGatePath, reviewGate, "scripts/check-supabase-network-layer-diagnostic.mjs"]
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
