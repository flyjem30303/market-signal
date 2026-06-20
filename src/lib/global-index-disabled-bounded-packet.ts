import { globalIndexSourceRegistry } from "./global-index-source-registry";

export const globalIndexDisabledBoundedPacketStatus =
  "phase_2a_global_index_disabled_bounded_packet_design" as const;

export type GlobalIndexBoundedPacketField =
  | "symbol"
  | "close"
  | "tradeDate"
  | "source"
  | "sourceUrl";

export type GlobalIndexDisabledBoundedPacket = {
  packetName: "phase_2a_global_index_bounded_fetch_candidate";
  enabled: false;
  allowedSymbols: string[];
  allowedFields: GlobalIndexBoundedPacketField[];
  derivedFields: ["change", "changePercent"];
  maxRowsPerSymbol: 2;
  writeEnabled: false;
  fetchExecuted: false;
  requiresLegalUsageStatus: "accepted";
  requiresSourceAttribution: true;
  requiresNoSecretsInOutput: true;
  stopReason: string;
};

export const globalIndexDisabledBoundedPacket: GlobalIndexDisabledBoundedPacket = {
  packetName: "phase_2a_global_index_bounded_fetch_candidate",
  enabled: false,
  allowedSymbols: globalIndexSourceRegistry
    .filter((entry) => entry.legalUsageStatus === "conditional")
    .map((entry) => entry.symbol),
  allowedFields: ["symbol", "close", "tradeDate", "source", "sourceUrl"],
  derivedFields: ["change", "changePercent"],
  maxRowsPerSymbol: 2,
  writeEnabled: false,
  fetchExecuted: false,
  requiresLegalUsageStatus: "accepted",
  requiresSourceAttribution: true,
  requiresNoSecretsInOutput: true,
  stopReason:
    "All candidate sources remain conditional, rejected, or unresolved. Packet stays disabled until CEO/PM upgrades at least one source to accepted with source-rights evidence."
};

export function getGlobalIndexDisabledBoundedPacket() {
  return globalIndexDisabledBoundedPacket;
}
