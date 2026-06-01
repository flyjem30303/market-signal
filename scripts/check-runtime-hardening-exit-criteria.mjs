import fs from "node:fs";

const libPath = "src/lib/runtime-hardening-exit-criteria.ts";
const componentPath = "src/components/runtime-readiness-panel.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [libPath, componentPath, packagePath, reviewGatePath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const required = [
  [libPath, "getRuntimeHardeningExitCriteria"],
  [libPath, "mock_runtime_hardening_exit_review"],
  [libPath, "local_ready_blocked_by_external_gates"],
  [libPath, "publicDataSource: \"mock\""],
  [libPath, "scoreSource: \"mock\""],
  [libPath, "Supabase readonly is a separate named action"],
  [libPath, "SQL, writes, and ingestion stay off"],
  [libPath, "Do not set publicDataSource=supabase or scoreSource=real"],
  [componentPath, "getRuntimeHardeningExitCriteria"],
  [componentPath, "runtimeHardeningExit.stage"],
  [componentPath, "Runtime hardening exit"],
  [componentPath, "runtimeHardeningExit.stopLine"],
  [packagePath, "\"check:runtime-hardening-exit-criteria\": \"node scripts/check-runtime-hardening-exit-criteria.mjs\""],
  [reviewGatePath, "scripts/check-runtime-hardening-exit-criteria.mjs"]
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
  [libPath, "publicDataSource: \"supabase\""],
  [libPath, "scoreSource: \"real\""],
  [componentPath, "fetch("],
  [componentPath, "createClient"],
  [componentPath, "process.env"]
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
