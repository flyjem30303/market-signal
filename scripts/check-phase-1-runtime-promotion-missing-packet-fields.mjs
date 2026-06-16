import fs from "node:fs";

const docPath = "docs/PHASE_1_RUNTIME_PROMOTION_MISSING_PACKET_FIELDS.md";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";
const problems = [];

const doc = read(docPath);
const pkg = JSON.parse(read(packagePath));
const reviewGate = read(reviewGatePath);

for (const phrase of [
  "Phase 1 Runtime Promotion Missing Packet Fields",
  "phase_1_runtime_promotion_missing_packet_fields_ready_keep_mock",
  "keep_mock_and_supply_missing_promotion_packet_fields",
  "publicDataSource=mock",
  "scoreSource=mock",
  "runtimeFlagName",
  "runtimeFlagTargetValue",
  "rollbackOwner",
  "rollbackCommand",
  "readbackCommand",
  "productionSmokeCommand",
  "postPromotionReviewOwner",
  "publicCopyFallbackLine",
  "freshnessFallbackLine",
  "phase_1_runtime_promotion_packet_field_intake_or_keep_mock_runtime",
  "Do not execute mutation from this document."
]) {
  if (!doc.includes(phrase)) problems.push(`${docPath} missing phrase: ${phrase}`);
}

for (const forbidden of [
  /publicDataSource\s*=\s*supabase is approved/u,
  /scoreSource\s*=\s*real is approved/u,
  /SQL execution is approved/u,
  /Supabase write is approved/u,
  /runtime flag mutation is approved/u,
  /production environment mutation is approved/u,
  /guaranteed return/iu,
  /buy now/iu,
  /\bsb_(publishable|secret|anon|service_role)_[a-z0-9_-]+/iu
]) {
  if (forbidden.test(doc)) problems.push(`${docPath} contains forbidden phrase: ${String(forbidden)}`);
}

if (
  pkg.scripts?.["check:phase-1-runtime-promotion-missing-packet-fields"] !==
  "node scripts/check-phase-1-runtime-promotion-missing-packet-fields.mjs"
) {
  problems.push(`${packagePath} missing check:phase-1-runtime-promotion-missing-packet-fields script`);
}

if (!reviewGate.includes("phase-1-runtime-promotion-missing-packet-fields")) {
  problems.push(`${reviewGatePath} missing phase-1-runtime-promotion-missing-packet-fields registration`);
}

if (problems.length > 0) {
  console.error(JSON.stringify({ status: "blocked", problems }, null, 2));
  process.exit(1);
}

console.log(
  JSON.stringify(
    {
      status: "ok",
      guardedStatus: "phase_1_runtime_promotion_missing_packet_fields_ready_keep_mock",
      currentRoute: "keep_mock_and_supply_missing_promotion_packet_fields",
      nextRoute: "phase_1_runtime_promotion_packet_field_intake_or_keep_mock_runtime",
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
