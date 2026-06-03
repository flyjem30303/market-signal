import fs from "node:fs";

const componentPath = "src/components/dashboard-shell.tsx";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [componentPath, packagePath, reviewGatePath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const component = read(componentPath);
const firstScreenStart = component.indexOf("<section className=\"hero\">");
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
  ["firstScreen", "台股與 ETF 指數燈號儀表板"],
  ["firstScreen", "mock-only 閱讀模式"],
  ["firstScreen", "正式資料來源與正式評分尚未啟用"],
  ["firstScreen", "產品狀態細節：資料與評分邊界"],
  ["firstScreen", "治理與審核細節"],
  ["firstScreen", "股票內容分頁"],
  ["firstScreen", "今日燈號"],
  ["firstScreen", "市場趨勢"],
  ["firstScreen", "新聞摘要"],
  ["firstScreen", "回測摘要"],
  ["firstScreen", "今日"],
  ["firstScreen", "趨勢"],
  ["firstScreen", "技術"],
  ["firstScreen", "量能"],
  ["firstScreen", "基本面 / 籌碼"],
  ["firstScreen", "新聞"],
  ["firstScreen", "回測"],
  ["followUp", "看完"],
  ["followUp", "回到市場層級交叉檢查"],
  ["followUp", "看每日晨報"],
  ["followUp", "看本週週報"],
  ["followUp", "回首頁看覆蓋地圖"],
  ["followUp", "確認方法論"],
  ["followUp", "確認免責聲明"],
  ["homeOverview", "首頁快速摘要"],
  ["homeOverview", "先用"],
  ["homeOverview", "建立今日閱讀節奏"],
  ["homeOverview", "正式投資訊號"],
  ["homeOverview", "首頁下一步決策列"],
  ["homeOverview", "三分鐘閱讀路線"],
  ["homeOverview", "首頁市場廣度摘要"],
  [packagePath, "\"check:stock-first-screen-readability\": \"node scripts/check-stock-first-screen-readability.mjs\""],
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
const mojibakePattern = /[\uFFFD\uF000-\uF8FF]/u;
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
  if (mojibakePattern.test(content)) {
    blocked.push(`${componentPath}: ${name} contains replacement/private-use mojibake characters`);
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
