import fs from "node:fs";

const files = [
  "src/lib/assets.ts",
  "src/lib/signal-model.ts",
  "src/lib/market-data.ts",
  "src/components/dashboard-shell.tsx",
  "src/app/briefing/page.tsx",
  "src/app/stocks/[symbol]/page.tsx"
];

const requiredPhrases = {
  "src/lib/assets.ts": ["台灣加權指數", "元大台灣50", "台積電", "AI 伺服器"],
  "src/lib/signal-model.ts": ["偏多", "觀望", "警戒", "示範資料", "尚未切換正式每日資料流程"],
  "src/lib/market-data.ts": ["市場基準", "ETF 觀察", "台股"],
  "src/components/dashboard-shell.tsx": ["30 秒看懂台股市場狀態", "正式每日資料尚未啟用", "非投資建議"],
  "src/app/briefing/page.tsx": ["3 分鐘把市場燈號拆成原因", "資料與風險邊界", "正式資料尚未啟用"],
  "src/app/stocks/[symbol]/page.tsx": ["指數燈號", "市場分數", "資料狀態", "示範資料"]
};

const forbiddenFragments = [
  "cmd.exe",
  "npm run",
  "hard blocker",
  "HARD BLOCKER",
  "REQUEST BLOCKS",
  "EXTERNAL REPLY",
  "workflow proof",
  "publicDataSource",
  "scoreSource",
  "daily_prices",
  "staging rows",
  "raw payload",
  "BETA_HOSTING_PROJECT_NAME",
  "BETA_TEMPORARY_URL"
];

const results = files.map((file) => {
  const text = fs.readFileSync(file, "utf8");
  const badCodePoints = findBadCodePoints(text);
  const missingPhrases = (requiredPhrases[file] ?? []).filter((phrase) => !text.includes(phrase));
  const forbiddenHits = forbiddenFragments.filter((fragment) => text.includes(fragment));

  return {
    badCodePoints,
    file,
    forbiddenHits,
    missingPhrases,
    pass: badCodePoints.length === 0 && missingPhrases.length === 0 && forbiddenHits.length === 0
  };
});

const status = results.every((result) => result.pass) ? "ok" : "blocked";

console.log(
  JSON.stringify(
    {
      status,
      guardedStatus: "phase_1_core_public_copy_readable",
      checkedFiles: files.length,
      results
    },
    null,
    2
  )
);

if (status !== "ok") process.exitCode = 1;

function findBadCodePoints(text) {
  const hits = new Set();
  for (const ch of text) {
    const cp = ch.codePointAt(0);
    if (cp === 0xfffd) hits.add("replacement-code-point");
    if (cp >= 0xe000 && cp <= 0xf8ff) hits.add("private-use-code-point");
    if (cp >= 0x80 && cp <= 0x9f) hits.add("c1-control-character");
  }
  if (/\?{3,}/u.test(text)) hits.add("question-mark-run");
  return [...hits];
}
