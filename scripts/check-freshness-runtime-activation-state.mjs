import fs from "node:fs";

const activationPath = "src/lib/freshness-runtime-activation.ts";
const panelPath = "src/components/runtime-readiness-panel.tsx";
const progressPath = "src/lib/project-progress-score.ts";

const files = new Map([activationPath, panelPath, progressPath].map((file) => [file, fs.readFileSync(file, "utf8")]));

const required = [
  [activationPath, "getFreshnessRuntimeActivationSummary"],
  [activationPath, "mock_only"],
  [activationPath, "readonly_metadata_open"],
  [activationPath, "automatedRemoteRun: false"],
  [activationPath, "connectionAttempted: false"],
  [activationPath, "sqlExecuted: false"],
  [activationPath, "writesEnabled: false"],
  [activationPath, "scoreSourceRealEnabled: false"],
  [activationPath, "nextPublicDataSource: \"mock\""],
  [activationPath, "DATA_FRESHNESS_SOURCE"],
  [activationPath, "DATA_FRESHNESS_SUPABASE_READS"],
  [activationPath, "NEXT_PUBLIC_DATA_SOURCE"],
  [activationPath, "must not run SQL, write Supabase, ingest market data, or set scoreSource=real"],
  [panelPath, "getFreshnessRuntimeActivationSummary"],
  [panelPath, "Freshness runtime activation"],
  [panelPath, "freshnessActivation.state"],
  [panelPath, "freshnessActivation.stopLine"],
  [progressPath, "Supabase readonly runtime activation"]
];

const forbidden = [
  [activationPath, "@supabase/supabase-js"],
  [activationPath, "createClient"],
  [activationPath, "fetch("],
  [activationPath, ".from("],
  [activationPath, ".insert("],
  [activationPath, ".update("],
  [activationPath, ".delete("],
  [activationPath, "automatedRemoteRun: true"],
  [activationPath, "connectionAttempted: true"],
  [activationPath, "sqlExecuted: true"],
  [activationPath, "writesEnabled: true"],
  [activationPath, "scoreSourceRealEnabled: true"],
  [activationPath, "nextPublicDataSource: \"supabase\""],
  [panelPath, "scoreSource=real approved"]
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
