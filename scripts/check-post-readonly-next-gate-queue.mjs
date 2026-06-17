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
  [libPath, "資料覆蓋率已完成"],
  [libPath, "正式資料升級審核改看資料品質"],
  [libPath, "資料品質證據已可作為本地審核依據"],
  [libPath, "資料來源深度已接受於 TWII 與上市股票日收盤價範圍"],
  [libPath, "publicDataSource: \"mock\""],
  [libPath, "scoreSource: \"mock\""],
  [libPath, "不得執行 SQL"],
  [libPath, "不得寫入 Supabase"],
  [libPath, "raw market data"],
  [libPath, "不得把示範分數宣稱為正式模型"],
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

const mojibakePatterns = [/鞈/u, /銝/u, /嚗/u, /蝣/u, /撌/u, /甇/u, /摰/u, /靘/u, /雿/u, /蝺/u, /�/u];
const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);

for (const pattern of mojibakePatterns) {
  if (pattern.test(read(libPath))) blocked.push(`${libPath}: mojibake pattern ${pattern}`);
}

console.log(JSON.stringify({ blocked, missing, status: missing.length === 0 && blocked.length === 0 ? "ok" : "blocked" }, null, 2));

if (missing.length > 0 || blocked.length > 0) {
  process.exitCode = 1;
}

function read(file) {
  return files.get(file) ?? "";
}
