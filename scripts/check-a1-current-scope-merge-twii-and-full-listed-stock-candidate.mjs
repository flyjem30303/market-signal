import { spawnSync } from "node:child_process";
import fs from "node:fs";

const problems = [];
const runnerPath = "scripts/run-a1-current-scope-merge-twii-and-full-listed-stock-candidate-once.mjs";
const validatorPath = "scripts/validate-phase-1-current-scope-sanitized-row-payload-candidate-artifact.mjs";
const pkg = JSON.parse(read("package.json"));
const runnerSource = read(runnerPath);

if (
  pkg.scripts?.["run:a1-current-scope-merge-twii-and-full-listed-stock-candidate-once"] !==
  `node ${runnerPath}`
) {
  problems.push("package.json missing run:a1-current-scope-merge-twii-and-full-listed-stock-candidate-once");
}

if (
  pkg.scripts?.["check:a1-current-scope-merge-twii-and-full-listed-stock-candidate"] !==
  "node scripts/check-a1-current-scope-merge-twii-and-full-listed-stock-candidate.mjs"
) {
  problems.push("package.json missing check:a1-current-scope-merge-twii-and-full-listed-stock-candidate");
}

for (const required of [
  "twii_plus_listed_stock_daily_close",
  "sourceRightsStatus: \"accepted\"",
  "fieldContractStatus: \"accepted\"",
  "rawPayloadIncluded: false",
  "stockIdPayloadIncluded: false",
  "secretsIncluded: false",
  "marketDataFetched: false",
  "supabaseConnectionAttempted: false",
  "dailyPricesMutation: false",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\""
]) {
  if (!runnerSource.includes(required)) problems.push(`${runnerPath} missing ${required}`);
}

for (const forbidden of [
  /\bfetch\s*\(/u,
  /@supabase\/supabase-js/u,
  /createClient\s*\(/u,
  /\.from\s*\(/u,
  /\.insert\s*\(/u,
  /\.upsert\s*\(/u,
  /SUPABASE_SERVICE_ROLE_KEY/u,
  /sb_secret_/u
]) {
  if (forbidden.test(runnerSource)) problems.push(`${runnerPath} contains forbidden boundary ${forbidden}`);
}

const merge = spawnSync(process.execPath, [runnerPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (merge.status !== 0) {
  problems.push(`${runnerPath} failed: ${(merge.stderr || merge.stdout).trim()}`);
} else {
  const output = JSON.parse(merge.stdout);
  if (output.status !== "a1_current_scope_twii_plus_full_listed_stock_candidate_merged") problems.push("merge status mismatch");
  if (output.twiiRows < 1) problems.push("merged artifact must include TWII rows");
  if (output.listedStockRows < 1) problems.push("merged artifact must include listed stock rows");
  if (output.marketDataFetched !== false) problems.push("merge must not fetch market data");
  if (output.supabaseConnectionAttempted !== false) problems.push("merge must not connect Supabase");
  if (output.dailyPricesMutation !== false) problems.push("merge must not mutate daily_prices");

  const validation = spawnSync(process.execPath, [validatorPath, "--candidate-artifact", output.outputPath], {
    cwd: process.cwd(),
    encoding: "utf8",
    shell: false
  });
  const validationOutput = JSON.parse(validation.stdout);
  if (validationOutput.accepted !== true) problems.push(`merged artifact validator blocked: ${validationOutput.problems?.join(",")}`);
  if (validationOutput.duplicateCount !== 0) problems.push("merged artifact must not duplicate symbol-date rows");
  if (validationOutput.invalidTradeDateCount !== 0) problems.push("merged artifact must not contain invalid trade dates");
  if (validationOutput.safety?.supabaseWriteAttempted !== false) problems.push("validator must not write Supabase");
}

if (problems.length > 0) {
  console.log(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      mode: "a1_current_scope_merge_twii_and_full_listed_stock_candidate_check",
      verified: {
        mergedArtifactValid: true,
        noFetch: true,
        noSupabase: true,
        noSql: true,
        noDailyPricesMutation: true,
        publicDataSource: "mock",
        scoreSource: "mock"
      }
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "";
  }
  return fs.readFileSync(filePath, "utf8");
}
