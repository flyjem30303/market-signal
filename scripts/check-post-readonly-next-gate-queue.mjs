import fs from "node:fs";

const libPath = "src/lib/post-readonly-next-gate-queue.ts";
const panelPath = "src/components/runtime-readiness-panel.tsx";
const cssPath = "src/app/globals.css";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [libPath, panelPath, cssPath, packagePath, reviewGatePath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const required = [
  [libPath, "PostReadonlyNextGateQueue"],
  [libPath, "getPostReadonlyNextGateQueue"],
  [libPath, "getSchemaShapeAcceptanceContract"],
  [libPath, "getFreshnessReadonlyLatestEvidenceSummary"],
  [libPath, "buildDataQualityEvidenceGate"],
  [libPath, "getPhase1PromotionReviewOutcomeSummary"],
  [libPath, "post_readonly_next_gate_queue"],
  [libPath, "gateSummary"],
  [libPath, "schemaAcceptedCount"],
  [libPath, "schemaObjectCount"],
  [libPath, "freshnessEvidenceState"],
  [libPath, "dataQualityProgressPercent"],
  [libPath, "dataQualityStatus"],
  [libPath, "localReadyCount"],
  [libPath, "blockedWaitingEvidenceCount"],
  [libPath, "needsRoleReviewCount"],
  [libPath, "schema_shape"],
  [libPath, "freshness"],
  [libPath, "row_coverage"],
  [libPath, "data_quality"],
  [libPath, "source_depth"],
  [libPath, "Phase 1 runtime schema shape"],
  [libPath, "Freshness evidence"],
  [libPath, "missingRows=0"],
  [libPath, "field validity promotion accepted"],
  [libPath, "source-depth artifact promotion rejected"],
  [libPath, "資料覆蓋與資料品質已可作為本地 Phase 1 promotion evidence"],
  [libPath, "publicDataSource: \"mock\""],
  [libPath, "scoreSource: \"mock\""],
  [libPath, "不要執行 SQL"],
  [libPath, "不要寫入 Supabase"],
  [libPath, "不要抓取或提交 raw market data"],
  [libPath, "不要切換 scoreSource=real"],
  [panelPath, "getPostReadonlyNextGateQueue"],
  [panelPath, "postReadonlyNextGateQueue"],
  [panelPath, "runtime-next-gate-queue"],
  [panelPath, "Post-readonly next gate queue"],
  [panelPath, "postReadonlyNextGateQueue.gateSummary.readableSummary"],
  [panelPath, "postReadonlyNextGateQueue.gateSummary.schemaAcceptedCount"],
  [panelPath, "postReadonlyNextGateQueue.gateSummary.schemaObjectCount"],
  [panelPath, "postReadonlyNextGateQueue.gateSummary.dataQualityProgressPercent"],
  [panelPath, "Local ready"],
  [panelPath, "postReadonlyNextGateQueue.items.map"],
  [panelPath, "item.acceptanceSignal"],
  [panelPath, "item.blockedPromotion"],
  [cssPath, ".runtime-next-gate-queue"],
  [cssPath, ".runtime-next-gate-queue article.ready"],
  [cssPath, ".runtime-next-gate-queue article.hold"],
  [packagePath, "\"check:post-readonly-next-gate-queue\": \"node scripts/check-post-readonly-next-gate-queue.mjs\""],
  [reviewGatePath, "scripts/check-post-readonly-next-gate-queue.mjs"]
];

const forbidden = [
  [libPath, "@supabase/supabase-js"],
  [libPath, "createClient"],
  [libPath, "fetch("],
  [libPath, ".from("],
  [libPath, ".insert("],
  [libPath, ".update("],
  [libPath, ".delete("],
  [libPath, "process.env"],
  [libPath, "node:fs"],
  [libPath, "publicDataSource: \"supabase\""],
  [libPath, "scoreSource: \"real\""],
  [panelPath, "publicDataSource: \"supabase\""],
  [panelPath, "scoreSource: \"real\""]
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
  return files.get(file) ?? "";
}
