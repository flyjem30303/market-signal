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
  ["src/components/home-runtime-status-panel.tsx", "目前可用的是 mock 訊號閱讀模式"],
  ["src/components/home-runtime-status-panel.tsx", "不是投資建議"],
  ["src/components/home-runtime-status-panel.tsx", "This is readiness evidence only, not a public real-data claim."],
  ["src/components/home-runtime-status-panel.tsx", "Real data, complete coverage, and advice wording remain blocked"],
  ["src/components/stock-runtime-at-a-glance.tsx", "目前是 mock 訊號閱讀頁"],
  ["src/components/stock-runtime-at-a-glance.tsx", "不是個人化投資建議"],
  ["src/components/stock-runtime-at-a-glance.tsx", "scoreSource=real is not enabled"],
  ["src/components/trust-runtime-boundary-notice.tsx", "Investment and data limits: currently mock-only"],
  ["src/components/trust-runtime-boundary-notice.tsx", "not investment advice"],
  ["src/components/trust-runtime-boundary-notice.tsx", "publicDataSource=mock; scoreSource=mock"],
  ["src/lib/public-runtime-boundary-copy.ts", "publicDataSource=mock; scoreSource=mock"],
  ["src/lib/public-runtime-boundary-copy.ts", "partial coverage"],
  ["src/lib/public-runtime-boundary-copy.ts", "missing/delayed data"],
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
  "src/lib/runtime-product-summary.ts",
  "src/components/home-runtime-status-panel.tsx",
  "src/components/stock-runtime-at-a-glance.tsx",
  "src/components/trust-runtime-boundary-notice.tsx",
  "src/lib/public-runtime-boundary-copy.ts"
]) {
  for (const marker of findMojibakeMarkers(read(file))) {
    blocked.push(`${file}: ${marker}`);
  }
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) process.exitCode = 1;

function read(file) {
  return files.get(file) ?? "";
}

function findMojibakeMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-code-point");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  return markers;
}
