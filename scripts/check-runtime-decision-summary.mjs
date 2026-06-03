import fs from "node:fs";

const helperPath = "src/lib/runtime-decision-summary.ts";
const homePath = "src/components/home-runtime-status-panel.tsx";
const stockPath = "src/components/stock-runtime-at-a-glance.tsx";
const briefingPath = "src/app/briefing/page.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [helperPath, homePath, stockPath, briefingPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [helperPath, "RuntimeDecisionSummary"],
  [helperPath, "getRuntimeDecisionSummary"],
  [helperPath, "runtime_decision_summary"],
  [helperPath, "mock_only_runtime_decision_ready"],
  [helperPath, "post_readonly_runtime_decision"],
  [helperPath, "post-readonly runtime decision"],
  [helperPath, "getHomeRuntimeActionSummary"],
  [helperPath, "getPostReadonlyRuntimeState"],
  [helperPath, "getRuntimeGateDecisionBrief"],
  [helperPath, "publicDataSource: \"mock\""],
  [helperPath, "scoreSource: \"mock\""],
  [helperPath, "Object reachability is accepted as backend evidence"],
  [helperPath, "Users can read mock-only signal direction"],
  [homePath, "getRuntimeDecisionSummary"],
  [homePath, "decisionSummary.currentProgressPercent"],
  [homePath, "decisionSummary.decisionLabel"],
  [homePath, "decisionSummary.safetyStopLine"],
  [stockPath, "getRuntimeDecisionSummary"],
  [stockPath, "decisionSummary.currentProgressPercent"],
  [stockPath, "decisionSummary.decisionLabel"],
  [stockPath, "decisionSummary.safetyStopLine"],
  [briefingPath, "getRuntimeDecisionSummary"],
  [briefingPath, "decisionSummary.userFacingNow"],
  [briefingPath, "decisionSummary.decisionLabel"],
  [briefingPath, "decisionSummary.safetyStopLine"],
  [briefingPath, "市場訊號晨報"],
  [briefingPath, "查看市場頁"],
  [briefingPath, "查看高風險標的"],
  [packagePath, "\"check:runtime-decision-summary\": \"node scripts/check-runtime-decision-summary.mjs\""],
  [reviewGatePath, "scripts/check-runtime-decision-summary.mjs"]
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
  [helperPath, "scoreSource: \"real\""],
  [helperPath, "publicDataSource: \"supabase\""],
  [homePath, "getHomeRuntimeActionSummary"],
  [stockPath, "getHomeRuntimeActionSummary"],
  [briefingPath, "getHomeRuntimeActionSummary"]
];

const mojibakePatterns = [
  /[�]/u,
  /\?[^\n"'<>]{0,8}[航亦]/u,
  /[銝蝡霈瘝嚗敺撌靘鞈璅鈭圾]/u
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

for (const file of [helperPath, homePath, stockPath, briefingPath]) {
  for (const pattern of mojibakePatterns) {
    if (pattern.test(read(file))) {
      blocked.push(`${file}: mojibake runtime decision copy ${String(pattern)}`);
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
