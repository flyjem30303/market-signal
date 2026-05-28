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
      scoreCanBeShownPublicly: false
    };
  }

  const caveats = mixed.warnings.map(toCaveat);
  const hasCritical = caveats.some((caveat) => caveat.severity === "critical");

  return {
    caveats,
    legalCaveat: buildLegalCaveat(),
    qualityLabel: hasCritical ? "unavailable" : "internal-only",
    scoreCanBeShownPublicly: false
  };
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
