import type { DataFreshnessSnapshot, DataFreshnessState } from "@/lib/data-freshness";

export type DataQualityDowngradeState =
  | "metadata_complete_unapproved"
  | "metadata_partial_blocked"
  | "metadata_stale_blocked"
  | "metadata_unavailable_blocked"
  | "mock_only";

export type DataQualityDowngradeSummary = {
  canUseForPublicScore: false;
  displayLabel: string;
  downgradeState: DataQualityDowngradeState;
  reason: string;
  scoreSource: "mock";
  stopLine: string;
};

const downgradeByFreshnessState: Record<DataFreshnessState, Omit<DataQualityDowngradeSummary, "scoreSource">> = {
  complete: {
    canUseForPublicScore: false,
    displayLabel: "Metadata complete, score still mock",
    downgradeState: "metadata_complete_unapproved",
    reason: "Freshness metadata is reachable, but source rights, field coverage, data quality, model evidence, and release approval remain separate gates.",
    stopLine: "Do not use complete freshness metadata as public score approval."
  },
  mock: {
    canUseForPublicScore: false,
    displayLabel: "Mock-only runtime",
    downgradeState: "mock_only",
    reason: "Public runtime is intentionally using mock data while real market data and scoreSource=real remain blocked.",
    stopLine: "Do not infer real market readiness from mock runtime state."
  },
  partial: {
    canUseForPublicScore: false,
    displayLabel: "Partial metadata, public score blocked",
    downgradeState: "metadata_partial_blocked",
    reason: "Partial freshness metadata means required tables, rows, or run states are not complete enough for public scoring.",
    stopLine: "Do not promote partial metadata to real score input."
  },
  stale: {
    canUseForPublicScore: false,
    displayLabel: "Stale metadata, public score blocked",
    downgradeState: "metadata_stale_blocked",
    reason: "Stale freshness metadata requires data owner review before it can support any runtime claim.",
    stopLine: "Do not promote stale metadata to real score input."
  },
  unavailable: {
    canUseForPublicScore: false,
    displayLabel: "Metadata unavailable, public score blocked",
    downgradeState: "metadata_unavailable_blocked",
    reason: "Unavailable freshness metadata blocks public scoring and should degrade to mock or unavailable UI state.",
    stopLine: "Do not promote unavailable metadata to real score input."
  }
};

export function getDataQualityDowngradeSummary(freshness: DataFreshnessSnapshot): DataQualityDowngradeSummary {
  const summary = downgradeByFreshnessState[freshness.state] ?? downgradeByFreshnessState.unavailable;

  return {
    ...summary,
    scoreSource: "mock"
  };
}
