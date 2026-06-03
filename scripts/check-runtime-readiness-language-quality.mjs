import fs from "node:fs";

const runtimePath = "src/lib/runtime-readiness-score.ts";
const actionPath = "src/lib/home-runtime-action-summary.ts";
const componentPath = "src/components/runtime-readiness-panel.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [runtimePath, actionPath, componentPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [runtimePath, "Runtime passed Supabase object reachability, but public runtime remains mock-only"],
  [runtimePath, "displayHeadline"],
  [runtimePath, "displayNextDecision"],
  [runtimePath, "displayLabel"],
  [runtimePath, "displayNextAction"],
  [runtimePath, "後端唯讀可達性已確認，但公開網站仍維持模擬訊號"],
  [runtimePath, "下一步先整理資料表形狀、資料新鮮度解讀與畫面狀態"],
  [runtimePath, "模擬狀態保護"],
  [runtimePath, "資料表可讀性"],
  [runtimePath, "資料完整度準備"],
  [runtimePath, "公開宣稱邊界"],
  [runtimePath, "投資可信度"],
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
  [componentPath, "readiness.displayHeadline"],
  [componentPath, "readiness.displayNextDecision"],
  [componentPath, "lane.displayLabel"],
  [componentPath, "lane.displayNextAction"],
  [actionPath, "Supabase object reachability is verified as backend evidence only"],
  [actionPath, "Runtime remains mock-only"],
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

const uiInternalWordingForbidden = [
  [componentPath, "readiness.headline"],
  [componentPath, "readiness.nextDecision"],
  [componentPath, ">{lane.label}</strong>"],
  [componentPath, ">{lane.nextAction}</p>"]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = [
  ...forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`),
  ...uiInternalWordingForbidden
    .filter(([file, phrase]) => read(file).includes(phrase))
    .map(([file, phrase]) => `${file}: UI still renders internal runtime wording ${phrase}`)
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
