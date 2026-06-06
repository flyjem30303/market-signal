import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const CONFIRMATION_VALUE = "CEO_APPROVED_TW_EQUITY_POST_WRITE_STAGING_VERIFICATION_ONCE";
const DOTENV_LOCAL_ALLOWED_KEYS = ["NEXT_PUBLIC_SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"];
const THIRD_WRITE_REVIEW_PATH = "docs/reviews/TW_EQUITY_STAGING_THIRD_WRITE_POST_RUN_REVIEW_2026-06-07.md";
const POST_RUN_REVIEW_PATH =
  "docs/reviews/TW_EQUITY_POST_WRITE_STAGING_VERIFICATION_POST_RUN_REVIEW_2026-06-07.md";
const RUN_ID = "11111111-2222-4333-8444-555555555555";
const TARGETS = [
  {
    expectedCount: 1,
    name: "staging_twse_stock_day_runs"
  },
  {
    expectedCount: 180,
    name: "staging_twse_stock_day_prices"
  }
];

loadProcessEnvFromDotEnvLocal();

const confirmationAccepted = process.env.TW_EQUITY_POST_WRITE_STAGING_VERIFICATION === CONFIRMATION_VALUE;
const thirdWriteReviewAccepted = loadThirdWriteReviewAccepted();
const credentialPresence = {
  nextPublicSupabaseUrl: envPresent("NEXT_PUBLIC_SUPABASE_URL"),
  serviceRoleKey: envPresent("SUPABASE_SERVICE_ROLE_KEY")
};
const safety = {
  dailyPricesMutated: false,
  marketDataFetched: false,
  marketDataIngested: false,
  publicDataSource: "mock",
  publicPromotionAllowed: false,
  rawPayloadsPrinted: false,
  rowCoveragePointsAllowed: false,
  rowPayloadsRead: false,
  rowPayloadsPrinted: false,
  scoreSource: "mock",
  scoreSourceRealAllowed: false,
  secretsPrinted: false,
  serviceRoleKeyPrinted: false,
  sqlExecutedByPm: false,
  stagingRowsCreated: false,
  supabaseWriteAttempted: false
};

if (!confirmationAccepted) {
  finish({
    connectionAttempted: false,
    postRunReviewWritten: false,
    status: "tw_equity_post_write_staging_verification_not_run_confirmation_required",
    targets: notRunTargets("not_run_confirmation_required")
  });
} else if (!thirdWriteReviewAccepted) {
  finish({
    connectionAttempted: false,
    postRunReviewWritten: false,
    status: "tw_equity_post_write_staging_verification_blocked_third_write_review_required",
    targets: notRunTargets("third_write_review_required")
  });
} else if (!credentialPresence.nextPublicSupabaseUrl || !credentialPresence.serviceRoleKey) {
  finish({
    connectionAttempted: false,
    postRunReviewWritten: false,
    status: "tw_equity_post_write_staging_verification_blocked_missing_credentials",
    targets: notRunTargets("missing_credentials")
  });
} else {
  const targets = await verifyStagingCounts();
  const status = classify(targets);
  const postRunReviewWritten = writePostRunReview({ status, targets });
  finish({
    connectionAttempted: true,
    postRunReviewWritten,
    status,
    targets
  });
}

async function verifyStagingCounts() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false
    }
  });

  return Promise.all(
    TARGETS.map(async (target) => {
      const { count, error } = await supabase.from(target.name).select("run_id", {
        count: "exact",
        head: true
      }).eq("run_id", RUN_ID);

      if (error) {
        return {
          count: 0,
          countStatus: "error",
          errorCode: sanitizeCode(error.code),
          expectedCount: target.expectedCount,
          matchedExpectedCount: false,
          name: target.name,
          problems: [`${target.name}_count_failed_${sanitizeCode(error.code)}`],
          runIdMatched: false
        };
      }

      return {
        count: count ?? 0,
        countStatus: "ok",
        errorCode: "none",
        expectedCount: target.expectedCount,
        matchedExpectedCount: (count ?? 0) === target.expectedCount,
        name: target.name,
        problems: (count ?? 0) === target.expectedCount ? [] : [`${target.name}_count_mismatch`],
        runIdMatched: (count ?? 0) > 0
      };
    })
  );
}

function classify(targets) {
  if (targets.every((target) => target.matchedExpectedCount)) {
    return "tw_equity_post_write_staging_verification_counts_match_no_public_promotion";
  }
  return "tw_equity_post_write_staging_verification_count_mismatch_promotion_blocked";
}

function writePostRunReview({ status, targets }) {
  fs.mkdirSync(path.dirname(POST_RUN_REVIEW_PATH), { recursive: true });
  const lines = [
    "# TW Equity Post-Write Staging Verification Post-Run Review",
    "",
    "Date: 2026-06-07",
    "",
    `Status: \`${status}\`.`,
    "",
    "## Scope",
    "",
    "- Exactly one bounded post-write staging verification was attempted after the successful third bounded staging write.",
    "- Verification uses `head: true` exact counts filtered by the accepted staging `run_id`.",
    "- No row payloads are read or printed.",
    "",
    "## Preconditions",
    "",
    "- Third write post-run review required: `accepted`.",
    `- Third write post-run review observed: \`${thirdWriteReviewAccepted ? "accepted" : "not_accepted"}\`.`,
    "- Expected run rows: `1`.",
    "- Expected price rows: `180`.",
    "",
    "## Sanitized Count Result",
    "",
    ...targets.map(
      (target) =>
        `- \`${target.name}\`: countStatus=\`${target.countStatus}\`, count=\`${target.count}\`, expectedCount=\`${target.expectedCount}\`, matchedExpectedCount=\`${target.matchedExpectedCount}\`, errorCode=\`${target.errorCode}\`.`
    ),
    "",
    "## Decision",
    "",
    "- Staging write closed loop is verified when both counts match.",
    "- This verification does not authorize `daily_prices` merge, public source promotion, row coverage points, or score-source promotion.",
    "",
    "## Safety Confirmation",
    "",
    "- no SQL execution by PM;",
    "- no insert/update/upsert/delete operation;",
    "- no staging rows created by this verification;",
    "- no `daily_prices` mutation;",
    "- no market-data fetch or ingestion;",
    "- no raw payloads printed;",
    "- no row payloads read;",
    "- no row payloads printed;",
    "- no secrets printed;",
    "- `publicDataSource=mock`;",
    "- `scoreSource=mock`.",
    "",
    "## Next Slice",
    "",
    "- NEXT-SLICE-001 create a promotion-readiness gate for staging-to-`daily_prices`, public source, row coverage, and score-source decisions."
  ];

  fs.writeFileSync(POST_RUN_REVIEW_PATH, `${lines.join("\n")}\n`);
  return true;
}

function finish({ connectionAttempted, postRunReviewWritten, status, targets }) {
  console.log(
    JSON.stringify(
      {
        connectionAttempted,
        credentialPresence,
        mode: "tw_equity_post_write_staging_verification_once",
        postRunReview: POST_RUN_REVIEW_PATH,
        postRunReviewWritten,
        safety,
        status,
        targets
      },
      null,
      2
    )
  );
}

function notRunTargets(reason) {
  return TARGETS.map((target) => ({
    count: 0,
    countStatus: reason,
    errorCode: "none",
    expectedCount: target.expectedCount,
    matchedExpectedCount: false,
    name: target.name,
    problems: [reason],
    runIdMatched: false
  }));
}

function loadThirdWriteReviewAccepted() {
  if (!fs.existsSync(THIRD_WRITE_REVIEW_PATH)) return false;
  const review = fs.readFileSync(THIRD_WRITE_REVIEW_PATH, "utf8");
  return review.includes("tw_equity_staging_third_write_success_staging_rows_created_no_public_promotion");
}

function loadProcessEnvFromDotEnvLocal() {
  const envPath = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(envPath)) return;

  const parsed = parseDotEnv(fs.readFileSync(envPath, "utf8"));
  for (const key of DOTENV_LOCAL_ALLOWED_KEYS) {
    if (!process.env[key] && parsed[key]) {
      process.env[key] = parsed[key];
    }
  }
}

function parseDotEnv(text) {
  const parsed = {};
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator <= 0) continue;

    const key = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim();
    parsed[key] = normalizeDotEnvValue(value);
  }
  return parsed;
}

function normalizeDotEnvValue(value) {
  const trimmed = value.trim();
  const quote = trimmed[0];
  if ((quote === "\"" || quote === "'") && trimmed[trimmed.length - 1] === quote) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function envPresent(name) {
  return typeof process.env[name] === "string" && process.env[name].trim().length > 0;
}

function sanitizeCode(code) {
  return typeof code === "string" && code.trim().length > 0 ? code.trim() : "unknown";
}
