import { spawnSync } from "node:child_process";
import fs from "node:fs";

const docPath = "docs/reviews/PRE_RUNTIME_BLOCKER_CLOSURE_PACKET_2026-06-02.md";
const reportPath = "scripts/report-pre-runtime-blocker-closure-packet.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const fullHealthPath = "scripts/check-localhost-full-health.mjs";

const doc = fs.readFileSync(docPath, "utf8");
const reportSource = fs.readFileSync(reportPath, "utf8");
const packageJson = JSON.parse(fs.readFileSync(packagePath, "utf8"));
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const fullHealth = fs.readFileSync(fullHealthPath, "utf8");

const required = [
  [docPath, "Pre-Runtime Blocker Closure Packet"],
  [docPath, "pre runtime blocker closure packet recorded"],
  [docPath, "ACCEPT_THREE_LOCAL_REVIEW_PACKETS_FOR_RUNTIME_NEXT_DECISION_ONLY"],
  [docPath, "DATA_QUALITY_FIELD_VALIDITY_ACCEPTANCE_GATE_2026-06-02.md"],
  [docPath, "SOURCE_RIGHTS_DISCLOSURE_ACCEPTANCE_GATE_2026-06-02.md"],
  [docPath, "MODEL_CREDIBILITY_ACCEPTANCE_GATE_2026-06-02.md"],
  [docPath, "Public data source remains mock"],
  [docPath, "`scoreSource=real` remains blocked"],
  [docPath, "default PM path remains mock runtime hardening"],
  [reportPath, "mode: \"pre_runtime_blocker_closure_packet\""],
  [reportPath, "three_local_packets_accepted_runtime_next_decision_ready"],
  [reportPath, "publicDataSource: \"mock\""],
  [reportPath, "scoreSource: \"mock\""],
  [reportPath, "scoreSourceRealEnabled: false"],
  [reportPath, "connectionAttempted: false"],
  [reportPath, "sqlExecuted: false"],
  [reportPath, "supabaseWritesEnabled: false"],
  [reportPath, "mock-runtime-hardening"],
  [reportPath, "bounded-row-coverage-readonly"],
  [reportPath, "separately named action"]
];

const forbiddenPatterns = [
  [docPath, /CP3_READY_NOW/],
  [docPath, /PROMOTE_CP3_READINESS_NOW/],
  [docPath, /scoreSource=real approved/],
  [docPath, /ALLOW_SQL_EXECUTION/],
  [docPath, /ALLOW_SUPABASE_WRITES/],
  [docPath, /ALLOW_MARKET_INGESTION/],
  [docPath, /PUBLIC_CLAIMS_APPROVED/],
  [docPath, /publicDataSource=supabase/],
  [reportPath, /@supabase\/supabase-js/],
  [reportPath, /createClient/],
  [reportPath, /fetch\(/],
  [reportPath, /\.from\(/],
  [reportPath, /\.insert\(/],
  [reportPath, /\.update\(/],
  [reportPath, /\.delete\(/],
  [reportPath, /process\.env\.(NEXT_PUBLIC_SUPABASE_URL|NEXT_PUBLIC_SUPABASE_ANON_KEY|SUPABASE_SERVICE_ROLE_KEY)/],
  [reportPath, /publicDataSource:\s*"supabase"/],
  [reportPath, /scoreSource:\s*"real"/],
  [reportPath, /scoreSourceRealEnabled:\s*true/],
  [reportPath, /connectionAttempted:\s*true/],
  [reportPath, /sqlExecuted:\s*true/],
  [reportPath, /supabaseWritesEnabled:\s*true/]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbiddenPatterns.filter(([file, pattern]) => pattern.test(read(file))).map(([file, pattern]) => `${file}: ${String(pattern)}`);

if (packageJson.scripts?.["report:pre-runtime-blocker-closure-packet"] !== "node scripts/report-pre-runtime-blocker-closure-packet.mjs") {
  missing.push(`${packagePath}: report:pre-runtime-blocker-closure-packet`);
}

if (packageJson.scripts?.["check:pre-runtime-blocker-closure-packet"] !== "node scripts/check-pre-runtime-blocker-closure-packet.mjs") {
  missing.push(`${packagePath}: check:pre-runtime-blocker-closure-packet`);
}

if (!reviewGate.includes("scripts/check-pre-runtime-blocker-closure-packet.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-pre-runtime-blocker-closure-packet.mjs`);
}

if (!fullHealth.includes("scripts/check-pre-runtime-blocker-closure-packet.mjs")) {
  missing.push(`${fullHealthPath}: scripts/check-pre-runtime-blocker-closure-packet.mjs`);
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
    if (pattern.test(run.stdout)) {
      blocked.push(`${reportPath}: forbidden output pattern ${String(pattern)}`);
    }
  }

  try {
    output = JSON.parse(run.stdout);
  } catch (error) {
    blocked.push(`${reportPath}: did not emit JSON ${error instanceof Error ? error.message : String(error)}`);
  }
}

if (output) {
  if (output.mode !== "pre_runtime_blocker_closure_packet") {
    blocked.push(`output.mode: ${String(output.mode)}`);
  }
  if (output.status !== "three_local_packets_accepted_runtime_next_decision_ready") {
    blocked.push(`output.status: ${String(output.status)}`);
  }
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    blocked.push("output safety must keep publicDataSource and scoreSource mock");
  }
  for (const flag of [
    "automatedRemoteRun",
    "connectionAttempted",
    "ingestionStarted",
    "rowPayloadsPrinted",
    "scoreSourceRealEnabled",
    "secretsPrinted",
    "sqlExecuted",
    "supabaseWritesEnabled"
  ]) {
    if (output.safety?.[flag] !== false) {
      blocked.push(`output.safety.${flag}: ${String(output.safety?.[flag])}`);
    }
  }

  const packetIds = new Set((output.acceptedPackets ?? []).map((packet) => packet.id));
  for (const id of ["data-quality-evidence", "source-rights-and-disclosure", "model-credibility"]) {
    if (!packetIds.has(id)) blocked.push(`output.acceptedPackets missing ${id}`);
  }

  const optionIds = new Set((output.nextDecisionOptions ?? []).map((option) => option.id));
  for (const id of ["mock-runtime-hardening", "bounded-row-coverage-readonly"]) {
    if (!optionIds.has(id)) blocked.push(`output.nextDecisionOptions missing ${id}`);
  }
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

function read(file) {
  if (file === docPath) return doc;
  if (file === reportPath) return reportSource;
  if (file === reviewGatePath) return reviewGate;
  if (file === fullHealthPath) return fullHealth;
  return fs.readFileSync(file, "utf8");
}
