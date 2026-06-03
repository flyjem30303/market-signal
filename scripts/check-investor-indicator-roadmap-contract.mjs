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
  [contractPath, "Market temperature"],
  [contractPath, "Stock health"],
  [contractPath, "Risk signal"],
  [contractPath, "Change detection"],
  [contractPath, "Watch-next guidance"],
  [contractPath, "Confidence level"],
  [contractPath, "publicDataSource: \"mock\""],
  [contractPath, "scoreSource: \"mock\""],
  [contractPath, "不提供買賣建議"],
  [contractPath, "不宣稱真實市場資料"],
  [contractPath, "不啟用 scoreSource=real"],
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
  [contractPath, "買進"],
  [contractPath, "賣出"],
  [contractPath, "停損價"]
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
