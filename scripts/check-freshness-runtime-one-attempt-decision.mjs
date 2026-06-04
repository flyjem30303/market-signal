import fs from "node:fs";

const libPath = "src/lib/freshness-runtime-one-attempt-decision.ts";
const readinessPath = "src/lib/freshness-runtime-readiness-contract.ts";
const panelPath = "src/components/runtime-readiness-panel.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const runnerPath = "scripts/run-freshness-runtime-read-once.mjs";

const files = new Map(
  [libPath, readinessPath, panelPath, cssPath, packagePath, reviewGatePath, runnerPath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [libPath, "FreshnessRuntimeOneAttemptDecision"],
  [libPath, "getFreshnessRuntimeOneAttemptDecision"],
  [libPath, "displayStatus"],
  [libPath, "displayHeadline"],
  [libPath, "displayNextAction"],
  [libPath, "displayStopLine"],
  [libPath, "displayRollbackLabel"],
  [libPath, "displayRollbackLine"],
  [libPath, "displayCommandLabel"],
  [libPath, "等待一次性明確授權"],
  [libPath, "必須由 CEO 明確點名一次"],
  [libPath, "回復目標維持 mock / disabled"],
  [libPath, "遠端唯讀命令已保留，尚未執行"],
  [libPath, "freshness_runtime_one_attempt_decision"],
  [libPath, "ready_for_explicit_one_attempt_request"],
  [libPath, "requires_explicit_ceo_named_attempt"],
  [libPath, "canExecuteAutomatically: false"],
  [libPath, "DATA_FRESHNESS_SOURCE=supabase"],
  [libPath, "DATA_FRESHNESS_SUPABASE_READS=enabled"],
  [libPath, "NEXT_PUBLIC_DATA_SOURCE=mock"],
  [libPath, "FRESHNESS_RUNTIME_READ_ONCE_CONFIRMATION=CEO_APPROVED_ONE_READ_ONLY_FRESHNESS_RUNTIME_ATTEMPT"],
  [libPath, "node scripts/run-freshness-runtime-read-once.mjs"],
  [libPath, "readiness.prechecks.map"],
  [libPath, "rollbackTarget: readiness.baselineEnvironment"],
  [libPath, "publicDataSource: \"mock\""],
  [libPath, "scoreSource: \"mock\""],
  [libPath, "does not execute the runner"],
  [libPath, "does not connect to Supabase"],
  [panelPath, "getFreshnessRuntimeOneAttemptDecision"],
  [panelPath, "freshnessRuntimeOneAttemptDecision"],
  [panelPath, "runtime-freshness-one-attempt-decision"],
  [panelPath, "Freshness runtime one-attempt decision"],
  [panelPath, "freshnessRuntimeOneAttemptDecision.displayStatus"],
  [panelPath, "freshnessRuntimeOneAttemptDecision.displayHeadline"],
  [panelPath, "freshnessRuntimeOneAttemptDecision.displayNextAction"],
  [panelPath, "freshnessRuntimeOneAttemptDecision.displayStopLine"],
  [panelPath, "freshnessRuntimeOneAttemptDecision.displayRollbackLabel"],
  [panelPath, "freshnessRuntimeOneAttemptDecision.displayRollbackLine"],
  [panelPath, "freshnessRuntimeOneAttemptDecision.displayCommandLabel"],
  [cssPath, ".runtime-freshness-one-attempt-decision"],
  [packagePath, "\"check:freshness-runtime-one-attempt-decision\": \"node scripts/check-freshness-runtime-one-attempt-decision.mjs\""],
  [reviewGatePath, "scripts/check-freshness-runtime-one-attempt-decision.mjs"],
  [runnerPath, "const REQUIRED_CONFIRMATION = \"CEO_APPROVED_ONE_READ_ONLY_FRESHNESS_RUNTIME_ATTEMPT\""],
  [runnerPath, "process.env.FRESHNESS_RUNTIME_READ_ONCE_CONFIRMATION !== REQUIRED_CONFIRMATION"],
  [runnerPath, "process.env.NEXT_PUBLIC_DATA_SOURCE !== \"mock\""],
  [runnerPath, "process.env.DATA_FRESHNESS_SOURCE !== \"supabase\""],
  [runnerPath, "process.env.DATA_FRESHNESS_SUPABASE_READS !== \"enabled\""]
];

const forbidden = [
  [libPath, "@supabase/supabase-js"],
  [libPath, "createClient"],
  [libPath, "fetch("],
  [libPath, ".from("],
  [libPath, ".insert("],
  [libPath, ".update("],
  [libPath, ".delete("],
  [libPath, "process.env"],
  [libPath, "node:fs"],
  [libPath, "canExecuteAutomatically: true"],
  [libPath, "publicDataSource: \"supabase\""],
  [libPath, "scoreSource: \"real\""],
  [panelPath, "publicDataSource: \"supabase\""],
  [panelPath, "scoreSource: \"real\""]
];

const uiInternalWordingForbidden = [
  [panelPath, ">{freshnessRuntimeOneAttemptDecision.status}</strong>"],
  [panelPath, "Approval: {freshnessRuntimeOneAttemptDecision.approvalState}"],
  [panelPath, "automatic execution"],
  [panelPath, "freshnessRuntimeOneAttemptDecision.canExecuteAutomatically"],
  [panelPath, ">{freshnessRuntimeOneAttemptDecision.nextAction}</p>"],
  [panelPath, ">{freshnessRuntimeOneAttemptDecision.stopLine}</p>"],
  [panelPath, "DATA_FRESHNESS_SOURCE={freshnessRuntimeOneAttemptDecision.rollbackTarget.dataFreshnessSource}"],
  [panelPath, "Reads {freshnessRuntimeOneAttemptDecision.rollbackTarget.supabaseRuntimeReads}"],
  [panelPath, ">{freshnessRuntimeOneAttemptDecision.mode}</strong>"]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = [
  ...forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`),
  ...uiInternalWordingForbidden
    .filter(([file, phrase]) => read(file).includes(phrase))
    .map(([file, phrase]) => `${file}: UI still renders internal one-attempt wording ${phrase}`)
];

console.log(
  JSON.stringify(
    {
      blocked,
      missing,
      status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

function read(file) {
  return files.get(file) ?? "";
}
