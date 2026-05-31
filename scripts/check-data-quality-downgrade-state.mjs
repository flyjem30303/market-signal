import fs from "node:fs";

const downgradePath = "src/lib/data-quality-downgrade.ts";
const stripPath = "src/components/data-freshness-strip.tsx";
const progressPath = "src/lib/project-progress-score.ts";

const files = new Map([downgradePath, stripPath, progressPath].map((file) => [file, fs.readFileSync(file, "utf8")]));

const required = [
  [downgradePath, "getDataQualityDowngradeSummary"],
  [downgradePath, "metadata_complete_unapproved"],
  [downgradePath, "metadata_partial_blocked"],
  [downgradePath, "metadata_stale_blocked"],
  [downgradePath, "metadata_unavailable_blocked"],
  [downgradePath, "mock_only"],
  [downgradePath, "canUseForPublicScore: false"],
  [downgradePath, "scoreSource: \"mock\""],
  [downgradePath, "Do not use complete freshness metadata as public score approval."],
  [stripPath, "getDataQualityDowngradeSummary"],
  [stripPath, "Data quality gate:"],
  [stripPath, "dataQuality.downgradeState"],
  [progressPath, "資料品質降級規則"]
];

const forbidden = [
  [downgradePath, "@supabase/supabase-js"],
  [downgradePath, "createClient"],
  [downgradePath, "fetch("],
  [downgradePath, ".from("],
  [downgradePath, ".insert("],
  [downgradePath, ".update("],
  [downgradePath, ".delete("],
  [downgradePath, "canUseForPublicScore: true"],
  [downgradePath, "scoreSource: \"real\""],
  [stripPath, "scoreSource=real approved"]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

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
