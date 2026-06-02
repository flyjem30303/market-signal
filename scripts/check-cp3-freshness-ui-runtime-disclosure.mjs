import fs from "node:fs";

const requirements = [
  {
    file: "src/lib/data-freshness.ts",
    patterns: [
      "Freshness metadata 已可讀取",
      "僅代表資料狀態可達",
      "不代表真實評分或資料品質已核准",
      "scoreSourceLabel: \"模擬評分\""
    ]
  },
  {
    file: "src/components/data-freshness-strip.tsx",
    patterns: [
      "Supabase metadata 已可讀",
      "freshness-runtime-source",
      "freshness-boundary",
      "資料新鮮度 metadata 只說明顯示狀態",
      "freshness.scoreSourceLabel"
    ]
  },
  {
    file: "src/app/globals.css",
    patterns: [
      ".freshness-strip .freshness-runtime-source.reachable",
      ".freshness-strip .freshness-boundary"
    ]
  },
  {
    file: "docs/DATA_FRESHNESS_UI.md",
    patterns: [
      "Freshness metadata 不等於真實評分或資料品質核准",
      "Supabase metadata 可達",
      "must not be used as a market-data quality claim",
      "`scoreSource=real` approval"
    ]
  },
  {
    file: "docs/reviews/CP3_FRESHNESS_REACHABILITY_TO_ACTION_GATE_2026-05-30.md",
    patterns: [
      "ALLOW_BOUNDED_FRESHNESS_STATE_CONSUMPTION_KEEP_REAL_SCORE_BLOCKED",
      "UI_RUNTIME_FRESHNESS_DISCLOSURE_WITH_MOCK_SCORE_SOURCE",
      "BLOCK-001 do not set `scoreSource=real`."
    ]
  }
];

const forbidden = [
  {
    file: "src/components/data-freshness-strip.tsx",
    patterns: [
      "scoreSource=real",
      "資料品質已通過",
      "真實評分已通過",
      "市場資料完整"
    ]
  },
  {
    file: "src/lib/data-freshness.ts",
    patterns: [
      "scoreSource: \"real\"",
      "資料品質已通過",
      "真實評分已通過"
    ]
  }
];

const missing = requirements.flatMap((requirement) => {
  const content = fs.readFileSync(requirement.file, "utf8");
  return requirement.patterns
    .filter((pattern) => !content.includes(pattern))
    .map((pattern) => ({ file: requirement.file, pattern }));
});

const forbiddenHits = forbidden.flatMap((requirement) => {
  const content = fs.readFileSync(requirement.file, "utf8");
  return requirement.patterns
    .filter((pattern) => content.includes(pattern))
    .map((pattern) => ({ file: requirement.file, pattern }));
});

const status = missing.length === 0 && forbiddenHits.length === 0 ? "ok" : "blocked";

console.log(JSON.stringify({ forbidden: forbiddenHits, missing, status }, null, 2));

if (status !== "ok") {
  process.exit(1);
}
