import type { MixedDataQualitySummary } from "@/lib/mixed-data-quality";
import type { MixedMarketSnapshot } from "@/lib/mixed-market-adapter";

export type PublicReleaseGate = {
  approved: false;
  blockers: string[];
  label: "blocked";
};

export function buildPublicReleaseGate({
  mixed,
  quality
}: {
  mixed: MixedMarketSnapshot | null;
  quality: MixedDataQualitySummary;
}): PublicReleaseGate {
  const blockers = [
    ...(mixed ? [] : ["mixed-snapshot-unavailable"]),
    ...(mixed?.rawDataSource === "real" ? [] : ["raw-market-data-not-real"]),
    ...(mixed?.scoreSource === "mock" ? ["score-is-mock"] : ["score-source-not-approved"]),
    ...(quality.scoreCanBeShownPublicly ? [] : ["score-not-approved-for-public-use"]),
    ...quality.caveats.filter((caveat) => caveat.severity === "critical").map((caveat) => caveat.code)
  ];

  return {
    approved: false,
    blockers: [...new Set(blockers)],
    label: "blocked"
  };
}
