import fs from "node:fs";

const dotEnvValues = loadLocalBetaValues();
const projectName = (process.env.BETA_HOSTING_PROJECT_NAME ?? dotEnvValues.BETA_HOSTING_PROJECT_NAME ?? "").trim();
const temporaryUrl = (process.env.BETA_TEMPORARY_URL ?? dotEnvValues.BETA_TEMPORARY_URL ?? "").trim();

const problems = [];

if (!projectName) problems.push("BETA_HOSTING_PROJECT_NAME missing");
if (!temporaryUrl) problems.push("BETA_TEMPORARY_URL missing");

if (projectName) validateProjectName(projectName);
if (temporaryUrl) validateTemporaryUrl(temporaryUrl);

const status =
  !projectName || !temporaryUrl
    ? "blocked_waiting_values"
    : problems.length > 0
      ? "rejected_unsafe_values"
      : "accepted_two_value_shape_only";

const ok = status === "accepted_two_value_shape_only";

console.log(
  JSON.stringify(
    {
      status,
      ok,
      packetCandidateAllowed: false,
      nextRoute: ok
        ? "run_repo_proof_then_create_separate_packet_window_candidate"
        : "keep_waiting_for_safe_two_values",
      values: {
        hostingProjectNameProvided: projectName.length > 0,
        temporaryBetaUrlProvided: temporaryUrl.length > 0,
        loadedFromEnvLocal:
          Boolean(dotEnvValues.BETA_HOSTING_PROJECT_NAME || dotEnvValues.BETA_TEMPORARY_URL) &&
          (!process.env.BETA_HOSTING_PROJECT_NAME || !process.env.BETA_TEMPORARY_URL)
      },
      problems,
      runtimeBoundary: {
        publicDataSource: "mock",
        scoreSource: "mock"
      },
      notes: [
        "Shape validation only; this does not deploy or prove public launch.",
        "A supabase.co dashboard or project API URL is not an accepted temporary public Beta URL.",
        "Do not print secrets, tokens, env values, dashboard URLs, or private preview URLs."
      ]
    },
    null,
    2
  )
);

process.exit(status === "rejected_unsafe_values" ? 1 : 0);

function validateProjectName(value) {
  if (value.length < 3 || value.length > 64) {
    problems.push("hosting project name must be 3-64 characters");
  }
  if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/u.test(value)) {
    problems.push("hosting project name must use lowercase letters, numbers, and hyphens, and start/end with a letter or number");
  }
  if (/(http|token|secret|key|password|dashboard|invite)/iu.test(value)) {
    problems.push("hosting project name contains unsafe word");
  }
}

function validateTemporaryUrl(value) {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    problems.push("temporary Beta URL must be a valid URL");
    return;
  }

  if (parsed.protocol !== "https:") problems.push("temporary Beta URL must use https");
  if (parsed.username || parsed.password) problems.push("temporary Beta URL must not include username or password");
  if (parsed.search) problems.push("temporary Beta URL must not include query string");
  if (parsed.hash) problems.push("temporary Beta URL must not include hash");
  if (!parsed.hostname.includes(".")) problems.push("temporary Beta URL hostname must be public-like and contain a dot");
  if (parsed.pathname !== "/" && parsed.pathname !== "") problems.push("temporary Beta URL path must be empty or /");
  if (/(localhost|127\.0\.0\.1|dashboard|token|secret|key|password|invite|supabase\.co)/iu.test(parsed.hostname)) {
    problems.push("temporary Beta URL hostname contains unsafe or non-public word");
  }
}

function loadLocalBetaValues() {
  if (process.env.BETA_PLATFORM_VALUES_SKIP_DOTENV === "1") return {};
  const filePath = ".env.local";
  if (!fs.existsSync(filePath)) return {};

  const values = {};
  const content = fs.readFileSync(filePath, "utf8");
  for (const line of content.split(/\r?\n/u)) {
    const match = line.match(/^\s*(BETA_HOSTING_PROJECT_NAME|BETA_TEMPORARY_URL)\s*=\s*(.*)\s*$/u);
    if (!match) continue;

    const [, key, rawValue] = match;
    values[key] = normalizeEnvValue(rawValue);
  }

  return values;
}

function normalizeEnvValue(rawValue) {
  const trimmed = rawValue.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1).trim();
  }

  const commentIndex = trimmed.search(/\s+#/u);
  return (commentIndex >= 0 ? trimmed.slice(0, commentIndex) : trimmed).trim();
}
