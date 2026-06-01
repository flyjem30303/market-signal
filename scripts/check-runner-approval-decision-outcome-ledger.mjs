import { spawnSync } from "node:child_process";
import fs from "node:fs";

const ledgerPath = "src/lib/runner-approval-decision-outcome-ledger.ts";
const reportPath = "scripts/report-runner-approval-decision-outcome-ledger.mjs";
const outcomeDataPath = "data/source-gates/runner-approval-decision-outcomes.json";
const readinessPath = "src/lib/data-source-readiness-packet.ts";
const componentPath = "src/components/project-progress-panel.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [ledgerPath, reportPath, readinessPath, componentPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);
const outcomeData = JSON.parse(fs.readFileSync(outcomeDataPath, "utf8"));
const packageJson = JSON.parse(read(packagePath));
const missing = [];
const blocked = [];

for (const [file, phrases] of [
  [
    ledgerPath,
    [
      "local_runner_approval_decision_outcome_ledger",
      "data/source-gates/runner-approval-decision-outcomes.json",
      "getRunnerApprovalDecisionOutcomeLedger",
      "awaiting_runner_approval_decision",
      "runner_implementation_approval_accepted",
      "runner_implementation_approval_rejected",
      "runner_implementation_approval_deferred",
      "report-only-runner-implementation-slice",
      "pending",
      "accepted",
      "rejected",
      "deferred",
      "implementationApproved",
      "allRequiredOutcomesAccepted",
      "publicDataSource",
      "scoreSource",
      "scoreSourceRealEnabled",
      "supabaseWritesEnabled",
      "runner execution",
      "market data fetch",
      "scoreSource=real"
    ]
  ],
  [
    reportPath,
    [
      "src/lib/runner-approval-decision-outcome-ledger.ts",
      "getRunnerApprovalDecisionOutcomeLedger",
      "loadTsModule"
    ]
  ],
  [
    readinessPath,
    [
      "getRunnerApprovalDecisionOutcomeLedger",
      "runnerApprovalDecisionOutcomeLedger: RunnerApprovalDecisionOutcomeLedger",
      "runnerApprovalDecisionOutcomeLedger: getRunnerApprovalDecisionOutcomeLedger()"
    ]
  ],
  [
    componentPath,
    [
      "project-progress-runner-outcome-ledger",
      "runnerApprovalDecisionOutcomeLedger.outcomes.map",
      "runnerApprovalDecisionOutcomeLedger.stillBlocked.join"
    ]
  ],
  [cssPath, [".project-progress-runner-outcome-ledger"]]
]) {
  for (const phrase of phrases) {
    if (!read(file).includes(phrase)) {
      missing.push(`${file}: ${phrase}`);
    }
  }
}

for (const file of [ledgerPath, reportPath]) {
  for (const pattern of [
    /@supabase\/supabase-js/,
    /createClient/,
    /fetch\(/,
    /\.from\(/,
    /\.insert\(/,
    /\.update\(/,
    /\.delete\(/,
    /process\.env\.(NEXT_PUBLIC_SUPABASE_URL|NEXT_PUBLIC_SUPABASE_ANON_KEY|SUPABASE_SERVICE_ROLE_KEY)/,
    /publicDataSource:\s*"supabase"/,
    /scoreSource:\s*"real"/,
    /scoreSourceRealEnabled:\s*true/,
    /connectionAttempted:\s*true/,
    /sqlExecuted:\s*true/,
    /supabaseWritesEnabled:\s*true/
  ]) {
    if (pattern.test(read(file))) {
      blocked.push(`${file}: forbidden source pattern ${String(pattern)}`);
    }
  }
}

if (!Array.isArray(outcomeData.outcomes) || outcomeData.outcomes.length !== 1) {
  blocked.push(`${outcomeDataPath}: expected one outcome`);
} else {
  const item = outcomeData.outcomes[0];
  if (item.id !== "report-only-runner-implementation-slice") {
    blocked.push(`${outcomeDataPath}: invalid id`);
  }
  if (!["pending", "accepted", "rejected", "deferred"].includes(item.outcome)) {
    blocked.push(`${outcomeDataPath}: invalid outcome`);
  }
  if (!["CEO", "Chairman", "not_recorded"].includes(item.recordedBy)) {
    blocked.push(`${outcomeDataPath}: invalid recordedBy`);
  }
  if (item.outcome === "pending" && (item.recordedBy !== "not_recorded" || item.recordedAt !== null)) {
    blocked.push(`${outcomeDataPath}: pending item must use not_recorded and null recordedAt`);
  }
  if (item.outcome !== "pending" && (item.recordedBy === "not_recorded" || typeof item.recordedAt !== "string")) {
    blocked.push(`${outcomeDataPath}: recorded item must include recorder and recordedAt`);
  }
  if (typeof item.decisionNote !== "string" || item.decisionNote.trim().length === 0) {
    blocked.push(`${outcomeDataPath}: decisionNote is required`);
  }
}

if (
  packageJson.scripts?.["report:runner-approval-decision-outcome-ledger"] !==
  "node scripts/report-runner-approval-decision-outcome-ledger.mjs"
) {
  missing.push(`${packagePath}: report:runner-approval-decision-outcome-ledger`);
}
if (
  packageJson.scripts?.["check:runner-approval-decision-outcome-ledger"] !==
  "node scripts/check-runner-approval-decision-outcome-ledger.mjs"
) {
  missing.push(`${packagePath}: check:runner-approval-decision-outcome-ledger`);
}
if (!read(reviewGatePath).includes("scripts/check-runner-approval-decision-outcome-ledger.mjs")) {
  missing.push(`${reviewGatePath}: scripts/check-runner-approval-decision-outcome-ledger.mjs`);
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
  if (output.mode !== "local_runner_approval_decision_outcome_ledger") {
    blocked.push(`output.mode: ${String(output.mode)}`);
  }
  if (
    ![
      "awaiting_runner_approval_decision",
      "runner_implementation_approval_accepted",
      "runner_implementation_approval_rejected",
      "runner_implementation_approval_deferred"
    ].includes(output.status)
  ) {
    blocked.push(`output.status: ${String(output.status)}`);
  }
  for (const flag of [
    "automatedRemoteRun",
    "connectionAttempted",
    "ingestionStarted",
    "scoreSourceRealEnabled",
    "secretsPrinted",
    "sqlExecuted",
    "supabaseWritesEnabled"
  ]) {
    if (output.safety?.[flag] !== false) {
      blocked.push(`output.safety.${flag}: ${String(output.safety?.[flag])}`);
    }
  }
  if (output.safety?.publicDataSource !== "mock" || output.safety?.scoreSource !== "mock") {
    blocked.push("output safety must keep publicDataSource and scoreSource mock");
  }
  if (!Array.isArray(output.outcomes) || output.outcomes.length !== 1) {
    blocked.push("output.outcomes: expected one outcome");
  }
  if (output.implementationApproved !== ((output.outcomes ?? [])[0]?.outcome === "accepted")) {
    blocked.push("output.implementationApproved mismatch");
  }
  if (!Array.isArray(output.stillBlocked) || output.stillBlocked.length < 10) {
    blocked.push("output.stillBlocked: expected at least 10 blocked items");
  }
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

function read(file) {
  return files.get(file) ?? "";
}
