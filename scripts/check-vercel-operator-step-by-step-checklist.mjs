import fs from "node:fs";

const problems = [];

const docPath = "docs/VERCEL_OPERATOR_STEP_BY_STEP_CHECKLIST.md";
const preCreationPath = "docs/VERCEL_BETA_PRE_CREATION_CHECKLIST.md";
const quickstartPath = "docs/BETA_DEPLOYMENT_QUICKSTART.md";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const reviewGatePath = "scripts/check-review-gates.mjs";

const doc = read(docPath);
const preCreation = read(preCreationPath);
const quickstart = read(quickstartPath);
const pkg = JSON.parse(read(packagePath));
const status = read(statusPath);
const reviewGate = read(reviewGatePath);

for (const [filePath, source, phrase] of [
  [docPath, doc, "Status: `vercel_operator_step_by_step_checklist_ready`"],
  [docPath, doc, "Open Vercel dashboard."],
  [docPath, doc, "Choose Add New Project or Import Project."],
  [docPath, doc, "Confirm framework preset is Next.js."],
  [docPath, doc, "Confirm build command is `npm run build`."],
  [docPath, doc, "Leave install command as provider default or `npm install`."],
  [docPath, doc, "Confirm source branch is `main`"],
  [docPath, doc, "https://vercel.com/docs/deployments/git"],
  [docPath, doc, "https://vercel.com/docs/getting-started-with-vercel/import"],
  [docPath, doc, "https://vercel.com/docs/frameworks/nextjs"],
  [docPath, doc, "https://vercel.com/docs/projects/environment-variables"],
  [docPath, doc, "taiwan-market-signal-beta"],
  [docPath, doc, "NEXT_PUBLIC_DATA_SOURCE=mock"],
  [docPath, doc, "NEXT_PUBLIC_SCORE_SOURCE=mock"],
  [docPath, doc, "BETA_HOSTING_PROJECT_NAME=<vercel-project-slug>"],
  [docPath, doc, "BETA_TEMPORARY_URL=https://<public-beta-hostname>.vercel.app/"],
  [docPath, doc, "D:\\指數燈號\\tmp\\public-beta-external-reply-env.template.cmd"],
  [docPath, doc, "cmd.exe /c npm run fill:public-beta-external-reply-file-from-env"],
  [docPath, doc, "cmd.exe /c npm run report:public-beta-external-reply-file-route"],
  [docPath, doc, "cmd.exe /c npm run report:public-beta-external-input-request"],
  [docPath, doc, "cmd.exe /c npm run report:public-beta-external-input-response-readiness"],
  [docPath, doc, "cmd.exe /c npm run run:public-beta-post-reply-route-once"],
  [docPath, doc, "cmd.exe /c npm run report:beta-deployment-quickstart"],
  [docPath, doc, "`publicDataSource=mock`"],
  [docPath, doc, "`scoreSource=mock`"],
  [docPath, doc, "No deployment is authorized by this checklist."],
  [docPath, doc, "No hosting project is created or mutated by this checklist."],
  [preCreationPath, preCreation, "Status: `vercel_beta_pre_creation_checklist_ready`"],
  [quickstartPath, quickstart, "Status: `beta_deployment_quickstart_ready`"],
  [packagePath, JSON.stringify(pkg), "check:vercel-operator-step-by-step-checklist"],
  [statusPath, status, "Latest Vercel operator step-by-step checklist slice"],
  [statusPath, status, "vercel_operator_step_by_step_checklist_ready"],
  [reviewGatePath, reviewGate, "name: \"vercel-operator-step-by-step-checklist\""],
  [reviewGatePath, reviewGate, "\"vercel-operator-step-by-step-checklist\""]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (pkg.scripts?.["check:vercel-operator-step-by-step-checklist"] !== "node scripts/check-vercel-operator-step-by-step-checklist.mjs") {
  problems.push("package.json missing check:vercel-operator-step-by-step-checklist");
}

if (pkg.scripts?.build !== "next build") problems.push("package.json build script must stay next build");

for (const pattern of forbiddenPatterns()) {
  if (pattern.test(doc)) problems.push(`${docPath} forbidden pattern ${String(pattern)}`);
}

if (doc.includes("cmd.exe /c npm run run:beta-platform-two-value-proof-map-once")) {
  problems.push(`${docPath} should not expose the lower-level platform proof runner as the routine Vercel next command`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "vercel_operator_step_by_step_checklist_ready",
      provider: "vercel",
      manualOnly: true,
      nextCommand: "cmd.exe /c npm run report:public-beta-external-input-request",
      afterReplyCommand: "cmd.exe /c npm run report:public-beta-external-input-response-readiness",
      publicDataSource: "mock",
      scoreSource: "mock"
    },
    null,
    2
  )
);

function read(filePath) {
  if (!fs.existsSync(filePath)) {
    problems.push(`missing file: ${filePath}`);
    return filePath.endsWith(".json") ? "{}" : "";
  }

  return fs.readFileSync(filePath, "utf8");
}

function forbiddenPatterns() {
  return [
    /NEXT_PUBLIC_SUPABASE_URL\s*=\s*https?:/u,
    /NEXT_PUBLIC_SUPABASE_ANON_KEY\s*=/u,
    /SUPABASE_SERVICE_ROLE_KEY\s*=/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /\bvercel\s+deploy\b/iu,
    /npm run deploy/iu,
    /RUN_DEPLOY_NOW/u,
    /DEPLOYMENT_COMPLETED/u,
    /production deployment completed/iu,
    /preview deployment completed/iu,
    /deployment command executed/iu,
    /hosting project created/iu,
    /platform env mutated/iu,
    /SQL execution is approved/iu,
    /Supabase reads are approved/iu,
    /Supabase writes are approved/iu,
    /raw market data approved/iu,
    /publicDataSource=supabase is approved/iu,
    /scoreSource=real is approved/iu
  ];
}
