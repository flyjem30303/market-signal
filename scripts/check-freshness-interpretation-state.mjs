import fs from "node:fs";

const interpretationPath = "src/lib/freshness-interpretation.ts";
const stripPath = "src/components/data-freshness-strip.tsx";
const progressPath = "src/lib/project-progress-score.ts";
const runtimePath = "src/lib/runtime-readiness-score.ts";

const files = new Map(
  [interpretationPath, stripPath, progressPath, runtimePath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const required = [
  [interpretationPath, "getFreshnessInterpretationSummary"],
  [interpretationPath, "baselineObject: \"data_runs\""],
  [interpretationPath, "currentPublicSource: \"mock\""],
  [interpretationPath, "dataFreshnessObjectRole: \"remote_only_candidate\""],
  [interpretationPath, "dataQualityApproval: \"not_approved\""],
  [interpretationPath, "scoreSource: \"mock\""],
  [
    interpretationPath,
    "Do not treat freshness metadata, data_freshness reachability, or schema shape as data-quality approval or scoreSource=real approval."
  ],
  [stripPath, "getFreshnessInterpretationSummary"],
  [stripPath, "新鮮度基準"],
  [stripPath, "interpretation.dataFreshnessObjectRole"],
  [progressPath, "freshness interpretation"],
  [progressPath, "data_runs baseline"],
  [progressPath, "data_freshness candidate"],
  [runtimePath, "freshness baseline"],
  [runtimePath, "data_runs"]
];

const forbidden = [
  [interpretationPath, "@supabase/supabase-js"],
  [interpretationPath, "createClient"],
  [interpretationPath, "fetch("],
  [interpretationPath, ".from("],
  [interpretationPath, ".insert("],
  [interpretationPath, ".update("],
  [interpretationPath, ".delete("],
  [interpretationPath, "scoreSource: \"real\""],
  [interpretationPath, "currentPublicSource: \"supabase\""],
  [stripPath, "scoreSource=real approved"],
  [progressPath, "scoreSource=real approved"]
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
