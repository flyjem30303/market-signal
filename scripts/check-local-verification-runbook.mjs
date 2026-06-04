import fs from "node:fs";

const runbookPath = "docs/LOCAL_VERIFICATION_RUNBOOK.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const runbook = fs.readFileSync(runbookPath, "utf8");
const packageJson = fs.readFileSync(packagePath, "utf8");
const reviewGate = fs.readFileSync(reviewGatePath, "utf8");

const required = [
  [runbookPath, "Do not run `npm run build`"],
  [runbookPath, "in parallel with `npm run check:review-gates`"],
  [runbookPath, "Next.js writes `.next`"],
  [runbookPath, "Cannot find module for page"],
  [runbookPath, "generated `.next` manifest/cache mismatch"],
  [runbookPath, "clear `.next`"],
  [runbookPath, "rerun `npm run build`"],
  [runbookPath, "If `http://localhost:3000/` is unreachable"],
  [runbookPath, "dev server availability issue"],
  [runbookPath, "port 3000 has a listener"],
  [runbookPath, "`npm run dev:recover`"],
  [runbookPath, "HTTP 200"],
  [runbookPath, "PowerShell may block `npm run build`"],
  [runbookPath, "npm.ps1"],
  [runbookPath, "shell execution-policy issue"],
  [runbookPath, "`cmd.exe /c npm run build`"],
  [runbookPath, "1. Run `npm run check:localhost-full-health`"],
  [runbookPath, "2. Run `npm run report:project-progress-snapshot`"],
  [runbookPath, "3. Run `npm run report:ceo-progress-brief`"],
  [runbookPath, "4. Run `npm run report:blocker-resolution-plan`"],
  [runbookPath, "5. Run `npm run report:data-quality-evidence-checklist`"],
  [runbookPath, "`npm run report:source-rights-disclosure-checklist`"],
  [runbookPath, "`npm run report:model-credibility-checklist`"],
  [runbookPath, "6. Run `npm run check:review-gates`"],
  [runbookPath, "7. Run `npm run build`"],
  [runbookPath, "If PowerShell blocks `npm.ps1`, run `cmd.exe /c npm run build`"],
  [runbookPath, "8. Run `npm run dev:recover`"],
  [runbookPath, "9. Run `npm run check:localhost-full-health`"],
  [runbookPath, "## Localhost Recovery"],
  [runbookPath, "connection refused"],
  [runbookPath, "does not connect to"],
  [runbookPath, "Supabase"],
  [runbookPath, "change the public source"],
  [runbookPath, "`npm run report:project-progress-snapshot` is local-only"],
  [runbookPath, "`publicDataSource=mock`"],
  [runbookPath, "`scoreSource=mock`"],
  [runbookPath, "`sqlExecuted=false`"],
  [runbookPath, "`connectionAttempted=false`"],
  [runbookPath, "`supabaseWritesEnabled=false`"],
  [runbookPath, "must not include Supabase URLs"],
  [runbookPath, "service role keys"],
  [runbookPath, "anon keys"],
  [runbookPath, "token values"],
  [runbookPath, "raw row payloads"],
  [runbookPath, "SQL text"],
  [runbookPath, "raw market data"],
  [runbookPath, "key prefixes"],
  [runbookPath, "key suffixes"],
  [runbookPath, "key lengths"],
  [runbookPath, "`npm run report:ceo-progress-brief` is also local-only"],
  [runbookPath, "same sanitized snapshot"],
  [runbookPath, "`npm run report:blocker-resolution-plan` is local-only"],
  [runbookPath, "keeps waiting /"],
  [runbookPath, "blocked nodes as action plans"],
  [runbookPath, "must not approve Supabase execution"],
  [runbookPath, "public"],
  [runbookPath, "data-source promotion"],
  [runbookPath, "row coverage points"],
  [runbookPath, "real scoring"],
  [runbookPath, "The three blocker checklist reports are local-only review inputs"],
  [runbookPath, "Data, Legal, and Investment lanes"],
  [runbookPath, "do not verify external"],
  [runbookPath, "execute remote reads"],
  [runbookPath, "approve public"],
  [runbookPath, "Do not run SQL."],
  [runbookPath, "Do not write Supabase."],
  [runbookPath, "Do not fetch or ingest raw market data."],
  [runbookPath, "Do not set `scoreSource=real`."],
  [packagePath, "\"report:project-progress-snapshot\": \"node scripts/report-project-progress-snapshot.mjs\""],
  [packagePath, "\"check:project-progress-snapshot\": \"node scripts/check-project-progress-snapshot.mjs\""],
  [packagePath, "\"report:ceo-progress-brief\": \"node scripts/report-ceo-progress-brief.mjs\""],
  [packagePath, "\"check:ceo-progress-brief\": \"node scripts/check-ceo-progress-brief.mjs\""],
  [packagePath, "\"report:blocker-resolution-plan\": \"node scripts/report-blocker-resolution-plan.mjs\""],
  [packagePath, "\"check:blocker-resolution-plan\": \"node scripts/check-blocker-resolution-plan.mjs\""],
  [packagePath, "\"report:data-quality-evidence-checklist\": \"node scripts/report-data-quality-evidence-checklist.mjs\""],
  [packagePath, "\"check:data-quality-evidence-checklist\": \"node scripts/check-data-quality-evidence-checklist.mjs\""],
  [packagePath, "\"report:source-rights-disclosure-checklist\": \"node scripts/report-source-rights-disclosure-checklist.mjs\""],
  [packagePath, "\"check:source-rights-disclosure-checklist\": \"node scripts/check-source-rights-disclosure-checklist.mjs\""],
  [packagePath, "\"report:model-credibility-checklist\": \"node scripts/report-model-credibility-checklist.mjs\""],
  [packagePath, "\"check:model-credibility-checklist\": \"node scripts/check-model-credibility-checklist.mjs\""],
  [packagePath, "\"check:blocker-readiness-panel\": \"node scripts/check-blocker-readiness-panel.mjs\""],
  [packagePath, "\"check:local-verification-runbook\": \"node scripts/check-local-verification-runbook.mjs\""],
  [reviewGatePath, "scripts/check-local-verification-runbook.mjs"]
];

const forbidden = [
  [runbookPath, "run `npm run build` in parallel"],
  [runbookPath, "run build and review gates in parallel"],
  [runbookPath, "scoreSource=real is approved"],
  [runbookPath, "Supabase writes are approved"],
  [runbookPath, "write Supabase before readonly approval"]
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
  if (file === runbookPath) return runbook;
  if (file === packagePath) return packageJson;
  if (file === reviewGatePath) return reviewGate;
  return "";
}
