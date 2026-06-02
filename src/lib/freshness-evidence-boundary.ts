import type { DataFreshnessSnapshot } from "@/lib/data-freshness";
import { getFreshnessInterpretationSummary } from "@/lib/freshness-interpretation";
import { getFreshnessMetadataBoundarySummary } from "@/lib/freshness-metadata-boundary";
import { getSupabaseReadonlyEvidenceSummary } from "@/lib/supabase-readonly-evidence";

export type FreshnessEvidenceBoundarySummary = {
  headline: string;
  items: Array<{
    body: string;
    label: string;
    tone: "active" | "readying" | "blocked";
    value: string;
  }>;
  stopLine: string;
  summary: string;
};

export function getFreshnessEvidenceBoundarySummary(
  freshness: DataFreshnessSnapshot
): FreshnessEvidenceBoundarySummary {
  const metadata = getFreshnessMetadataBoundarySummary(freshness);
  const interpretation = getFreshnessInterpretationSummary();
  const readonlyEvidence = getSupabaseReadonlyEvidenceSummary();

  return {
    headline: "Freshness evidence boundary",
    items: [
      {
        body: metadata.allowedPublicClaim,
        label: "Freshness metadata",
        tone: metadata.canDisplayFreshnessMetadata ? "active" : "blocked",
        value: metadata.state
      },
      {
        body: readonlyEvidence.acceptedScope,
        label: "Readonly reachability",
        tone: "readying",
        value: readonlyEvidence.evidenceStatus
      },
      {
        body: interpretation.interpretation,
        label: "Data quality",
        tone: "blocked",
        value: interpretation.dataQualityApproval
      }
    ],
    stopLine:
      "Do not convert freshness metadata or readonly reachability into writes, ingestion, public source promotion, or real-score mode.",
    summary:
      "Freshness evidence can explain display state. It is not market-data completeness, source-depth approval, or production scoring approval."
  };
}
