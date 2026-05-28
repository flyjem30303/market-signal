import fs from "node:fs";

const requirements = [
  {
    file: "src/lib/data-freshness.ts",
    patterns: ["scoreSource:", "scoreSourceLabel:", "模擬評分"]
  },
  {
    file: "src/components/data-freshness-strip.tsx",
    patterns: ["分數來源：", "freshness.scoreSourceLabel", "freshness-score-source"]
  },
  {
    file: "src/components/dashboard-shell.tsx",
    patterns: ["score-source-note", "目前分數來源：", "/methodology", "/disclaimer"]
  },
  {
    file: "docs/DATA_FRESHNESS_UI.md",
    patterns: ["分數來源：", "score-source note"]
  }
];

const missing = requirements.flatMap((requirement) => {
  const content = fs.readFileSync(requirement.file, "utf8");
  return requirement.patterns
    .filter((pattern) => !content.includes(pattern))
    .map((pattern) => ({ file: requirement.file, pattern }));
});

console.log(
  JSON.stringify(
    {
      checked_files: requirements.map((requirement) => requirement.file),
      missing,
      status: missing.length === 0 ? "ok" : "blocked"
    },
    null,
    2
  )
);

if (missing.length > 0) {
  process.exitCode = 1;
}
