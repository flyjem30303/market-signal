export type AssetTypePolicy = {
  assetType: "etf" | "index" | "stock" | "unknown";
  missingFundamentalsCode: "fundamentals-not-applicable-for-etf" | "latest-fundamentals-unavailable";
  requiresStockFundamentals: boolean;
};

export function getAssetTypePolicy({
  assetType,
  isEtf
}: {
  assetType?: string | null;
  isEtf?: boolean | null;
}): AssetTypePolicy {
  const normalized = assetType?.toLowerCase();

  if (isEtf || normalized === "etf") {
    return {
      assetType: "etf",
      missingFundamentalsCode: "fundamentals-not-applicable-for-etf",
      requiresStockFundamentals: false
    };
  }

  if (normalized === "index") {
    return {
      assetType: "index",
      missingFundamentalsCode: "latest-fundamentals-unavailable",
      requiresStockFundamentals: false
    };
  }

  return {
    assetType: normalized === "stock" ? "stock" : "unknown",
    missingFundamentalsCode: "latest-fundamentals-unavailable",
    requiresStockFundamentals: true
  };
}
