import fs from "node:fs";

const componentPath = "src/components/dashboard-shell.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [componentPath, packagePath, reviewGatePath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const component = read(componentPath);
const firstScreenStart = component.indexOf('<section className="hero dashboard-hero">');
const firstScreenEnd = component.indexOf("<DataFreshnessStrip", firstScreenStart);
const followUpStart = component.indexOf("<PublicNextReadingFlow", firstScreenEnd);
const followUpEnd = component.indexOf("{!isStockPage && (", followUpStart);
const homeStart = component.indexOf("function HomeMarketOverview");
const homeEnd = component.indexOf("function HomeCoreIndicatorReadout", homeStart);

const firstScreen = slice(firstScreenStart, firstScreenEnd);
const followUp = slice(followUpStart, followUpEnd);
const homeOverview = slice(homeStart, homeEnd);

const required = [
  ["firstScreen", "狀態儀表"],
  ["firstScreen", "指數燈號把市場資料整理成紅、黃、綠等狀態提示"],
  ["firstScreen", "30 秒內看懂市場氛圍"],
  ["firstScreen", "3 分鐘內判斷"],
  ["firstScreen", "正式市場資料尚未啟用"],
  ["firstScreen", "不提供個股買賣建議"],
  ["followUp", "PublicNextReadingFlow"],
  ["followUp", "context={isStockPage ? \"stock\" : \"home\"}"],
  ["homeOverview", "全市場總覽"],
  ["homeOverview", "全市場總覽"],
  ["homeOverview", "核心指標面板"],
  ["homeOverview", "警示清單"],
  ["homeOverview", "正式資料升級前檢查仍未完成"],
  ["homeOverview", "示範資料邊界"],
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
