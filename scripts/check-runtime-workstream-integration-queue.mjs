import fs from "node:fs";

const libPath = "src/lib/runtime-workstream-integration-queue.ts";
const panelPath = "src/components/runtime-readiness-panel.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [libPath, panelPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [libPath, "RuntimeWorkstreamIntegrationQueue"],
  [libPath, "getRuntimeWorkstreamIntegrationQueue"],
  [libPath, "runtime_workstream_integration_queue"],
  [libPath, "runtime_readiness_integration"],
  [libPath, "pm_runtime_mainline"],
  [libPath, "a1_evidence_handoff"],
  [libPath, "a2_public_copy_gate"],
  [libPath, "i_launch_operations_guard"],
  [libPath, "pmRuntime: 70"],
  [libPath, "a1Evidence: 20"],
  [libPath, "a2PublicCopy: 10"],
  [libPath, "iLaunchOps: 0"],
  [libPath, "I is accepted as a launch-readiness guard"],
  [libPath, "not an implementation lane or deployment trigger"],
  [libPath, "launch, environment, credential, DNS, monitoring, rollback"],
  [libPath, "Do not wait for A1, A2, or I"],
  [libPath, "publicDataSource: \"mock\""],
  [libPath, "scoreSource: \"mock\""],
  [libPath, "does not run SQL"],
  [libPath, "write Supabase"],
  [libPath, "create staging rows"],
  [libPath, "modify daily_prices"],
  [libPath, "fetch or ingest raw market data"],
  [libPath, "deploy"],
  [libPath, "change DNS"],
  [libPath, "change cloud settings"],
  [libPath, "enter secrets"],
  [panelPath, "getRuntimeWorkstreamIntegrationQueue"],
  [panelPath, "runtimeWorkstreamIntegrationQueue"],
  [panelPath, "runtime-workstream-integration-queue"],
  [panelPath, "Runtime workstream integration queue"],
  [panelPath, "runtimeWorkstreamIntegrationQueue.workMix.iLaunchOps"],
  [panelPath, "runtimeWorkstreamIntegrationQueue.items.map"],
  [panelPath, "item.acceptanceSignal"],
  [panelPath, "item.integrationAction"],
  [cssPath, ".runtime-workstream-integration-queue"],
  [packagePath, "\"check:runtime-workstream-integration-queue\": \"node scripts/check-runtime-workstream-integration-queue.mjs\""],
  [reviewGatePath, "scripts/check-runtime-workstream-integration-queue.mjs"]
];

const forbidden = [
  [libPath, "@supabase/supabase-js"],
  [libPath, "createClient"],
  [libPath, "fetch("],
  [libPath, ".from("],
  [libPath, ".insert("],
  [libPath, ".update("],
  [libPath, ".delete("],
  [libPath, ".upsert("],
  [libPath, "process.env"],
  [libPath, "node:fs"],
  [libPath, "publicDataSource: \"supabase\""],
  [libPath, "scoreSource: \"real\""],
  [panelPath, "publicDataSource: \"supabase\""],
  [panelPath, "scoreSource: \"real\""]
];

const missing = required
  .filter(([file, phrase]) => !read(file).includes(phrase))
  .map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden
  .filter(([file, phrase]) => read(file).includes(phrase))
  .map(([file, phrase]) => `${file}: ${phrase}`);

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
