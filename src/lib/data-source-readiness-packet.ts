import { getEtfSourceRightsReviewPacket, type EtfSourceRightsReviewPacket } from "@/lib/etf-source-rights-review-packet";
import { getEquityDryRunPacketReadiness, type EquityDryRunPacketReadiness } from "@/lib/equity-dry-run-packet-readiness";
import { getEquityPacketRoleReviewGate, type EquityPacketRoleReviewGate } from "@/lib/equity-packet-role-review-gate";
import {
  getEquityReportOnlyDryRunPacket,
  type EquityReportOnlyDryRunPacket
} from "@/lib/equity-report-only-dry-run-packet";
import {
  getSourceReadinessCheckpointSummary,
  type SourceReadinessCheckpointSummary
} from "@/lib/source-readiness-checkpoint-summary";
import { getTwiiSourceSelectionPacket, type TwiiSourceSelectionPacket } from "@/lib/twii-source-selection-packet";

export type DataSourceReadinessLane = {
  id: "twii-source-selection" | "etf-source-rights" | "equity-dry-run-packet";
  lane: "TWII" | "ETF" | "Equity";
  owner: "Data" | "Engineering" | "Legal";
  status: "blocked_needs_source_decision" | "blocked_needs_rights_review" | "ready_for_report_only_packet";
  decisionNeeded: string;
  nextSafeAction: string;
  symbols: string[];
};

export type DataSourceReadinessPacket = {
  status: "source_readiness_packet_prepared";
  priorityOrder: ["TWII", "ETF", "Equity"];
  lanes: DataSourceReadinessLane[];
  publicDataSource: "mock";
  scoreSource: "mock";
  sourceReadinessCheckpointSummary: SourceReadinessCheckpointSummary;
  stopLine: string;
  etfSourceRightsReviewPacket: EtfSourceRightsReviewPacket;
  equityDryRunPacketReadiness: EquityDryRunPacketReadiness;
  equityPacketRoleReviewGate: EquityPacketRoleReviewGate;
  equityReportOnlyDryRunPacket: EquityReportOnlyDryRunPacket;
  twiiSourceSelectionPacket: TwiiSourceSelectionPacket;
};

export function getDataSourceReadinessPacket(): DataSourceReadinessPacket {
  return {
    lanes: [
      {
        decisionNeeded:
          "Choose the official or licensed TWII historical source and define attribution, retention, and field contract.",
        id: "twii-source-selection",
        lane: "TWII",
        nextSafeAction:
          "Draft a report-only TWII source-selection packet with candidate source names and required review fields only.",
        owner: "Data",
        status: "blocked_needs_source_decision",
        symbols: ["TWII"]
      },
      {
        decisionNeeded:
          "Confirm ETF source rights, redistribution limits, field completeness, and whether NAV or market price is in scope.",
        id: "etf-source-rights",
        lane: "ETF",
        nextSafeAction:
          "Prepare an ETF source-rights review packet before any ETF dry-run reporter or market-data file is created.",
        owner: "Legal",
        status: "blocked_needs_rights_review",
        symbols: ["0050", "006208"]
      },
      {
        decisionNeeded:
          "Confirm the TWSE STOCK_DAY report-only packet scope for listed equities and keep production writes unauthorized.",
        id: "equity-dry-run-packet",
        lane: "Equity",
        nextSafeAction:
          "Assemble a no-write dry-run packet from the existing TWSE STOCK_DAY designs for 2330, 2382, and 2308.",
        owner: "Engineering",
        status: "ready_for_report_only_packet",
        symbols: ["2330", "2382", "2308"]
      }
    ],
    etfSourceRightsReviewPacket: getEtfSourceRightsReviewPacket(),
    equityDryRunPacketReadiness: getEquityDryRunPacketReadiness(),
    equityPacketRoleReviewGate: getEquityPacketRoleReviewGate(),
    equityReportOnlyDryRunPacket: getEquityReportOnlyDryRunPacket(),
    priorityOrder: ["TWII", "ETF", "Equity"],
    publicDataSource: "mock",
    scoreSource: "mock",
    sourceReadinessCheckpointSummary: getSourceReadinessCheckpointSummary(),
    status: "source_readiness_packet_prepared",
    stopLine:
      "This packet does not run SQL, connect to Supabase, write Supabase, fetch or ingest market data, create staging rows, modify daily_prices, print secrets, print row payloads, promote publicDataSource=supabase, award row coverage points, or set scoreSource=real.",
    twiiSourceSelectionPacket: getTwiiSourceSelectionPacket()
  };
}
