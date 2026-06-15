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
  "src/components/dashboard-shell.tsx": [
    "\u5e02\u5834\u5206\u6578",
    "\u98a8\u96aa\u5206\u6578",
    "\u6b63\u5f0f\u6bcf\u65e5\u8cc7\u6599\u5c1a\u672a\u555f\u7528",
    "\u975e\u6295\u8cc7\u5efa\u8b70"
  ],
  "src/app/briefing/page.tsx": [
    "3 \u5206\u9418\u628a\u5e02\u5834\u71c8\u865f\u62c6\u6210\u539f\u56e0",
    "\u8cc7\u6599\u8207\u98a8\u96aa\u908a\u754c",
    "\u6b63\u5f0f\u8cc7\u6599\u5c1a\u672a\u555f\u7528"
  ],
  "src/app/stocks/[symbol]/page.tsx": [
    "\u6307\u6578\u71c8\u865f",
    "\u5e02\u5834\u5206\u6578",
    "\u98a8\u96aa\u5206\u6578",
    "\u793a\u7bc4\u8cc7\u6599"
  ]
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
  const decodedText = decodeUnicodeEscapes(text);
  const badCodePoints = findBadCodePoints(text);
  const missingPhrases = (requiredPhrases[file] ?? []).filter((phrase) => !decodedText.includes(phrase));
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

function decodeUnicodeEscapes(source) {
  return source.replace(/\\u([0-9a-f]{4})/giu, (_match, hex) => String.fromCodePoint(Number.parseInt(hex, 16)));
}
