import fs from "node:fs";

const helperPath = "src/lib/post-readonly-runtime-state.ts";
const homePath = "src/components/home-runtime-status-panel.tsx";
const stockPath = "src/components/stock-runtime-at-a-glance.tsx";
const briefingPath = "src/components/runtime-readiness-panel.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [helperPath, homePath, stockPath, briefingPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [helperPath, "PostReadonlyRuntimeState"],
  [helperPath, "getPostReadonlyRuntimeState"],
  [helperPath, "readonly_verified_mock_only"],
  [helperPath, "objectsReachable: evidence.objects.length"],
  [helperPath, "publicDataSource: \"mock\""],
  [helperPath, "scoreSource: \"mock\""],
  [helperPath, "Supabase reachability is accepted as backend evidence only"],
  [helperPath, "Do not convert readonly reachability into writes"],
  [homePath, "getPostReadonlyRuntimeState"],
  [homePath, "postReadonlyRuntime.objectsReachable"],
  [homePath, "Post-readonly next gate"],
  [stockPath, "getPostReadonlyRuntimeState"],
  [stockPath, "postReadonlyRuntime.userFacingSummary"],
  [stockPath, "postReadonlyRuntime.stopLine"],
  [briefingPath, "getPostReadonlyRuntimeState"],
  [briefingPath, "Post-readonly runtime"],
  [briefingPath, "postReadonlyRuntime.userFacingSummary"],
  [cssPath, ".post-readonly-runtime-card"],
  [packagePath, "\"check:post-readonly-runtime-state\": \"node scripts/check-post-readonly-runtime-state.mjs\""],
  [reviewGatePath, "scripts/check-post-readonly-runtime-state.mjs"]
];

const forbidden = [
  [helperPath, "@supabase/supabase-js"],
  [helperPath, "createClient"],
  [helperPath, "fetch("],
  [helperPath, ".from("],
  [helperPath, ".insert("],
  [helperPath, ".update("],
  [helperPath, ".delete("],
  [helperPath, "process.env"],
  [helperPath, "node:fs"],
  [helperPath, "publicDataSource: \"supabase\""],
  [helperPath, "scoreSource: \"real\""],
  [helperPath, "scoreSource=real approved"],
  [stockPath, "scoreSource=real approved"],
  [briefingPath, "scoreSource=real approved"]
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
