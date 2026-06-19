import { spawnSync } from "node:child_process";
import fs from "node:fs";

const problems = [];
const reportPath = "scripts/report-a1-rate-limited-candidate-generation-execution-packet.mjs";
const packagePath = "package.json";
const reportSource = read(reportPath);
const packageJson = JSON.parse(read(packagePath));

if (
  packageJson.scripts?.["report:a1-rate-limited-candidate-generation-execution-packet"] !==
  `node ${reportPath}`
) {
  problems.push("package.json missing report:a1-rate-limited-candidate-generation-execution-packet");
}

if (
  packageJson.scripts?.["check:a1-rate-limited-candidate-generation-execution-packet"] !==
  "node scripts/check-a1-rate-limited-candidate-generation-execution-packet.mjs"
) {
  problems.push("package.json missing check:a1-rate-limited-candidate-generation-execution-packet");
}

for (const required of [
  "ready_for_explicit_operator_approval_only",
  "run:a1-full-twse-equity-rate-limited-candidate-generation-once",
  "check:a1-full-twse-equity-rate-limited-candidate-runner",
  "tmp/a1-full-twse-equity-candidates",
  "Do not commit generated candidate artifacts.",
  "requestCount: 3249",
  "estimatedTradingSessionRows: 71478",
  "batchSize: 50",
  "requestDelayMs: 900",
  "batchPauseMs: 30000",
  "marketFetchBeforeExplicitApproval: false",
  "supabaseConnection: false",
  "supabaseWrite: false",
  "dailyPricesMutation: false",
  "rawPayloadStorage: false",
  "stockIdListPrint: false",
  "publicDataSourcePromotion: false",
  "scoreSourceRealPromotion: false"
]) {
  if (!reportSource.includes(required)) problems.push(`${reportPath} missing ${required}`);
}

for (const forbidden of [
  /\bfetch\s*\(/u,
  /@supabase\/supabase-js/u,
  /createClient\s*\(/u,
  /\.from\s*\(/u,
  /\.insert\s*\(/u,
  /\.upsert\s*\(/u,
  /fs\.writeFile/u,
  /SUPABASE_SERVICE_ROLE_KEY/u,
  /sb_secret_/u
]) {
  if (forbidden.test(reportSource)) problems.push(`${reportPath} contains forbidden executable boundary ${forbidden}`);
}

const result = spawnSync(process.execPath, [reportPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  shell: false
});

if (result.status !== 0) {
  problems.push(`${reportPath} failed: ${(result.stderr || result.stdout).trim()}`);
} else {
  const output = JSON.parse(result.stdout);
  if (output.status !== "ok") problems.push("execution packet status must be ok");
  if (output.mode !== "a1_rate_limited_candidate_generation_execution_packet") problems.push("unexpected mode");
  if (output.decision !== "ready_for_explicit_operator_approval_only") problems.push("decision must require explicit approval");
  if (!String(output.authorizedRunCommand ?? "").includes("A1_FULL_TWSE_EQUITY_CANDIDATE_GENERATION_2026_06_18")) {
    problems.push("authorized run command must include the explicit confirmation phrase");
  }
  if (!String(output.authorizedRunCommand ?? "").includes("run:a1-full-twse-equity-rate-limited-candidate-generation-once")) {
    problems.push("authorized run command must call the bounded runner");
  }
  if (output.executionShape?.outputDirectoryGitIgnored !== true) problems.push("tmp output directory must be git-ignored");
  if (output.executionShape?.requestCount !== 3249) problems.push("requestCount must remain 3249");
  if (output.executionShape?.batchCount !== 22) problems.push("batchCount must remain 22");
  if (output.hardStopLines?.supabaseConnection !== false) problems.push("must not connect Supabase");
  if (output.hardStopLines?.dailyPricesMutation !== false) problems.push("must not mutate daily_prices");
  if (output.hardStopLines?.stockIdListPrint !== false) problems.push("must not print stock ID lists");
  if (output.stillRequiredAfterCandidateArtifact?.includes("staging write authorization") !== true) {
    problems.push("staging write authorization must remain after candidate artifact");
  }
  if (/\b(1101|1102|2330|2308|2382|2454|2317)\b/u.test(result.stdout)) {
    problems.push("execution packet output must not include stock IDs");
  }
}

if (problems.length > 0) {
  console.log(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      mode: "a1_rate_limited_candidate_generation_execution_packet_check",
      verified: {
        explicitApprovalStillRequired: true,
        outputDirectoryGitIgnored: true,
        noFetch: true,
        noSupabase: true,
        noSql: true,
        noDailyPricesMutation: true,
        noStockIdOutput: true,
        candidateArtifactNotCommitReady: true
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
