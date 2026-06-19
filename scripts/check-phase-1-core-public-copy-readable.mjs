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
    "\u6307\u6578\u71c8\u865f",
    "\u66f4\u65b0\u65e5\u671f",
    "\u5f15\u7528\u4f86\u6e90",
    "\u98a8\u96aa\u5206\u6578",
    "\u4e0d\u63d0\u4f9b\u500b\u80a1\u8cb7\u8ce3\u5efa\u8b70"
  ],
  "src/app/briefing/page.tsx": [
    "\u5e02\u5834\u5feb\u5831",
    "\u5e02\u5834\u71c8\u865f",
    "\u5f15\u7528\u4f86\u6e90",
    "\u98a8\u96aa\u5206\u6578",
    "\u4e0d\u63d0\u4f9b\u500b\u80a1\u8cb7\u8ce3\u5efa\u8b70"
  ],
  "src/app/stocks/[symbol]/page.tsx": [
    "\u6a19\u7684\u71c8\u865f",
    "\u5f15\u7528\u4f86\u6e90",
    "\u98a8\u96aa\u5206\u6578",
    "\u4e0d\u69cb\u6210\u6295\u8cc7\u5efa\u8b70"
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
