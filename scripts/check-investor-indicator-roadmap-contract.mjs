import fs from "node:fs";

const contractPath = "src/lib/investor-indicator-roadmap.ts";
const packagePath = "package.json";
const reviewGatePath = "scripts/check-review-gates.mjs";

const files = new Map(
  [contractPath, packagePath, reviewGatePath].map((file) => [file, fs.readFileSync(file, "utf8")])
);

const required = [
  [contractPath, "InvestorIndicatorRoadmap"],
  [contractPath, "InvestorIndicatorFamily"],
  [contractPath, "InvestorIndicatorStatus"],
  [contractPath, "mock-readable"],
  [contractPath, "design-only"],
  [contractPath, "blocked-until-real-data"],
  [contractPath, "市場溫度"],
  [contractPath, "標的健康度"],
  [contractPath, "風險訊號"],
  [contractPath, "變化偵測"],
  [contractPath, "下一步觀察"],
  [contractPath, "信心層級"],
  [contractPath, "publicDataSource: \"mock\""],
  [contractPath, "scoreSource: \"mock\""],
  [contractPath, "投資指標目前只是 mock 路線圖"],
  [contractPath, "不能當成真實市場資料"],
  [contractPath, "真實分數"],
  [contractPath, "下一步觀察可以描述接下來該看什麼"],
  [contractPath, "信心層級在資料品質"],
  [contractPath, "runtimeDataFoundation: 70"],
  [contractPath, "productReadabilityAndWording: 20"],
  [contractPath, "futureIndicatorDesignNotes: 10"],
  [contractPath, "getInvestorIndicatorRoadmap"],
  [packagePath, "\"check:investor-indicator-roadmap-contract\""],
  [reviewGatePath, "check-investor-indicator-roadmap-contract.mjs"]
];

const forbidden = [
  [contractPath, "@supabase/supabase-js"],
  [contractPath, "createClient"],
  [contractPath, "fetch("],
  [contractPath, ".from(\""],
  [contractPath, ".from('"],
  [contractPath, "process.env"],
  [contractPath, "scoreSource: \"real\""],
  [contractPath, "publicDataSource: \"supabase\""],
  [contractPath, "Market temperature"],
  [contractPath, "Stock health"],
  [contractPath, "Future notes"],
  [contractPath, "buy recommendation"],
  [contractPath, "sell recommendation"]
];

const missing = required.filter(([file, phrase]) => !read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const blocked = forbidden.filter(([file, phrase]) => read(file).includes(phrase)).map(([file, phrase]) => `${file}: ${phrase}`);
const mojibakePattern = /[\uE000-\uF8FF\uFFFD]|[嚗餅銝蝡舫摰祇雿輻閮踹]{2,}|\?{2,}/u;

if (mojibakePattern.test(read(contractPath))) {
  blocked.push(`${contractPath}: mojibake-like text`);
}

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
