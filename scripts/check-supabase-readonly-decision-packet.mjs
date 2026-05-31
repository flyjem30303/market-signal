import fs from "node:fs";

const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
const scriptPath = "scripts/report-supabase-readonly-decision.mjs";
const checkerPath = "scripts/check-supabase-readonly-decision-packet.mjs";
const reviewGate = fs.readFileSync("scripts/check-review-gates.mjs", "utf8");
const source = fs.readFileSync(scriptPath, "utf8");
const normalized = source.toLowerCase();

const required = [
  "mode: \"supabase_readonly_decision_packet\"",
  "decision",
  "proceed_to_ceo_review",
  "ready_for_ceo_decision",
  "runPreflight",
  "scripts/report-supabase-readonly-local-preflight.mjs",
  "nextRemoteCommand: blocked ? null : preflight.nextRemoteCommand",
  "warningCount",
  "boundary.status !== \"ok\"",
  "scoreSourceRealEnabled: false",
  "connectionAttempted: false",
  "sqlExecuted: false",
  "mutations: false",
  "secretsPrinted: false",
  "rowPayloadsPrinted: false",
  "publicClaimsChanged: false",
  "recommendedWorkMix",
  "CEO reviews one guarded read-only run",
  "any request to write Supabase, run SQL, ingest market rows, or set scoreSource=real"
];

const forbidden = [
  "@supabase/supabase-js",
  "createclient",
  "fetch(",
  ".from(",
  ".select(",
  ".insert(",
  ".upsert(",
  ".update(",
  ".delete(",
  ".rpc(",
  "insert into",
  "delete from",
  "truncate",
  "drop table",
  "alter table",
  "create table",
  "writefilesync",
  "appendfilesync",
  "process.env"
];

const packageScript = packageJson.scripts?.["report:supabase-readonly-decision"];
const packageScriptOk = packageScript === "node scripts/report-supabase-readonly-decision.mjs";
const reviewGateRunsChecker = reviewGate.includes(checkerPath);
const reviewGateDoesNotRunReporter = !reviewGate.includes(scriptPath);
const missing = required.filter((phrase) => !source.includes(phrase));
const blocked = forbidden.filter((phrase) => normalized.includes(phrase));
const failures = [
  ...missing.map((phrase) => `missing:${phrase}`),
  ...blocked.map((phrase) => `forbidden:${phrase}`),
  ...(packageScriptOk ? [] : [`packageScript:${packageScript ?? "missing"}`]),
  ...(reviewGateRunsChecker ? [] : ["reviewGateMissingChecker"]),
  ...(reviewGateDoesNotRunReporter ? [] : ["reviewGateRunsDecisionReporter"])
];

console.log(
  JSON.stringify(
    {
      failures,
      packageScript,
      report: scriptPath,
      status: failures.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (failures.length > 0) {
  process.exitCode = 1;
}
