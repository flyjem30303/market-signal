import fs from "node:fs";

const requirements = [
  {
    file: "src/lib/data-freshness.ts",
    patterns: ["description: string", "stateDescriptions", "partial:", "stale:", "unavailable:"]
  },
  {
    file: "src/lib/data-freshness-source.ts",
    patterns: [
      "DATA_FRESHNESS_SUPABASE_READS",
      "getSupabaseRuntimeReads",
      "createFreshnessRepository",
      "return repository.getSnapshot();"
    ]
  },
  {
    file: "src/lib/repositories/freshness-repository.ts",
    patterns: [
      "return buildMockDataFreshnessSnapshot();",
      "catch",
      "source !== \"supabase\" || supabaseRuntimeReads !== \"enabled\""
    ]
  },
  {
    file: "src/components/data-freshness-strip.tsx",
    patterns: ["freshness.description", "freshness-description"]
  },
  {
    file: "docs/DATA_FRESHNESS_UI.md",
    patterns: ["state description", "partial", "stale", "unavailable"]
  },
  {
    file: "docs/CP1_TO_CP2_RELEASE_CHECKLIST.md",
    patterns: ["- [x] Public UI state for stale / partial / unavailable real data approved."]
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
