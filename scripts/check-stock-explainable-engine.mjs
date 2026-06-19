import fs from "node:fs";

const enginePath = "src/lib/stock-explanation-engine.ts";
const dashboardPath = "src/components/dashboard-shell.tsx";
const moduleBuilderPath = "src/lib/price-derived-explanation-modules.ts";
const signalModelPath = "src/lib/signal-model.ts";
const supabaseRepositoryPath = "src/lib/repositories/supabase-market-signal-repository.ts";
const schemaDocPath = "docs/PHASE_1_EXPLAINABLE_MODULE_SCHEMA.md";

const engine = fs.readFileSync(enginePath, "utf8");
const dashboard = fs.readFileSync(dashboardPath, "utf8");
const moduleBuilder = fs.readFileSync(moduleBuilderPath, "utf8");
const signalModel = fs.readFileSync(signalModelPath, "utf8");
const supabaseRepository = fs.readFileSync(supabaseRepositoryPath, "utf8");
const schemaDoc = fs.readFileSync(schemaDocPath, "utf8");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

for (const required of [
  "export function buildStockExplanation",
  "decisionContext",
  "positive-${module.id}-health",
  "negative-${module.id}-health",
  "confidence-from-data-quality",
  "confidence-from-stale-flags",
  "confidence-from-missing-flags",
  "confidence-from-series-length",
  ".sort(sortByImpact)",
  "nonMarketModuleIds",
  "dataFreshness",
  "moduleEvidence(module",
  "selectPositiveModules",
  "selectNegativeModules",
  "buildPositiveItems",
  "buildNegativeItems"
]) {
  assert(engine.includes(required), `engine missing required contract: ${required}`);
}

for (const required of ["ModuleEvidence", "evidence?: ModuleEvidence[]", "updatedAt?: string", "source?: string"]) {
  assert(signalModel.includes(required), `signal model missing module schema field: ${required}`);
}

for (const required of [
  "buildPriceDerivedExplanationModules",
  "id: \"trend\"",
  "id: \"momentum\"",
  "id: \"volatility\"",
  "id: \"dataFreshness\"",
  "daily_prices.open",
  "daily_prices.close",
  "daily_prices.high",
  "daily_prices.low",
  "computed.open_close_return_pct",
  "computed.intraday_range_pct",
  "valuation_source_missing_phase_1",
  "fund_flow_baseline_missing_phase_1"
]) {
  assert(moduleBuilder.includes(required), `price-derived module builder missing contract: ${required}`);
}

assert(
  supabaseRepository.includes("buildPriceDerivedExplanationModules") && !supabaseRepository.includes("modules: []"),
  "Supabase repository must populate modules instead of returning modules: []"
);

for (const required of ["trend", "momentum", "volatility", "dataFreshness", "valuation_source_missing_phase_1"]) {
  assert(schemaDoc.includes(required), `schema doc missing mapping note: ${required}`);
}

for (const forbidden of ["actionNotes", "market_health", "持續觀察", "等待確認"]) {
  assert(!engine.includes(forbidden), `engine leaked forbidden phrase: ${forbidden}`);
  assert(!dashboard.includes(forbidden), `dashboard leaked forbidden phrase: ${forbidden}`);
}

for (const [fileName, source] of [
  [enginePath, engine],
  [dashboardPath, dashboard],
  [moduleBuilderPath, moduleBuilder]
]) {
  for (const forbiddenMojibake of ["鞈", "銝", "蝣", "撣", "憸", "", "", "�", "嚙"]) {
    assert(!source.includes(forbiddenMojibake), `${fileName} contains mojibake marker: ${forbiddenMojibake}`);
  }
}

for (const requiredReadableText of [
  "市場診斷",
  "分數來源拆解",
  "投資人解讀",
  "決策脈絡",
  "判讀信心",
  "主要加分",
  "主要扣分",
  "資料日期",
  "缺漏因子",
  "資料延遲",
  "趨勢",
  "動能",
  "波動",
  "資料完整度"
]) {
  assert(
    engine.includes(requiredReadableText) || dashboard.includes(requiredReadableText) || moduleBuilder.includes(requiredReadableText),
    `missing readable stock explanation text: ${requiredReadableText}`
  );
}

for (const requiredEngineText of [
  "趨勢延續力",
  "價格動能由開盤到收盤變化推估",
  "盤中高低區間",
  "資料完整度"
]) {
  assert(engine.includes(requiredEngineText), `engine missing readable explanation copy: ${requiredEngineText}`);
}

for (const requiredUiText of ["市場診斷", "分數來源拆解", "投資人解讀", "決策脈絡", "判讀信心"]) {
  assert(dashboard.includes(requiredUiText), `dashboard missing explanation section: ${requiredUiText}`);
}

const positiveSortIndex = engine.indexOf("buildPositiveItems(snapshot, marketModules).sort(sortByImpact)");
const negativeSortIndex = engine.indexOf("buildNegativeItems(snapshot, marketModules).sort(sortByImpact)");
assert(positiveSortIndex >= 0 && negativeSortIndex >= 0, "engine must build positive and negative factors separately");
assert(positiveSortIndex >= 0, "positive factors must sort by impact");
assert(negativeSortIndex >= 0, "negative factors must sort by impact");

console.log(
  JSON.stringify(
    {
      ok: true,
      mode: "static_contract_plus_language_guard",
      checks: [
        "decisionContext naming",
        "impact sorting hooks",
        "rule evidence hooks",
        "quality excluded from market factors",
        "dataFreshness excluded from market factors",
        "readable Chinese public explanation copy",
        "price-derived module builder wired to Supabase repository",
        "public UI sections",
        "mojibake guard"
      ]
    },
    null,
    2
  )
);
