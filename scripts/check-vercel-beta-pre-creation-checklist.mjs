import fs from "node:fs";

const problems = [];

const docPath = "docs/VERCEL_BETA_PRE_CREATION_CHECKLIST.md";
const packagePath = "package.json";
const statusPath = "PROJECT_STATUS.md";
const reviewGatePath = "scripts/check-review-gates.mjs";
const envExamplePath = ".env.example";
const pkg = JSON.parse(read(packagePath));
const doc = read(docPath);
const status = read(statusPath);
const reviewGate = read(reviewGatePath);
const envExample = read(envExamplePath);

for (const [filePath, source, phrase] of [
  [docPath, doc, "Status: `vercel_beta_pre_creation_checklist_ready`"],
  [docPath, doc, "Use Vercel first"],
  [docPath, doc, "https://vercel.com/docs/deployments/git"],
  [docPath, doc, "https://vercel.com/docs/getting-started-with-vercel/import"],
  [docPath, doc, "https://vercel.com/docs/frameworks/nextjs"],
  [docPath, doc, "https://vercel.com/docs/projects/environment-variables"],
  [docPath, doc, "framework preset: Next.js"],
  [docPath, doc, "build command: `npm run build`"],
  [docPath, doc, "install command: provider default or `npm install`"],
  [docPath, doc, "preferred project slug: `taiwan-market-signal-beta`"],
  [docPath, doc, "BETA_HOSTING_PROJECT_NAME=<vercel-project-slug>"],
  [docPath, doc, "BETA_TEMPORARY_URL=https://<public-beta-hostname>.vercel.app/"],
  [docPath, doc, "D:\\指數燈號\\tmp\\public-beta-external-reply-env.template.cmd"],
  [docPath, doc, "set BETA_HOSTING_PROJECT_NAME=taiwan-market-signal-beta"],
  [docPath, doc, "cmd.exe /c npm run fill:public-beta-external-reply-file-from-env"],
  [docPath, doc, "cmd.exe /c npm run report:public-beta-external-reply-file-route"],
  [docPath, doc, "cmd.exe /c npm run report:public-beta-external-input-request"],
  [docPath, doc, "cmd.exe /c npm run report:public-beta-external-input-response-readiness"],
  [docPath, doc, "cmd.exe /c npm run run:public-beta-post-reply-route-once"],
  [docPath, doc, "cmd.exe /c npm run report:beta-deployment-quickstart"],
  [docPath, doc, "NEXT_PUBLIC_DATA_SOURCE=mock"],
  [docPath, doc, "NEXT_PUBLIC_SCORE_SOURCE=mock"],
  [docPath, doc, "`publicDataSource=mock`"],
  [docPath, doc, "`scoreSource=mock`"],
  [docPath, doc, "No deployment is authorized by this checklist."],
  [docPath, doc, "No hosting project is created or mutated by this checklist."],
  [docPath, doc, "No platform environment value is written by this checklist."],
  [docPath, doc, "blocked_waiting_two_platform_values"],
  [statusPath, status, "Latest Vercel beta pre-creation checklist slice"],
  [statusPath, status, "vercel_beta_pre_creation_checklist_ready"],
  [reviewGatePath, reviewGate, "name: \"vercel-beta-pre-creation-checklist\""],
  [reviewGatePath, reviewGate, "\"vercel-beta-pre-creation-checklist\""],
  [envExamplePath, envExample, "NEXT_PUBLIC_DATA_SOURCE=mock"],
  [envExamplePath, envExample, "BETA_HOSTING_PROJECT_NAME="],
  [envExamplePath, envExample, "BETA_TEMPORARY_URL="]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (pkg.scripts?.build !== "next build") problems.push("package.json build script must stay next build");
if (pkg.scripts?.start !== "next start") problems.push("package.json start script must stay next start");
if (pkg.scripts?.["check:vercel-beta-pre-creation-checklist"] !== "node scripts/check-vercel-beta-pre-creation-checklist.mjs") {
  problems.push("package.json missing check:vercel-beta-pre-creation-checklist");
}

for (const [filePath, source] of [
  [docPath, doc]
]) {
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(source)) problems.push(`${filePath} forbidden pattern ${String(pattern)}`);
  }
}

if (doc.includes("cmd.exe /c npm run run:beta-platform-two-value-proof-map-once")) {
  problems.push(`${docPath} should not expose the lower-level platform proof runner as the routine Vercel next command`);
}

for (const pattern of forbiddenEnvValuePatterns()) {
  if (pattern.test(envExample)) problems.push(`${envExamplePath} forbidden env value pattern ${String(pattern)}`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "vercel_beta_pre_creation_checklist_ready",
      provider: "vercel",
      buildCommand: "npm run build",
      returnedValues: ["BETA_HOSTING_PROJECT_NAME", "BETA_TEMPORARY_URL"],
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

function forbiddenEnvValuePatterns() {
  return [
    /^NEXT_PUBLIC_SUPABASE_URL[^\S\r\n]*=[^\S\r\n]*https?:/mu,
    /^NEXT_PUBLIC_SUPABASE_ANON_KEY[^\S\r\n]*=[^\S\r\n]*\S/mu,
    /^SUPABASE_SERVICE_ROLE_KEY[^\S\r\n]*=[^\S\r\n]*\S/mu,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu,
    /^BETA_TEMPORARY_URL[^\S\r\n]*=[^\S\r\n]*https?:\/\/[^<\s]+/mu
  ];
}
