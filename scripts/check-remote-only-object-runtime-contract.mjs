import fs from "node:fs";

const libPath = "src/lib/remote-only-object-runtime-contract.ts";
const panelPath = "src/components/runtime-readiness-panel.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const repositoryPath = "src/lib/repositories/supabase-data-freshness-repository.ts";

const files = new Map(
  [libPath, panelPath, cssPath, packagePath, reviewGatePath, repositoryPath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [libPath, "RemoteOnlyRuntimeContract"],
  [libPath, "getRemoteOnlyObjectRuntimeContract"],
  [libPath, "remote_only_object_runtime_contract"],
  [libPath, "schema_shape_sanitized_run_2026_05_31"],
  [libPath, "market_assets"],
  [libPath, "model_runs"],
  [libPath, "data_freshness"],
  [libPath, "data_runs"],
  [libPath, "keep_data_runs_as_runtime_baseline"],
  [libPath, "runtimeRepositoryDependency: \"data_runs_only\""],
  [libPath, "local_mapping_required"],
  [libPath, "provenance_planning_only"],
  [libPath, "blocked_runtime_candidate"],
  [libPath, "Supabase reads from remote-only objects"],
  [libPath, "runtime repository dependency on data_freshness"],
  [libPath, "market_assets global runtime reads"],
  [libPath, "model_runs score provenance claims"],
  [libPath, "publicDataSource: \"mock\""],
  [libPath, "scoreSource: \"mock\""],
  [libPath, "Remote-only object contracts do not approve Supabase reads"],
  [panelPath, "getRemoteOnlyObjectRuntimeContract"],
  [panelPath, "remoteOnlyObjectContract"],
  [panelPath, "runtime-remote-only-object-contract"],
  [panelPath, "Remote-only object runtime contract"],
  [panelPath, "remoteOnlyObjectContract.objects.map"],
  [cssPath, ".runtime-remote-only-object-contract"],
  [packagePath, "\"check:remote-only-object-runtime-contract\": \"node scripts/check-remote-only-object-runtime-contract.mjs\""],
  [reviewGatePath, "scripts/check-remote-only-object-runtime-contract.mjs"],
  [repositoryPath, ".from(\"data_runs\")"]
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
  [libPath, "Supabase reads approved"],
  [libPath, "scoreSource=real approved"],
  [panelPath, "publicDataSource: \"supabase\""],
  [panelPath, "scoreSource: \"real\""],
  [repositoryPath, ".from(\"data_freshness\")"],
  [repositoryPath, "from(table: \"data_freshness\")"]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

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
