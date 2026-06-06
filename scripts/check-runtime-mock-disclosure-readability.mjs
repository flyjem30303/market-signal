import fs from "node:fs";

const filesToRead = [
  "src/lib/runtime-product-summary.ts",
  "src/components/home-runtime-status-panel.tsx",
  "src/components/stock-runtime-at-a-glance.tsx",
  "src/components/trust-runtime-boundary-notice.tsx",
  "src/lib/public-runtime-boundary-copy.ts",
  "src/lib/post-readonly-runtime-state.ts",
  "package.json",
  "scripts/check-review-gates.mjs"
];

const files = new Map(filesToRead.map((file) => [file, fs.readFileSync(file, "utf8")]));

const required = [
  ["src/lib/runtime-product-summary.ts", "Use mock signals for reading only"],
  ["src/lib/runtime-product-summary.ts", "Real-data claims are not live"],
  ["src/lib/runtime-product-summary.ts", "Decide post-readonly runtime interpretation"],
  ["src/components/home-runtime-status-panel.tsx", "目前可閱讀 mock 訊號"],
  ["src/components/home-runtime-status-panel.tsx", "真實市場資料"],
  ["src/components/home-runtime-status-panel.tsx", "freshness metadata"],
  ["src/components/home-runtime-status-panel.tsx", "這是覆蓋率 readiness，不是公開完整覆蓋率宣稱"],
  ["src/components/home-runtime-status-panel.tsx", "公開內容只供資訊閱讀與產品理解"],
  ["src/components/home-runtime-status-panel.tsx", "scoreSource=real 仍需等待 PM 接受 gate"],
  ["src/components/stock-runtime-at-a-glance.tsx", "目前是可閱讀的 mock 訊號"],
  ["src/components/stock-runtime-at-a-glance.tsx", "不是即時市場資料、完整覆蓋率、正式模型結論或個人化投資建議"],
  ["src/components/stock-runtime-at-a-glance.tsx", "這是 readiness 訊息，不是公開完整覆蓋率承諾"],
  ["src/components/stock-runtime-at-a-glance.tsx", "scoreSource=real is not enabled"],
  ["src/components/trust-runtime-boundary-notice.tsx", "投資與資料限制：目前仍是 mock-only"],
  ["src/components/trust-runtime-boundary-notice.tsx", "不構成投資建議"],
  ["src/lib/public-runtime-boundary-copy.ts", "publicDataSource=mock; scoreSource=mock"],
  ["src/lib/public-runtime-boundary-copy.ts", "不得提供個人化投資建議"],
  ["src/lib/post-readonly-runtime-state.ts", "publicDataSource: \"mock\""],
  ["src/lib/post-readonly-runtime-state.ts", "scoreSource: \"mock\""],
  ["package.json", "\"check:runtime-mock-disclosure-readability\""],
  ["scripts/check-review-gates.mjs", "scripts/check-runtime-mock-disclosure-readability.mjs"]
];

const forbidden = [
  ["src/lib/runtime-product-summary.ts", "scoreSource=real is enabled"],
  ["src/lib/runtime-product-summary.ts", "publicDataSource=supabase is enabled"],
  ["src/components/home-runtime-status-panel.tsx", "scoreSource: \"real\""],
  ["src/components/home-runtime-status-panel.tsx", "publicDataSource: \"supabase\""],
  ["src/components/stock-runtime-at-a-glance.tsx", "scoreSource: \"real\""],
  ["src/components/stock-runtime-at-a-glance.tsx", "publicDataSource: \"supabase\""],
  ["src/components/trust-runtime-boundary-notice.tsx", "scoreSource: \"real\""],
  ["src/lib/post-readonly-runtime-state.ts", "scoreSource: \"real\""],
  ["src/lib/post-readonly-runtime-state.ts", "publicDataSource: \"supabase\""]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

for (const file of [
  "src/components/home-runtime-status-panel.tsx",
  "src/components/stock-runtime-at-a-glance.tsx",
  "src/components/trust-runtime-boundary-notice.tsx",
  "src/lib/public-runtime-boundary-copy.ts"
]) {
  const markers = findMojibakeMarkers(read(file));
  for (const marker of markers) blocked.push(`${file}: ${marker}`);
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
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-code-point");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  return markers;
}
