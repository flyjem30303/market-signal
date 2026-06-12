import fs from "node:fs";

const componentPath = "src/components/dashboard-shell.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [componentPath, packagePath, reviewGatePath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const component = read(componentPath);
const firstScreenStart = component.indexOf('<section className="hero">');
const firstScreenEnd = component.indexOf("function StockPageFollowUpLinks", firstScreenStart);
const followUpStart = component.indexOf("function StockPageFollowUpLinks");
const followUpEnd = component.indexOf("function HomeProductOverview", followUpStart);
const homeStart = component.indexOf("function HomeProductOverview");
const homeEnd = component.indexOf("function buildHomeGroupSummaries", homeStart);

const firstScreen = slice(firstScreenStart, firstScreenEnd);
const followUp = slice(followUpStart, followUpEnd);
const homeOverview = slice(homeStart, homeEnd);

const required = [
  ["firstScreen", "Market Signal Dashboard"],
  ["firstScreen", "狀態儀表"],
  ["firstScreen", "mock-only 資料"],
  ["firstScreen", "快速理解狀態、風險與資料品質"],
  ["firstScreen", "不構成投資建議"],
  ["firstScreen", "尚未啟用真實資料推廣"],
  ["firstScreen", "股票內容分頁"],
  ["firstScreen", "今日"],
  ["firstScreen", "趨勢"],
  ["firstScreen", "技術"],
  ["firstScreen", "量能"],
  ["firstScreen", "基本面"],
  ["firstScreen", "回測"],
  ["firstScreen", "新聞"],
  ["followUp", "After Reading"],
  ["followUp", "看完"],
  ["followUp", "回到市場層級交叉檢查"],
  ["followUp", "看每日晨報"],
  ["followUp", "看本週週報"],
  ["followUp", "回首頁看覆蓋地圖"],
  ["followUp", "確認方法論"],
  ["followUp", "確認免責聲明"],
  ["homeOverview", "市場氛圍"],
  ["homeOverview", "3 分鐘決定"],
  ["homeOverview", "全市場總覽"],
  ["homeOverview", "核心指標面板"],
  ["homeOverview", "警示清單"],
  ["homeOverview", "市場氛圍"],
  ["homeOverview", "警示清單"],
  ["homeOverview", "mock 邊界"],
  ["homeOverview", "正式市場資料或正式評分"],
  ["homeOverview", "正式市場資料"],
  [packagePath, '"check:stock-first-screen-readability": "node scripts/check-stock-first-screen-readability.mjs"'],
  [reviewGatePath, "scripts/check-stock-first-screen-readability.mjs"]
];

const forbidden = [
  ["firstScreen", "scoreSource=real approved"],
  ["firstScreen", "real score-source mode approved"],
  ["firstScreen", "publicDataSource=supabase approved"],
  ["firstScreen", "createClient"],
  ["firstScreen", "fetch("],
  ["followUp", "createClient"],
  ["followUp", "fetch("],
  ["homeOverview", "scoreSource=real approved"],
  ["homeOverview", "publicDataSource=supabase approved"],
  ["homeOverview", "createClient"],
  ["homeOverview", "fetch("]
];

const sources = new Map([
  ["firstScreen", firstScreen],
  ["followUp", followUp],
  ["homeOverview", homeOverview],
  ...files
]);
const missing = required.filter(([file, phrase]) => !source(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => source(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

if (firstScreenStart < 0 || firstScreenEnd < 0 || firstScreenEnd <= firstScreenStart) {
  missing.push(`${componentPath}: first-screen range`);
}

if (followUpStart < 0 || followUpEnd < 0 || followUpEnd <= followUpStart) {
  missing.push(`${componentPath}: follow-up range`);
}

if (homeStart < 0 || homeEnd < 0 || homeEnd <= homeStart) {
  missing.push(`${componentPath}: home overview range`);
}

for (const [name, content] of [
  ["firstScreen", firstScreen],
  ["followUp", followUp],
  ["homeOverview", homeOverview]
]) {
  for (const hit of findMojibakeMarkers(content)) {
    blocked.push(`${componentPath}: ${name} contains ${hit}`);
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

function slice(start, end) {
  return start >= 0 && end > start ? component.slice(start, end) : "";
}

function source(file) {
  return sources.get(file) ?? "";
}

function findMojibakeMarkers(text) {
  const hits = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) hits.push("private-use-or-replacement-code-point");
  if (/\?{3,}/u.test(text)) hits.push("question-mark-run");
  return hits;
}
