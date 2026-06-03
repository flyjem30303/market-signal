import fs from "node:fs";

const componentPath = "src/components/home-runtime-status-panel.tsx";
const libPath = "src/lib/row-coverage-second-attempt-readiness.ts";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [componentPath, libPath, cssPath, packagePath, reviewGatePath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const required = [
  [componentPath, "getRowCoverageSecondAttemptReadiness"],
  [componentPath, "Row coverage"],
  [componentPath, "scoreSource=real"],
  [componentPath, "查看 CEO/PM briefing"],
  [componentPath, "runtime_next_briefing"],
  [libPath, "getRowCoverageSecondAttemptReadiness"],
  [libPath, "local_ready_remote_paused"],
  [libPath, "publicDataSource: \"mock\""],
  [libPath, "scoreSource: \"mock\""],
  [libPath, "remote_paused"],
  [libPath, "Do not run SQL, write Supabase"],
  [cssPath, "repeat(auto-fit, minmax(150px"],
  [packagePath, "\"check:row-coverage-readiness-ui-wiring\": \"node scripts/check-row-coverage-readiness-ui-wiring.mjs\""],
  [reviewGatePath, "scripts/check-row-coverage-readiness-ui-wiring.mjs"]
];

const forbidden = [
  [componentPath, "@supabase/supabase-js"],
  [componentPath, "createClient"],
  [componentPath, "fetch("],
  [componentPath, ".from("],
  [componentPath, "process.env"],
  [componentPath, "scoreSource: \"real\""],
  [libPath, "@supabase/supabase-js"],
  [libPath, "createClient"],
  [libPath, "fetch("],
  [libPath, ".from("],
  [libPath, "process.env"],
  [libPath, "scoreSource: \"real\""]
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
