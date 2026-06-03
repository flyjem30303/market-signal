import fs from "node:fs";

const runtimePath = "src/lib/runtime-readiness-score.ts";
const actionPath = "src/lib/home-runtime-action-summary.ts";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [runtimePath, actionPath, packagePath, reviewGatePath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const required = [
  [runtimePath, "Runtime passed Supabase object reachability, but public runtime remains mock-only"],
  [runtimePath, "Mock runtime guard"],
  [runtimePath, "Supabase object reachability"],
  [runtimePath, "Row coverage readiness"],
  [runtimePath, "Public claim boundary"],
  [runtimePath, "Investment credibility"],
  [runtimePath, "freshness interpretation"],
  [runtimePath, "public source remains mock"],
  [runtimePath, "scoreSource=real claim"],
  [runtimePath, "npm run report:supabase-readonly-preflight"],
  [runtimePath, "npm run db:readonly-validate"],
  [actionPath, "Mock MVP runtime guard is active"],
  [actionPath, "freshness readonly metadata are review evidence only"],
  [actionPath, "publicDataSource=supabase"],
  [actionPath, "scoreSource=real remain blocked"],
  [actionPath, "cannot promote publicDataSource or scoreSource without a separate gate"],
  [packagePath, "\"check:runtime-readiness-language-quality\": \"node scripts/check-runtime-readiness-language-quality.mjs\""],
  [reviewGatePath, "scripts/check-runtime-readiness-language-quality.mjs"]
];

const mojibakeFragments = [
  "�",
  "銝",
  "嚗",
  "蝣",
  "摰",
  "璅",
  "鞈",
  "撣",
  "憸",
  "隞",
  "砍",
  "靘",
  "甇",
  "蝬",
  "脣",
  "蝺"
];

const forbidden = [
  ...mojibakeFragments.flatMap((fragment) => [
    [runtimePath, fragment],
    [actionPath, fragment]
  ]),
  [runtimePath, "@supabase/supabase-js"],
  [runtimePath, "createClient"],
  [runtimePath, "fetch("],
  [runtimePath, ".from("],
  [runtimePath, ".insert("],
  [runtimePath, ".update("],
  [runtimePath, ".delete("],
  [runtimePath, "process.env"],
  [runtimePath, "publicDataSource: \"supabase\""],
  [runtimePath, "scoreSource: \"real\""],
  [actionPath, "@supabase/supabase-js"],
  [actionPath, "createClient"],
  [actionPath, "fetch("],
  [actionPath, ".from("],
  [actionPath, ".insert("],
  [actionPath, ".update("],
  [actionPath, ".delete("],
  [actionPath, "process.env"],
  [actionPath, "publicDataSource: \"supabase\""],
  [actionPath, "scoreSource: \"real\""]
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
