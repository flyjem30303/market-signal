import fs from "node:fs";

const pagePath = "src/app/briefing/page.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const checkerPath = "scripts/check-briefing-midpage-readability.mjs";

const page = fs.readFileSync(pagePath, "utf8");
const packageJson = fs.readFileSync(packagePath, "utf8");
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");
const checker = fs.readFileSync(checkerPath, "utf8");

const required = [
  [pagePath, "市場訊號閱讀路徑"],
  [pagePath, "閱讀路徑"],
  [pagePath, "首頁儀表站"],
  [pagePath, "市場細節"],
  [pagePath, "週報"],
  [pagePath, "方法說明"],
  [pagePath, "風險揭露"],
  [pagePath, "晨報決策邊界"],
  [pagePath, "示範資料公開 Beta 閱讀介面"],
  [pagePath, "覆蓋尚未完整；仍可能出現缺漏或延遲資料"],
  [pagePath, "不提供買賣建議，也不宣稱真實資料或完整覆蓋已上線"],
  [pagePath, "閱讀計畫"],
  [pagePath, "3 分鐘判讀流程"],
  [pagePath, "閱讀橋接"],
  [pagePath, "從市場氣氛接到細節頁"],
  [pagePath, "資料邊界"],
  [pagePath, "目前是示範資料狀態，不是正式市場資料"],
  [pagePath, "升級檢查"],
  [pagePath, "公開資料來源"],
  [pagePath, "分數來源"],
  [pagePath, "建議狀態"],
  [pagePath, "publicDataSource=mock"],
  [pagePath, "scoreSource=mock"],
  [packagePath, "\"check:briefing-midpage-readability\""],
  [reviewGatePath, "check-briefing-midpage-readability.mjs"],
  [reviewGatePath, "briefing-midpage-readability"],
  [checkerPath, "forbidden"]
];

const forbidden = [
  [pagePath, "mock-only 公開 Beta 閱讀介面"],
  [pagePath, "partial coverage"],
  [pagePath, "missing/delayed data"],
  [pagePath, "promotion gate"],
  [pagePath, "Model Boundary"],
  [pagePath, "mock runtime"],
  [pagePath, "Public data source"],
  [pagePath, "Score source"],
  [pagePath, "Advice status"],
  [pagePath, "demo data"],
  [pagePath, "demo scores"],
  [pagePath, "real scoring"],
  [pagePath, "cmd.exe"],
  [pagePath, "PUBLIC_BETA"],
  [pagePath, "BETA_"],
  [pagePath, "operator packet"],
  [pagePath, "execution packet"],
  [pagePath, "SQL execution is approved"],
  [pagePath, "Supabase writes are approved"],
  [pagePath, "publicDataSource=supabase"],
  [pagePath, "scoreSource=real"]
];

const files = new Map([
  [pagePath, page],
  [packagePath, packageJson],
  [reviewGatePath, reviewGate],
  [checkerPath, checker]
]);

const missing = required
  .filter(([file, phrase]) => !read(file).includes(phrase))
  .map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden
  .filter(([file, phrase]) => read(file).includes(phrase))
  .map(([file, phrase]) => `${file}: ${phrase}`);
const markerHits = [pagePath].flatMap((file) => findMojibakeMarkers(read(file)).map((marker) => `${file}: ${marker}`));

const status = missing.length === 0 && blocked.length === 0 && markerHits.length === 0 ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      blocked: [...blocked, ...markerHits],
      missing,
      status
    },
    null,
    2
  )
);

if (status !== "ok") process.exitCode = 1;

function read(file) {
  return files.get(file) ?? "";
}

function findMojibakeMarkers(source) {
  const markers = [];
  if (/\uFFFD/u.test(source)) markers.push("replacement-character");
  if (/[\uE000-\uF8FF]/u.test(source)) markers.push("private-use-codepoint");
  if (/\?{3,}/u.test(source)) markers.push("question-mark-run");
  return markers;
}
