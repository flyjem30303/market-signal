import fs from "node:fs";
import { spawnSync } from "node:child_process";

const libPath = "src/lib/freshness-runtime-prerun-bundle.ts";
const decisionPath = "src/lib/freshness-runtime-one-attempt-decision.ts";
const panelPath = "src/components/runtime-readiness-panel.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [libPath, decisionPath, panelPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [libPath, "FreshnessRuntimePreRunBundle"],
  [libPath, "getFreshnessRuntimePreRunBundle"],
  [libPath, "displayStatus"],
  [libPath, "displayHeadline"],
  [libPath, "displayNextAction"],
  [libPath, "displayStopLine"],
  [libPath, "displayImmediateChecksLabel"],
  [libPath, "displayFinalGate"],
  [libPath, "displaySourceLine"],
  [libPath, "本機預檢就緒，遠端執行尚未授權"],
  [libPath, "新鮮度遠端讀取前，必須先完成同一批本機預檢"],
  [libPath, "公開資料來源與評分來源都維持 mock"],
  [libPath, "freshness_runtime_prerun_bundle"],
  [libPath, "ready_for_same_slice_pre_run_checks"],
  [libPath, "automaticRemoteExecution: false"],
  [libPath, "node scripts/check-freshness-runtime-readiness-contract.mjs"],
  [libPath, "node scripts/check-freshness-runtime-one-attempt-decision.mjs"],
  [libPath, "node scripts/check-cp3-freshness-runtime-wrapper-local-smoke.mjs"],
  [libPath, "node scripts/check-cp3-freshness-runtime-read-once-guarded-runner.mjs"],
  [libPath, "node scripts/check-freshness-runtime-read-once-pre-remote-behavior.mjs"],
  [libPath, "finalProjectGate: \"node scripts/check-review-gates.mjs\""],
  [libPath, "publicDataSource: \"mock\""],
  [libPath, "scoreSource: \"mock\""],
  [libPath, "does not execute the runner"],
  [libPath, "does not connect to Supabase"],
  [panelPath, "getFreshnessRuntimePreRunBundle"],
  [panelPath, "freshnessRuntimePreRunBundle"],
  [panelPath, "runtime-freshness-prerun-bundle"],
  [panelPath, "Freshness runtime pre-run bundle"],
  [panelPath, "freshnessRuntimePreRunBundle.displayStatus"],
  [panelPath, "freshnessRuntimePreRunBundle.displayHeadline"],
  [panelPath, "freshnessRuntimePreRunBundle.displayNextAction"],
  [panelPath, "freshnessRuntimePreRunBundle.displayStopLine"],
  [panelPath, "freshnessRuntimePreRunBundle.displayImmediateChecksLabel"],
  [panelPath, "freshnessRuntimePreRunBundle.displayFinalGate"],
  [panelPath, "freshnessRuntimePreRunBundle.displaySourceLine"],
  [cssPath, ".runtime-freshness-prerun-bundle"],
  [packagePath, "\"check:freshness-runtime-prerun-bundle\": \"node scripts/check-freshness-runtime-prerun-bundle.mjs\""],
  [reviewGatePath, "scripts/check-freshness-runtime-prerun-bundle.mjs"],
  [decisionPath, "canExecuteAutomatically: false"]
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
  [libPath, "automaticRemoteExecution: true"],
  [libPath, "publicDataSource: \"supabase\""],
  [libPath, "scoreSource: \"real\""],
  [panelPath, "publicDataSource: \"supabase\""],
  [panelPath, "scoreSource: \"real\""]
];

const uiInternalWordingForbidden = [
  [panelPath, ">{freshnessRuntimePreRunBundle.status}</strong>"],
  [panelPath, "One-attempt status: {freshnessRuntimePreRunBundle.oneAttemptStatus}"],
  [panelPath, ">{freshnessRuntimePreRunBundle.nextAction}</p>"],
  [panelPath, ">{freshnessRuntimePreRunBundle.stopLine}</p>"],
  [panelPath, "{freshnessRuntimePreRunBundle.immediateLocalChecks.length} checks"],
  [panelPath, ">{freshnessRuntimePreRunBundle.finalProjectGate}</strong>"],
  [panelPath, "Public {freshnessRuntimePreRunBundle.publicDataSource}; score"]
];

const precheckScripts = [
  "scripts/check-freshness-runtime-readiness-contract.mjs",
  "scripts/check-freshness-runtime-one-attempt-decision.mjs",
  "scripts/check-cp3-freshness-runtime-wrapper-local-smoke.mjs",
  "scripts/check-cp3-freshness-runtime-read-once-guarded-runner.mjs",
  "scripts/check-freshness-runtime-read-once-pre-remote-behavior.mjs"
];

const precheckResults = precheckScripts.map((script) => {
  const result = spawnSync(process.execPath, [script], {
    cwd: process.cwd(),
    encoding: "utf8",
    env: safeEnv()
  });

  return {
    exitCode: result.status,
    pass: result.status === 0,
    script
  };
});

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = [
  ...forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`),
  ...uiInternalWordingForbidden
    .filter(([file, phrase]) => read(file).includes(phrase))
    .map(([file, phrase]) => `${file}: UI still renders internal prerun wording ${phrase}`)
];
const failedPrechecks = precheckResults.filter((result) => !result.pass);

console.log(
  JSON.stringify(
    {
      blocked,
      failedPrechecks,
      missing,
      precheckResults,
      status: missing.length === 0 && blocked.length === 0 && failedPrechecks.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0 || blocked.length > 0 || failedPrechecks.length > 0) {
  process.exitCode = 1;
}

function read(file) {
  return files.get(file) ?? "";
}

function safeEnv() {
  return {
    PATH: process.env.PATH,
    SystemRoot: process.env.SystemRoot,
    TEMP: process.env.TEMP,
    TMP: process.env.TMP
  };
}
