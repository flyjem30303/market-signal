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
    headline: "新鮮度證據邊界",
    items: [
      {
        body: metadata.allowedPublicClaim,
        label: "新鮮度 metadata",
        tone: metadata.canDisplayFreshnessMetadata ? "active" : "blocked",
        value: metadata.state
      },
      {
        body: readonlyEvidence.acceptedScope,
        label: "唯讀可讀性",
        tone: "readying",
        value: readonlyEvidence.evidenceStatus
      },
      {
        body: interpretation.interpretation,
        label: "資料品質",
        tone: "blocked",
        value: interpretation.dataQualityApproval
      }
    ],
    stopLine:
      "不得把新鮮度 metadata 或唯讀可讀性轉成寫入、匯入、公開資料升級或正式分數模式。",
    summary:
      "新鮮度證據可以說明顯示狀態，但不代表市場資料完整、來源深度核准或正式評分核准。"
  };
}
