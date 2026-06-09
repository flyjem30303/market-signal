import fs from "node:fs";
import { spawnSync } from "node:child_process";

const problems = [];

const docPath = "docs/BETA_PLATFORM_TWO_VALUE_VALIDATOR.md";
const intakeGatePath = "docs/BETA_PLATFORM_TWO_VALUE_INTAKE_GATE.md";
const validatorPath = "scripts/validate-beta-platform-two-values.mjs";
const loaderPath = "scripts/lib/beta-platform-values.mjs";
const envExamplePath = ".env.example";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const statusPath = "PROJECT_STATUS.md";
const boardPath = "docs/LAUNCH_ENGINEERING_WORKSTREAM_BOARD.md";

const doc = read(docPath);
const validator = read(validatorPath);
const loader = read(loaderPath);
const envExample = read(envExamplePath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

for (const phrase of [
  "Status: `beta_platform_two_value_validator_ready_waiting_values`",
  "CEO decision: `make_two_platform_values_locally_validatable_before_packet_window`",
  "beta_platform_two_value_validator",
  "validator_ready_waiting_for_two_safe_values",
  "cmd.exe /c npm run validate:beta-platform-two-values",
  "BETA_HOSTING_PROJECT_NAME",
  "BETA_TEMPORARY_URL",
  "blocked_waiting_values",
  "rejected_unsafe_values",
  "accepted_two_value_shape_only",
  "`publicDataSource=mock`",
  "`scoreSource=mock`",
  "`publicDataSource=supabase`",
  "`scoreSource=real`"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const phrase of [
  "loadBetaPlatformValues",
  "blocked_waiting_values",
  "rejected_unsafe_values",
  "accepted_two_value_shape_only",
  "packetCandidateAllowed: false",
  "classifyProvider",
  "nextCommands",
  "publicDataSource: \"mock\"",
  "scoreSource: \"mock\"",
  "BETA_HOSTING_PROJECT_NAME",
  "BETA_TEMPORARY_URL",
  "supabase.co"
]) {
  if (!validator.includes(phrase)) problems.push(`${validatorPath} missing phrase: ${phrase}`);
}

for (const phrase of [
  "ALLOWED_KEYS",
  "BETA_HOSTING_PROJECT_NAME",
  "BETA_TEMPORARY_URL",
  "BETA_PLATFORM_VALUES_SKIP_DOTENV",
  "loadBetaPlatformValues",
  "betaPlatformValuesEnv"
]) {
  if (!loader.includes(phrase)) problems.push(`${loaderPath} missing phrase: ${phrase}`);
}

for (const phrase of [
  "BETA_HOSTING_PROJECT_NAME is the plain hosting project slug",
  "not a URL or dashboard link",
  "BETA_TEMPORARY_URL must be a public https preview/Beta URL",
  "not localhost, Supabase dashboard, or a URL with tokens/query strings"
]) {
  if (!envExample.includes(phrase)) problems.push(`${envExamplePath} missing phrase: ${phrase}`);
}

for (const [filePath, phrase] of [
  [intakeGatePath, "beta_platform_two_value_intake_gate_ready_waiting_two_values"],
  [statusPath, "Latest beta platform two value validator slice"],
  [statusPath, "beta_platform_two_value_validator_ready_waiting_values"],
  [boardPath, "`docs/BETA_PLATFORM_TWO_VALUE_VALIDATOR.md` is `accepted` as PM mainline two-value validator"],
  [boardPath, "validator_ready_waiting_for_two_safe_values"]
]) {
  if (!read(filePath).includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (pkg.scripts?.["validate:beta-platform-two-values"] !== "node scripts/validate-beta-platform-two-values.mjs") {
  problems.push(`${packagePath} missing validate:beta-platform-two-values script`);
}

if (pkg.scripts?.["check:beta-platform-two-value-validator"] !== "node scripts/check-beta-platform-two-value-validator.mjs") {
  problems.push(`${packagePath} missing check:beta-platform-two-value-validator script`);
}

for (const phrase of [
  "scripts/check-beta-platform-two-value-validator.mjs",
  "expectStatus: \"ok\"",
  "name: \"beta-platform-two-value-validator\""
]) {
  if (!reviewGate.includes(phrase)) problems.push(`${reviewGatePath} missing phrase: ${phrase}`);
}

const absentRun = spawnSync(process.execPath, [validatorPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  env: skipDotenv(withoutBetaValues(process.env)),
  windowsHide: true
});

if (absentRun.status !== 0) problems.push(`${validatorPath} absent-value run should exit 0`);
if (!absentRun.stdout.includes('"status": "blocked_waiting_values"')) {
  problems.push(`${validatorPath} absent-value run did not report blocked_waiting_values`);
}

const acceptedRun = spawnSync(process.execPath, [validatorPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  env: {
    ...skipDotenv(withoutBetaValues(process.env)),
    BETA_HOSTING_PROJECT_NAME: "taiwan-market-signal-beta",
    BETA_TEMPORARY_URL: "https://taiwan-market-signal-beta.example.app"
  },
  windowsHide: true
});

if (acceptedRun.status !== 0) problems.push(`${validatorPath} accepted sample should exit 0`);
if (!acceptedRun.stdout.includes('"status": "accepted_two_value_shape_only"')) {
  problems.push(`${validatorPath} accepted sample did not report accepted_two_value_shape_only`);
}
if (!acceptedRun.stdout.includes('"provider": "other-public-host"')) {
  problems.push(`${validatorPath} accepted sample should classify provider without printing the URL`);
}
if (!acceptedRun.stdout.includes("run:beta-packet-window-proof-map")) {
  problems.push(`${validatorPath} accepted sample should route to packet-window proof map`);
}

const rejectedRun = spawnSync(process.execPath, [validatorPath], {
  cwd: process.cwd(),
  encoding: "utf8",
  env: {
    ...skipDotenv(withoutBetaValues(process.env)),
    BETA_HOSTING_PROJECT_NAME: "secret-project",
    BETA_TEMPORARY_URL: "https://example.app/?token=abc"
  },
  windowsHide: true
});

if (rejectedRun.status === 0) problems.push(`${validatorPath} rejected sample should exit non-zero`);
if (!rejectedRun.stdout.includes('"status": "rejected_unsafe_values"')) {
  problems.push(`${validatorPath} rejected sample did not report rejected_unsafe_values`);
}
if (!rejectedRun.stdout.includes('"provider": "other-public-host"')) {
  problems.push(`${validatorPath} rejected sample should still classify provider shape only`);
}

for (const phrase of [
  "production deployment",
  "preview deployment",
  "deployment command execution",
  "hosting project creation",
  "hosting project mutation",
  "DNS change",
  "SSL configuration change",
  "platform env mutation",
  "secret output",
  "secret storage action",
  "SQL execution",
  "Supabase connection",
  "Supabase write",
  "staging row creation",
  "`daily_prices` mutation",
  "raw market-data fetch",
  "raw market-data ingest",
  "raw market-data storage",
  "raw market-data commit",
  "row coverage points",
  "complete MVP coverage claim",
  "Supabase public-source promotion",
  "`publicDataSource=supabase`",
  "real score promotion",
  "`scoreSource=real`",
  "investment advice claim",
  "public launch completion claim"
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing hard stop: ${phrase}`);
}

const forbiddenPatterns = [
  /NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?:/u,
  /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
  /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
  /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
  /vercel deploy/iu,
  /npm run deploy/iu,
  /RUN_DEPLOY_NOW/u,
  /DEPLOYMENT_COMPLETED/u,
  /production deployment completed/iu,
  /preview deployment completed/iu,
  /deployment command executed/iu,
  /hosting project created/iu,
  /platform env mutated/iu,
  /SQL execution is approved/iu,
  /Supabase writes are approved/iu,
  /row coverage points awarded/iu,
  /complete MVP coverage achieved/iu,
  /publicDataSource=supabase is approved/iu,
  /scoreSource=real is approved/iu
];

for (const [filePath, source] of [
  [docPath, doc],
  [validatorPath, validator]
]) {
  for (const pattern of forbiddenPatterns) {
    if (pattern.test(source)) problems.push(`${filePath} contains forbidden pattern: ${pattern}`);
  }
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "beta_platform_two_value_validator_ready_waiting_values",
      outcome: "validator_ready_waiting_for_two_safe_values"
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return "{}";
  }

  return fs.readFileSync(filePath, "utf8");
}

function withoutBetaValues(env) {
  const next = { ...env };
  delete next.BETA_HOSTING_PROJECT_NAME;
  delete next.BETA_TEMPORARY_URL;
  return next;
}

function skipDotenv(env) {
  return {
    ...env,
    BETA_PLATFORM_VALUES_SKIP_DOTENV: "1"
  };
}
