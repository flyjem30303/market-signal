export type PublicBetaDataReadinessLane = {
  id: string;
  label: string;
  status: "accepted" | "readying" | "blocked";
  summary: string;
};

export type PublicBetaDataReadinessStatus = {
  headline: string;
  summary: string;
  publicDataSource: "mock";
  scoreSource: "mock";
  rowCoverage: {
    acceptedRows: number;
    targetRows: number;
    label: string;
  };
  twiiPrerequisites: {
    acceptedSlots: number;
    totalSlots: number;
    nextOwner: string;
    nextAction: string;
  };
  lanes: PublicBetaDataReadinessLane[];
  stopLine: string;
};

export function getPublicBetaDataReadinessStatus(): PublicBetaDataReadinessStatus {
  return {
    headline: "Data-realification is visible, but runtime remains mock",
    summary:
      "PM has accepted the TWII write-prerequisite intake as gate-preparation evidence only. This opens a future candidate-gate preparation path, not SQL, Supabase writes, row acceptance, coverage scoring, or real promotion.",
    publicDataSource: "mock",
    scoreSource: "mock",
    rowCoverage: {
      acceptedRows: 182,
      targetRows: 360,
      label: "182/360 accepted evidence"
    },
    twiiPrerequisites: {
      acceptedSlots: 6,
      totalSlots: 6,
      nextOwner: "CEO / PM",
      nextAction:
        "Prepare the next bounded write-ready candidate gate; keep SQL, Supabase writes, row acceptance, scoring, and promotion blocked."
    },
    lanes: [
      {
        id: "tw-equity",
        label: "TW equity",
        status: "accepted",
        summary: "2330, 2382, and 2308 evidence coverage remains accepted for the current Beta evidence view."
      },
      {
        id: "twii",
        label: "TWII",
        status: "readying",
        summary:
          "A1/D prerequisite intake is accepted for future gate preparation; implementation and writes remain blocked."
      },
      {
        id: "etf",
        label: "ETF",
        status: "blocked",
        summary: "0050 and 006208 still need separate source-rights and coverage evidence before real promotion."
      }
    ],
    stopLine:
      "No SQL, Supabase write, market-data ingestion, row acceptance, row coverage points, publicDataSource=supabase, or scoreSource=real is allowed by this status."
  };
}
