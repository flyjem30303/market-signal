const baseUrl = process.env.LOCALHOST_BASE_URL ?? "http://localhost:3000";

const pages = ["/stocks/2330", "/stocks/TWII", "/stocks/0050"];

const forbiddenVisibleTerms = [
  "mock-only",
  "publicDataSource",
  "scoreSource",
  "SQL scoring",
  "Supabase-backed",
  "real score-source",
  "Runtime Brief",
  "Stock Runtime",
  "Public Boundary",
  "Decision Guide",
  "Source & Coverage",
  "blocked gates",
  "cmd.exe",
  "PUBLIC_BETA",
  "BETA_",
  "failure=",
  "mockOnly=true",
  "Supabase runtime reads disabled",
  "remote_only_candidate"
];

const requiredVisiblePhrases = [
  "30 秒快速閱讀",
  "把單一標的放回市場脈絡",
  "成因",
  "更新時間",
  "影響級別",
  "下一步",
  "30 秒可用",
  "3 分鐘要複核",
  "不能當成個股買賣指令",
  "示範資料與示範分數",
  "不提供個股買賣建議"
];

const results = [];

for (const path of pages) {
  const response = await fetch(`${baseUrl}${path}`);
  const text = toVisibleText(await response.text());
  const forbiddenHits = forbiddenVisibleTerms.filter((term) => includesTerm(text, term));
  const missingRequired = requiredVisiblePhrases.filter((term) => !includesTerm(text, term));
  const markerHits = findMojibakeMarkers(text);

  results.push({
    forbiddenHits,
    markerHits,
    missingRequired,
    path,
    status: response.status,
    visibleLength: text.length
  });
}

const blocked = results.filter(
  (result) =>
    result.status !== 200 ||
    result.forbiddenHits.length > 0 ||
    result.missingRequired.length > 0 ||
    result.markerHits.length > 0
);

console.log(
  JSON.stringify(
    {
      baseUrl,
      blocked,
      checkedPages: pages,
      status: blocked.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (blocked.length > 0) process.exitCode = 1;

function toVisibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function includesTerm(text, term) {
  return text.toLowerCase().includes(term.toLowerCase());
}

function findMojibakeMarkers(source) {
  const markers = [];
  if (/\uFFFD/u.test(source)) markers.push("replacement-character");
  if (/[\uE000-\uF8FF]/u.test(source)) markers.push("private-use-codepoint");
  if (/\?{3,}/u.test(source)) markers.push("question-mark-run");
  return markers;
}
