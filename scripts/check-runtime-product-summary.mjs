import fs from "node:fs";

const helperPath = "src/lib/runtime-product-summary.ts";
const homePath = "src/components/home-runtime-status-panel.tsx";
const stockPath = "src/components/stock-runtime-at-a-glance.tsx";
const railPath = "src/components/runtime-transition-rail.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [helperPath, homePath, stockPath, railPath, cssPath, packagePath, reviewGatePath].map((file) => [
    file,
    fs.readFileSync(file, "utf8")
  ])
);

const required = [
  [helperPath, "RuntimeProductSummary"],
  [helperPath, "RuntimeProductSummaryItem"],
  [helperPath, "getRuntimeProductSummary"],
  [helperPath, "displayLabel"],
  [helperPath, "displayTitle"],
  [helperPath, "displayBody"],
  [helperPath, "readonlyDecision"],
  [helperPath, "現在可用"],
  [helperPath, "尚未正式"],
  [helperPath, "下一關"],
  [helperPath, "資料檢查"],
  [helperPath, "正式資料尚未啟用"],
  [helperPath, "資料上線前的必要檢查"],
  [helperPath, "合法免費可自動化來源"],
  [helperPath, "示範 30 秒狀態與 3 分鐘觀察流程"],
  [homePath, "getRuntimeProductSummary"],
  [homePath, "runtime-product-summary"],
  [homePath, "productSummary.useNow"],
  [homePath, "productSummary.notLiveYet"],
  [homePath, "productSummary.nextGate"],
  [homePath, "productSummary.readonlyDecision"],
  [railPath, "getRuntimeProductSummary"],
  [railPath, "getPostReadonlyRuntimeState"],
  [stockPath, "示範資料 / 示範分數"],
  [cssPath, ".runtime-product-summary"],
  [cssPath, ".runtime-next-links"],
  [cssPath, "repeat(4, minmax(0, 1fr))"],
  [packagePath, "\"check:runtime-product-summary\": \"node scripts/check-runtime-product-summary.mjs\""],
  [reviewGatePath, "scripts/check-runtime-product-summary.mjs"]
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
  [homePath, "productSummary.networkBlocker"],
  [stockPath, "productSummary.networkBlocker"],
  [homePath, "scoreSource: \"real\""],
  [stockPath, "scoreSource: \"real\""]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

for (const file of [helperPath, homePath, stockPath, railPath]) {
  for (const marker of findMojibakeMarkers(read(file))) blocked.push(`${file}: ${marker}`);
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

function findMojibakeMarkers(text) {
  const markers = [];
  if (/\uFFFD/u.test(text)) markers.push("replacement-character");
  if (/[\uE000-\uF8FF]/u.test(text)) markers.push("private-use-codepoint");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  return markers;
}
