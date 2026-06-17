import {
  buildTwseOpenApiRuntimeHandoff,
  isTwseOpenApiRuntimeHandoffReady,
  type TwseOpenApiRuntimeHandoff
} from "@/lib/twse-openapi-parser-consumer-adapter";
import { parseTwseOpenApiSyntheticRows } from "@/lib/twse-openapi-parser-contract";

export type TwseOpenApiRuntimeMockConsumerWireSummary = {
  boundary: {
    publicDataSource: "mock";
    rawMarketDataFetch: false;
    scoreSource: "mock";
    sqlExecution: false;
    supabaseWrite: false;
  };
  display: {
    headline: string;
    nextAction: string;
    safetyCopy: string;
    userValue: string;
  };
  handoff: TwseOpenApiRuntimeHandoff;
  mode: "synthetic_runtime_wire_only";
  route: "twse_openapi_runtime_mock_consumer_wire";
  status: "ready" | "blocked";
};

const SYNTHETIC_TWII_ROWS = [
  {
    "日期": "2026-06-08",
    "收盤指數": "23150.20",
    "最高指數": "23220.30",
    "最低指數": "22980.10",
    "開盤指數": "23010.00"
  },
  {
    "日期": "2026-06-09",
    "收盤指數": "23240.70",
    "最高指數": "23300.40",
    "最低指數": "23095.60",
    "開盤指數": "23160.20"
  },
  {
    "日期": "2026-06-10",
    "收盤指數": "23190.10",
    "最高指數": "23310.00",
    "最低指數": "23120.20",
    "開盤指數": "23255.50"
  }
] as const;

export function getTwseOpenApiRuntimeMockConsumerWireSummary(): TwseOpenApiRuntimeMockConsumerWireSummary {
  const parserResult = parseTwseOpenApiSyntheticRows("twiiIndexHistory", SYNTHETIC_TWII_ROWS);
  const handoff = buildTwseOpenApiRuntimeHandoff("twiiIndexHistory", parserResult);
  const isReady = isTwseOpenApiRuntimeHandoffReady(handoff);

  return {
    boundary: {
      publicDataSource: "mock",
      rawMarketDataFetch: false,
      scoreSource: "mock",
      sqlExecution: false,
      supabaseWrite: false
    },
    display: {
      headline: isReady ? "Mock runtime wire is connected" : "Mock runtime wire is blocked",
      nextAction: isReady
        ? "Use this synthetic-only bridge to shape the public dashboard state before real-data promotion."
        : "Keep the public runtime in fail-closed mock mode until parser and handoff warnings are resolved.",
      safetyCopy:
        "This bridge is synthetic-only. It does not fetch market data, run SQL, write Supabase, or promote real scoring.",
      userValue:
        "The dashboard can now rehearse market-status wording from a computed runtime handoff while still staying honest about mock data."
    },
    handoff,
    mode: "synthetic_runtime_wire_only",
    route: "twse_openapi_runtime_mock_consumer_wire",
    status: isReady ? "ready" : "blocked"
  };
}
