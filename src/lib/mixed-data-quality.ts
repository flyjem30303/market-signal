import type { MixedMarketSnapshot } from "@/lib/mixed-market-adapter";

export type DataQualitySeverity = "info" | "warning" | "critical";

export type DataQualityCaveat = {
  code: string;
  label: string;
  message: string;
  severity: DataQualitySeverity;
};

export type MixedDataQualitySummary = {
  caveats: DataQualityCaveat[];
  legalCaveat: string;
  qualityLabel: "internal-only" | "partial" | "unavailable";
  qualityScore: number;
  scoreCanBeShownPublicly: false;
};

const caveatCopy: Record<string, Omit<DataQualityCaveat, "code">> = {
  "latest-fundamentals-unavailable": {
    label: "Latest fundamentals unavailable",
    message: "Valuation fields are missing, so raw data coverage is incomplete.",
    severity: "warning"
  },
  "latest-price-unavailable": {
    label: "Latest price unavailable",
    message: "The latest raw price row is missing, so this symbol cannot be previewed as current market data.",
    severity: "critical"
  },
  "raw-market-data-unavailable": {
    label: "Raw market data unavailable",
    message: "No raw Supabase market snapshot was loaded for this symbol.",
    severity: "critical"
  },
  "score-is-mock": {
    label: "Score is mock",
    message: "The signal score is synthetic and must not be presented as a real model output.",
    severity: "warning"
  }
};

export function buildMixedDataQualitySummary(mixed: MixedMarketSnapshot | null): MixedDataQualitySummary {
  if (!mixed) {
    return {
      caveats: [
        {
          code: "mixed-snapshot-unavailable",
          label: "Mixed snapshot unavailable",
          message: "The adapter could not produce a mixed raw-data and score snapshot.",
          severity: "critical"
        }
      ],
      legalCaveat: buildLegalCaveat(),
      qualityLabel: "unavailable",
      qualityScore: 0,
      scoreCanBeShownPublicly: false
    };
  }

  const caveats = mixed.warnings.map(toCaveat);
  const hasCritical = caveats.some((caveat) => caveat.severity === "critical");
  const qualityScore = calculateInternalQualityScore({ caveats, mixed });

  return {
    caveats,
    legalCaveat: buildLegalCaveat(),
    qualityLabel: hasCritical ? "unavailable" : "internal-only",
    qualityScore,
    scoreCanBeShownPublicly: false
  };
}

function calculateInternalQualityScore({
  caveats,
  mixed
}: {
  caveats: DataQualityCaveat[];
  mixed: MixedMarketSnapshot;
}) {
  let score = 100;

  if (mixed.rawDataSource !== "real") score -= 45;
  if (mixed.scoreSource === "mock") score -= 35;
  if (!mixed.quote.tradeDate) score -= 20;
  if (mixed.quote.close === null) score -= 20;
  if (mixed.quote.pe === null || mixed.quote.pb === null) score -= 10;

  for (const caveat of caveats) {
    if (caveat.severity === "critical") score -= 25;
    if (caveat.severity === "warning") score -= 10;
  }

  return Math.max(0, Math.min(100, score));
}

function toCaveat(code: string): DataQualityCaveat {
  const copy = caveatCopy[code] ?? {
    label: code,
    message: "This diagnostic warning has not yet been mapped to user-facing copy.",
    severity: "info" as const
  };

  return {
    code,
    ...copy
  };
}

function buildLegalCaveat() {
  return "Internal diagnostic only. Real raw market data may be shown beside mock model scores; do not treat this as investment advice or public product output.";
}
