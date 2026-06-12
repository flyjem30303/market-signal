import fs from "node:fs";

const docPath = "docs/A2_PUBLIC_COPY_UX_SAFETY_BRIEF_HANDOFF.md";
const componentPath = "src/components/twse-openapi-runtime-mock-consumer-wire-card.tsx";
const checkerPath = "scripts/check-a2-public-copy-ux-safety-brief-handoff.mjs";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const problems = [];
const doc = read(docPath);
const component = read(componentPath);
const checker = read(checkerPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

for (const [filePath, source, phrase] of [
  [docPath, doc, "A2 Public Copy / UX Safety Brief Handoff"],
  [docPath, doc, "market mood within 30 seconds"],
  [docPath, doc, "next observation direction within 3 minutes"],
  [docPath, doc, "publicDataSource=mock"],
  [docPath, doc, "scoreSource=mock"],
  [docPath, doc, "not investment advice"],
  [docPath, doc, "Do not fetch market data."],
  [docPath, doc, "Do not run SQL."],
  [docPath, doc, "Do not connect to Supabase."],
  [docPath, doc, "Do not write Supabase."],
  [docPath, doc, "Do not create staging rows."],
  [docPath, doc, "Do not modify `daily_prices`."],
  [docPath, doc, "Do not set `publicDataSource=supabase`."],
  [docPath, doc, "Do not set `scoreSource=real`."],
  [docPath, doc, "Audit `/briefing` visible copy"],
  [componentPath, component, "市場氛圍示範"],
  [componentPath, component, "資料邊界"],
  [componentPath, component, "fetch=false；sql=false；write=false"],
  [checkerPath, checker, "forbiddenPatterns"],
  [reviewGatePath, reviewGate, "a2-public-copy-ux-safety-brief-handoff"]
]) {
  if (!source.includes(phrase)) problems.push(`${filePath} missing phrase: ${phrase}`);
}

if (
  pkg.scripts?.["check:a2-public-copy-ux-safety-brief-handoff"] !==
  "node scripts/check-a2-public-copy-ux-safety-brief-handoff.mjs"
) {
  problems.push(`${packagePath} missing check:a2-public-copy-ux-safety-brief-handoff script`);
}

for (const [filePath, source] of [
  [docPath, doc],
  [componentPath, component]
]) {
  for (const pattern of forbiddenPatterns()) {
    if (pattern.test(source)) problems.push(`${filePath} contains forbidden pattern ${String(pattern)}`);
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
      guardedStatus: "a2_public_copy_ux_safety_brief_handoff_ready",
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
    /publicDataSource\s*=\s*"supabase"/u,
    /scoreSource\s*=\s*"real"/u,
    /SQL execution is approved/u,
    /Supabase writes are approved/u,
    /raw market data fetch is approved/u,
    /investment advice is provided/u,
    /buy\/sell recommendation is provided/u,
    /buy\/sell recommendation is approved/u,
    /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu
  ];
}
