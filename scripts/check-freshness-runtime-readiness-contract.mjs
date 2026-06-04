import fs from "node:fs";

const libPath = "src/lib/freshness-runtime-readiness-contract.ts";
const panelPath = "src/components/runtime-readiness-panel.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const sourcePath = "src/lib/data-freshness-source.ts";
const repositoryPath = "src/lib/repositories/freshness-repository.ts";
const supabaseRepositoryPath = "src/lib/repositories/supabase-data-freshness-repository.ts";

const files = new Map(
  [
    libPath,
    panelPath,
    cssPath,
    packagePath,
    reviewGatePath,
    sourcePath,
    repositoryPath,
    supabaseRepositoryPath
  ].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const required = [
  [libPath, "FreshnessRuntimeReadinessContract"],
  [libPath, "getFreshnessRuntimeReadinessContract"],
  [libPath, "displayHeadline"],
  [libPath, "displayStatus"],
  [libPath, "displayBaseline"],
  [libPath, "displayCandidate"],
  [libPath, "displayNextDefaultAction"],
  [libPath, "displayStopLine"],
  [libPath, "新鮮度唯讀檢查可進入流程討論，但尚未執行"],
  [libPath, "可做流程決策，尚未授權執行"],
  [libPath, "目前公開網站仍使用 mock 新鮮度狀態"],
  [libPath, "下一步只討論從 data_runs 進行一次唯讀檢查"],
  [libPath, "這張合約不允許自動遠端讀取"],
  [libPath, "freshness_runtime_readiness_contract"],
  [libPath, "ready_for_process_only_decision"],
  [libPath, "dataRunsObject: \"only_runtime_read_candidate\""],
  [libPath, "dataFreshnessObject: \"blocked_remote_candidate\""],
  [libPath, "failureBehavior: \"fallback_to_mock_snapshot\""],
  [libPath, "dataFreshnessSource: \"mock\""],
  [libPath, "supabaseRuntimeReads: \"disabled\""],
  [libPath, "confirmation: \"CEO_APPROVED_ONE_READ_ONLY_FRESHNESS_RUNTIME_ATTEMPT\""],
  [libPath, "dataFreshnessSource: \"supabase\""],
  [libPath, "supabaseRuntimeReads: \"enabled\""],
  [libPath, "nextPublicDataSource: \"mock\""],
  [libPath, "node scripts/check-cp3-freshness-runtime-wrapper-local-smoke.mjs"],
  [libPath, "node scripts/check-cp3-freshness-runtime-read-once-guarded-runner.mjs"],
  [libPath, "node scripts/check-freshness-runtime-read-once-pre-remote-behavior.mjs"],
  [libPath, "node scripts/check-review-gates.mjs"],
  [libPath, "runtime repository dependency on data_freshness"],
  [libPath, "publicDataSource=supabase"],
  [libPath, "scoreSource=real"],
  [libPath, "Freshness runtime readiness does not approve automatic remote reads"],
  [panelPath, "getFreshnessRuntimeReadinessContract"],
  [panelPath, "freshnessRuntimeReadinessContract"],
  [panelPath, "runtime-freshness-readiness-contract"],
  [panelPath, "Freshness runtime read readiness contract"],
  [panelPath, "freshnessRuntimeReadinessContract.displayStatus"],
  [panelPath, "freshnessRuntimeReadinessContract.displayHeadline"],
  [panelPath, "freshnessRuntimeReadinessContract.displayBaseline"],
  [panelPath, "freshnessRuntimeReadinessContract.displayCandidate"],
  [panelPath, "freshnessRuntimeReadinessContract.displayStopLine"],
  [panelPath, "freshnessRuntimeReadinessContract.prechecks.map"],
  [cssPath, ".runtime-freshness-readiness-contract"],
  [packagePath, "\"check:freshness-runtime-readiness-contract\": \"node scripts/check-freshness-runtime-readiness-contract.mjs\""],
  [reviewGatePath, "scripts/check-freshness-runtime-readiness-contract.mjs"],
  [sourcePath, "env.DATA_FRESHNESS_SOURCE ?? \"mock\""],
  [sourcePath, "env.DATA_FRESHNESS_SUPABASE_READS === \"enabled\" ? \"enabled\" : \"disabled\""],
  [repositoryPath, "return createMockFreshnessRepository();"],
  [repositoryPath, "return createDataRunsFreshnessRepository(createSupabaseClient());"],
  [supabaseRepositoryPath, ".from(\"data_runs\")"]
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
  [libPath, "publicDataSource: \"supabase\""],
  [libPath, "scoreSource: \"real\""],
  [libPath, "automatic remote reads approved"],
  [libPath, "摨血"],
  [libPath, "隞"],
  [libPath, "銝"],
  [libPath, "嚗"],
  [libPath, "瘚"],
  [panelPath, "publicDataSource: \"supabase\""],
  [panelPath, "scoreSource: \"real\""],
  [sourcePath, "DATA_FRESHNESS_SOURCE ?? \"supabase\""],
  [sourcePath, "DATA_FRESHNESS_SUPABASE_READS === \"enabled\" ? \"enabled\" : \"enabled\""],
  [supabaseRepositoryPath, ".from(\"data_freshness\")"],
  [supabaseRepositoryPath, "from(table: \"data_freshness\")"]
];

const uiInternalWordingForbidden = [
  [panelPath, ">{freshnessRuntimeReadinessContract.status}</strong>"],
  [panelPath, "Baseline: DATA_FRESHNESS_SOURCE="],
  [panelPath, "Candidate: {freshnessRuntimeReadinessContract.dataRunsObject}"],
  [panelPath, ">{freshnessRuntimeReadinessContract.stopLine}</p>"]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = [
  ...forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`),
  ...uiInternalWordingForbidden
    .filter(([file, phrase]) => read(file).includes(phrase))
    .map(([file, phrase]) => `${file}: UI still renders internal freshness wording ${phrase}`)
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
