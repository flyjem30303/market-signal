import fs from "node:fs";

const reportPath = "docs/reviews/CP3_TWSE_STOCK_DAY_STAGING_READ_ONLY_VALIDATION_DRAFT_OUTPUT.md";
const requiredConfirmation = "TWSE_STOCK_DAY_STAGING_READONLY";
const targetConfirmation = process.env.TWSE_STOCK_DAY_STAGING_READONLY_CONFIRMATION;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (targetConfirmation !== requiredConfirmation) {
  failClosed("missing_explicit_target_confirmation");
}

if (!supabaseUrl || !serviceRoleKey) {
  failClosed("missing_supabase_environment");
}

const { createClient } = await import("@supabase/supabase-js");
const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false
  }
});

const checks = [];

checks.push(await countRows("staging_twse_stock_day_runs"));
checks.push(await countRows("staging_twse_stock_day_prices"));

const result = {
  checks,
  decision: checks.every((check) => check.status === "ok") ? "ready_for_review" : "blocked",
  guardrails: [
    "read-only validation",
    "no insert",
    "no upsert",
    "no update",
    "no delete",
    "no raw market rows",
    "no CSV / JSON market data files",
    "public data source remains mock",
    "scoreSource=real remains disabled"
  ],
  report: reportPath,
  status: "ok"
};

fs.writeFileSync(reportPath, renderReport(result));
console.log(JSON.stringify(result, null, 2));

async function countRows(table) {
  const { count, error } = await supabase.from(table).select("run_id", {
    count: "exact",
    head: true
  });

  if (error) {
    return {
      error: error.message,
      status: "blocked",
      table
    };
  }

  return {
    count,
    status: "ok",
    table
  };
}

function failClosed(reason) {
  console.log(
    JSON.stringify(
      {
        reason,
        status: "blocked"
      },
      null,
      2
    )
  );
  process.exit(1);
}

function renderReport(result) {
  const checkLines = result.checks.map((check) => `${check.table}: ${check.status}, count=${check.count ?? "n/a"}`).join("\n");

  return `# CP3 TWSE Stock Day Staging Read-Only Validation Draft Output

Status: draft output only

Decision: ${result.decision}

Guardrails:

\`\`\`text
read-only validation
no insert
no upsert
no update
no delete
no raw market rows
no CSV / JSON market data files
public data source remains mock
scoreSource=real remains disabled
\`\`\`

Checks:

\`\`\`text
${checkLines}
\`\`\`
`;
}
