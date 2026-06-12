import fs from "node:fs";

const pagePath = "src/app/briefing/page.tsx";
const cssPath = "src/app/globals.css";
const page = fs.readFileSync(pagePath, "utf8");
const css = fs.readFileSync(cssPath, "utf8");

const executiveStart = page.indexOf("function BriefingExecutiveSummary");
const executiveSummary = executiveStart >= 0 ? page.slice(executiveStart) : "";

const required = [
  [pagePath, "BriefingExecutiveSummary"],
  [pagePath, "市場訊號晨報"],
  [pagePath, "mock-only"],
  [pagePath, "publicDataSource=mock"],
  [pagePath, "scoreSource=mock"],
  [pagePath, "不提供買賣建議"],
  [pagePath, "briefing-runtime-action-strip"],
  [pagePath, "產品閱讀流程可用"],
  [pagePath, "真實資料尚未上線"],
  [pagePath, "mock composite"],
  [pagePath, "mock risk"],
  [cssPath, ".briefing-executive-summary"],
  [cssPath, ".briefing-runtime-action-strip"],
  [cssPath, ".briefing-executive-summary nav"],
  [cssPath, ".briefing-executive-summary aside"]
];

const forbidden = [
  [pagePath, "@supabase/supabase-js"],
  [pagePath, "createClient("],
  [pagePath, "fetch("],
  [pagePath, ".from("],
  [pagePath, "process.env"],
  [pagePath, "scoreSource: \"real\""],
  [pagePath, "publicDataSource: \"supabase\""],
  [pagePath, "scoreSource=real"],
  [pagePath, "publicDataSource=supabase"],
  [pagePath, "real market data is live"],
  [pagePath, "investment advice is allowed"]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

for (const marker of findMojibakeMarkers(executiveSummary || page)) {
  blocked.push(`${pagePath}: mojibake executive summary ${marker}`);
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

if (missing.length > 0 || blocked.length > 0) process.exitCode = 1;

function read(file) {
  return file === pagePath ? page : css;
}

function findMojibakeMarkers(text) {
  const markers = [];
  if (/[\uE000-\uF8FF\uFFFD]/u.test(text)) markers.push("private-use-or-replacement-code-point");
  if (/\?{3,}/u.test(text)) markers.push("question-mark-run");
  return markers;
}
