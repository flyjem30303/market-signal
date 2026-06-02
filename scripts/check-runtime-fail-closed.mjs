import fs from "node:fs";

const failClosedPath = "src/lib/runtime-fail-closed.ts";
const homePath = "src/components/home-runtime-status-panel.tsx";
const stockPath = "src/components/stock-runtime-at-a-glance.tsx";
const readinessPath = "src/components/runtime-readiness-panel.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [failClosedPath, homePath, stockPath, readinessPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [failClosedPath, "RuntimeFailClosedSummary"],
  [failClosedPath, "getRuntimeFailClosedSummary"],
  [failClosedPath, "failClosedState: \"active\""],
  [failClosedPath, "allowedState: \"mock_runtime_only\""],
  [failClosedPath, "publicDataSource: \"mock\""],
  [failClosedPath, "scoreSource: \"mock\""],
  [failClosedPath, "Supabase-backed public data"],
  [failClosedPath, "SQL-backed scoring"],
  [failClosedPath, "market-data ingestion"],
  [failClosedPath, "publicDataSource=supabase"],
  [failClosedPath, "scoreSource=real"],
  [homePath, "getRuntimeFailClosedSummary"],
  [homePath, "failClosed.failClosedState"],
  [homePath, "runtime-fail-closed-card"],
  [stockPath, "getRuntimeFailClosedSummary"],
  [stockPath, "failClosed.failClosedState"],
  [stockPath, "runtime-fail-closed-card"],
  [readinessPath, "getRuntimeFailClosedSummary"],
  [readinessPath, "failClosed.failClosedState"],
  [readinessPath, "runtime-fail-closed-card"],
  [cssPath, ".runtime-fail-closed-card"],
  [packagePath, "\"check:runtime-fail-closed\": \"node scripts/check-runtime-fail-closed.mjs\""],
  [reviewGatePath, "scripts/check-runtime-fail-closed.mjs"]
];

const forbidden = [
  [failClosedPath, "@supabase/supabase-js"],
  [failClosedPath, "createClient"],
  [failClosedPath, "fetch("],
  [failClosedPath, ".from("],
  [failClosedPath, ".insert("],
  [failClosedPath, ".update("],
  [failClosedPath, ".delete("],
  [failClosedPath, "process.env"],
  [failClosedPath, "node:fs"],
  [failClosedPath, "publicDataSource: \"supabase\""],
  [failClosedPath, "scoreSource: \"real\""],
  [homePath, "project-progress-score"],
  [stockPath, "project-progress-score"],
  [readinessPath, "project-progress-score"]
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
