import fs from "node:fs";

const runtimePath = "src/lib/runtime-readiness-score.ts";
const actionPath = "src/lib/home-runtime-action-summary.ts";
const readinessPanelPath = "src/components/runtime-readiness-panel.tsx";
const progressPanelPath = "src/components/project-progress-panel.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [runtimePath, actionPath, readinessPanelPath, progressPanelPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [runtimePath, "Runtime 已通過 Supabase 物件可達性檢查，但公開狀態仍維持 mock-only"],
  [runtimePath, "下一步由 PM 收斂 runtime guard summary"],
  [runtimePath, "schema、freshness、row coverage、data quality 與 source-depth"],
  [runtimePath, "另行命名的邊界"],
  [runtimePath, "Mock runtime guard"],
  [runtimePath, "Supabase readonly reachability"],
  [runtimePath, "Row coverage readiness"],
  [runtimePath, "Public claim boundary"],
  [runtimePath, "Investment credibility"],
  [runtimePath, "維持公開頁面對齊 mock-only、not_ready 與 blocked 狀態"],
  [runtimePath, "已接受 readonly object reachability 作為後端證據"],
  [runtimePath, "local-ready、remote-paused"],
  [runtimePath, "不得暗示正式資料、投資建議或 production readiness"],
  [runtimePath, "scoreSource=real 宣稱"],
  [runtimePath, "displayHeadline"],
  [runtimePath, "displayNextDecision"],
  [runtimePath, "displayLabel"],
  [runtimePath, "displayNextAction"],
  [runtimePath, "npm run report:supabase-readonly-preflight"],
  [runtimePath, "npm run db:readonly-validate"],
  [readinessPanelPath, "readiness.displayHeadline"],
  [readinessPanelPath, "readiness.displayNextDecision"],
  [readinessPanelPath, "lane.displayLabel"],
  [readinessPanelPath, "lane.displayNextAction"],
  [progressPanelPath, "runtime.displayHeadline"],
  [progressPanelPath, "runtime.displayNextDecision"],
  [actionPath, "Supabase object reachability is verified as backend evidence only"],
  [actionPath, "Runtime remains mock-only"],
  [actionPath, "publicDataSource=supabase"],
  [actionPath, "scoreSource=real remain blocked"],
  [actionPath, "cannot promote publicDataSource or scoreSource without a separate gate"],
  [packagePath, "\"check:runtime-readiness-language-quality\": \"node scripts/check-runtime-readiness-language-quality.mjs\""],
  [reviewGatePath, "scripts/check-runtime-readiness-language-quality.mjs"]
];

const forbidden = [
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
  [actionPath, "scoreSource: \"real\""],
  [readinessPanelPath, "readiness.headline"],
  [readinessPanelPath, "readiness.nextDecision"],
  [readinessPanelPath, ">{lane.label}</strong>"],
  [readinessPanelPath, ">{lane.nextAction}</p>"],
  [progressPanelPath, "runtime.status"],
  [progressPanelPath, "runtime.nextDecision"]
];

const mojibakePatterns = [/[\uE000-\uF8FF\uFFFD]/u, /[嚗餅銝蝡舫摰祇雿輻閮踹]{2,}/u, /\?{2,}/u];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

for (const file of [runtimePath]) {
  for (const pattern of mojibakePatterns) {
    if (pattern.test(read(file))) {
      blocked.push(`${file}: mojibake runtime display copy ${String(pattern)}`);
    }
  }
}

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
